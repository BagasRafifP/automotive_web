// Fetch one landscape hero photo per car from Wikimedia Commons.
// Resumable: cars whose file + metadata already exist are skipped.
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEST = join(ROOT, "public", "cars");
const META_PATH = join(ROOT, "scratch", "catalog-meta.json");
const API = "https://commons.wikimedia.org/w/api.php";
const UA = "automotive-gallery/1.0 (local build script; contact: bagasrp1098@gmail.com)";
const THUMB_W = 1280;
const WORKERS = 4;
const LIMIT = Number(process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1] ?? 0);

const GROUPS = ["group-a", "group-b", "group-c", "group-d", "group-e", "group-f"];

const ALIASES = {
  chevrolet: ["chevrolet", "chevy", "corvette", "camaro"],
  volkswagen: ["volkswagen", "vw"],
  mercedes: ["mercedes"],
  rolls: ["rolls"],
  aston: ["aston"],
  alfa: ["alfa"],
  land: ["land rover", "range rover"],
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

async function candidatesFor(query, limit = 14) {
  const data = await api({
    action: "query",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "6",
    gsrlimit: String(limit * 3),
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    iiurlwidth: String(THUMB_W),
  });
  const pages = data?.query?.pages ?? [];
  const out = [];
  for (const p of pages) {
    const info = p.imageinfo?.[0];
    if (!info) continue;
    if (!/^image\/(jpeg|png)$/.test(info.mime ?? "")) continue;
    if (info.width < 1000 || info.width / info.height < 1.18) continue;
    const meta = info.extmetadata ?? {};
    out.push({
      title: String(p.title ?? "").replace(/^File:/, ""),
      thumb: info.thumburl ?? info.url,
      page: info.descriptionurl,
      width: info.width,
      height: info.height,
      artist: clean(meta.Artist?.value) || "Wikimedia Commons contributor",
      license: clean(meta.LicenseShortName?.value) || "See file page",
    });
  }
  return out;
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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function handle(spec, meta) {
  const file = `${spec.id}.jpg`;
  const dest = join(DEST, file);
  if (existsSync(dest) && meta[spec.id]) return "skip";

  const queries = [spec.query, spec.fallbackQuery].filter(Boolean);
  for (const q of queries) {
    let list = [];
    try {
      list = await candidatesFor(q);
    } catch (e) {
      console.log(`! ${spec.id} query failed (${q}): ${e.message}`);
      continue;
    }
    if (list.length === 0) continue;
    const tokens = brandTokens(spec.brand);
    list.sort((a, b) => {
      const at = tokens.some((t) => a.title.toLowerCase().includes(t)) ? 0 : 1;
      const bt = tokens.some((t) => b.title.toLowerCase().includes(t)) ? 0 : 1;
      if (at !== bt) return at - bt;
      return b.width - a.width;
    });
    for (const cand of list.slice(0, 4)) {
      try {
        const bytes = await download(cand.thumb, dest);
        meta[spec.id] = {
          id: spec.id,
          file,
          title: cand.title,
          page: cand.page,
          artist: cand.artist,
          license: cand.license,
          width: cand.width,
          height: cand.height,
          bytes,
          query: q,
        };
        return "ok";
      } catch (e) {
        // try the next candidate
      }
      await sleep(120);
    }
  }
  console.log(`FAIL ${spec.id} (${spec.brand} ${spec.model})`);
  return "fail";
}

mkdirSync(DEST, { recursive: true });
mkdirSync(dirname(META_PATH), { recursive: true });

const meta = existsSync(META_PATH) ? JSON.parse(readFileSync(META_PATH, "utf8")) : {};

let specs = [];
for (const g of GROUPS) {
  const mod = await import(`file://${join(ROOT, "scripts", "spec", `${g}.mjs`).replace(/\\/g, "/")}`);
  specs.push(...mod.default);
}
if (LIMIT > 0) specs = specs.slice(0, LIMIT);

console.log(`fetching ${specs.length} cars (${WORKERS} workers) -> ${DEST}`);

let done = 0;
const results = { ok: 0, skip: 0, fail: 0 };
const queue = [...specs];

async function worker() {
  while (queue.length > 0) {
    const spec = queue.shift();
    const r = await handle(spec, meta);
    results[r] += 1;
    done += 1;
    if (r !== "skip") {
      console.log(`[${done}/${specs.length}] ${r} ${spec.id}`);
      writeFileSync(META_PATH, JSON.stringify(meta, null, 2));
    }
    await sleep(90);
  }
}

await Promise.all(Array.from({ length: WORKERS }, worker));
writeFileSync(META_PATH, JSON.stringify(meta, null, 2));
console.log(`\nDONE ok=${results.ok} skip=${results.skip} fail=${results.fail} totalMeta=${Object.keys(meta).length}`);
