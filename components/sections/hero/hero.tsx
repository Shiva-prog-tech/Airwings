"use client"

import { useRef } from "react"

import { QuoteBadge } from "@/components/ui/quote-badge/quote-badge"
import { ScrambleText } from "@/components/ui/scramble-text/scramble-text"
import { SiteVideo } from "@/components/ui/site-video/site-video"
import { heroFacts } from "@/content/home"
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion/gsap"
import { revealsReady } from "@/lib/motion/reveal-gate"

import styles from "./hero.module.scss"

/**
 * Hero: CNC milling footage full-screen behind a graphite scrim, the
 * poster-scale headline in white over it, and the key facts along the
 * bottom. One orchestrated entrance once the preloader lifts: the footage
 * settles from a slight zoom while the lines rise.
 */
export function Hero() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    (_, contextSafe) => {
      if (prefersReducedMotion() || !document.documentElement.classList.contains("has-motion")) return
      gsap.set("[data-line]", { yPercent: 105 })
      gsap.set("[data-intro]", { autoAlpha: 0, y: 24 })
      gsap.set("[data-bg]", { scale: 1.12 })
      const intro = contextSafe!(() => {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .to("[data-bg]", { scale: 1, duration: 2.2, ease: "power3.out" }, 0)
          .to("[data-line]", { yPercent: 0, duration: 1.2, stagger: 0.1 }, 0.1)
          .to("[data-intro]", { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.6)
      })
      revealsReady().then(intro)
    },
    { scope: rootRef }
  )

  return (
    <section ref={rootRef} id="top" className={styles.hero} aria-labelledby="hero-title" data-hero>
      {/* Footage: the outer layer drifts (parallax), the inner one settles.
          The scrim lives in the same moving layer as the video, and the
          video itself is darkened, so the GPU can never draw the footage
          without its overlay while scrolling. */}
      <div className={styles.bg} aria-hidden>
        <div className={styles.parallax} data-speed="0.75">
          <div className={styles.zoom} data-bg>
            <SiteVideo name="hero" priority className={styles.video} />
            <div className={styles.scrim} />
          </div>
        </div>
      </div>

      <div className={`container ${styles.content}`}>
        <h1 id="hero-title" className={styles.title}>
          <span className={styles.mask}>
            <span data-line>Precision parts</span>
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
            <QuoteBadge href="#contact" label="Request a quote" ringText="Request a quote · Send your drawing · " />
          </div>
        </div>

        <dl className={styles.facts} data-intro>
          {heroFacts.map((fact, i) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>
                <ScrambleText text={fact.value} delay={500 + i * 120} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
