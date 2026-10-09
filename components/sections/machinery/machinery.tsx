"use client"

import { useRef, useState } from "react"

import { SectionHeading } from "@/components/ui/section-heading/section-heading"
import { SiteImage } from "@/components/ui/site-image/site-image"
import { machines } from "@/content/machinery"
import { usePin } from "@/lib/motion/use-pin"
import { cn } from "@/lib/utils"

import styles from "./machinery.module.scss"

const WITH_IMAGES = machines.filter((machine) => machine.image)

/**
 * Machinery list (after Parody's hover image-swap list). Pointing at or
 * focusing a row swaps the large photo, which stays pinned beside the list on
 * desktop; on phones each row shows its own thumbnail instead.
 */
export function Machinery() {
  const [active, setActive] = useState(WITH_IMAGES[0].id)
  const layoutRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<HTMLDivElement>(null)
  usePin(layoutRef, viewerRef, { start: "top top+=110", end: "bottom bottom-=40" })

  return (
    <section id="machinery" className={styles.section} aria-labelledby="machinery-title">
      <div className="container">
        <SectionHeading
          id="machinery-title"
          title="The machines on our floor"
          intro="BFW milling centres up to 3100 × 1700 × 1000 mm, turning centres, drilling and handling equipment. All capacities in millimetres."
        />

        <div ref={layoutRef} className={styles.layout}>
          <div ref={viewerRef} className={styles.viewer} aria-hidden>
            {WITH_IMAGES.map((machine) => (
              <div key={machine.id} className={styles.viewerImage} data-active={machine.id === active || undefined}>
                <SiteImage name={machine.image!} sizes="(min-width: 992px) 38vw, 1px" decorative placeholder={false} />
              </div>
            ))}
          </div>

          <ul className={styles.list}>
            {machines.map((machine) => (
              <li
                key={machine.id}
                className={cn(styles.row, machine.id === active && styles.rowActive)}
                onPointerEnter={() => machine.image && setActive(machine.id)}
                onFocus={() => machine.image && setActive(machine.id)}
                tabIndex={machine.image ? 0 : undefined}
              >
                {machine.image ? (
                  <div className={styles.thumb}>
                    <SiteImage name={machine.image} sizes="96px" placeholder={false} />
                  </div>
                ) : (
                  <div className={styles.thumb} aria-hidden />
                )}
                <div className={styles.name}>
                  <span className={styles.make}>{machine.make}</span>
                  <span className={styles.kind}>
                    {machine.name}
                    {machine.quantity > 1 ? <span className={styles.qty}> × {machine.quantity}</span> : null}
                  </span>
                </div>
                <dl className={styles.specs}>
                  {machine.model ? (
                    <div>
                      <dt>Model</dt>
                      <dd className="mono">{machine.model}</dd>
                    </div>
                  ) : null}
                  {machine.capacity ? (
                    <div>
                      <dt>Capacity</dt>
                      <dd className="mono">{machine.capacity}</dd>
                    </div>
                  ) : null}
                </dl>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
