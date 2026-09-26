/**
 * Generate detailed minimalist Nimbus app icons.
 * Run: node scripts/generate-icons.mjs
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const BLUE = "#1e55d6";
const GOLD = "#f6c344";
const GOLD_DEEP = "#e8b02e";

/** Detailed cloud mark in viewBox 0 0 64 64 */
function cloudMark(fill = "#ffffff", { withBadge = true } = {}) {
  const onWhite = fill === "#ffffff";
  const highlight = onWhite ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.38)";
  // Bars need contrast against the cloud fill
  const bar = onWhite ? "#1542b0" : "rgba(255,255,255,0.92)";
  const barOp = onWhite ? [0.72, 0.55, 0.4] : [1, 0.75, 0.55];
  return `
  <g>
    <g fill="${fill}">
      <rect x="11" y="31" width="42" height="15" rx="7.5"/>
      <circle cx="21.5" cy="32" r="9.5"/>
      <circle cx="33" cy="26.5" r="12.5"/>
      <circle cx="46" cy="32" r="9"/>
    </g>
    <ellipse cx="30" cy="22.5" rx="8" ry="4.2" fill="${highlight}"/>
    <path d="M18 33.5c1.2-3.8 4.6-6.2 8.4-6.2" stroke="${highlight}" stroke-width="2" stroke-linecap="round" fill="none"/>
    <rect x="24" y="31.5" width="16" height="2.6" rx="1.3" fill="${bar}" opacity="${barOp[0]}"/>
    <rect x="26" y="35.2" width="12" height="2.6" rx="1.3" fill="${bar}" opacity="${barOp[1]}"/>
    <rect x="28" y="38.9" width="8" height="2.6" rx="1.3" fill="${bar}" opacity="${barOp[2]}"/>
    ${
      withBadge
        ? `<g>
      <circle cx="48" cy="18" r="7.2" fill="${GOLD}"/>
      <circle cx="48" cy="18" r="7.2" fill="${GOLD_DEEP}" opacity="0.35"/>
      <circle cx="48" cy="18" r="5.8" fill="none" stroke="#fff" stroke-width="1.1" opacity="0.55"/>
      <path d="M45.2 18.1 47.1 20l3.8-4.2" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </g>`
        : ""
    }
  </g>`;
}

function appIconSvg(size, { maskable = false, rounded = true } = {}) {
  const pad = maskable ? size * 0.2 : size * 0.14;
  const cloudSize = size - pad * 2;
  const yNudge = size * 0.015;
  const r = rounded && !maskable ? Math.round(size * 0.22) : 0;
  const bg =
    rounded && !maskable
      ? `<rect width="${size}" height="${size}" rx="${r}" fill="${BLUE}"/>`
      : `<rect width="${size}" height="${size}" fill="${BLUE}"/>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${bg}
  <g transform="translate(${pad} ${pad - yNudge}) scale(${cloudSize / 64})">
    ${cloudMark("#ffffff")}
  </g>
</svg>`;
}

function transparentMarkSvg(size = 64) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  ${cloudMark(BLUE)}
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
  await writePng(transparentMarkSvg(512), join(publicDir, "logo-mark.png"));
  await writePng(appIconSvg(1024), join(publicDir, "icon-generated.png"));

  writeFileSync(join(publicDir, "icon.svg"), appIconSvg(512, { rounded: true }));
  writeFileSync(join(publicDir, "logo.svg"), transparentMarkSvg(64));
  console.log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
