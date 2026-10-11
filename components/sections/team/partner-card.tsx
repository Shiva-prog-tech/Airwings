"use client"

import { useRef } from "react"

import { prefersReducedMotion } from "@/lib/motion/gsap"
import { pad2 } from "@/lib/utils"
import type { Partner } from "@/content/people"
import { Icon } from "@/components/ui/icon/icon"
import { SiteImage } from "@/components/ui/site-image/site-image"

import styles from "./partner-card.module.scss"

/**
 * Stand-in portrait for `pnpm dev` only, so the layout can be judged before
 * the partners' own photos arrive. It is a third-party still of someone
 * else, so it is git-ignored (public/_dev/) and never rendered in a
 * production build: there each card falls back to its monogram plate.
 */
const DEV_PLACEHOLDER = process.env.NODE_ENV === "production" ? null : "/_dev/crew-placeholder.webp"

/** Max tilt in degrees as the pointer crosses the card. */
const TILT = 5

/** The Ashoka Chakra's 24 spokes, as angles in degrees. */
const SPOKES = Array.from({ length: 24 }, (_, i) => i * 15)

/** Small Ashoka Chakra mark for the title pill. */
function Chakra() {
  return (
    <svg viewBox="0 0 24 24" className={styles.chakra} aria-hidden>
      <circle cx="12" cy="12" r="10.5" fill="none" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.6" />
      {SPOKES.map((angle) => (
        <line key={angle} x1="12" y1="12" x2="12" y2="2" strokeWidth="0.7" transform={`rotate(${angle} 12 12)`} />
      ))}
    </svg>
  )
}

const initials = (name: string) =>
  name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")

/**
 * A partner as a full-bleed portrait card: the photo fills the card and
 * fades into a dark base that carries the name, role, background and a call
 * button. Tricolour accents (a ribbon along the top edge, the index dash,
 * the rule and a small Ashoka Chakra) sit on a hairline metal border, with a
 * soft light that follows the pointer. Tilts toward the pointer (fine
 * pointers, motion allowed); pointer moves only write CSS variables, so
 * nothing re-renders.
 */
export function PartnerCard({ person, index }: { person: Partner; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const placeholder = !person.photo ? DEV_PLACEHOLDER : null

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const card = ref.current
    if (!card || event.pointerType !== "mouse" || prefersReducedMotion()) return
    const box = card.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width
    const y = (event.clientY - box.top) / box.height
    card.style.setProperty("--rx", `${(0.5 - y) * TILT}deg`)
    card.style.setProperty("--ry", `${(x - 0.5) * TILT}deg`)
    card.style.setProperty("--mx", `${x * 100}%`)
    card.style.setProperty("--my", `${y * 100}%`)
  }
  const onLeave = () => {
    const card = ref.current
    if (!card) return
    for (const name of ["--rx", "--ry", "--mx", "--my"]) card.style.removeProperty(name)
  }

  return (
    <div ref={ref} className={styles.card} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className={styles.media}>
        {person.photo ? (
          <SiteImage name={person.photo} sizes="(min-width: 768px) 380px, 80vw" className={styles.photo} />
        ) : placeholder ? (
          // eslint-disable-next-line @next/next/no-img-element -- dev-only stand-in, not in the pipeline
          <img src={placeholder} alt="" className={styles.photo} />
        ) : (
          // Monogram plate until the partner's own portrait is supplied.
          <div className={styles.plate} aria-hidden>
            <span className={styles.initials}>{initials(person.name)}</span>
          </div>
        )}
        <span className={styles.shade} aria-hidden />
        <span className={styles.glow} aria-hidden />
      </div>

      <div className={styles.top}>
        <span className={`mono ${styles.index}`}>{pad2(index + 1)}</span>
        <span className={`mono ${styles.title}`}>
          <Chakra />
          Managing partner
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.identity}>
          <h3 className={styles.name}>{person.name}</h3>
          <p className={styles.role}>{person.role}</p>
        </div>

        <span className={styles.rule} aria-hidden />

        <div className={styles.meta}>
          <div className={styles.expertise}>
            <span className={`mono ${styles.label}`}>Background</span>
            <span>{person.expertise}</span>
          </div>
          <a href={person.phone.href} className={styles.call} aria-label={`Call ${person.name}, ${person.phone.display}`}>
            <Icon name="phone" />
            <span className="mono">{person.phone.display}</span>
          </a>
        </div>
      </div>
    </div>
  )
}
