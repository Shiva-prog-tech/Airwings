import { SiteImage } from "@/components/ui/site-image/site-image"
import { SiteVideo } from "@/components/ui/site-video/site-video"
import { industries } from "@/content/home"
import { getCredit } from "@/content/images"
import { pad2 } from "@/lib/utils"

import styles from "./industries.module.scss"

/**
 * Sectors served: full-bleed face-milling footage drifts behind the
 * heading and four sector modules, each with a customer's product photo
 * (credited), a short capability line and the customer names in that sector.
 */
export function Industries() {
  return (
    <section id="industries" className={styles.section} aria-labelledby="industries-title">
      <div className={styles.bg} aria-hidden>
        <div className={styles.parallax} data-speed="0.8">
          <SiteVideo name="facemill" className={styles.video} />
        </div>
        <div className={styles.scrim} />
      </div>

      <div className={`container ${styles.content}`}>
        <div className={styles.head}>
          <p className={styles.code} data-reveal="fade">
            Sectors
          </p>
          <h2 id="industries-title" className={styles.title} data-title>
            {industries.title}
          </h2>
          <p className={styles.intro} data-reveal="fade">
            {industries.intro}
          </p>
        </div>

        <ul className={styles.sectors} data-reveal-group>
          {industries.sectors.map((sector, i) => {
            const credit = getCredit(sector.image)
            return (
            <li key={sector.id} className={styles.sector} data-sector={sector.id}>
              <figure className={styles.media}>
                <SiteImage name={sector.image} sizes="(min-width: 1200px) 22vw, (min-width: 768px) 45vw, 90vw" />
                <span className={`mono ${styles.index}`}>{pad2(i + 1)}</span>
                <figcaption className={styles.caption}>
                  <span>{sector.caption}</span>
                  {credit ? (
                    <a href={credit.source} target="_blank" rel="noopener noreferrer" className={styles.credit}>
                      {credit.credit} · {credit.license}
                    </a>
                  ) : null}
                </figcaption>
              </figure>
              <div className={styles.body}>
                <h3 className={styles.sectorTitle}>{sector.title}</h3>
                <p>{sector.text}</p>
                <ul className={styles.customers} aria-label={`Customers in ${sector.title.toLowerCase()}`}>
                  {sector.customers.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
            </li>
            )
          })}
        </ul>

        <p className={styles.note}>{industries.note}</p>
      </div>
    </section>
  )
}
