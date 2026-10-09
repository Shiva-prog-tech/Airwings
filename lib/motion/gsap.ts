"use client"

// The single GSAP entry point. Plugins register once, in the browser only.
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollSmoother } from "gsap/ScrollSmoother"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText)
  gsap.config({ nullTargetWarn: false })
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** Pinned and heavy scenes run at this width and up; phones get stand-ins. */
export const DESKTOP_MEDIA = "(min-width: 992px)"

/** Height of the fixed header, for anchor offsets. */
const HEADER_OFFSET = 84

let anchorTween: gsap.core.Tween | null = null
const INTERRUPTS = ["wheel", "touchstart", "keydown"] as const

// Wheel, touch or keys during a jump hand control back to the user.
const cancelAnchorTween = () => {
  anchorTween?.kill()
  anchorTween = null
  for (const type of INTERRUPTS) window.removeEventListener(type, cancelAnchorTween)
}

/**
 * Scroll to an in-page anchor through ScrollSmoother, or natively without it.
 * The smoother's own scrollTo jumps the position and lets the lag catch up,
 * which reads as a snap over long distances; tweening `scrollTop` with an
 * in-out ease, timed by distance, glides instead.
 */
export function scrollToHash(hash: string) {
  const target = document.querySelector<HTMLElement>(hash)
  if (!target) return
  const smoother = ScrollSmoother.get()
  if (smoother && !prefersReducedMotion()) {
    const to = smoother.offset(target, hash === "#top" ? "top top" : `top ${HEADER_OFFSET}px`)
    const distance = Math.abs(to - smoother.scrollTop())
    cancelAnchorTween()
    anchorTween = gsap.to(smoother, {
      scrollTop: to,
      duration: gsap.utils.clamp(0.9, 2.4, 0.7 + distance / 3500),
      ease: "power3.inOut",
      onComplete: cancelAnchorTween,
    })
    for (const type of INTERRUPTS) window.addEventListener(type, cancelAnchorTween, { passive: true })
  } else {
    target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" })
  }
  history.replaceState(null, "", hash)
}

export { gsap, ScrollSmoother, ScrollTrigger, SplitText, useGSAP }
