import { writeFile, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DEST_DIR = join(ROOT, "public", "destinations");
const URLS_FILE = join(__dirname, "image-urls.json");

async function download(url, filepath) {
  const resp = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "image/webp,image/avif,image/*,*/*;q=0.8",
    },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return Buffer.from(await resp.arrayBuffer());
}

async function main() {
  const urlsByDest = JSON.parse(await readFile(URLS_FILE, "utf-8"));

  let total = 0;
  for (const [slug, urls] of Object.entries(urlsByDest)) {
    const dir = join(DEST_DIR, slug);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }

    const files = ["hero.webp", "gallery-1.webp", "gallery-2.webp"];
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const filepath = join(dir, files[i]);
      if (existsSync(filepath) && existsSync(filepath.replace(".webp", ".jpg"))) {
        console.log(`[${slug}] ${files[i]} exists, skip`);
        total++;
        continue;
      }
      try {
        console.log(`[${slug}] Downloading ${files[i]}...`);
        const buf = await download(url, filepath);
        await writeFile(filepath, buf);
        console.log(`[${slug}] Saved ${files[i]} (${(buf.length / 1024).toFixed(0)}KB)`);
        total++;
      } catch (e) {
        console.error(`[${slug}] FAILED ${files[i]}: ${e.message}`);
      }
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  console.log(`\nDone. Downloaded ${total} images.`);
}

main().catch(console.error);
