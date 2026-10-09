"use client"

import { useRef } from "react"

import { SiteImage } from "@/components/ui/site-image/site-image"
import { process } from "@/content/home"
import { usePin } from "@/lib/motion/use-pin"
import { pad2 } from "@/lib/utils"

import styles from "./process.module.scss"

/** How a job moves through the shop: five real steps, with a photo pinned beside them on desktop. */
export function Process() {
  const triggerRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  usePin(triggerRef, pinRef)

  return (
    <section className={styles.section} aria-labelledby="process-title">
      <div className="container">
        <h2 id="process-title" className={styles.title} data-title>
          From drawing to delivery
        </h2>
        <div ref={triggerRef} className={styles.layout}>
          <div ref={pinRef} className={styles.photo}>
            <SiteImage name="hero-manufacturing" sizes="(min-width: 992px) 30vw, 100vw" />
          </div>
          <ol className={styles.steps} data-reveal-group>
            {process.map((step, i) => (
              <li key={step.title} className={styles.step}>
                <span className={`mono ${styles.index}`}>{pad2(i + 1)}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
