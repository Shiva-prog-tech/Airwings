"use client"

import { useRef } from "react"

import { SectionHeading } from "@/components/ui/section-heading/section-heading"
import { SiteImage } from "@/components/ui/site-image/site-image"
import { instruments } from "@/content/machinery"
import { site } from "@/content/site"
import { usePin } from "@/lib/motion/use-pin"

import styles from "./quality.module.scss"

/** Quality room: certification, calibration note and the instrument list as Parody-style award rows. */
export function Quality() {
  const layoutRef = useRef<HTMLDivElement>(null)
  const asideRef = useRef<HTMLElement>(null)
  usePin(layoutRef, asideRef, { start: "top top+=110", end: "bottom bottom-=40" })

  return (
    <section id="quality" className={styles.section} aria-labelledby="quality-title">
      <div className="container">
        <SectionHeading
          id="quality-title"
          title="Measured before it leaves"
          intro="A full-fledged quality room with standard instruments for general inspection and custom attribute gauges for production jobs. Every instrument is calibrated periodically at approved labs."
        />

        <div ref={layoutRef} className={styles.layout}>
          <aside ref={asideRef} className={styles.aside}>
            <div className={styles.badge}>
              <span className={styles.badgeMark} aria-hidden />
              <div>
                <strong>{site.certification} certified</strong>
                <span>Quality management system</span>
              </div>
            </div>
            <div className={styles.photo} data-mask>
              <SiteImage name="qc-surface-table" sizes="(min-width: 992px) 30vw, 100vw" />
            </div>
            <p className={styles.note}>
              Granite surface table, 2000 × 1000 × 200 mm, flat to 0.006 mm, in the quality room.
            </p>
          </aside>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className="sr-only">Quality instruments with range, least count and make</caption>
              <thead>
                <tr>
                  <th scope="col">Instrument</th>
                  <th scope="col">Range</th>
                  <th scope="col">Least count</th>
                  <th scope="col">Make</th>
                </tr>
              </thead>
              <tbody data-reveal-group>
                {instruments.map((item, i) => (
                  <tr key={`${item.name}-${i}`}>
                    <th scope="row">{item.name}</th>
                    <td className="mono">{item.range}</td>
                    <td className="mono">{item.leastCount}</td>
                    <td>{item.make}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
