"use client"

import { useEffect, useRef, useState } from "react"

import { Icon } from "@/components/ui/icon/icon"
import { scrollToHash } from "@/lib/motion/gsap"

import styles from "./scroll-progress.module.scss"

const R = 22
const CIRCUMFERENCE = 2 * Math.PI * R

/** Back-to-top button whose ring fills with scroll progress. */
export function ScrollProgress() {
  const ringRef = useRef<SVGCircleElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? window.scrollY / max : 0
      ringRef.current?.style.setProperty("stroke-dashoffset", String(CIRCUMFERENCE * (1 - progress)))
      setVisible(window.scrollY > 600)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <button
      type="button"
      className={styles.button}
      data-visible={visible || undefined}
      onClick={() => scrollToHash("#top")}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      <svg viewBox="0 0 52 52" className={styles.ring} aria-hidden>
        <circle cx="26" cy="26" r={R} className={styles.track} />
        <circle
          ref={ringRef}
          cx="26"
          cy="26"
          r={R}
          className={styles.progress}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
      </svg>
      <Icon name="arrow-up" />
    </button>
  )
}
