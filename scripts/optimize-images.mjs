/**
 * Converts the heavy PNG screenshots to resized WebP files next to the originals,
 * and cuts the portrait photos into 4:5 crops. The site (and the WebGL scenes,
 * which use them as textures) loads the .webp versions; the originals stay as sources.
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

/* Portraits: 4:5 crops framed on the subject (coordinates in the 960×1280 originals). */
const portraits = [
  { input: "home/banner/my.jpeg", output: "home/banner/portrait-hero.webp", crop: { left: 180, top: 250, width: 640, height: 800 } },
  { input: "home/banner/my 1.jpeg", output: "home/banner/portrait-about.webp", crop: { left: 40, top: 400, width: 560, height: 700 } },
];

for (const { input, output, crop } of portraits) {
  const info = await sharp(path.join(root, input))
    .rotate()
    .extract(crop)
    .resize({ width: 800, height: 1000, fit: "cover" })
    .webp({ quality: 82, effort: 6 })
    .toFile(path.join(root, output));
  console.log(`${input} -> ${output}: ${kb(info.size)}`);
}
