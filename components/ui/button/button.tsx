import { AnchorLink } from "@/components/ui/anchor-link/anchor-link"
import { Icon, type IconName } from "@/components/ui/icon/icon"
import { cn } from "@/lib/utils"

import styles from "./button.module.scss"

type Variant = "primary" | "ghost" | "onGraphite"

/** Pill link. `#anchor` hrefs smooth-scroll in the page; others are plain links. */
export function Button({
  href,
  children,
  variant = "primary",
  icon = "arrow-right",
  className,
  download,
  external,
}: {
  href: string
  children: string
  variant?: Variant
  icon?: IconName | null
  className?: string
  download?: boolean
  external?: boolean
}) {
  const content = (
    <>
      <span className={styles.label}>
        <span>{children}</span>
        <span aria-hidden>{children}</span>
      </span>
      {icon ? <Icon name={icon} /> : null}
    </>
  )
  const classes = cn(styles.button, styles[variant], className)

  if (href.startsWith("#")) {
    return (
      <AnchorLink href={href as `#${string}`} className={classes}>
        {content}
      </AnchorLink>
    )
  }
  return (
    <a
      href={href}
      className={classes}
      download={download || undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {content}
    </a>
  )
}
