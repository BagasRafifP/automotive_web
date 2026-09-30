import { copyFileSync, cpSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// GitHub Pages serves this repository from its root, so the built page and the
// assets it references must live at the root as well. public/cars stays the
// canonical source that Vite copies into dist.
const dist = join(process.cwd(), "dist");
const root = process.cwd();

for (const file of ["index.html", "credits.html", "favicon.svg"]) {
  copyFileSync(join(dist, file), join(root, file));
}

mkdirSync(join(root, "cars"), { recursive: true });
cpSync(join(dist, "cars"), join(root, "cars"), { recursive: true });

console.log("Synced dist output to the repository root for GitHub Pages");
