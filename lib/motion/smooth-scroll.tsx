"use client"

import { createSmoother } from "@/lib/motion/effects"
import { prefersReducedMotion, useGSAP } from "@/lib/motion/gsap"

/**
 * ScrollSmoother must exist before any ScrollTrigger is created (pins choose
 * transform pinning from it). Rendered first inside #smooth-content so its
 * effect runs before the sections' effects. `data-speed` / `data-lag` in the
 * markup become parallax through `effects: true`.
 */
export function SmoothScroll() {
  useGSAP(() => {
    if (prefersReducedMotion()) return
    const smoother = createSmoother()
    return () => smoother?.kill()
  })

  return null
}
