"use client"

import { useRef } from "react"

import { SectionHeading } from "@/components/ui/section-heading/section-heading"
import { SiteImage } from "@/components/ui/site-image/site-image"
import { instrumentGroups, instruments } from "@/content/machinery"
import { site } from "@/content/site"
import { usePin } from "@/lib/motion/use-pin"

import styles from "./quality.module.scss"

// Least counts on the sheet run from 0.01 mm to 0.001 mm (a 10x range), so
// the resolution bar uses a log scale: 0.01 mm is the shortest, 0.001 mm full.
const COARSEST = 0.01
const FINEST = 0.001
const parseMm = (value: string) => {
  const n = parseFloat(value)
  return Number.isFinite(n) ? n : null
}
const share = (mm: number) => {
  const t = Math.log10(COARSEST / mm) / Math.log10(COARSEST / FINEST)
  return 0.12 + 0.88 * Math.min(1, Math.max(0, t))
}

const finest = instruments.filter((item) => parseMm(item.leastCount) === FINEST).length

const figures = [
  { value: String(instruments.length), label: "Calibrated instruments" },
  { value: "0.001 mm", label: `Finest least count (${finest} instruments)` },
  { value: "0.006 mm", label: "Granite surface table grade" },
  { value: site.certification, label: "Certified quality system" },
]

/**
 * Quality room: key figures, the certification and the surface table, then
 * every instrument grouped by what it measures, each with a resolution bar
 * so the finest instruments stand out at a glance.
 */
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

        <dl className={styles.figures} data-reveal-group>
          {figures.map((figure) => (
            <div key={figure.label}>
              <dt>{figure.label}</dt>
              <dd className={figure.value.includes("mm") ? "mono" : undefined}>{figure.value}</dd>
            </div>
          ))}
        </dl>

        <div ref={layoutRef} className={styles.layout}>
          <aside ref={asideRef} className={styles.aside}>
            <div className={styles.badge}>
              <span className={styles.badgeMark} aria-hidden />
              <div>
                <strong>{site.certification} certified</strong>
                <span>Instruments calibrated at approved labs</span>
              </div>
            </div>
            <div className={styles.photo} data-mask>
              <SiteImage name="qc-surface-table" sizes="(min-width: 992px) 30vw, 100vw" />
            </div>
            <p className={styles.note}>
              Granite surface table, 2000 × 1000 × 200 mm, in the quality room.
            </p>
          </aside>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.caption}>
                Instruments by type. The bar shows resolution (least count) on a log scale: longer is finer.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Instrument</th>
                  <th scope="col">Range</th>
                  <th scope="col">Least count</th>
                  <th scope="col">Make</th>
                </tr>
              </thead>
              {instrumentGroups.map((group) => {
                const rows = instruments.filter((item) => item.group === group.id)
                return (
                  <tbody key={group.id} className={styles.group}>
                    <tr className={styles.groupRow}>
                      <th scope="colgroup" colSpan={4}>
                        {group.label}
                        <span className={styles.groupCount}>{rows.length}</span>
                      </th>
                    </tr>
                    {rows.map((item, i) => {
                      const mm = parseMm(item.leastCount)
                      return (
                        <tr key={`${item.name}-${item.range}-${i}`}>
                          <th scope="row">{item.name}</th>
                          <td className="mono">{item.range}</td>
                          <td>
                            <span className={styles.resolution}>
                              <span className="mono">{item.leastCount}</span>
                              {mm ? (
                                <span className={styles.meter} aria-hidden>
                                  <span style={{ "--share": share(mm) }} data-finest={mm === FINEST || undefined} />
                                </span>
                              ) : null}
                            </span>
                          </td>
                          <td>{item.make}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                )
              })}
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
