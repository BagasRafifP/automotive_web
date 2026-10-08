// Scratch tool: targeted re-fetch for cars whose first pass returned weak matches.
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const OUT = "scratch/cand2";
const API = "https://commons.wikimedia.org/w/api.php";
const UA = "automotive-web-showcase/1.0 (contact: local build script)";

const JOBS = [
  { id: "vw-golf-gti-mk8", queries: ["Volkswagen Golf VIII GTI", "Volkswagen Golf 8 GTI", "VW Golf VII GTI 2019", "Volkswagen Golf GTI Clubsport"] },
  { id: "tesla-model-s-plaid", queries: ["Tesla Model S Plaid", "Tesla Model S Plaid 2022", "Tesla Model S Plaid front"] },
  { id: "bmw-i8", queries: ["BMW i8 Coupé", "BMW i8 2015", "BMW i8 front"] },
  { id: "jaguar-e-type", queries: ["Jaguar E-Type roadster", "Jaguar E-Type 1965"] },
];

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: "json", origin: "*", ...params })}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

const clean = (h) =>
  (h ?? "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").trim();

async function candidatesFor(query, limit = 6) {
  const data = await api({
    action: "query",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "6",
    gsrlimit: String(limit * 3),
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    iiurlwidth: "1400",
  });
  const out = [];
  for (const p of Object.values(data?.query?.pages ?? {})) {
    const info = p.imageinfo?.[0];
    if (!info) continue;
    if (!/^image\/(jpeg|png)$/.test(info.mime ?? "")) continue;
    if (info.width < 1100 || info.width / info.height < 1.25) continue;
    const meta = info.extmetadata ?? {};
    out.push({
      title: p.title.replace(/^File:/, ""),
      thumb: info.thumburl ?? info.url,
      page: info.descriptionurl,
      width: info.width,
      height: info.height,
      artist: clean(meta.Artist?.value) || "Wikimedia Commons contributor",
      license: clean(meta.LicenseShortName?.value) || "See file page",
      query,
    });
    if (out.length >= limit) break;
  }
  return out;
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 20_000) throw new Error("file too small");
  writeFileSync(dest, buf);
  return buf.length;
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const meta = {};
for (const job of JOBS) {
  meta[job.id] = [];
  const seen = new Set();
  for (const q of job.queries) {
    let list = [];
    try {
      list = await candidatesFor(q);
    } catch (e) {
      console.log(`FAIL ${job.id} / ${q}: ${e.message}`);
      continue;
    }
    for (const cand of list) {
      if (seen.has(cand.title)) continue;
      seen.add(cand.title);
      const n = meta[job.id].length;
      const file = `${job.id}__${n}.jpg`;
      try {
        const size = await download(cand.thumb, join(OUT, file));
        meta[job.id].push({ ...cand, file, bytes: size });
      } catch (e) {
        console.log(`  skip ${cand.title}: ${e.message}`);
      }
    }
  }
  console.log(`${job.id}: ${meta[job.id].length} candidates`);
}

writeFileSync(join(OUT, "meta.json"), JSON.stringify(meta, null, 2));
for (const [id, list] of Object.entries(meta)) {
  console.log(`== ${id}`);
  for (const c of list) console.log(`  #${c.file.split("__")[1].replace(".jpg", "")} ${c.width}x${c.height}  ${c.title.slice(0, 90)}`);
}
