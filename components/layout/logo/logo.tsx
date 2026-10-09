import { logoSize } from "@/content/images.generated"
import { site } from "@/content/site"

/**
 * Brand logo. `tone="dark"` is the full-colour logo for light backgrounds;
 * `tone="light"` turns the indigo wordmark white for graphite bands.
 */
export function Logo({
  height = 44,
  tone = "dark",
  className,
}: {
  height?: number
  tone?: "dark" | "light"
  className?: string
}) {
  const width = Math.round((logoSize.width / logoSize.height) * height)
  return (
    // eslint-disable-next-line @next/next/no-img-element -- small pre-built brand asset
    <img
      src={tone === "light" ? "/images/brand/logo-light.webp" : "/images/brand/logo.webp"}
      width={width}
      height={height}
      alt={site.name}
      className={className}
      decoding="async"
    />
  )
}
