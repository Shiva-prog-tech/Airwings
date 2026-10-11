"use client"

import { useRef } from "react"

import { Logo } from "@/components/layout/logo/logo"
import { AnchorLink } from "@/components/ui/anchor-link/anchor-link"
import { Icon } from "@/components/ui/icon/icon"
import { RoundButton } from "@/components/ui/round-button/round-button"
import { YouTubeBackground } from "@/components/ui/youtube-background/youtube-background"
import { imageUrl } from "@/content/images"
import { menuLinks } from "@/content/nav"
import { launchFilm, site } from "@/content/site"
import { DESKTOP_MEDIA, gsap, prefersReducedMotion, useGSAP } from "@/lib/motion/gsap"
import { cn } from "@/lib/utils"

import styles from "./site-footer.module.scss"

/**
 * Footer: a statement headline over Skyroot's Vikram-I launch with a round
 * call-to-action, contact columns and an underlined brochure line, then a
 * ghosted full-width wordmark and the legal bar. On desktop the footer rises
 * from under the page (curtain) and the wordmark lifts into place.
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
        gsap.fromTo("[data-stage]", { yPercent: -35 }, { yPercent: 0, ease: "none", scrollTrigger: reveal })
        gsap.fromTo(
          "[data-wordmark]",
          { yPercent: 35 },
          { yPercent: 0, ease: "none", scrollTrigger: { ...reveal, start: "top 60%" } }
        )
      })
      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <footer ref={rootRef} className={styles.footer}>
      <div className={styles.stage} data-stage>
        {/* Skyroot's Vikram-I liftoff: a customer's launch, embedded from YouTube. */}
        <div className={styles.bg} aria-hidden>
          <YouTubeBackground
            id={launchFilm.id}
            start={launchFilm.start}
            end={launchFilm.end}
            title={launchFilm.title}
            poster={imageUrl("skyroot-vikram-s", 1600)}
            className={styles.video}
          />
        </div>
        <div className={cn("container", styles.top)}>
          <div>
            <p className={styles.kicker}>{site.tagline}</p>
            <h2 className={styles.title}>
              Have a drawing?
              <br />
              We&apos;ll machine it.
            </h2>
            {/* <a href={launchFilm.url} target="_blank" rel="noopener noreferrer" className={styles.film}>
              <span className={styles.filmDot} aria-hidden />
              <span>
                {launchFilm.label}
                <small>{launchFilm.credit}. Watch on YouTube</small>
              </span>
              <Icon name="arrow-up-right" />
            </a> */}
          </div>
          <RoundButton href="#contact" tone="solid" className={styles.cta}>
            Request a quote
          </RoundButton>
        </div>

        <div className={cn("container", styles.columns)}>
          <address className={styles.column}>
            <span className={styles.label}>Workshop</span>
            <span>{site.address.street}</span>
            <span>
              {site.address.area}, {site.address.city} {site.address.postalCode}
            </span>
            <a href={site.mapLink} target="_blank" rel="noopener noreferrer" className={styles.textLink}>
              Get directions
            </a>
          </address>

          <div className={styles.column}>
            <span className={styles.label}>Talk to a partner</span>
            {site.phones.map((phone) => (
              <a key={phone.href} href={phone.href} className="mono">
                {phone.display}
              </a>
            ))}
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>

          <div className={cn(styles.column, styles.wide)}>
            <span className={styles.label}>Company profile</span>
            {/* Parody's underlined input line, used for the brochure download. */}
            <a href={site.brochure} download className={styles.lineLink}>
              <span>Download our brochure (PDF)</span>
              <Icon name="download" />
            </a>
            <span className={styles.note}>
              Machinery, quality instruments and project specs in one document.
            </span>
          </div>
        </div>

        <div className={styles.wordmarkWrap} aria-hidden>
          <span className={styles.wordmark} data-wordmark>
            Airwing
          </span>
        </div>

        <div className={styles.bottomBar}>
          <div className={cn("container", styles.bottom)}>
            <div className={styles.legal}>
              <Logo height={34} tone="light" />
              <p>
                © <CurrentYear /> {site.name}. {site.certification} certified. GSTIN{" "}
                <span className="mono">{site.gstin}</span>
              </p>
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
          </div>
        </div>
      </div>
    </footer>
  )
}

/** Read the year at render time. */
function CurrentYear() {
  return <>{new Date().getFullYear()}</>
}
