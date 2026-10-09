"use client"

import { useCallback, useState } from "react"

import { Logo } from "@/components/layout/logo/logo"
import { SiteNav } from "@/components/layout/site-nav/site-nav"
import { MenuToggle, StaggeredMenu } from "@/components/layout/staggered-menu/staggered-menu"
import { AnchorLink } from "@/components/ui/anchor-link/anchor-link"
import { Button } from "@/components/ui/button/button"
import { cn } from "@/lib/utils"

import { useStickyHeader } from "./use-sticky-header"
import styles from "./site-header.module.scss"

/**
 * Logo · shadcn-style navigation (xl+) · quote pill + Menu toggle.
 * Fixed outside #smooth-wrapper; hides on scroll down, returns on scroll up.
 * The full-screen menu is a sibling so the header's transform and
 * backdrop-filter never become its containing block.
 */
export function SiteHeader() {
  const { scrolled, hidden } = useStickyHeader()
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <header
        className={styles.header}
        data-scrolled={scrolled || undefined}
        data-hidden={(hidden && !open) || undefined}
        data-menu-open={open || undefined}
      >
        <div className={cn("container", styles.bar)}>
          <AnchorLink href="#top" className={styles.logo} aria-label="Airwing Technologies, back to top">
            <Logo height={50} />
          </AnchorLink>
          <div className={styles.nav}>
            <SiteNav />
          </div>
          <div className={styles.actions}>
            <Button href="#contact" className={styles.cta}>
              Request a quote
            </Button>
            <MenuToggle open={open} onToggle={() => setOpen((value) => !value)} />
          </div>
        </div>
      </header>
      <StaggeredMenu open={open} onClose={close} />
    </>
  )
}
