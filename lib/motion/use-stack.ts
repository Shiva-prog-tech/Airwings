"use client"

import type { RefObject } from "react"

import { DESKTOP_MEDIA, gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/motion/gsap"

/**
 * Stacking panels (desktop): every `[data-stack-item]` inside `rootRef` pins
 * at `top` until the container ends, so later items slide over earlier ones.
 * The covered item recedes (scale + dim) while the next one arrives.
 * Replaces CSS `position: sticky`, which ScrollSmoother's transformed content
 * can't honour.
 */
export function useStack(
  rootRef: RefObject<HTMLElement | null>,
  { top = 0, step = 0, recede = true }: { top?: number; step?: number; recede?: boolean } = {}
) {
  useGSAP(
    () => {
      const root = rootRef.current
      if (!root || prefersReducedMotion()) return
      const mm = gsap.matchMedia()
      mm.add(DESKTOP_MEDIA, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-stack-item]", root)
        const container = root.querySelector<HTMLElement>("[data-stack]") ?? root
        items.forEach((item, i) => {
          const offset = top + i * step
          ScrollTrigger.create({
            trigger: item,
            start: `top top+=${offset}`,
            endTrigger: container,
            end: `bottom top+=${offset + item.offsetHeight}`,
            pin: true,
            pinSpacing: false,
          })
          const next = items[i + 1]
          if (!recede || !next) return
          gsap.to(item.querySelector("[data-stack-inner]") ?? item, {
            scale: 0.94,
            autoAlpha: 0.4,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: `top top+=${offset + step}`, scrub: true },
          })
        })
      })
      return () => mm.revert()
    },
    { scope: rootRef }
  )
}
