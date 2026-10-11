"use client"

import { useCallback, useState } from "react"

import { Logo } from "@/components/layout/logo/logo"
import { SiteNav } from "@/components/layout/site-nav/site-nav"
import { MENU_ID, StaggeredMenu } from "@/components/layout/staggered-menu/staggered-menu"
import { Icon } from "@/components/ui/icon/icon"
import { site } from "@/content/site"
import { scrollToHash } from "@/lib/motion/gsap"
import { cn } from "@/lib/utils"

import { useStickyHeader } from "./use-sticky-header"
import styles from "./site-header.module.scss"

/** The bar turns solid only once the dark hero has scrolled out from under it. */
function pastHero() {
  const hero = document.querySelector<HTMLElement>("[data-hero]")
  return hero ? hero.offsetHeight - 90 : 120
}

/**
 * Full-width header: logo · shadcn-style links (xl+) · Brochure + Request a
 * quote. Transparent with light text over the hero footage, a frosted
 * aluminium bar once the hero is passed. Hides on scroll down, returns on scroll up.
 * Below xl a Menu button opens the full-screen staggered menu.
 */
export function SiteHeader() {
  const { scrolled, hidden } = useStickyHeader(120, 8, pastHero)
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  const go = (event: React.MouseEvent<HTMLAnchorElement>, href: `#${string}`) => {
    event.preventDefault()
    scrollToHash(href)
  }

  return (
    <>
      <header
        className={styles.header}
        data-scrolled={scrolled || undefined}
        data-hidden={(hidden && !open) || undefined}
        data-menu-open={open || undefined}
      >
        <div className={cn("container", styles.bar)}>
          <a
            href="#top"
            className={styles.logo}
            onClick={(event) => go(event, "#top")}
            aria-label="Airwing Technologies, back to top"
          >
            {/* Light logo over the hero, full colour on the scrolled bar. */}
            <Logo height={46} tone="light" className={styles.logoLight} />
            <Logo height={46} className={styles.logoDark} />
          </a>

          <div className={styles.nav}>
            <SiteNav />
          </div>

          <div className={styles.actions}>
            <a href={site.brochure} download className={styles.brochure}>
              <Icon name="download" /> Brochure
            </a>
            <a href="#contact" className={styles.quote} onClick={(event) => go(event, "#contact")}>
              <span className={styles.quoteLabel}>
                <span>Request a quote</span>
                <span aria-hidden>Request a quote</span>
              </span>
              <span className={styles.quoteChip} aria-hidden>
                <Icon name="arrow-up-right" />
              </span>
            </a>
            <button
              type="button"
              className={styles.toggle}
              aria-expanded={open}
              aria-controls={MENU_ID}
              onClick={() => setOpen((value) => !value)}
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span className={styles.toggleIcon} data-open={open || undefined} aria-hidden />
            </button>
          </div>
        </div>
      </header>
      {/* Sibling, not child: the header's transform would trap a fixed menu. */}
      <StaggeredMenu open={open} onClose={close} />
    </>
  )
}
