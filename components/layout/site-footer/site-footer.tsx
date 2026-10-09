"use client"

import { useRef } from "react"

import { Logo } from "@/components/layout/logo/logo"
import { AnchorLink } from "@/components/ui/anchor-link/anchor-link"
import { Icon } from "@/components/ui/icon/icon"
import { menuLinks } from "@/content/nav"
import { site } from "@/content/site"
import { DESKTOP_MEDIA, gsap, prefersReducedMotion, useGSAP } from "@/lib/motion/gsap"
import { cn } from "@/lib/utils"

import styles from "./site-footer.module.scss"

/**
 * Footer with a curtain reveal on desktop: the stage counter-moves while the
 * page scrolls off it, the giant wordmark rises, and the contact pills are
 * magnetic under a fine pointer. Phones get the same content, static.
 */
export function SiteFooter() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root || prefersReducedMotion()) return
      const mm = gsap.matchMedia()
      mm.add(DESKTOP_MEDIA, () => {
        const reveal = { trigger: root, start: "top bottom", end: "bottom bottom", scrub: true }
        gsap.fromTo("[data-stage]", { yPercent: -60 }, { yPercent: 0, ease: "none", scrollTrigger: reveal })
        gsap.fromTo(
          "[data-giant]",
          { yPercent: 40, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, ease: "none", scrollTrigger: { ...reveal, start: "top 75%" } }
        )

        if (!window.matchMedia("(pointer: fine)").matches) return
        const cleanups = gsap.utils.toArray<HTMLElement>("[data-magnetic]", root).map((pill) => {
          const move = (event: PointerEvent) => {
            const rect = pill.getBoundingClientRect()
            gsap.to(pill, {
              x: (event.clientX - rect.left - rect.width / 2) * 0.35,
              y: (event.clientY - rect.top - rect.height / 2) * 0.35,
              duration: 0.4,
              ease: "power3.out",
              overwrite: "auto",
            })
          }
          const leave = () =>
            gsap.to(pill, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)", overwrite: "auto" })
          pill.addEventListener("pointermove", move)
          pill.addEventListener("pointerleave", leave)
          return () => {
            pill.removeEventListener("pointermove", move)
            pill.removeEventListener("pointerleave", leave)
          }
        })
        return () => cleanups.forEach((cleanup) => cleanup())
      })
      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <footer ref={rootRef} className={styles.footer}>
      <div className={styles.stage} data-stage>
        <div className={cn("container", styles.top)}>
          <div className={styles.cta}>
            <h2 className={styles.title}>Have a drawing? Send it over.</h2>
            <p className={styles.lead}>
              Tell us the material, quantity and tolerances, and we will reply with a quote and lead time.
            </p>
          </div>
          <div className={styles.pills}>
            <AnchorLink href="#contact" className={cn(styles.pill, styles.pillPrimary)} data-magnetic>
              Request a quote <Icon name="arrow-right" />
            </AnchorLink>
            <a href={site.phones[0].href} className={styles.pill} data-magnetic>
              <Icon name="phone" /> {site.phones[0].display}
            </a>
            <a href={`mailto:${site.email}`} className={styles.pill} data-magnetic>
              <Icon name="mail" /> Email us
            </a>
            <a href={site.brochure} className={styles.pill} download data-magnetic>
              <Icon name="download" /> Company brochure (PDF)
            </a>
          </div>
        </div>

        <div className={cn("container", styles.columns)}>
          <div className={styles.brand}>
            <Logo height={64} tone="light" />
            <p>{site.motto}</p>
          </div>
          <nav aria-label="Footer">
            <ul className={styles.links}>
              {menuLinks.map((item) => (
                <li key={item.href}>
                  <AnchorLink href={item.href}>{item.label}</AnchorLink>
                </li>
              ))}
            </ul>
          </nav>
          <address className={styles.address}>
            <span>{site.address.street}</span>
            <span>{site.address.area}</span>
            <span>
              {site.address.city} {site.address.postalCode}
            </span>
            {site.phones.map((phone) => (
              <a key={phone.href} href={phone.href} className="mono">
                {phone.display}
              </a>
            ))}
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </address>
        </div>

        <div className={styles.giant} data-giant aria-hidden>
          Airwing
        </div>

        <div className={cn("container", styles.bottom)}>
          <p>
            © <CurrentYear /> {site.name}. {site.certification} certified · {site.registration}
          </p>
          <p className="mono">GSTIN {site.gstin}</p>
        </div>
      </div>
    </footer>
  )
}

/** Read the year at render time on the client and server alike. */
function CurrentYear() {
  return <>{new Date().getFullYear()}</>
}
