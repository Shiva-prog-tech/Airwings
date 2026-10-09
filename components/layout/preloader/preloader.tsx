"use client"

import { useRef, useState } from "react"

import { Logo } from "@/components/layout/logo/logo"
import { ScrambleText } from "@/components/ui/scramble-text/scramble-text"
import { projects } from "@/content/projects"
import { site } from "@/content/site"
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion/gsap"
import { releaseReveals } from "@/lib/motion/reveal-gate"

import { FrameDrawing, MACHINING } from "./frame-drawing"
import styles from "./preloader.module.scss"

const SEEN_KEY = "awt-intro-seen"

function seenThisSession() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1"
  } catch {
    return false
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1")
  } catch {
    // Private mode or blocked storage: the full intro simply plays again.
  }
}

// Decided once per page load, so React's double-run of effects in
// development can't flip a first visit into the short version.
let introMode: "full" | "short" | null = null
function getIntroMode() {
  if (!introMode) {
    introMode = seenThisSession() ? "short" : "full"
    markSeen()
  }
  return introMode
}

// The part on the sheet: Airwing's ribbed frame (brochure, component 1).
const PART = projects.find((project) => project.id === "c1")!
const RAW_KG = parseFloat(PART.rawWeight ?? "0")
const FINISH_KG = parseFloat(PART.finishWeight ?? "0")
// Probe travel as a share of the drawing width (SVG viewBox is 640 wide).
const PROBE_FROM = `${(MACHINING.start / 640) * 100}%`
const PROBE_TO = `${((MACHINING.start + MACHINING.width) / 640) * 100}%`

/**
 * First-load reveal, "from drawing to part", using one of Airwing's own
 * parts: the ribbed frame's drawing draws itself with its real dimensions and
 * GD&T callouts, the 274 kg billet appears, a machining pass cuts the pockets
 * and ribs out of it while the title block counts down to the 15 kg finished
 * weight, and then the sheet lifts off the page.
 * Full sequence once per session; afterwards a short lift. Click or any key
 * skips. Shown only under `html.has-motion` (no-JS and reduced-motion
 * visitors never see it).
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      if (prefersReducedMotion() || !document.documentElement.classList.contains("has-motion")) {
        releaseReveals()
        setDone(true)
        return
      }

      const short = getIntroMode() === "short"

      // Start states (undrawn strokes, hidden callouts) are set in CSS so
      // nothing finished flashes before hydration; every step here is a `to`.
      const strokes = gsap.utils.toArray<SVGGeometryElement>("[data-draw]", root)

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } })

      const shown = "[data-frame], [data-chain], [data-fade], [data-block], [data-stamp], [data-billet]"
      const readout = root.querySelector<HTMLElement>("[data-weight]")
      const weight = { kg: RAW_KG }
      if (short) {
        gsap.set(strokes, { strokeDashoffset: 0 })
        gsap.set(shown, { autoAlpha: 1 })
        gsap.set("[data-cut]", { attr: { width: MACHINING.width } })
        gsap.set("[data-cut-rest]", { attr: { width: 0 } })
        root.querySelector("[data-weight]")!.textContent = `${FINISH_KG} kg`
        tl.to({}, { duration: 0.25 })
      } else {
        tl.to("[data-frame]", { autoAlpha: 1, duration: 0.5, ease: "power1.out" })
          // 1. The drawing draws itself.
          .to(strokes, { strokeDashoffset: 0, duration: 1.1, stagger: 0.035 }, 0.1)
          .to("[data-chain]", { autoAlpha: 0.6, duration: 0.6 }, 0.3)
          .fromTo("[data-fade]", { y: 6 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.12 }, 0.9)
          .fromTo("[data-block]", { y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.6)
          // 2. The raw billet appears inside the outline.
          .to("[data-billet]", { autoAlpha: 0.85, duration: 0.45, ease: "power1.out" }, 1.2)
          // 3. The machining pass: pockets and ribs are cut out behind the
          //    probe while the weight falls from raw to finished.
          .set("[data-probe]", { left: PROBE_FROM }, 1.6)
          .to("[data-probe]", { autoAlpha: 1, duration: 0.15 }, 1.6)
          .to("[data-probe]", { left: PROBE_TO, duration: 1.3, ease: "power1.inOut" }, 1.6)
          .to("[data-cut]", { attr: { width: MACHINING.width }, duration: 1.3, ease: "power1.inOut" }, 1.6)
          .to(
            "[data-cut-rest]",
            { attr: { x: MACHINING.start + MACHINING.width, width: 0 }, duration: 1.3, ease: "power1.inOut" },
            1.6
          )
          .to(
            weight,
            {
              kg: FINISH_KG,
              duration: 1.3,
              ease: "power1.inOut",
              onUpdate: () => {
                if (readout) readout.textContent = `${Math.round(weight.kg)} kg`
              },
            },
            1.6
          )
          .to("[data-probe]", { autoAlpha: 0, duration: 0.2 }, 2.85)
          .fromTo("[data-stamp]", { scale: 1.4 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, 2.9)
      }

      // 3. The sheet lifts; the page's own entrance starts underneath it.
      tl.to(root, { yPercent: -100, duration: short ? 0.7 : 0.95, ease: "power4.inOut" }, short ? ">" : "+=0.35")
        .add(() => releaseReveals(), "<0.15")
        .add(() => setDone(true))

      // Start once fonts are in (or after 1.2s at worst).
      Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 1200))]).then(() => tl.play())

      // Any click or key skips straight to the lift.
      const skip = () => {
        if (tl.progress() < 0.8) tl.timeScale(5)
      }
      window.addEventListener("pointerdown", skip, { once: true })
      window.addEventListener("keydown", skip, { once: true })
      return () => {
        window.removeEventListener("pointerdown", skip)
        window.removeEventListener("keydown", skip)
      }
    },
    { scope: rootRef }
  )

  if (done) return null

  return (
    <div ref={rootRef} className={styles.preloader} aria-hidden>
      <div className={styles.sheet} data-sheet>
        {/* Drawing border with zone ticks, like a real sheet frame. */}
        <div className={styles.frame} data-frame />

        <div className={styles.drawing}>
          <FrameDrawing />
          <span className={styles.probe} data-probe />
        </div>

        <div className={styles.block} data-block>
          <div className={styles.blockLogo}>
            <Logo height={46} tone="light" />
          </div>
          <dl className={styles.blockGrid}>
            <div>
              <dt>Part</dt>
              <dd>
                <ScrambleText text={PART.title} waitForReveal={false} delay={700} duration={600} />
              </dd>
            </div>
            <div>
              <dt>Material</dt>
              <dd>
                <ScrambleText text={PART.material} waitForReveal={false} delay={850} duration={600} />
              </dd>
            </div>
            <div>
              <dt>Raw stock (mm)</dt>
              <dd>
                <ScrambleText text={PART.size} waitForReveal={false} delay={1000} duration={600} />
              </dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd className={styles.weight}>
                <span data-weight>{RAW_KG} kg</span>
              </dd>
            </div>
            <div>
              <dt>Standard</dt>
              <dd>
                <ScrambleText text={site.certification} waitForReveal={false} delay={1150} duration={600} />
              </dd>
            </div>
            <div className={styles.stampCell}>
              <dt>Status</dt>
              <dd>
                <span className={styles.stamp} data-stamp>
                  Inspected
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <p className={styles.skip}>Click or press any key to skip</p>
      </div>
    </div>
  )
}
