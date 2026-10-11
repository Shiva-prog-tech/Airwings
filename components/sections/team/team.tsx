"use client"

import { useRef } from "react"

import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion/gsap"
import { team, workforce } from "@/content/people"
import { SectionHeading } from "@/components/ui/section-heading/section-heading"
import { StatCounter } from "@/components/ui/stat-counter/stat-counter"

import { PartnerCarousel } from "./partner-carousel"
import styles from "./team.module.scss"

const TOTAL = workforce.reduce((sum, item) => sum + item.count, 0)

/**
 * The four managing partners as portrait cards in a 3D coverflow
 * (partner-carousel.tsx), then the whole workforce as a unit chart: one
 * square per person, grouped by role.
 */
export function Team() {
  const unitsRef = useRef<HTMLDivElement>(null)

  // Squares pop in row by row when the chart scrolls into view.
  useGSAP(
    () => {
      const root = unitsRef.current
      if (!root || prefersReducedMotion()) return
      gsap.fromTo(
        root.querySelectorAll("[data-unit]"),
        { scale: 0, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.4,
          ease: "back.out(2)",
          stagger: 0.025,
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
        }
      )
    },
    { scope: unitsRef }
  )

  return (
    <section id="team" className={styles.section} aria-labelledby="team-title">
      <div className="container">
        <SectionHeading
          id="team-title"
          code="Leadership"
          align="stack"
          className={styles.heading}
          title="Run by the people who machine"
          intro="Four managing partners with backgrounds in CNC, CAD-CAM and tool-room work. Call the partner who handles what you need."
        />

        <div data-reveal="up">
          <PartnerCarousel people={team} />
        </div>

        <div className={styles.workforce}>
          <div className={styles.workforceLead}>
            <span className={styles.total}>
              <StatCounter value={TOTAL} />
            </span>
            <p>People on design, programming, machining, fitting and quality. Each square is one person.</p>
          </div>

          <div ref={unitsRef} className={styles.units} role="list" aria-label="Workforce by role">
            {workforce.map((item) => (
              <div key={item.role} className={styles.unitRow} role="listitem">
                <span className={styles.unitRole}>{item.role}</span>
                <span className={styles.unitSquares} aria-hidden>
                  {Array.from({ length: item.count }, (_, i) => (
                    <span key={i} className={styles.unit} data-unit />
                  ))}
                </span>
                <span className={`mono ${styles.unitCount}`}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
