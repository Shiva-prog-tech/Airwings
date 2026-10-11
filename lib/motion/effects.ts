"use client"

// Page-wide scroll effects, driven by data attributes in the markup:
//   [data-reveal="up|down|left|right|fade"] (+ data-reveal-delay)  fade/slide in
//   [data-reveal-group]   direct children stagger in
//   [data-mask]           clip-path wipe up; the inner <img> settles from zoom
//   [data-text-fill]      SplitText lines paint in as they scroll through
//   [data-title]          SplitText lines rise in with a slight 3D tilt
//   [data-speed] / [data-lag]  parallax (ScrollSmoother `effects: true`)
// Hidden start states live in styles/base/_motion.scss under `.has-motion`.
// Call inside a gsap context (useGSAP) so everything reverts together.

import { gsap, ScrollSmoother, ScrollTrigger, SplitText } from "@/lib/motion/gsap"

export function createSmoother() {
  const wrapper = document.querySelector("#smooth-wrapper")
  const content = document.querySelector("#smooth-content")
  if (!wrapper || !content) return null
  return ScrollSmoother.create({
    wrapper,
    content,
    smooth: 1.2,
    effects: true,
    smoothTouch: 0.1,
    ignoreMobileResize: true,
  })
}

const REVEAL_FROM: Record<string, gsap.TweenVars> = {
  up: { y: 48 },
  down: { y: -48 },
  left: { x: -64 },
  right: { x: 64 },
  fade: {},
}

const onEnter = (trigger: Element): ScrollTrigger.Vars => ({
  trigger,
  start: "top 88%",
  once: true,
})

export function animateReveals(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    const from = REVEAL_FROM[el.dataset.reveal ?? "up"] ?? REVEAL_FROM.up
    gsap.fromTo(
      el,
      { ...from, autoAlpha: 0 },
      {
        x: 0,
        y: 0,
        autoAlpha: 1,
        duration: 1.1,
        delay: Number(el.dataset.revealDelay ?? 0),
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: onEnter(el),
      }
    )
  })

  root.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
    gsap.fromTo(
      group.children,
      { y: 40, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: onEnter(group),
      }
    )
  })
}

/** Resolves once `image` has pixels to show (or after `timeout` ms). */
function imageReady(image: HTMLImageElement | null, timeout = 1500) {
  if (!image || (image.complete && image.naturalWidth)) return Promise.resolve()
  return Promise.race([
    image.decode().catch(() => undefined),
    new Promise((resolve) => setTimeout(resolve, timeout)),
  ])
}

export function animateMasks(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>("[data-mask]").forEach((wrap) => {
    const image = wrap.querySelector("img")
    const tl = gsap.timeline({ paused: true })
    tl.fromTo(
      wrap,
      { clipPath: "inset(100% 0% 0% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.2,
        ease: "power3.inOut",
        // Explicit "none" so the pre-paint CSS can't re-hide it.
        onComplete: () => void (wrap.style.clipPath = "none"),
      }
    )
    if (image) tl.fromTo(image, { scale: 1.25 }, { scale: 1, duration: 1.6, ease: "power3.out" }, 0)
    // Play once the real image has loaded, never over the blur placeholder.
    ScrollTrigger.create({
      ...onEnter(wrap),
      onEnter: () => void imageReady(image).then(() => tl.play()),
    })
  })
}

// Line-only splits keep words whole, so screen readers read the lines as-is;
// SplitText's default aria-label isn't allowed on <p> and fails axe.
export function animateTitles(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>("[data-title]").forEach((el) => {
    const split = new SplitText(el, { type: "lines", mask: "lines", aria: "none" })
    gsap.from(split.lines, {
      yPercent: 110,
      duration: 1,
      ease: "power4.out",
      stagger: 0.09,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    })
  })
}

export function animateTextFill(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>("[data-text-fill]").forEach((el) => {
    const split = new SplitText(el, { type: "lines", aria: "none" })
    split.lines.forEach((line) => {
      gsap.to(line, {
        backgroundPositionX: 0,
        ease: "none",
        scrollTrigger: { trigger: line, scrub: 1, start: "top 85%", end: "bottom 55%" },
      })
    })
  })
}
