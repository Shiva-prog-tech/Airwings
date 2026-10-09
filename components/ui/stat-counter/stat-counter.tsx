"use client"

import { useEffect, useRef } from "react"

import { prefersReducedMotion } from "@/lib/motion/gsap"

const DURATION = 1800
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

const format = (n: number, decimals: number, grouped: boolean) =>
  grouped
    ? Math.round(n).toLocaleString("en-IN")
    : n.toFixed(decimals)

/**
 * Renders the final number on the server (SEO, no-JS), then counts up from 0
 * when it scrolls into view.
 */
export function StatCounter({
  value,
  grouped = false,
  className,
}: {
  value: number
  /** Thousands separators (10,000). */
  grouped?: boolean
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const decimals = (String(value).split(".")[1] ?? "").length

  useEffect(() => {
    const node = ref.current
    if (!node || prefersReducedMotion()) return
    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION)
          node.textContent = format(easeOut(t) * value, decimals, grouped)
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.6 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, decimals, grouped])

  return (
    <span ref={ref} className={className}>
      {format(value, decimals, grouped)}
    </span>
  )
}
