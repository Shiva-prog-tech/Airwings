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

/** Scroll to an in-page anchor through ScrollSmoother, or natively without it. */
export function scrollToHash(hash: string) {
  const target = document.querySelector<HTMLElement>(hash)
  if (!target) return
  const smoother = ScrollSmoother.get()
  if (smoother) smoother.scrollTo(target, true, hash === "#top" ? "top top" : `top ${HEADER_OFFSET}px`)
  else target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" })
  history.replaceState(null, "", hash)
}

export { gsap, ScrollSmoother, ScrollTrigger, SplitText, useGSAP }
