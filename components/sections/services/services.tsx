import { SectionHeading } from "@/components/ui/section-heading/section-heading"
import { SiteImage } from "@/components/ui/site-image/site-image"
import { SiteVideo } from "@/components/ui/site-video/site-video"
import { StatCounter } from "@/components/ui/stat-counter/stat-counter"
import { numbers, services } from "@/content/home"
import { pad2 } from "@/lib/utils"

import styles from "./services.module.scss"

/**
 * Services as Parody "Digital Agency" rows: number, title, description and a
 * thumbnail that opens on hover (always shown on phones), then the counters.
 */
export function Services() {
  return (
    <section id="services" className={styles.section} aria-labelledby="services-title">
      <div className="container">
        <SectionHeading
          id="services-title"
          title="What we make for you"
          intro="One workshop for the whole job: design and drafting, multi-operation machining, assembly and inspection."
        />

        <ol className={styles.rows}>
          {services.map((service, i) => (
            <li key={service.id} className={styles.row} data-reveal="up">
              <span className={`mono ${styles.index}`}>{pad2(i + 1)}</span>
              <div className={styles.body}>
                <h3 className={styles.title}>{service.title}</h3>
                <p className={styles.text}>{service.text}</p>
                <ul className={styles.points}>
                  {service.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.thumb}>
                {"video" in service && service.video ? (
                  <SiteVideo name={service.video} className={styles.thumbVideo} />
                ) : (
                  <SiteImage name={service.image} sizes="(min-width: 992px) 22vw, 100vw" />
                )}
              </div>
            </li>
          ))}
        </ol>

        <ul className={styles.counters} data-reveal-group>
          {numbers.map((item) => (
            <li key={item.label}>
              <span className={styles.value}>
                <StatCounter value={item.value} grouped={"format" in item} />
                <span className={`mono ${styles.unit}`}>{item.unit}</span>
              </span>
              <span className={styles.label}>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
