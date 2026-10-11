import { RoundButton } from "@/components/ui/round-button/round-button"
import { SiteImage } from "@/components/ui/site-image/site-image"
import { about } from "@/content/home"

import styles from "./about.module.scss"

/**
 * About: an editorial statement that fills in as it scrolls, under faint
 * orbit rings, flanked by two HUD-framed photos drifting at different speeds;
 * then the company story and the five commitments as an open/close list.
 */
export function About() {
  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <div className={`container ${styles.intro}`}>
        <div className={styles.sideLeft} data-speed="0.9">
          <figure className={styles.figure}>
            <div className={styles.photo} data-mask>
              <SiteImage name="hal-helicopter" sizes="(min-width: 992px) 18vw, 40vw" />
            </div>
            <figcaption>
              <span>Customer · HAL</span>
              <span>Prachand LCH</span>
            </figcaption>
          </figure>
        </div>

        <div className={styles.center}>
          <h2 id="about-title" className={styles.code}>
            About Airwing Technologies
          </h2>
          <p className={styles.statement} data-text-fill="tricolour">
            {about.statement}
          </p>
          <RoundButton href="#services">Our capabilities</RoundButton>
        </div>

        <div className={styles.sideRight} data-speed="1.1">
          <figure className={styles.figure}>
            <div className={styles.photo} data-mask>
              <SiteImage name="qc-surface-table" sizes="(min-width: 992px) 16vw, 40vw" />
            </div>
            <figcaption>
              <span>Quality room</span>
              <span className="mono">0.006 mm</span>
            </figcaption>
          </figure>
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
