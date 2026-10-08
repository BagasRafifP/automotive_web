// Regenerate the generated block of public/credits.html from the fetched
// catalog metadata. Idempotent: the block is delimited by markers, so re-runs
// replace it instead of appending duplicates.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CREDITS_HTML = join(ROOT, "public", "credits.html");
const META_PATH = join(ROOT, "scratch", "catalog-meta.json");
const START = "<!-- catalog:start -->";
const END = "<!-- catalog:end -->";

const meta = JSON.parse(readFileSync(META_PATH, "utf8"));

const specs = [];
for (const group of ["group-a", "group-b", "group-c", "group-d", "group-e", "group-f"]) {
  const mod = await import(
    `file://${join(ROOT, "scripts", "spec", `${group}.mjs`).replace(/\\/g, "/")}`
  );
  specs.push(...mod.default);
}

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const sections = [];
for (const spec of specs) {
  const record = meta[spec.id];
  if (!record) continue;
  const row = `<tr><td>${esc(record.file)}</td><td>${esc(record.artist)}</td><td class="lic">${esc(record.license)}</td><td><a href="${esc(record.page)}" target="_blank" rel="noreferrer">Open source page</a></td></tr>`;
  sections.push(
    `<h2>${esc(`${spec.brand} ${spec.model}`)}</h2><table><tr><th>File</th><th>Artist</th><th>License</th><th>Source</th></tr>${row}</table>`,
  );
}

let html = readFileSync(CREDITS_HTML, "utf8");
const start = html.indexOf(START);
const end = html.indexOf(END);
if (start !== -1 && end !== -1) {
  html = html.slice(0, start) + html.slice(end + END.length + 1);
}
if (html.includes(START) || html.includes(END)) throw new Error("unbalanced catalog markers");

const before = html.length;
html = html.replace("</body>", `${START}${sections.join("")}${END}\n</body>`);
if (html.length === before) throw new Error("could not find </body> in credits.html");

const vehicleCount = (html.match(/<h2>/g) ?? []).length;
const rowCount = (html.match(/<tr>/g) ?? []).length;
const imageCount = rowCount - vehicleCount;
html = html.replace(/\d+ images across \d+ vehicles\./, `${imageCount} images across ${vehicleCount} vehicles.`);

writeFileSync(CREDITS_HTML, html);
console.log(
  `credits.html: ${sections.length} generated sections, now ${imageCount} images across ${vehicleCount} vehicles`,
);
