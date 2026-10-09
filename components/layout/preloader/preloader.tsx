"use client"

import { useRef, useState } from "react"

import { Logo } from "@/components/layout/logo/logo"
import { site } from "@/content/site"
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion/gsap"
import { releaseReveals } from "@/lib/motion/reveal-gate"

import styles from "./preloader.module.scss"

/**
 * First-load brand screen: a dimension line measures across while the logo
 * settles, then the sheet lifts away. Shown only under `html.has-motion`
 * (CSS), so no-JS and reduced-motion visitors never see it.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      if (prefersReducedMotion() || !document.documentElement.classList.contains("has-motion")) {
        releaseReveals()
        setDone(true)
        return
      }
      const readout = root.querySelector<HTMLElement>("[data-readout]")
      const counter = { value: 0 }
      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } })
      tl.from("[data-logo]", { autoAlpha: 0, y: 24, duration: 0.8, ease: "power3.out" })
        .fromTo("[data-measure]", { scaleX: 0 }, { scaleX: 1, duration: 1.2 }, 0.2)
        .to(
          counter,
          {
            value: 10000,
            duration: 1.2,
            onUpdate: () => {
              if (readout) readout.textContent = Math.round(counter.value).toLocaleString("en-IN")
            },
          },
          0.2
        )
        .to(root, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "+=0.25")
        .add(() => releaseReveals(), "-=0.6")
        .add(() => setDone(true))
      // Fonts and the first slide should be in before the sheet lifts.
      tl.pause()
      Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]).then(() => tl.play())
    },
    { scope: rootRef }
  )

  if (done) return null

  return (
    <div ref={rootRef} className={styles.preloader} aria-hidden>
      <div className={styles.inner}>
        <div data-logo>
          <Logo height={120} tone="light" />
          <p className={styles.motto}>{site.motto}</p>
        </div>
        <div className={styles.dimension}>
          <span className={styles.line} data-measure />
          <span className={`mono ${styles.readout}`}>
            <span data-readout>0</span> sq ft
          </span>
        </div>
      </div>
    </div>
  )
}
