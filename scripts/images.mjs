// Build optimised site images from assets/images (originals) into public/images.
//   pnpm images
// - Photos (assets/images/sources.json): optional crop to an aspect, optional
//   steel grade (desaturate + cool tint) so mixed stock and phone photos
//   read as one set, WebP at WIDTHS, a blur placeholder.
// - Brand: transparent logo for dark backgrounds, favicon, apple icon, OG card.
// Writes content/images.generated.ts (dimensions + placeholders).
import fs from "node:fs"
import path from "node:path"

import sharp from "sharp"

const ROOT = path.resolve(import.meta.dirname, "..")
const SRC = path.join(ROOT, "assets/images")
const OUT = path.join(ROOT, "public/images")
const WIDTHS = [640, 1080, 1600, 2400]
/** Sources narrower than this get a (capped 2x) quality upscale. */
const MIN_WIDTH = 1200
// Cool steel tint so stock, phone and CAD images read as one set.
const STEEL = { r: 124, g: 131, b: 142 }

fs.mkdirSync(OUT, { recursive: true })

async function grade(pipeline) {
  const { data, info } = await pipeline
    .modulate({ saturation: 0.75, brightness: 0.99 })
    .toBuffer({ resolveWithObject: true })
  const tint = await sharp({
    create: {
      width: info.width,
      height: info.height,
      channels: 4,
      background: { ...STEEL, alpha: 0.22 },
    },
  })
    .png()
    .toBuffer()
  return sharp(data).composite([{ input: tint, blend: "soft-light" }])
}

async function buildImage(entry) {
  const file = path.join(SRC, entry.src)
  const meta = await sharp(file).metadata()
  // Largest crop of the requested aspect that fits the source.
  const cropWidth = Math.min(meta.width, entry.aspect ? meta.height * entry.aspect : Infinity)
  // Small sources (many originals are ~500 px) are upscaled up to 2x with
  // Lanczos plus light sharpening, so they stay crisp on high-DPI screens.
  // This can't invent detail; sharper originals are still the real fix.
  const upscale = cropWidth < MIN_WIDTH ? Math.min(2, MIN_WIDTH / cropWidth) : 1
  const baseWidth = Math.round(Math.min(2400, cropWidth * upscale))
  const baseHeight = entry.aspect
    ? Math.round(baseWidth / entry.aspect)
    : Math.round((meta.height * baseWidth) / meta.width)

  let base = sharp(file).rotate().resize({
    width: baseWidth,
    height: baseHeight,
    fit: "cover",
    position: sharp.strategy.attention,
    kernel: sharp.kernel.lanczos3,
  })
  if (upscale > 1) base = base.sharpen({ sigma: 0.8, m1: 0.6, m2: 1.4 })
  if (entry.grade) base = await grade(sharp(await base.png().toBuffer()))
  const master = await base.png().toBuffer()

  // Only emit widths the source can fill; smaller sources reuse their max.
  for (const width of WIDTHS) {
    await sharp(master)
      .resize({ width: Math.min(width, baseWidth) })
      .webp({ quality: entry.plain ? 94 : 88, effort: 6, smartSubsample: true })
      .toFile(path.join(OUT, `${entry.key}-${width}.webp`))
  }
  const blur = await sharp(master).resize({ width: 16 }).webp({ quality: 40 }).toBuffer()
  return {
    width: baseWidth,
    height: baseHeight,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
  }
}

// The logo sits on white or transparency. Key out the white, then make a light variant
// (indigo wordmark → near-white) for the dark site; saffron and green stay.
async function buildBrand() {
  const brandOut = path.join(OUT, "brand")
  fs.mkdirSync(brandOut, { recursive: true })
  const { data, info } = await sharp(path.join(SRC, "AWT-logo.jpeg"))
    .trim({ threshold: 20 })
    .resize({ height: 300 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const light = Buffer.from(data)
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]]
    const min = Math.min(r, g, b)
    // White → transparent, with a soft edge for anti-aliased pixels.
    // (The source is really a PNG with transparency; keep its own alpha too.)
    const keyed = min > 235 ? 0 : min > 180 ? Math.round(((235 - min) / 55) * 255) : 255
    const alpha = Math.min(keyed, data[i + 3])
    data[i + 3] = alpha
    light[i + 3] = alpha
    const isIndigo = b > r + 40 && b > g + 40
    if (isIndigo) light[i] = light[i + 1] = light[i + 2] = 240
  }
  await sharp(data, { raw: info }).webp({ quality: 92 }).toFile(path.join(brandOut, "logo.webp"))
  await sharp(light, { raw: info }).webp({ quality: 92 }).toFile(path.join(brandOut, "logo-light.webp"))

  const icon = await sharp(path.join(SRC, "AWT-logo.jpeg"))
    .extract({ left: 150, top: 10, width: 270, height: 270 })
    .toBuffer()
  await sharp(icon).resize(512, 512).png().toFile(path.join(ROOT, "app/icon.png"))
  await sharp(icon).resize(180, 180).png().toFile(path.join(ROOT, "app/apple-icon.png"))
  console.log("brand assets written", `${info.width}x${info.height}`)
  return { width: info.width, height: info.height }
}

async function buildOgImage() {
  const bg = await sharp(path.join(SRC, "slideshow/UM.jpeg"))
    .resize(1200, 630, { fit: "cover", position: sharp.strategy.attention })
    .modulate({ saturation: 0.4, brightness: 0.35 })
    .toBuffer()
  const logo = await sharp(path.join(OUT, "brand/logo-light.webp")).resize({ height: 150 }).png().toBuffer()
  const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <rect x="0" y="0" width="1200" height="630" fill="#16181c" fill-opacity="0.5"/>
    <rect x="0" y="0" width="10" height="630" fill="#e4572e"/>
    <text x="80" y="390" font-family="Arial Narrow, Arial, sans-serif" font-size="84" font-weight="700" fill="#ffffff">SHAPING THE FUTURE</text>
    <text x="80" y="475" font-family="Arial Narrow, Arial, sans-serif" font-size="84" font-weight="700" fill="#e8eaed">OF AEROSPACE</text>
    <text x="80" y="545" font-family="Arial, sans-serif" font-size="28" fill="#c9cdd3">Precision aerospace and defence machining · Bengaluru · ISO 9001:2015</text>
  </svg>`)
  await sharp(bg)
    .composite([{ input: logo, left: 80, top: 70 }, { input: text, left: 0, top: 0 }])
    .png()
    .toFile(path.join(ROOT, "app/opengraph-image.png"))
  console.log("og image written")
}

const { images } = JSON.parse(fs.readFileSync(path.join(SRC, "sources.json"), "utf8"))
const generated = {}
for (const entry of images) {
  generated[entry.key] = await buildImage(entry)
  console.log("built", entry.key, `${generated[entry.key].width}x${generated[entry.key].height}`)
}
const logo = await buildBrand()
await buildOgImage()

const ts = `// Generated by scripts/images.mjs. Do not edit.
export const imageWidths = ${JSON.stringify(WIDTHS)} as const

export const logoSize = ${JSON.stringify(logo)} as const

export const imageData = ${JSON.stringify(generated, null, 2)} as const
`
fs.writeFileSync(path.join(ROOT, "content/images.generated.ts"), ts)
console.log(`wrote content/images.generated.ts (${images.length} images)`)
