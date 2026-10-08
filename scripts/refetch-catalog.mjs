// Re-fetch specific catalog photos whose Commons match was wrong.
// Usage:
//   node scripts/refetch-catalog.mjs id1 id2 ...            (auto-pick best candidate)
//   node scripts/refetch-catalog.mjs id1=File:Exact_Title.jpg
//   add --dry to only print the candidate that would be used
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEST = join(ROOT, "public", "cars");
const META_PATH = join(ROOT, "scratch", "catalog-meta.json");
const API = "https://commons.wikimedia.org/w/api.php";
const UA = "automotive-gallery/1.0 (local build script; contact: bagasrp1098@gmail.com)";
const THUMB_W = 1280;

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const targets = args.filter((a) => !a.startsWith("--"));

const GROUPS = ["group-a", "group-b", "group-c", "group-d", "group-e", "group-f"];

const ALIASES = {
  chevrolet: ["chevrolet", "chevy", "corvette", "camaro"],
  volkswagen: ["volkswagen", "vw"],
  mercedes: ["mercedes"],
  rolls: ["rolls"],
  aston: ["aston"],
};

function brandTokens(brand) {
  const first = brand.toLowerCase().split(/[^a-z]+/).filter(Boolean)[0] ?? "";
  return ALIASES[first] ?? [first];
}

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: "json", formatversion: "2", ...params })}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

function clean(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const BAD_SUBJECT =
  /\b(interior|dashboard|cockpit|engine|badge|emblem|logo|seat|steering|trunk|boot|cutaway|chassis|factory|plant|production line)\b/i;
const MULTI = /&|\band\b/i;

function toCandidate(page) {
  const info = page.imageinfo?.[0];
  if (!info) return null;
  if (!/^image\/(jpeg|png)$/.test(info.mime ?? "")) return null;
  if (info.width < 1000 || info.width / info.height < 1.18) return null;
  const meta = info.extmetadata ?? {};
  return {
    title: String(page.title ?? "").replace(/^File:/, ""),
    thumb: info.thumburl ?? info.url,
    page: info.descriptionurl,
    width: info.width,
    height: info.height,
    artist: clean(meta.Artist?.value) || "Wikimedia Commons contributor",
    license: clean(meta.LicenseShortName?.value) || "See file page",
  };
}

function scoreCandidate(candidate, spec) {
  const title = candidate.title;
  let score = 0;
  const tokens = brandTokens(spec.brand);
  if (tokens.some((t) => title.toLowerCase().includes(t))) score += 40;
  const modelTokens = spec.model
    .toLowerCase()
    .split(/[^a-z0-9+.-]+/)
    .filter((t) => t.length >= 2);
  if (modelTokens.some((t) => title.toLowerCase().includes(t))) score += 30;
  if (BAD_SUBJECT.test(title)) score -= 60;
  if (MULTI.test(title)) score -= 30;
  const years = [...title.matchAll(/\b(19|20)\d{2}\b/g)].map((m) => Number(m[0]));
  if (years.length > 0 && spec.year >= 1975) {
    const delta = Math.min(...years.map((y) => Math.abs(y - spec.year)));
    score -= Math.min(delta, 20) * 1.5;
  }
  score += Math.min(candidate.width / 1000, 8);
  return score;
}

async function searchCandidates(query, limit = 25) {
  const data = await api({
    action: "query",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "6",
    gsrlimit: String(limit),
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    iiurlwidth: String(THUMB_W),
  });
  return (data?.query?.pages ?? []).map(toCandidate).filter(Boolean);
}

async function fetchByTitle(title) {
  const data = await api({
    action: "query",
    titles: title.startsWith("File:") ? title : `File:${title}`,
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    iiurlwidth: String(THUMB_W),
  });
  return (data?.query?.pages ?? []).map(toCandidate).filter(Boolean);
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 25_000) throw new Error("file too small");
  if (!(buf[0] === 0xff && buf[1] === 0xd8) && !(buf[0] === 0x89 && buf[1] === 0x50)) {
    throw new Error("not an image");
  }
  writeFileSync(dest, buf);
  return buf.length;
}

mkdirSync(DEST, { recursive: true });
const meta = JSON.parse(readFileSync(META_PATH, "utf8"));

const specs = [];
for (const group of GROUPS) {
  const mod = await import(
    `file://${join(ROOT, "scripts", "spec", `${group}.mjs`).replace(/\\/g, "/")}`
  );
  specs.push(...mod.default);
}
const byId = new Map(specs.map((s) => [s.id, s]));

let ok = 0;
let failed = 0;
for (const target of targets) {
  const [id, explicitTitle] = target.split("=");
  const spec = byId.get(id);
  if (!spec) {
    console.log(`UNKNOWN SPEC ${id}`);
    failed += 1;
    continue;
  }

  let chosen = null;
  let source = "";
  if (explicitTitle) {
    const list = await fetchByTitle(explicitTitle);
    if (list.length > 0) {
      chosen = list[0];
      source = `title:${explicitTitle}`;
    }
  } else {
    const queries = [
      `${spec.brand} ${spec.model} ${spec.year}`,
      spec.query,
      spec.fallbackQuery,
    ].filter(Boolean);
    const seen = new Set();
    let best = null;
    let bestScore = -Infinity;
    for (const query of queries) {
      let list = [];
      try {
        list = await searchCandidates(query);
      } catch (e) {
        console.log(`  ! ${id} query failed (${query}): ${e.message}`);
        continue;
      }
      for (const candidate of list) {
        if (seen.has(candidate.title)) continue;
        seen.add(candidate.title);
        const score = scoreCandidate(candidate, spec);
        if (score > bestScore) {
          bestScore = score;
          best = candidate;
        }
      }
      if (best && bestScore >= 60) break;
    }
    chosen = best;
    source = best ? `score:${bestScore.toFixed(1)}` : "";
  }

  if (!chosen) {
    console.log(`NO CANDIDATE ${id}`);
    failed += 1;
    continue;
  }

  console.log(`${id.padEnd(30)} ${source.padEnd(16)} "${chosen.title}"  ${chosen.width}x${chosen.height} ${chosen.artist} / ${chosen.license}`);
  if (DRY) continue;

  const file = `${id}.jpg`;
  try {
    const bytes = await download(chosen.thumb, join(DEST, file));
    meta[id] = {
      id,
      file,
      title: chosen.title,
      page: chosen.page,
      artist: chosen.artist,
      license: chosen.license,
      width: chosen.width,
      height: chosen.height,
      bytes,
      query: `refetch:${source}`,
    };
    writeFileSync(META_PATH, JSON.stringify(meta, null, 2));
    ok += 1;
  } catch (e) {
    console.log(`  ! download failed: ${e.message}`);
    failed += 1;
  }
  await new Promise((r) => setTimeout(r, 150));
}

console.log(`\nrefetch done ok=${ok} fail=${failed}${DRY ? " (dry run)" : ""}`);
