"use client"

import type { RefObject } from "react"

import { DESKTOP_MEDIA, gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/motion/gsap"

/** Pin `pinRef` while `triggerRef` scrolls past (desktop only). */
export function usePin(
  triggerRef: RefObject<HTMLElement | null>,
  pinRef: RefObject<HTMLElement | null>,
  { start = "top top+=120", end = "bottom bottom-=80" }: { start?: string; end?: string } = {}
) {
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const mm = gsap.matchMedia()
      mm.add(DESKTOP_MEDIA, () => {
        if (!triggerRef.current || !pinRef.current) return
        ScrollTrigger.create({
          trigger: triggerRef.current,
          pin: pinRef.current,
          start,
          end: () => `${end}`,
          pinSpacing: false,
        })
      })
      return () => mm.revert()
    },
    { scope: triggerRef }
  )
}
