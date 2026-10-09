"use client"

import { useRef } from "react"

import { Icon } from "@/components/ui/icon/icon"
import { SectionHeading } from "@/components/ui/section-heading/section-heading"
import { SiteImage } from "@/components/ui/site-image/site-image"
import { StatCounter } from "@/components/ui/stat-counter/stat-counter"
import { team, workforce } from "@/content/people"
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion/gsap"

import styles from "./team.module.scss"

const initials = (name: string) =>
  name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")

const TOTAL = workforce.reduce((sum, item) => sum + item.count, 0)

/**
 * The four managing partners as cards with a floating round monogram (a
 * photo once the client supplies one): name, role, call link and their
 * background below a hairline. Then the
 * whole workforce as a unit chart: one square per person, grouped by role.
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
          align="stack"
          className={styles.heading}
          title="Run by the people who machine"
          intro="Four managing partners with backgrounds in CNC, CAD-CAM and tool-room work. Call the partner who handles what you need."
        />

        <ul className={styles.partners} data-reveal-group>
          {team.map((person) => (
            <li key={person.name} className={styles.card}>
              <div className={styles.avatar} aria-hidden>
                <div className={styles.avatarInner}>
                  {person.photo ? (
                    <SiteImage name={person.photo} sizes="96px" className={styles.photo} />
                  ) : (
                    <span className={styles.initials}>{initials(person.name)}</span>
                  )}
                </div>
              </div>
              <h3 className={styles.name}>{person.name}</h3>
              <p className={styles.role}>Managing partner · {person.role}</p>
              <a href={person.phone.href} className={`mono ${styles.call}`}>
                <Icon name="phone" />
                {person.phone.display}
              </a>
              <div className={styles.expertise}>
                <span>{person.expertise}</span>
                <small>Background</small>
              </div>
            </li>
          ))}
        </ul>

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
