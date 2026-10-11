import { SectionHeading } from "@/components/ui/section-heading/section-heading"
import { SiteImage } from "@/components/ui/site-image/site-image"
import { SiteVideo } from "@/components/ui/site-video/site-video"
import { StatCounter } from "@/components/ui/stat-counter/stat-counter"
import { numbers, services } from "@/content/home"
import { pad2 } from "@/lib/utils"

import styles from "./services.module.scss"

/**
 * Services as three tall capability modules: footage (or the CAD still) on
 * top that wakes on hover, then the copy and spec tags; then the counters as
 * a telemetry row.
 */
export function Services() {
  return (
    <section id="services" className={styles.section} aria-labelledby="services-title">
      <div className="container">
        <SectionHeading
          id="services-title"
          code="Capabilities"
          title="What we make for you"
          intro="One workshop for the whole job: design and drafting, multi-operation machining, assembly and inspection."
        />

        <ol className={styles.cards} data-reveal-group>
          {services.map((service, i) => (
            <li key={service.id} className={styles.card}>
              <div className={styles.media} data-render={"video" in service && service.video ? undefined : "cad"}>
                {"video" in service && service.video ? (
                  <SiteVideo name={service.video} className={styles.mediaFill} />
                ) : (
                  <SiteImage name={service.image} sizes="(min-width: 992px) 30vw, 100vw" className={styles.mediaFill} />
                )}
                <span className={`mono ${styles.index}`}>S-{pad2(i + 1)}</span>
              </div>
              <div className={styles.body}>
                <h3 className={styles.title}>{service.title}</h3>
                <p className={styles.text}>{service.text}</p>
                <ul className={styles.points}>
                  {service.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
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
