import { SectionHeading } from "@/components/ui/section-heading/section-heading"
import { Icon } from "@/components/ui/icon/icon"
import { team, workforce } from "@/content/people"

import styles from "./team.module.scss"

const initials = (name: string) =>
  name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")

const TOTAL = workforce.reduce((sum, item) => sum + item.count, 0)

/** The four managing partners (tap to call) and the people behind them. */
export function Team() {
  return (
    <section id="team" className={styles.section} aria-labelledby="team-title">
      <div className="container">
        <SectionHeading
          id="team-title"
          title="Run by the people who machine"
          intro="Airwing is led by four managing partners with backgrounds in CNC, CAD-CAM and tool-room work. Call the partner who handles what you need."
        />

        <ul className={styles.partners} data-reveal-group>
          {team.map((person) => (
            <li key={person.name} className={styles.partner}>
              <span className={styles.monogram} aria-hidden>
                {initials(person.name)}
              </span>
              <div className={styles.who}>
                <strong className={styles.name}>{person.name}</strong>
                <span className={styles.role}>Managing partner · {person.role}</span>
              </div>
              <a href={person.phone.href} className={styles.call}>
                <Icon name="phone" />
                <span className="mono">{person.phone.display}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.workforce}>
          <p className={styles.workforceLead}>
            <span className={styles.total}>{TOTAL}</span> people on design, programming, machining, fitting and quality.
          </p>
          <ul className={styles.bars}>
            {workforce.map((item) => (
              <li key={item.role} style={{ "--share": item.count / TOTAL }}>
                <span>{item.role}</span>
                <span className="mono">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
