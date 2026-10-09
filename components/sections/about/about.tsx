import { RoundButton } from "@/components/ui/round-button/round-button"
import { SiteImage } from "@/components/ui/site-image/site-image"
import { about } from "@/content/home"

import styles from "./about.module.scss"

/**
 * About (after Parody "Digital Agency"): a centred statement that fills in as
 * it scrolls, flanked by two photos drifting at different speeds, then the
 * company story and the five commitments as an open/close list.
 */
export function About() {
  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <div className={`container ${styles.intro}`}>
        <div className={styles.sideLeft} data-speed="0.9">
          <div className={styles.photo} data-mask>
            <SiteImage name="about-engine" sizes="(min-width: 992px) 18vw, 40vw" />
          </div>
        </div>

        <div className={styles.center}>
          <h2 id="about-title" className="sr-only">
            About Airwing Technologies
          </h2>
          <p className={styles.statement} data-text-fill>
            {about.statement}
          </p>
          <RoundButton href="#services">Our capabilities</RoundButton>
        </div>

        <div className={styles.sideRight} data-speed="1.1">
          <div className={styles.photo} data-mask>
            <SiteImage name="qc-surface-table" sizes="(min-width: 992px) 16vw, 40vw" />
          </div>
        </div>
      </div>

      <div className={`container ${styles.story}`}>
        <div className={styles.text} data-reveal-group>
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        <div className={styles.pillars}>
          {about.pillars.map((pillar) => (
            <details key={pillar.title} className={styles.pillar} name="pillars">
              <summary>
                <span className={styles.pillarTitle}>{pillar.title}</span>
                <span className={styles.plus} aria-hidden />
              </summary>
              <p>{pillar.text}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
