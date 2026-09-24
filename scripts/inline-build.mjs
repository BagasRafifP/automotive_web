import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dist = join(process.cwd(), "dist");
const indexPath = join(dist, "index.html");
const readAsset = (ref) => readFileSync(join(dist, ref.replace(/^\.?\//, "")), "utf8");

let html = readFileSync(indexPath, "utf8");

html = html.replace(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (_match, href) => {
  return `<style>${readAsset(href)}</style>`;
});

html = html.replace(/<script[^>]*type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g, (_match, src) => {
  const js = readAsset(src).replace(/<\/script/gi, "<\\/script");
  return `<script type="module">${js}</script>`;
});

writeFileSync(indexPath, html);
console.log(`Inlined build into a single HTML file (${html.length} bytes)`);
