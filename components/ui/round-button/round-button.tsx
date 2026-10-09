import { AnchorLink } from "@/components/ui/anchor-link/anchor-link"
import { Icon } from "@/components/ui/icon/icon"
import { cn } from "@/lib/utils"

import styles from "./round-button.module.scss"

/** Parody Home 5's circular call-to-action: a short label inside a ring. */
export function RoundButton({
  href,
  children,
  tone = "outline",
  className,
}: {
  href: `#${string}`
  children: string
  tone?: "outline" | "solid" | "onGraphite"
  className?: string
}) {
  return (
    <AnchorLink href={href} className={cn(styles.round, styles[tone], className)}>
      <span>
        {children}
        <Icon name="arrow-up-right" className={styles.icon} />
      </span>
    </AnchorLink>
  )
}
