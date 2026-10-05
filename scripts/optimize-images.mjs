/**
 * Converts the heavy PNG screenshots to resized WebP files next to the originals.
 * The site (and the WebGL scenes, which use them as textures) loads the .webp
 * versions; the originals stay as sources.
 *
 *   npm run images
 */
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..", "public", "images");

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

/* Project screenshots: every PNG/JPEG in the folder. */
const folders = [{ dir: "work", width: 1280, quality: 78 }];

for (const { dir, width, quality } of folders) {
  const folder = path.join(root, dir);
  const files = (await readdir(folder)).filter((f) => /\.(png|jpe?g)$/i.test(f));

  for (const file of files) {
    const input = path.join(folder, file);
    const output = input.replace(/\.(png|jpe?g)$/i, ".webp");
    const info = await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(output);
    console.log(`${dir}/${file}: ${kb((await stat(input)).size)} -> ${kb(info.size)}`);
  }
}
