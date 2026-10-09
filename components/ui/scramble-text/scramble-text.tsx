"use client"

import { useEffect, useRef } from "react"

import { prefersReducedMotion } from "@/lib/motion/gsap"
import { revealsReady } from "@/lib/motion/reveal-gate"

const GLYPHS = "0123456789ABCDEFX/.-"

/**
 * Text that decodes into place, left to right, like a readout settling.
 * Server-renders the final text (SEO, no-JS); the effect runs once, after
 * the preloader, unless reduced motion is on. Screen readers get the final
 * text through aria-label.
 */
export function ScrambleText({
  text,
  className,
  duration = 900,
  delay = 0,
  waitForReveal = true,
}: {
  text: string
  className?: string
  /** Total decode time in ms. */
  duration?: number
  delay?: number
  /** Start after the preloader lifts (reveal gate). */
  waitForReveal?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node || prefersReducedMotion() || !document.documentElement.classList.contains("has-motion")) return
    let frame = 0
    let timer = 0
    let cancelled = false
    const chars = [...text]

    const run = () => {
      if (cancelled) return
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        const settled = Math.floor(t * chars.length)
        node.textContent = chars
          .map((char, i) =>
            i < settled || char === " " ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          )
          .join("")
        if (t < 1) frame = requestAnimationFrame(tick)
        else node.textContent = text
      }
      frame = requestAnimationFrame(tick)
    }

    const begin = () => {
      timer = window.setTimeout(run, delay)
    }
    if (waitForReveal) revealsReady().then(begin)
    else begin()

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      node.textContent = text
    }
  }, [text, duration, delay, waitForReveal])

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text}
    </span>
  )
}
