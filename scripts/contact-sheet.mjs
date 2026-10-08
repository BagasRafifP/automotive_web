// Scratch tool: render scratch/cand/meta.json into a compact contact sheet.
import { readFileSync, writeFileSync } from "node:fs";

const meta = JSON.parse(readFileSync("scratch/cand/meta.json", "utf8"));
const PER_CAR = 4;

const sections = Object.entries(meta)
  .map(([id, list]) => {
    const cells = list
      .slice(0, PER_CAR)
      .map((c) => {
        const idx = c.file.split("__")[1].replace(".jpg", "");
        return `<figure><img src="cand/${c.file}" loading="eager"><figcaption>#${idx}</figcaption></figure>`;
      })
      .join("");
    return `<section><h2>${id}</h2><div class="row">${cells}</div></section>`;
  })
  .join("");

const html = `<!doctype html><meta charset="utf-8"><title>candidates</title>
<style>
html{background:#0b0d12}
body{color:#e8eef7;font:12px/1.3 system-ui,sans-serif;margin:0;padding:8px}
section{margin-bottom:10px;border-bottom:1px solid #1d242f;padding-bottom:8px}
h2{font-size:12px;margin:0 0 4px;color:#6fd3ff;font-family:ui-monospace,monospace;text-transform:uppercase;letter-spacing:.12em}
.row{display:grid;grid-template-columns:repeat(${PER_CAR},1fr);gap:5px}
figure{margin:0;background:#141821;border:1px solid #262e3c;border-radius:5px;overflow:hidden}
img{width:100%;height:86px;object-fit:cover;display:block}
figcaption{padding:1px 4px;font-size:10px;color:#8b9ab0;font-family:ui-monospace,monospace}
</style>${sections}`;
writeFileSync("scratch/sheet.html", html);
console.log(`wrote scratch/sheet.html (${Object.keys(meta).length} cars, ${PER_CAR} each)`);
