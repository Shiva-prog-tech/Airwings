"use client"

import { useRef } from "react"

import { RoundButton } from "@/components/ui/round-button/round-button"
import { SiteImage } from "@/components/ui/site-image/site-image"
import { heroFacts } from "@/content/home"
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion/gsap"
import { revealsReady } from "@/lib/motion/reveal-gate"

import styles from "./hero.module.scss"

/**
 * Hero (after Parody "Digital Agency"): a poster-scale headline with a
 * machined part set into the first line, a round call-to-action, then the
 * shop floor full-bleed with parallax. One orchestrated entrance once the
 * preloader lifts.
 */
export function Hero() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    (_, contextSafe) => {
      if (prefersReducedMotion() || !document.documentElement.classList.contains("has-motion")) return
      gsap.set("[data-line]", { yPercent: 105 })
      gsap.set("[data-pill]", { scaleX: 0 })
      gsap.set("[data-intro]", { autoAlpha: 0, y: 24 })
      gsap.set("[data-stage]", { clipPath: "inset(18% 6% 0% 6% round 28px)" })
      const intro = contextSafe!(() => {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .to("[data-line]", { yPercent: 0, duration: 1.2, stagger: 0.1 })
          .to("[data-pill]", { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, 0.3)
          .to("[data-intro]", { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.6)
          .to("[data-stage]", { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.6, ease: "power3.inOut" }, 0.5)
      })
      revealsReady().then(intro)
    },
    { scope: rootRef }
  )

  return (
    <section ref={rootRef} id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.top}`}>
        <h1 id="hero-title" className={styles.title}>
          <span className={styles.mask}>
            <span data-line className={styles.lineWithPill}>
              {/* Words are separate flex items so the gap holds when the pill is hidden (phones). */}
              <span>Precision</span>
              <span className={styles.pill} data-pill aria-hidden>
                <SiteImage name="part-2" sizes="240px" decorative priority />
              </span>
              <span>parts</span>
            </span>
          </span>
          <span className={styles.mask}>
            <span data-line>for aerospace</span>
          </span>
          <span className={styles.mask}>
            <span data-line>and defence</span>
          </span>
        </h1>

        <div className={styles.aside}>
          <p className={styles.lead} data-intro>
            CNC milling, turning, design and inspection of aerospace and special-purpose components in Peenya,
            Bengaluru.
          </p>
          <div data-intro>
            <RoundButton href="#contact" tone="solid">
              Request a quote
            </RoundButton>
          </div>
        </div>
      </div>

      <dl className={`container ${styles.facts}`} data-intro>
        {heroFacts.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>

      <div className={styles.stage} data-stage>
        <div className={styles.parallax} data-speed="0.8">
          <SiteImage name="infrastructure" sizes="100vw" priority className={styles.image} />
        </div>
      </div>
    </section>
  )
}
