import { cn } from "@/lib/utils"

import styles from "./section-heading.module.scss"

/** Section title (h2) with an optional HUD code and intro, on the dark canvas or the paper band. */
export function SectionHeading({
  id,
  title,
  intro,
  code,
  tone = "dark",
  align = "split",
  className,
}: {
  id: string
  title: React.ReactNode
  intro?: React.ReactNode
  /** Short mono label above the title, e.g. "03 · Capabilities". */
  code?: string
  tone?: "dark" | "paper"
  /** `split`: title left, intro right on desktop. `stack`: intro under title. */
  align?: "split" | "stack"
  className?: string
}) {
  return (
    <div className={cn(styles.heading, styles[align], tone === "paper" && styles.paper, className)}>
      <div>
        {code ? (
          <p className={styles.code} data-reveal="fade">
            {code}
          </p>
        ) : null}
        <h2 id={id} className={styles.title} data-title>
          {title}
        </h2>
      </div>
      {intro ? (
        <p className={styles.intro} data-reveal="fade">
          {intro}
        </p>
      ) : null}
    </div>
  )
}
