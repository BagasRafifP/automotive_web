import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const PORT = 4190;
const PREFIX = "/automotive_web/";
const root = join(process.cwd(), "dist");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  if (!url.startsWith(PREFIX)) {
    res.writeHead(404).end("not under " + PREFIX);
    return;
  }
  let rel = url.slice(PREFIX.length);
  if (rel === "" || rel.endsWith("/")) rel += "index.html";
  const file = join(root, rel);
  if (!existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404).end("missing " + rel);
    return;
  }
  res.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
}).listen(PORT, "127.0.0.1", () => console.log(`serving dist at http://127.0.0.1:${PORT}${PREFIX}`));
