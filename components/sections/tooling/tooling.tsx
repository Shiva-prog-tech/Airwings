import { Marquee } from "@/components/ui/marquee/marquee"
import { SiteImage } from "@/components/ui/site-image/site-image"
import { tooling } from "@/content/projects"

import styles from "./tooling.module.scss"

const half = Math.ceil(tooling.length / 2)

/** Tooling and special-purpose work: two opposing rows of photo cards, plus a plain list for assistive tech. */
export function Tooling() {
  const card = (item: (typeof tooling)[number]) => (
    <figure key={item.title} className={styles.card}>
      <div className={styles.media}>
        <SiteImage name={item.image} sizes="320px" decorative />
      </div>
      <figcaption>{item.title}</figcaption>
    </figure>
  )

  return (
    <section className={styles.section} aria-labelledby="tooling-title">
      <div className="container">
        <div className={styles.head}>
          <h2 id="tooling-title" className={styles.title} data-title>
            Tooling and special-purpose work
          </h2>
          <p className={styles.intro} data-reveal="fade">
            Moulds, jigs, fixtures and gauges from the same tool room, plus automotive and medical CNC parts.
          </p>
        </div>
        <ul className="sr-only">
          {tooling.map((item) => (
            <li key={item.title}>{item.title}</li>
          ))}
        </ul>
      </div>
      <div className={styles.rows}>
        <Marquee duration={50} items={tooling.slice(0, half).concat(tooling.slice(0, half)).map(card)} />
        <Marquee duration={55} reverse items={tooling.slice(half).concat(tooling.slice(half)).map(card)} />
      </div>
    </section>
  )
}
