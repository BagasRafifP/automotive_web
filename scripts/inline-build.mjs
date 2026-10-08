import { readFileSync, writeFileSync, existsSync, rmSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";

// Vite emits dist/app.html (its configured entry). This step inlines the CSS
// and JS into that document, writes it as dist/index.html, and removes the
// original so the deployed artifact is a single self-contained page.
const dist = join(process.cwd(), "dist");
const appPath = join(dist, "app.html");
const indexPath = join(dist, "index.html");

// Emitted refs carry the configured base (e.g. "/automotive_web/assets/x.js")
// which does not exist on disk under dist, so locate the file by name.
const findByBasename = (dir, name) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      const hit = findByBasename(full, name);
      if (hit) return hit;
    } else if (entry.name === name) {
      return full;
    }
  }
  return null;
};

const readAsset = (ref) => {
  const rel = decodeURIComponent(ref).replace(/^\.?\//, "");
  const direct = join(dist, rel);
  const resolved = existsSync(direct) ? direct : findByBasename(dist, basename(rel));
  if (!resolved) throw new Error(`Could not resolve built asset: ${ref}`);
  return readFileSync(resolved, "utf8");
};

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
