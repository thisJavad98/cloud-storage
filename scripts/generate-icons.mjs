/**
 * Generate Nimbus app icons — classic cloud + bars + check.
 * Run: node scripts/generate-icons.mjs
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const ORANGE = "#e8782a";
const ORANGE_DEEP = "#c96118";
const CREAM = "#fff4e8";

function nimbusMark(fill = "#ffffff", { onOrange = true } = {}) {
  const bar = onOrange ? ORANGE_DEEP : "#ffffff";
  const barOp = onOrange ? [0.55, 0.42, 0.3] : [0.92, 0.75, 0.55];
  const badge = onOrange ? CREAM : ORANGE;
  const tick = onOrange ? ORANGE_DEEP : "#ffffff";

  return `
  <g>
    <g fill="${fill}">
      <circle cx="22" cy="34" r="11"/>
      <circle cx="33" cy="27" r="13.5"/>
      <circle cx="45" cy="34" r="10.5"/>
      <rect x="12" y="34" width="40" height="14" rx="7"/>
    </g>
    <rect x="22" y="32" width="20" height="3" rx="1.5" fill="${bar}" opacity="${barOp[0]}"/>
    <rect x="24" y="36.5" width="16" height="3" rx="1.5" fill="${bar}" opacity="${barOp[1]}"/>
    <rect x="27" y="41" width="10" height="3" rx="1.5" fill="${bar}" opacity="${barOp[2]}"/>
    <circle cx="50" cy="18" r="7.5" fill="${badge}"/>
    <path d="M46.8 18.2 49.1 20.4l4.4-4.8" stroke="${tick}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>`;
}

function appIconSvg(size, { maskable = false, rounded = true } = {}) {
  const pad = maskable ? size * 0.18 : size * 0.14;
  const markSize = size - pad * 2;
  const r = rounded && !maskable ? Math.round(size * 0.22) : 0;
  const bgRect =
    rounded && !maskable
      ? `<rect width="${size}" height="${size}" rx="${r}" fill="url(#bg)"/>`
      : `<rect width="${size}" height="${size}" fill="url(#bg)"/>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${size}" y2="${size}" gradientUnits="userSpaceOnUse">
      <stop stop-color="${ORANGE}"/>
      <stop offset="1" stop-color="${ORANGE_DEEP}"/>
    </linearGradient>
  </defs>
  ${bgRect}
  <g transform="translate(${pad} ${pad}) scale(${markSize / 64})">
    ${nimbusMark("#ffffff", { onOrange: true })}
  </g>
</svg>`;
}

function transparentMarkSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  ${nimbusMark(ORANGE, { onOrange: false })}
</svg>`;
}

async function writePng(svg, outPath) {
  const buf = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  writeFileSync(outPath, buf);
  console.log("wrote", outPath.replace(root + "/", ""));
}

async function main() {
  const publicDir = join(root, "public");
  const appDir = join(root, "app");

  await writePng(appIconSvg(1024), join(publicDir, "icon.png"));
  await writePng(appIconSvg(1024), join(appDir, "icon.png"));
  await writePng(appIconSvg(1024), join(appDir, "apple-icon.png"));
  await writePng(appIconSvg(180, { rounded: true }), join(publicDir, "apple-touch-icon.png"));
  await writePng(appIconSvg(32, { rounded: true }), join(publicDir, "favicon.png"));
  await writePng(appIconSvg(192, { rounded: true }), join(publicDir, "icon-192.png"));
  await writePng(appIconSvg(512, { rounded: true }), join(publicDir, "icon-512.png"));
  await writePng(appIconSvg(192, { maskable: true }), join(publicDir, "icon-192-maskable.png"));
  await writePng(appIconSvg(512, { maskable: true }), join(publicDir, "icon-512-maskable.png"));
  await writePng(transparentMarkSvg(), join(publicDir, "logo-mark.png"));
  await writePng(appIconSvg(1024), join(publicDir, "icon-generated.png"));

  writeFileSync(join(publicDir, "icon.svg"), appIconSvg(512, { rounded: true }));
  writeFileSync(join(publicDir, "logo.svg"), transparentMarkSvg());
  console.log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
