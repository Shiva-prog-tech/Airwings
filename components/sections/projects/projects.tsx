"use client"

import { useRef, useState } from "react"

import { SectionHeading } from "@/components/ui/section-heading/section-heading"
import { SiteImage } from "@/components/ui/site-image/site-image"
import { SiteVideo } from "@/components/ui/site-video/site-video"
import { projects, type Project } from "@/content/projects"
import { DESKTOP_MEDIA, gsap, prefersReducedMotion, useGSAP } from "@/lib/motion/gsap"
import { pad2 } from "@/lib/utils"

import styles from "./projects.module.scss"

/**
 * Projects as a full-screen slicer (after Parody's "Full Screen Slicer"):
 * on desktop the stage pins and each scroll step wipes the next part in over
 * the last, which sinks back. Each slide plays a machining clip; the real
 * part photo sits in its spec block. Phones and reduced motion get a
 * swipeable row.
 */
export function Projects() {
  const rootRef = useRef<HTMLElement>(null)
  // Desktop scene: only the current slide's clip plays (all are stacked).
  const [current, setCurrent] = useState<number | null>(null)
  const currentRef = useRef<number | null>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root || prefersReducedMotion()) return
      const mm = gsap.matchMedia()
      mm.add(DESKTOP_MEDIA, () => {
        root.dataset.animated = ""
        currentRef.current = 0
        setCurrent(0)
        const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", root)
        const counter = root.querySelector<HTMLElement>("[data-counter]")
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.querySelector("[data-slicer]"),
            start: "top top",
            end: () => `+=${(slides.length - 1) * window.innerHeight}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate: (self) => {
              const index = Math.round(self.progress * (slides.length - 1))
              if (counter) counter.textContent = pad2(index + 1)
              if (index !== currentRef.current) {
                currentRef.current = index
                setCurrent(index)
              }
            },
          },
        })
        slides.forEach((slide, i) => {
          if (i === 0) return
          tl.fromTo(
            slide,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1 },
            i - 1
          )
          tl.fromTo(slide.querySelector("[data-slide-image]"), { scale: 1.25 }, { scale: 1, duration: 1 }, i - 1)
          tl.to(slides[i - 1].querySelector("[data-slide-inner]"), { scale: 0.9, autoAlpha: 0.3, duration: 1 }, i - 1)
        })
        return () => {
          delete root.dataset.animated
          currentRef.current = null
          setCurrent(null)
        }
      })
      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <section ref={rootRef} id="projects" className={styles.section} aria-labelledby="projects-title">
      <div className="container">
        <SectionHeading
          id="projects-title"
          tone="graphite"
          title="Parts we have machined"
          intro="Aluminium and titanium parts machined from solid billet, with tight position and profile tolerances."
        />
      </div>

      <div className={styles.slicer} data-slicer>
        <ol className={styles.track}>
          {projects.map((project, i) => (
            <Slide key={project.id} project={project} index={i} active={current === null || current === i} />
          ))}
        </ol>
        <div className={styles.hud} aria-hidden>
          <span className="mono">
            <span data-counter>01</span> / {pad2(projects.length)}
          </span>
          <span className={styles.hint}>Scroll</span>
        </div>
      </div>
    </section>
  )
}

function Slide({ project, index, active }: { project: Project; index: number; active: boolean }) {
  return (
    <li className={styles.slide} data-slide style={{ zIndex: index + 1 }} aria-labelledby={`project-${project.id}`}>
      <div className={styles.inner} data-slide-inner>
        <div className={styles.media}>
          <div className={styles.mediaImage} data-slide-image>
            <SiteVideo name={project.video} active={active} className={styles.mediaVideo} />
          </div>
        </div>
        <div className={styles.caption}>
          {/* The real part: the clip above is illustrative machining footage. */}
          <figure className={styles.part}>
            <SiteImage name={project.image} sizes="160px" />
            <figcaption>The part</figcaption>
          </figure>
          <span className={`mono ${styles.no}`}>{pad2(index + 1)}</span>
          <h3 id={`project-${project.id}`} className={styles.title}>
            {project.title}
          </h3>
          <dl className={styles.specs}>
            <div>
              <dt>Material</dt>
              <dd className="mono">{project.material}</dd>
            </div>
            <div>
              <dt>{project.sizeLabel}</dt>
              <dd className="mono">{project.size} mm</dd>
            </div>
            <div>
              <dt>{project.rawWeight ? "Raw → finished" : "Weight"}</dt>
              <dd className="mono">
                {project.rawWeight ? `${project.rawWeight} → ${project.finishWeight}` : project.weight}
              </dd>
            </div>
            <div>
              <dt>Position / profile</dt>
              <dd className={`mono ${styles.tolerance}`}>
                {project.position}
                {project.profile ? ` / ${project.profile}` : ""}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </li>
  )
}
