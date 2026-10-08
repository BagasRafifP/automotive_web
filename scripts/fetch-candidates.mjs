// Scratch tool: gather candidate photos for new cars from Wikimedia Commons.
// Downloads a few options per car plus the credit metadata, then writes a
// contact sheet so the best shot per car can be chosen by eye.
import { mkdirSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const OUT = "scratch/cand";
const API = "https://commons.wikimedia.org/w/api.php";

const CARS = [
  { id: "bmw-m3-g80", query: "BMW M3 G80" },
  { id: "bmw-i8", query: "BMW i8" },
  { id: "vw-golf-gti-mk8", query: "Volkswagen Golf 8 GTI" },
  { id: "rolls-royce-phantom", query: "Rolls-Royce Phantom VIII" },
  { id: "mercedes-amg-gt", query: "Mercedes-AMG GT Black Series" },
  { id: "audi-r8", query: "Audi R8 V10 Performance" },
  { id: "corvette-c8", query: "Chevrolet Corvette C8" },
  { id: "dodge-challenger-hellcat", query: "Dodge Challenger SRT Hellcat" },
  { id: "bugatti-chiron", query: "Bugatti Chiron" },
  { id: "tesla-model-s-plaid", query: "Tesla Model S Plaid" },
  { id: "aston-martin-dbs", query: "Aston Martin DBS Superleggera" },
  { id: "pagani-huayra", query: "Pagani Huayra" },
  { id: "koenigsegg-jesko", query: "Koenigsegg Jesko" },
  { id: "lexus-lfa", query: "Lexus LFA" },
  { id: "ford-gt", query: "Ford GT 2017" },
  { id: "jaguar-e-type", query: "Jaguar E-Type" },
];

const UA = "automotive-web-showcase/1.0 (contact: local build script)";

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: "json", origin: "*", ...params })}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`API ${res.status} for ${params.gsrsearch ?? ""}`);
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
    .trim();
}

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
  const pages = Object.values(data?.query?.pages ?? {});
  const out = [];
  for (const p of pages) {
    const info = p.imageinfo?.[0];
    if (!info) continue;
    if (!/^image\/(jpeg|png)$/.test(info.mime ?? "")) continue;
    // Landscape only — the cards crop to 16:10.
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
for (const car of CARS) {
  meta[car.id] = [];
  let list = [];
  try {
    list = await candidatesFor(car.query);
  } catch (e) {
    console.log(`FAIL query ${car.id}: ${e.message}`);
    continue;
  }
  let n = 0;
  for (const cand of list) {
    const file = `${car.id}__${n}.jpg`;
    try {
      const size = await download(cand.thumb, join(OUT, file));
      meta[car.id].push({ ...cand, file, bytes: size });
      n += 1;
    } catch (e) {
      console.log(`  skip ${cand.title}: ${e.message}`);
    }
  }
  console.log(`${car.id}: ${meta[car.id].length} candidates`);
}

writeFileSync(join(OUT, "meta.json"), JSON.stringify(meta, null, 2));

// Contact sheet for visual selection.
const sections = Object.entries(meta)
  .map(([id, list]) => {
    const cells = list
      .map(
        (c) => `<figure><img src="${c.file}" loading="lazy"><figcaption><b>${id} #${c.file
          .split("__")[1]
          .replace(".jpg", "")}</b><br>${c.title}<br>${c.width}×${c.height} · ${(
          c.bytes / 1024
        ).toFixed(0)} KB<br>${c.artist} · ${c.license}</figcaption></figure>`,
      )
      .join("");
    return `<h2>${id}</h2><div class="row">${cells || "<p>none</p>"}</div>`;
  })
  .join("");

const html = `<!doctype html><meta charset="utf-8"><title>candidates</title>
<style>
body{background:#0b0d12;color:#e8eef7;font:13px/1.4 system-ui,sans-serif;margin:0;padding:16px}
h2{font-size:15px;margin:22px 0 8px;color:#6fd3ff;font-family:ui-monospace,monospace;text-transform:uppercase;letter-spacing:.1em}
.row{display:flex;gap:10px;flex-wrap:wrap}
figure{margin:0;width:300px;background:#141821;border:1px solid #232a36;border-radius:8px;overflow:hidden}
img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block}
figcaption{padding:6px 8px;font-size:10px;color:#95a3b8;line-height:1.35}
</style>${sections}`;
writeFileSync("scratch/contact-sheet.html", html);

const total = Object.values(meta).reduce((a, b) => a + b.length, 0);
console.log(`\nTOTAL ${total} images -> scratch/contact-sheet.html`);
