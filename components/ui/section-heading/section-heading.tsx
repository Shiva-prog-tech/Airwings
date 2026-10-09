import { cn } from "@/lib/utils"

import styles from "./section-heading.module.scss"

/** Section title (h2) with an optional intro, on the canvas or a graphite band. */
export function SectionHeading({
  id,
  title,
  intro,
  tone = "canvas",
  align = "split",
  className,
}: {
  id: string
  title: React.ReactNode
  intro?: React.ReactNode
  tone?: "canvas" | "graphite"
  /** `split`: title left, intro right on desktop. `stack`: intro under title. */
  align?: "split" | "stack"
  className?: string
}) {
  return (
    <div className={cn(styles.heading, styles[align], tone === "graphite" && styles.graphite, className)}>
      <h2 id={id} className={styles.title} data-title>
        {title}
      </h2>
      {intro ? (
        <p className={styles.intro} data-reveal="fade">
          {intro}
        </p>
      ) : null}
    </div>
  )
}
