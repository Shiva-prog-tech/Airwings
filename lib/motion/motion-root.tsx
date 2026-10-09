"use client"

import {
  animateMasks,
  animateReveals,
  animateTextFill,
  animateTitles,
} from "@/lib/motion/effects"
import { prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/motion/gsap"
import { revealsReady } from "@/lib/motion/reveal-gate"

/**
 * Wires the markup-driven effects once the preloader has cleared and web
 * fonts are ready (SplitText measures lines with the final fonts).
 * Mounted once in the root layout, after the page.
 */
export function MotionRoot() {
  useGSAP((_, contextSafe) => {
    if (prefersReducedMotion()) {
      document.documentElement.classList.remove("has-motion")
      return
    }
    window.__motionReady = true
    let active = true

    const start = contextSafe!(() => {
      if (!active) return
      animateReveals()
      animateMasks()
      animateTitles()
      animateTextFill()
      ScrollTrigger.refresh()
    })
    Promise.all([revealsReady(), document.fonts.ready]).then(start)

    // Images and late layout shifts move trigger positions.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener("load", refresh)
    return () => {
      active = false
      window.removeEventListener("load", refresh)
    }
  })

  return null
}
