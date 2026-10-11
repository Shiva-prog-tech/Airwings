"use client"

import { useRef } from "react"

import { SiteImage } from "@/components/ui/site-image/site-image"
import { process } from "@/content/home"
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/motion/gsap"
import { usePin } from "@/lib/motion/use-pin"
import { pad2 } from "@/lib/utils"

import styles from "./process.module.scss"

/**
 * How a job moves through the shop: five real stages on a trajectory line
 * that burns in as it scrolls, with a photo pinned beside them on desktop.
 */
export function Process() {
  const triggerRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  usePin(triggerRef, pinRef)

  useGSAP(
    () => {
      const root = triggerRef.current
      if (!root || prefersReducedMotion()) return
      gsap.fromTo(
        "[data-trajectory]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-steps]", start: "top 70%", end: "bottom 60%", scrub: true },
        }
      )
      // Each stage's node lights once the trajectory reaches it.
      gsap.utils.toArray<HTMLElement>("[data-step]", root).forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 62%",
          onEnter: () => step.setAttribute("data-lit", ""),
          onLeaveBack: () => step.removeAttribute("data-lit"),
        })
      })
    },
    { scope: triggerRef }
  )

  return (
    <section className={styles.section} aria-labelledby="process-title">
      <div className="container">
        <p className={styles.code} data-reveal="fade">
          Process
        </p>
        <h2 id="process-title" className={styles.title} data-title>
          From drawing to delivery
        </h2>
        <div ref={triggerRef} className={styles.layout}>
          <div ref={pinRef} className={styles.photo}>
            <SiteImage name="hero-manufacturing" sizes="(min-width: 992px) 30vw, 100vw" />
            <span className={`mono ${styles.photoTag}`}>Spindle under coolant</span>
          </div>
          <div className={styles.steps} data-steps>
            <span className={styles.track} aria-hidden>
              <span data-trajectory />
            </span>
            <ol>
              {process.map((step, i) => (
                <li key={step.title} className={styles.step} data-step>
                  <span className={styles.node} aria-hidden />
                  <span className={`mono ${styles.index}`}>Stage {pad2(i + 1)}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
