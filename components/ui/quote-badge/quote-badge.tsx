import { AnchorLink } from "@/components/ui/anchor-link/anchor-link"
import { Icon } from "@/components/ui/icon/icon"
import { cn } from "@/lib/utils"

import styles from "./quote-badge.module.scss"

/**
 * Circular call-to-action: the label runs around a slowly turning ring, with
 * a solid signal disc and arrow at the centre. The ring text is decorative;
 * the link's accessible name is `label`.
 */
export function QuoteBadge({
  href,
  label,
  ringText,
  className,
}: {
  href: `#${string}`
  label: string
  /** Repeated around the ring, e.g. "Request a quote · Send a drawing · ". */
  ringText: string
  className?: string
}) {
  return (
    <AnchorLink href={href} className={cn(styles.badge, className)} aria-label={label}>
      <svg className={styles.ring} viewBox="0 0 200 200" aria-hidden focusable="false">
        <defs>
          <path id="quote-badge-circle" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" />
        </defs>
        <text className={styles.ringText}>
          <textPath href="#quote-badge-circle" textLength="488" lengthAdjust="spacing">
            {ringText}
          </textPath>
        </text>
      </svg>
      <span className={styles.disc} aria-hidden>
        <Icon name="arrow-up-right" />
      </span>
    </AnchorLink>
  )
}
