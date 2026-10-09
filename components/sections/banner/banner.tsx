import { AnchorLink } from "@/components/ui/anchor-link/anchor-link"
import { Marquee } from "@/components/ui/marquee/marquee"
import { bannerLines } from "@/content/home"

import styles from "./banner.module.scss"

const REPEAT = 4

/**
 * Closing infinite banner (after wion's footer marquee): two huge lines run
 * in opposite directions and the whole band links to the quote form.
 */
export function Banner() {
  const row = (text: string) =>
    Array.from({ length: REPEAT }, (_, i) => (
      <span key={i} className={styles.item}>
        {text}
        <span className={styles.mark} aria-hidden />
      </span>
    ))

  return (
    <AnchorLink href="#contact" className={styles.banner} aria-label="Request a quote">
      <Marquee items={row(bannerLines[0])} duration={38} />
      <Marquee items={row(bannerLines[1])} duration={32} reverse className={styles.second} />
    </AnchorLink>
  )
}
