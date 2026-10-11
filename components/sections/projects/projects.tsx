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
 * Projects as a full-screen slicer: on desktop the stage pins and each scroll
 * step wipes the next part in over the last, which sinks back. Airwing's own
 * part is the hero of every slide, in a blueprint inspection panel (CAD
 * renders become x-ray scans); illustrative machining footage runs dark
 * behind it. Phones and reduced motion get a swipeable row of spec cards.
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
        const bar = root.querySelector<HTMLElement>("[data-progress]")
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
              bar?.style.setProperty("transform", `scaleY(${self.progress})`)
              if (index !== currentRef.current) {
                currentRef.current = index
                setCurrent(index)
              }
            },
          },
        })
        slides.forEach((slide, i) => {
          if (i === 0) return
          // The wipe: the slide rises while its content counter-slides
          // down by the same amount, so the content holds still behind a
          // rising edge. Transforms only, so the GPU does it without the
          // full-screen repaint an animated clip-path costs every frame.
          tl.fromTo(slide, { yPercent: 100 }, { yPercent: 0, duration: 1 }, i - 1)
          tl.fromTo(slide.querySelector("[data-slide-inner]"), { yPercent: -100 }, { yPercent: 0, duration: 1 }, i - 1)
          tl.fromTo(slide.querySelector("[data-slide-image]"), { scale: 1.25 }, { scale: 1, duration: 1 }, i - 1)
          tl.fromTo(slide.querySelector("[data-part]"), { yPercent: 18 }, { yPercent: 0, duration: 1 }, i - 1)
          tl.to(slides[i - 1].querySelector("[data-slide-inner]"), { scale: 0.92, autoAlpha: 0.25, duration: 1 }, i - 1)
          // The slide two back is fully covered by now: hide it, so it can't
          // ghost through the fading one above it (and isn't drawn at all).
          if (i >= 2) tl.set(slides[i - 2], { autoAlpha: 0 }, i - 1)
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
          code="Flight hardware"
          title="Parts we have machined"
          intro="Aluminium and titanium structures machined from solid billet, holding tight position and profile tolerances."
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
            <span data-counter>01</span>
            <span className={styles.hudTotal}> / {pad2(projects.length)}</span>
          </span>
          <span className={styles.rail}>
            <span data-progress />
          </span>
          <span className={styles.hint}>Scroll</span>
        </div>
      </div>
    </section>
  )
}

function Slide({ project, index, active }: { project: Project; index: number; active: boolean }) {
  const reduction = project.rawWeight
    ? Math.round((1 - parseFloat(project.finishWeight ?? "0") / parseFloat(project.rawWeight)) * 100)
    : null

  return (
    <li className={styles.slide} data-slide style={{ zIndex: index + 1 }} aria-labelledby={`project-${project.id}`}>
      <div className={styles.inner} data-slide-inner>
        {/* Illustrative machining footage, not this part. */}
        <div className={styles.media} aria-hidden>
          <div className={styles.mediaImage} data-slide-image>
            <SiteVideo name={project.video} active={active} className={styles.mediaVideo} />
          </div>
        </div>

        <div className={styles.layout}>
          <figure className={styles.part} data-part data-render={project.render}>
            <div className={styles.partImage}>
              <SiteImage name={project.image} sizes="(min-width: 992px) 46vw, 85vw" placeholder={project.render === "photo"} />
            </div>
            <figcaption>
              <span className="mono">Fig. {pad2(index + 1)}</span>
              <span>{project.render === "cad" ? "CAD model" : "Finished part"}</span>
            </figcaption>
          </figure>

          <div className={styles.info}>
            <span className={`mono ${styles.no}`}>
              {pad2(index + 1)} / {pad2(projects.length)}
            </span>
            <h3 id={`project-${project.id}`} className={styles.title}>
              {project.title}
            </h3>
            {reduction !== null ? (
              <p className={styles.reduction}>
                <span className="mono">{reduction}%</span> of the billet machined away
              </p>
            ) : null}
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
      </div>
    </li>
  )
}
