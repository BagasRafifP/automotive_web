import { readFileSync } from "node:fs";

const html = readFileSync("dist/index.html", "utf8");

const all = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
const external = all.filter((u) => !u.startsWith("data:") && !/^\d+\.\d/.test(u) && !u.startsWith("http"));

const counts = {};
for (const u of external) {
  const key = u.replace(/\/[^/]+$/, "/").replace(/(assets|automotive_web\/cars)\/.*/, "$1/*");
  counts[key] = (counts[key] || 0) + 1;
}

console.log("total ref attrs:", all.length);
console.log("non-http refs:", external.length);
console.log("ref buckets:", counts);
console.log("module scripts still external:", /<script[^>]*type="module"[^>]*\bsrc=/i.test(html));
console.log("inline style blocks:", (html.match(/<style>/g) || []).length);
console.log("cars/ refs:", (html.match(/\/automotive_web\/cars\//g) || []).length);
const badCarsRefs = [...html.matchAll(/"(?:\/cars\/|automotive_web\/cars\/)/g)].length;
console.log("cars refs NOT under /automotive_web/:", badCarsRefs);
console.log("root-absolute refs:", (html.match(/="\/(?!automotive_web\/)/g) || []).length);
console.log("relative ./ refs:", (html.match(/="\.\//g) || []).length);
console.log("sample refs:", external.slice(0, 4));
