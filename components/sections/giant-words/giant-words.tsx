"use client"

import { useRef } from "react"

import { giantWords } from "@/content/home"
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion/gsap"

import styles from "./giant-words.module.scss"

/**
 * Poster-scale type band (Parody "Digital Agency"): two lines slide in
 * opposite directions as the band scrolls through. Decorative.
 */
export function GiantWords() {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root || prefersReducedMotion()) return
      const scroll = { trigger: root, start: "top bottom", end: "bottom top", scrub: true }
      gsap.fromTo("[data-word='0']", { xPercent: 8 }, { xPercent: -18, ease: "none", scrollTrigger: scroll })
      gsap.fromTo("[data-word='1']", { xPercent: -30 }, { xPercent: 4, ease: "none", scrollTrigger: scroll })
    },
    { scope: rootRef }
  )

  return (
    <div ref={rootRef} className={styles.band} aria-hidden>
      {giantWords.map((word, i) => (
        <span key={word} className={i === 0 ? styles.solid : styles.outline} data-word={i}>
          {word}
        </span>
      ))}
    </div>
  )
}
