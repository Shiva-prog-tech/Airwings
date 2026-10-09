"use client"

import { useRef } from "react"

import { SectionHeading } from "@/components/ui/section-heading/section-heading"
import { SiteImage } from "@/components/ui/site-image/site-image"
import { projects, type Project } from "@/content/projects"
import { DESKTOP_MEDIA, gsap, prefersReducedMotion, useGSAP } from "@/lib/motion/gsap"
import { pad2 } from "@/lib/utils"

import styles from "./projects.module.scss"

/**
 * Projects as a full-screen slicer (after Parody's "Full Screen Slicer"):
 * on desktop the stage pins and each scroll step wipes the next part in over
 * the last, which sinks back. Phones and reduced motion get a swipeable row.
 */
export function Projects() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root || prefersReducedMotion()) return
      const mm = gsap.matchMedia()
      mm.add(DESKTOP_MEDIA, () => {
        root.dataset.animated = ""
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
              if (counter) counter.textContent = pad2(Math.round(self.progress * (slides.length - 1)) + 1)
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
            <Slide key={project.id} project={project} index={i} />
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

function Slide({ project, index }: { project: Project; index: number }) {
  return (
    <li className={styles.slide} data-slide style={{ zIndex: index + 1 }} aria-labelledby={`project-${project.id}`}>
      <div className={styles.inner} data-slide-inner>
        <div className={styles.media}>
          <div className={styles.mediaImage} data-slide-image>
            <SiteImage name={project.image} sizes="(min-width: 992px) 100vw, 85vw" />
          </div>
        </div>
        <div className={styles.caption}>
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
