import { getImage, imageUrl, imageWidths, type ImageKey } from "@/content/images"

/**
 * Responsive image over the variants pre-built by `pnpm images`
 * (640/1080/1600/2400 WebP), with an inline blur placeholder.
 * Pass `sizes` matching the slot's real layout width.
 */
export function SiteImage({
  name,
  sizes = "100vw",
  className,
  priority = false,
  decorative = false,
  speed,
  placeholder = true,
}: {
  name: ImageKey
  sizes?: string
  className?: string
  /** LCP image: load eagerly with high priority. */
  priority?: boolean
  /** Empty alt for purely decorative use. */
  decorative?: boolean
  /** Parallax factor (data-speed, lib/motion/effects.ts). */
  speed?: number
  /** Blur placeholder behind the image; turn off for `object-fit: contain` slots. */
  placeholder?: boolean
}) {
  const image = getImage(name)
  // Variants never exceed the source; skip duplicate widths in srcset.
  const widths = imageWidths.filter((w, i) => i === 0 || imageWidths[i - 1] < image.width)

  return (
    // eslint-disable-next-line @next/next/no-img-element -- pre-built variants, no runtime optimiser
    <img
      src={imageUrl(name, 1080)}
      srcSet={widths.map((w) => `${imageUrl(name, w)} ${Math.min(w, image.width)}w`).join(", ")}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={decorative ? "" : image.alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
      data-speed={speed}
      style={
        placeholder
          ? { backgroundImage: `url(${image.blurDataURL})`, backgroundSize: "cover", backgroundPosition: "center" }
          : undefined
      }
    />
  )
}
