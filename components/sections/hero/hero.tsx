"use client"

import { useRef } from "react"

import { Button } from "@/components/ui/button/button"
import { QuoteBadge } from "@/components/ui/quote-badge/quote-badge"
import { ScrambleText } from "@/components/ui/scramble-text/scramble-text"
import { SiteVideo } from "@/components/ui/site-video/site-video"
import { hero, heroFacts } from "@/content/home"
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion/gsap"
import { revealsReady } from "@/lib/motion/reveal-gate"

import styles from "./hero.module.scss"

/** Ruler ticks down the right edge (every 10th is long and numbered). */
const TICKS = Array.from({ length: 41 }, (_, i) => i)

/**
 * Hero: CNC milling footage full-screen behind a deep scrim and a blueprint
 * grid, framed by HUD corners and an altitude ruler. The expanded headline
 * rises in, then the lead, the actions and the telemetry strip. One
 * orchestrated entrance once the preloader lifts.
 */
export function Hero() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    (_, contextSafe) => {
      if (prefersReducedMotion() || !document.documentElement.classList.contains("has-motion")) return
      gsap.set("[data-line]", { yPercent: 110 })
      gsap.set("[data-intro]", { autoAlpha: 0, y: 24 })
      gsap.set("[data-hud]", { autoAlpha: 0 })
      gsap.set("[data-bg]", { scale: 1.15 })
      const intro = contextSafe!(() => {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .to("[data-bg]", { scale: 1, duration: 2.6, ease: "power3.out" }, 0)
          .to("[data-hud]", { autoAlpha: 1, duration: 1.2, ease: "power2.out", stagger: 0.1 }, 0.2)
          .to("[data-line]", { yPercent: 0, duration: 1.3, stagger: 0.12 }, 0.15)
          .to("[data-intro]", { autoAlpha: 1, y: 0, duration: 1, stagger: 0.09 }, 0.65)
      })
      revealsReady().then(intro)
    },
    { scope: rootRef }
  )

  return (
    <section ref={rootRef} id="top" className={styles.hero} aria-labelledby="hero-title" data-hero>
      {/* Footage: the outer layer drifts (parallax), the inner one settles.
          The scrim lives in the same moving layer as the video, so the GPU
          never draws the footage without its overlay while scrolling. */}
      <div className={styles.bg} aria-hidden>
        <div className={styles.parallax} data-speed="0.75">
          <div className={styles.zoom} data-bg>
            <SiteVideo name="hero" priority className={styles.video} />
            <div className={styles.scrim} />
          </div>
        </div>
        <div className={styles.grid} />
        <div className={styles.glow} />
      </div>

      {/* HUD: frame corners, the location readout and an altitude ruler. */}
      <div className={styles.hud} aria-hidden>
        <span className={styles.frame} data-hud />
        <span className={styles.ruler} data-hud>
          {TICKS.map((tick) => (
            <span key={tick} data-major={tick % 10 === 0 || undefined}>
              {tick % 10 === 0 ? <em>{String(100 - tick * 2.5).padStart(3, "0")}</em> : null}
            </span>
          ))}
        </span>
        <span className={`mono ${styles.crosshair}`} data-hud />
      </div>

      <div className={`container ${styles.content}`}>
        <p className={styles.kicker} data-intro>
          <span className={styles.dot} />
          {hero.kicker}
        </p>

        <h1 id="hero-title" className={styles.title}>
          {hero.title.map((line) => (
            <span key={line} className={styles.mask}>
              <span data-line>{line}</span>
            </span>
          ))}
        </h1>

        <div className={styles.aside}>
          <div className={styles.copy}>
            <p className={styles.lead} data-intro>
              {hero.lead}
            </p>
            <div className={styles.actions} data-intro>
              <Button href="#contact">Request a quote</Button>
              <Button href="#services" variant="ghost" icon="arrow-down">
                Explore capabilities
              </Button>
            </div>
          </div>
          <div className={styles.badge} data-intro>
            <QuoteBadge href="#contact" label="Request a quote" ringText="Send your drawing · Get a quote · " />
          </div>
        </div>

        <dl className={styles.facts} data-intro>
          {heroFacts.map((fact, i) => (
            <div key={fact.label}>
              <dt>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                {fact.label}
              </dt>
              <dd className="mono">
                <ScrambleText text={fact.value} delay={500 + i * 120} />
              </dd>
            </div>
          ))}
          <div className={styles.location}>
            <dt>Workshop</dt>
            <dd>{hero.location}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
