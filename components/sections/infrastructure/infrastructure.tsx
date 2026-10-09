"use client"

import { useRef } from "react"

import { SiteImage } from "@/components/ui/site-image/site-image"
import { infrastructure } from "@/content/home"
import { DESKTOP_MEDIA, gsap, prefersReducedMotion, useGSAP } from "@/lib/motion/gsap"

import styles from "./infrastructure.module.scss"

// Where each photo flies to, as a share of the viewport.
const CORNERS = [
  { x: -0.42, y: -0.36, rotation: -8 },
  { x: 0.42, y: -0.34, rotation: 7 },
  { x: -0.4, y: 0.36, rotation: 6 },
  { x: 0.42, y: 0.36, rotation: -7 },
]

/**
 * Infrastructure: on desktop the stage pins while four shop-floor photos,
 * stacked at the centre, fly out to the corners and the facility statement
 * grows in their place. Phones get the photos in a grid and the same text.
 */
export function Infrastructure() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root || prefersReducedMotion()) return
      const mm = gsap.matchMedia()
      mm.add(DESKTOP_MEDIA, () => {
        // The stacked, pinned layout only applies while this scene runs;
        // otherwise (reduced motion, phones) the CSS grid layout shows.
        root.dataset.animated = ""
        const photos = gsap.utils.toArray<HTMLElement>("[data-photo]", root)
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.querySelector("[data-stage]"),
            start: "top top",
            end: "+=180%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        })
        photos.forEach((photo, i) => {
          const corner = CORNERS[i % CORNERS.length]
          tl.fromTo(
            photo,
            { xPercent: -50, yPercent: -50, x: 0, y: 0, rotation: (i - 1.5) * 4, scale: 0.85 },
            {
              x: () => corner.x * window.innerWidth,
              y: () => corner.y * window.innerHeight,
              rotation: corner.rotation,
              scale: 0.5,
              duration: 1,
            },
            0
          )
        })
        tl.fromTo("[data-statement]", { autoAlpha: 0, scale: 0.86 }, { autoAlpha: 1, scale: 1, duration: 0.5 }, 0.25)
        return () => {
          delete root.dataset.animated
        }
      })
      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <section ref={rootRef} id="infrastructure" className={styles.section} aria-labelledby="infra-title">
      <div className={styles.stage} data-stage>
        <div className={styles.photos}>
          {infrastructure.images.map((image) => (
            <div key={image} className={styles.photo} data-photo>
              <SiteImage name={image} sizes="(min-width: 992px) 34vw, 50vw" />
            </div>
          ))}
        </div>
        <div className={styles.statement} data-statement>
          <h2 id="infra-title" className={styles.title}>
            {infrastructure.statement}
          </h2>
          <p className={styles.text}>{infrastructure.text}</p>
        </div>
      </div>

      <div className={`container ${styles.stats}`} data-reveal-group>
        {infrastructure.stats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
            <p>{stat.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
