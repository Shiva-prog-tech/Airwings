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

const alts = new Map(sources.images.map((image) => [image.key, image.alt]))

/** Dimensions and blur placeholder from the build; alt text from sources.json. */
export function getImage(key: ImageKey): SiteImageData {
  return { ...imageData[key], alt: alts.get(key) ?? "" }
}

/** URL of one pre-built variant (also for CSS backgrounds). */
export function imageUrl(key: ImageKey, width: ImageWidth = 1600) {
  return `/images/${key}-${width}.webp`
}

export { imageWidths }
