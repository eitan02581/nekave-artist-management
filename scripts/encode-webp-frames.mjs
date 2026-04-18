import { readdir } from "node:fs/promises";
import { join, parse } from "node:path";
import sharp from "sharp";

const [, , inputDir, outputDir] = process.argv;
if (!inputDir || !outputDir) {
  console.error("usage: encode-webp-frames.mjs <inputDir> <outputDir>");
  process.exit(1);
}

const files = (await readdir(inputDir))
  .filter((f) => f.endsWith(".png"))
  .sort();

await Promise.all(
  files.map(async (file) => {
    const out = join(outputDir, `${parse(file).name}.webp`);
    await sharp(join(inputDir, file))
      .webp({ quality: 78, effort: 6 })
      .toFile(out);
  }),
);
