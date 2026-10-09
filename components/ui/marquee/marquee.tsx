"use client"

import { useRef } from "react"

import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion/gsap"
import { cn } from "@/lib/utils"

import styles from "./marquee.module.scss"

/**
 * Seamless horizontal loop: items render twice and the track slides by half
 * its width. `reverse` runs right-to-left → left-to-right. Pauses on hover.
 * Decorative by default (aria-hidden); pass `label` to expose it.
 */
export function Marquee({
  items,
  duration = 40,
  reverse = false,
  className,
  itemClassName,
  label,
}: {
  items: React.ReactNode[]
  /** Seconds per loop. */
  duration?: number
  reverse?: boolean
  className?: string
  itemClassName?: string
  label?: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const track = trackRef.current
      if (!root || !track || prefersReducedMotion()) return
      const tween = gsap.fromTo(
        track,
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, ease: "none", duration, repeat: -1 }
      )
      const slow = () => gsap.to(tween, { timeScale: 0.15, duration: 0.6 })
      const resume = () => gsap.to(tween, { timeScale: 1, duration: 0.6 })
      root.addEventListener("pointerenter", slow)
      root.addEventListener("pointerleave", resume)
      return () => {
        root.removeEventListener("pointerenter", slow)
        root.removeEventListener("pointerleave", resume)
      }
    },
    { scope: rootRef, dependencies: [duration, reverse] }
  )

  return (
    <div
      ref={rootRef}
      className={cn(styles.marquee, className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "region" : undefined}
    >
      <div ref={trackRef} className={styles.track}>
        {[...items, ...items].map((item, i) => (
          <div
            key={i}
            className={cn(styles.item, itemClassName)}
            aria-hidden={i >= items.length || undefined}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
