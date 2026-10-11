import sources from "@/assets/images/sources.json"
import { imageData, imageWidths } from "@/content/images.generated"

export type ImageKey = keyof typeof imageData
export type ImageWidth = (typeof imageWidths)[number]

export type SiteImageData = {
  width: number
  height: number
  blurDataURL: string
  alt: string
}

type SourceEntry = { key: string; alt: string; source?: string; license?: string; licenseUrl?: string; credit?: string }

const entries: SourceEntry[] = sources.images
const alts = new Map(entries.map((image) => [image.key, image.alt]))

/** Dimensions and blur placeholder from the build; alt text from sources.json. */
export function getImage(key: ImageKey): SiteImageData {
  return { ...imageData[key], alt: alts.get(key) ?? "" }
}

export type ImageCredit = { credit: string; license: string; licenseUrl?: string; source: string }

/** Attribution for third-party photos (licences such as CC BY-SA require it), else null. */
export function getCredit(key: ImageKey): ImageCredit | null {
  const entry = entries.find((image) => image.key === key)
  return entry?.credit && entry.license && entry.source
    ? { credit: entry.credit, license: entry.license, licenseUrl: entry.licenseUrl, source: entry.source }
    : null
}

/** URL of one pre-built variant (also for CSS backgrounds). */
export function imageUrl(key: ImageKey, width: ImageWidth = 1600) {
  return `/images/${key}-${width}.webp`
}

export { imageWidths }
