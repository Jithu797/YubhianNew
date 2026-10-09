// Makes web-sized WebP copies of the homepage artwork. Run after adding or replacing
// images in public/chapters or public/cards:
//
//   node scripts/optimize-images.mjs
//
// Originals are left untouched; optimized files go to public/<folder>/opt/.
//   chapters → <name>-1920.webp (desktop) and <name>-960.webp (phones)
//   cards    → <name>-720.webp
import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.join(import.meta.dirname, "..", "public");
// Three widths so every screen gets enough real pixels: 960 for phones, 1920 for
// standard laptops, 2560 for 125–200% scaled and high-density displays (srcset lets the
// browser choose). Quality is kept high — softness from over-compression showed.
const JOBS = [
  { folder: "chapters", widths: [2560, 1920, 960], quality: 84 },
  { folder: "pages", widths: [2560, 1920, 960], quality: 84 },
  { folder: "cards", widths: [1080, 720], quality: 86 },
];
const SOURCE = /\.(jpe?g|png|webp)$/i;
// Optional crops (in source pixels), applied before resizing. Every chapter clip had its
// bottom edge trimmed (and its sides evenly, to stay 16:9) to remove the video
// generator's watermark, so each still is cropped identically: picture and video share
// one framing and the video fades in over the picture without a jump.
const VIDEO_CROP = { left: 133, top: 0, width: 2293, height: 1290 };
const CROPS = Object.fromEntries(
  ["hero", "service", "process", "number", "why-us", "cta"].map((n) => [`chapters/${n}.jpg`, VIDEO_CROP]),
);

for (const { folder, widths, quality } of JOBS) {
  const dir = path.join(PUBLIC, folder);
  if (!(await stat(dir).catch(() => null))) continue;
  const out = path.join(dir, "opt");
  await mkdir(out, { recursive: true });

  for (const file of await readdir(dir)) {
    if (!SOURCE.test(file)) continue;
    const name = file.replace(SOURCE, "");
    const src = path.join(dir, file);
    for (const width of widths) {
      const dest = path.join(out, `${name}-${width}.webp`);
      const crop = CROPS[`${folder}/${file}`];
      let img = sharp(src);
      if (crop) img = img.extract(crop);
      // A light sharpen after downscaling restores the crispness resizing softens.
      await img
        .resize({ width, withoutEnlargement: true, kernel: "lanczos3" })
        .sharpen({ sigma: 0.6 })
        .webp({ quality, effort: 6, smartSubsample: true })
        .toFile(dest);
      const before = (await stat(src)).size;
      const after = (await stat(dest)).size;
      console.log(`${folder}/${file} → opt/${name}-${width}.webp  ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB`);
    }
  }
}
