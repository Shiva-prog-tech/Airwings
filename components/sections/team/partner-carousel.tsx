"use client"

import { useEffect, useRef, useState } from "react"

import { prefersReducedMotion } from "@/lib/motion/gsap"
import type { Partner } from "@/content/people"

import { PartnerCard } from "./partner-card"
import styles from "./partner-carousel.module.scss"

/** Pixels of horizontal travel before a press counts as a swipe. */
const SWIPE = 48

/**
 * Where a slide sits relative to the active one: centre, either flank, or
 * parked out of sight behind the centre (so it never sweeps across the stage).
 */
function position(index: number, active: number, count: number) {
  const offset = (((index - active) % count) + count) % count
  if (offset === 0) return "0"
  if (offset === 1) return "1"
  if (offset === count - 1) return "-1"
  return "far"
}

/**
 * The partner cards as a 3D coverflow: the active card faces the viewer,
 * its neighbours angle away on either side under a dark scrim, and the rest
 * wait behind. Moves on its own (paused while the pointer rests on the
 * centre card, while keyboard focus is inside, off screen or with reduced
 * motion), and by the dots, the keyboard,
 * a swipe, or a click on a flanking card. The active dot's fill is the
 * autoplay timer: its CSS animation ending advances the carousel.
 */
export function PartnerCarousel({ people }: { people: Partner[] }) {
  const count = people.length
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [inView, setInView] = useState(false)
  const [reduced, setReduced] = useState(true)
  const rootRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null)
  const suppressClick = useRef(false)

  const go = (index: number) => {
    setHovered(false)
    setActive(((index % count) + count) % count)
  }
  const next = () => go(active + 1)
  const prev = () => go(active - 1)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    // Fires once on observe, so this also settles the reduced-motion check.
    const observer = new IntersectionObserver(
      ([entry]) => {
        setReduced(prefersReducedMotion())
        setInView(entry.isIntersecting)
      },
      { threshold: 0.35 }
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  const playing = !reduced && inView && !hovered && !focused

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") next()
    else if (event.key === "ArrowLeft") prev()
    else return
    event.preventDefault()
  }

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.button !== 0) return
    drag.current = { x: event.clientX, y: event.clientY, moved: false }
  }
  const onPointerMove = (event: React.PointerEvent) => {
    const start = drag.current
    if (!start || start.moved) return
    const dx = event.clientX - start.x
    if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(event.clientY - start.y)) start.moved = true
  }
  const onPointerUp = (event: React.PointerEvent) => {
    const start = drag.current
    drag.current = null
    if (!start?.moved) return
    const dx = event.clientX - start.x
    suppressClick.current = true
    if (dx <= -SWIPE) next()
    else if (dx >= SWIPE) prev()
  }
  // A swipe ends in a click on whatever is under the pointer; swallow it.
  const onClickCapture = (event: React.MouseEvent) => {
    if (!suppressClick.current) return
    suppressClick.current = false
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <div
      ref={rootRef}
      className={styles.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label="Managing partners"
      // Only keyboard focus pauses: a click on an arrow or tab must not.
      onFocus={(event) => setFocused(event.target.matches(":focus-visible"))}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false)
      }}
      onKeyDown={onKeyDown}
    >
      <div className={styles.viewport}>
        <ul
          className={styles.stage}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (drag.current = null)}
          onClickCapture={onClickCapture}
          aria-live={playing ? "off" : "polite"}
        >
          {people.map((person, i) => {
            const pos = position(i, active, count)
            const current = pos === "0"
            return (
              <li
                key={person.name}
                className={styles.slide}
                data-pos={pos}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}: ${person.name}`}
                aria-hidden={!current}
              >
                <div
                  className={styles.card}
                  inert={!current}
                  onPointerEnter={(event) => current && event.pointerType === "mouse" && setHovered(true)}
                  onPointerLeave={() => setHovered(false)}
                >
                  <PartnerCard person={person} index={i} />
                </div>
                {(pos === "1" || pos === "-1") && (
                  <button
                    type="button"
                    className={styles.peek}
                    tabIndex={-1}
                    aria-label={`Show ${person.name}`}
                    onClick={() => go(i)}
                  />
                )}
              </li>
            )
          })}
        </ul>
      </div>

      <div className={styles.dots} role="group" aria-label="Choose a partner">
        {people.map((person, i) => (
          <button
            key={person.name}
            type="button"
            className={styles.dot}
            aria-current={i === active}
            aria-label={`Show ${person.name}`}
            onClick={() => go(i)}
          >
            {i === active && (
              <span
                key={active}
                className={styles.fill}
                data-auto={!reduced || undefined}
                data-paused={!playing || undefined}
                onAnimationEnd={next}
                aria-hidden
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
