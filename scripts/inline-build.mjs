import { readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

// Vite emits dist/app.html (its configured entry). This step inlines the CSS
// and JS into that document, writes it as dist/index.html, and removes the
// original so the deployed artifact is a single self-contained page.
const dist = join(process.cwd(), "dist");
const appPath = join(dist, "app.html");
const indexPath = join(dist, "index.html");
const readAsset = (ref) => readFileSync(join(dist, ref.replace(/^\.?\//, "")), "utf8");

let html = readFileSync(appPath, "utf8");

html = html.replace(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (_match, href) => {
  return `<style>${readAsset(href)}</style>`;
});

html = html.replace(/<script[^>]*type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g, (_match, src) => {
  const js = readAsset(src).replace(/<\/script/gi, "<\\/script");
  return `<script type="module">${js}</script>`;
});

writeFileSync(indexPath, html);
if (existsSync(appPath)) rmSync(appPath);

console.log(`Inlined build into a single HTML file (${html.length} bytes)`);
