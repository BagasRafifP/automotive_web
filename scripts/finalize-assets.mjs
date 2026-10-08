// Scratch tool: copy the chosen candidate photos into public/cars/ using the
// site's <id>.jpg / <id>-2.jpg naming, validating each file and emitting the
// credit rows for public/credits.html.
import { readFileSync, writeFileSync, copyFileSync, statSync } from "node:fs";

// Lookup keyed by "<set>/<filename>" so both fetch passes resolve uniformly.
const byPath = {};
for (const [set, metaPath] of [
  ["cand", "scratch/cand/meta.json"],
  ["cand2", "scratch/cand2/meta.json"],
]) {
  for (const list of Object.values(JSON.parse(readFileSync(metaPath, "utf8")))) {
    for (const c of list) byPath[`${set}/${c.file}`] = c;
  }
}

// [carId, mainCandidateFile, galleryCandidateFile]
const PICKS = [
  ["bmw-m3-g80", "scratch/cand/bmw-m3-g80__2.jpg", "scratch/cand/bmw-m3-g80__3.jpg"],
  ["bmw-i8", "scratch/cand2/bmw-i8__0.jpg", "scratch/cand2/bmw-i8__9.jpg"],
  ["vw-golf-gti-mk8", "scratch/cand2/vw-golf-gti-mk8__3.jpg", "scratch/cand2/vw-golf-gti-mk8__4.jpg"],
  ["rolls-royce-phantom", "scratch/cand/rolls-royce-phantom__2.jpg", "scratch/cand/rolls-royce-phantom__0.jpg"],
  ["mercedes-amg-gt", "scratch/cand/mercedes-amg-gt__0.jpg", "scratch/cand/mercedes-amg-gt__5.jpg"],
  ["audi-r8", "scratch/cand/audi-r8__2.jpg", "scratch/cand/audi-r8__0.jpg"],
  ["corvette-c8", "scratch/cand/corvette-c8__0.jpg", "scratch/cand/corvette-c8__2.jpg"],
  ["dodge-challenger-hellcat", "scratch/cand/dodge-challenger-hellcat__2.jpg", "scratch/cand/dodge-challenger-hellcat__3.jpg"],
  ["bugatti-chiron", "scratch/cand/bugatti-chiron__2.jpg", "scratch/cand/bugatti-chiron__0.jpg"],
  ["tesla-model-s-plaid", "scratch/cand2/tesla-model-s-plaid__5.jpg", "scratch/cand2/tesla-model-s-plaid__7.jpg"],
  ["aston-martin-dbs", "scratch/cand/aston-martin-dbs__1.jpg", "scratch/cand/aston-martin-dbs__5.jpg"],
  ["pagani-huayra", "scratch/cand/pagani-huayra__0.jpg", "scratch/cand/pagani-huayra__2.jpg"],
  ["koenigsegg-jesko", "scratch/cand/koenigsegg-jesko__3.jpg", "scratch/cand/koenigsegg-jesko__4.jpg"],
  ["lexus-lfa", "scratch/cand/lexus-lfa__3.jpg", "scratch/cand/lexus-lfa__4.jpg"],
  ["ford-gt", "scratch/cand/ford-gt__0.jpg", "scratch/cand/ford-gt__2.jpg"],
  ["jaguar-e-type", "scratch/cand/jaguar-e-type__2.jpg", "scratch/cand2/jaguar-e-type__4.jpg"],
];

// Find the record for a downloaded candidate file across both meta sets.
function recordFor(src) {
  const [, set, file] = src.split("/");
  return byPath[`${set}/${file}`] ?? null;
}

// Minimal JPEG sanity check: magic bytes + read the SOF dimensions.
function jpegInfo(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error("not a JPEG");
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = buf[i + 1];
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2;
      continue;
    }
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  throw new Error("no SOF marker");
}

const credits = [];
for (const [id, mainSrc, gallerySrc] of PICKS) {
  const rows = [];
  const targets = [
    [mainSrc, `public/cars/${id}.jpg`],
    [gallerySrc, `public/cars/${id}-2.jpg`],
  ];
  for (const [src, dest] of targets) {
    const buf = readFileSync(src);
    const { width, height } = jpegInfo(buf);
    copyFileSync(src, dest);
    const rec = recordFor(src);
    if (!rec) throw new Error(`no metadata for ${src}`);
    rows.push({
      file: dest.replace("public/cars/", ""),
      artist: rec.artist,
      license: rec.license,
      page: rec.page,
      title: rec.title,
      width,
      height,
      bytes: statSync(dest).size,
    });
  }
  credits.push({ id, rows });
  console.log(`${id.padEnd(26)} ${rows.map((r) => `${r.file} ${r.width}x${r.height} ${(r.bytes / 1024).toFixed(0)}KB`).join("  |  ")}`);
}

writeFileSync("scratch/new-credits.json", JSON.stringify(credits, null, 2));
const total = credits.reduce((a, c) => a + c.rows.reduce((x, r) => x + r.bytes, 0), 0);
console.log(`\n${credits.length} cars, ${credits.length * 2} images, ${(total / 1048576).toFixed(1)}MB`);

// --- Patch public/credits.html with the new attribution tables -------------
const NAMES = {
  "bmw-m3-g80": "BMW M3 Competition",
  "bmw-i8": "BMW i8",
  "vw-golf-gti-mk8": "Volkswagen Golf GTI Clubsport",
  "rolls-royce-phantom": "Rolls-Royce Phantom VIII",
  "mercedes-amg-gt": "Mercedes-AMG GT Black Series",
  "audi-r8": "Audi R8 V10 Performance",
  "corvette-c8": "Chevrolet Corvette C8",
  "dodge-challenger-hellcat": "Dodge Challenger SRT Hellcat",
  "bugatti-chiron": "Bugatti Chiron",
  "tesla-model-s-plaid": "Tesla Model S Plaid",
  "aston-martin-dbs": "Aston Martin DBS Superleggera",
  "pagani-huayra": "Pagani Huayra",
  "koenigsegg-jesko": "Koenigsegg Jesko",
  "lexus-lfa": "Lexus LFA",
  "ford-gt": "Ford GT",
  "jaguar-e-type": "Jaguar E-Type Series 1",
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const CREDITS_HTML = "public/credits.html";

{
  let html = readFileSync(CREDITS_HTML, "utf8");
  if (html.includes("<h2>BMW M3 Competition</h2>")) {
    console.log("credits.html already lists the new cars — skipping");
  } else {
    const sections = credits
      .map(({ id, rows }) => {
        const cells = rows
          .map(
            (r) =>
              `<tr><td>${r.file}</td><td>${esc(r.artist)}</td><td class="lic">${esc(r.license)}</td><td><a href="${r.page}" target="_blank" rel="noreferrer">Open source page</a></td></tr>`,
          )
          .join("");
        return `<h2>${NAMES[id]}</h2><table><tr><th>File</th><th>Artist</th><th>License</th><th>Source</th></tr>${cells}</table>`;
      })
      .join("");

    const before = html;
    html = html.replace("</body>", `${sections}\n</body>`);
    if (html === before) throw new Error("could not find </body> in credits.html");

    // The intro sentence carries a hand-maintained count; refresh it.
    html = html.replace(
      /\d+ images across \d+ vehicles\./,
      (m) => {
        const [imgs, cars] = m.match(/\d+/g).map(Number);
        return `${imgs + rows_total(credits)} images across ${cars + credits.length} vehicles.`;
      },
    );
    writeFileSync(CREDITS_HTML, html);
    const after = readFileSync(CREDITS_HTML, "utf8");
    console.log(`credits.html: ${before.length} -> ${after.length} bytes`);
    console.log(after.match(/\d+ images across \d+ vehicles\./)[0]);
  }
}

function rows_total(list) {
  return list.reduce((a, c) => a + c.rows.length, 0);
}
