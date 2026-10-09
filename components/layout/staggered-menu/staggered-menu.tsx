"use client"

import { useEffect, useRef } from "react"

import { Icon } from "@/components/ui/icon/icon"
import { menuLinks } from "@/content/nav"
import { site } from "@/content/site"
import { gsap, prefersReducedMotion, ScrollSmoother, scrollToHash, useGSAP } from "@/lib/motion/gsap"

import styles from "./staggered-menu.module.scss"

export const MENU_ID = "site-menu"

/** Layers that sweep in ahead of the panel: graphite, then logo indigo. */
const LAYERS = [styles.layerGraphite, styles.layerIndigo]

function resetItems(panel: HTMLElement) {
  gsap.set(panel.querySelectorAll("[data-label]"), { yPercent: 140, rotate: 8 })
  gsap.set(panel.querySelectorAll("[data-item]"), { "--num-opacity": 0 })
  gsap.set(panel.querySelectorAll("[data-fade]"), { y: 24, opacity: 0 })
}

function playOpen(wrap: HTMLElement, panel: HTMLElement) {
  const layers = gsap.utils.toArray<HTMLElement>("[data-layer]", wrap)
  gsap.killTweensOf([...layers, panel])
  resetItems(panel)
  const tl = gsap.timeline({ defaults: { overwrite: "auto" } })
  if (prefersReducedMotion()) {
    tl.set([...layers, panel], { xPercent: 0 })
    tl.set(panel.querySelectorAll("[data-label]"), { yPercent: 0, rotate: 0 })
    tl.set(panel.querySelectorAll("[data-item]"), { "--num-opacity": 1 })
    tl.set(panel.querySelectorAll("[data-fade]"), { y: 0, opacity: 1 })
    return
  }
  layers.forEach((layer, i) => {
    tl.fromTo(layer, { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: "power4.out" }, i * 0.07)
  })
  const panelAt = (layers.length - 1) * 0.07 + 0.08
  tl.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.65, ease: "power4.out" }, panelAt)
  const itemsAt = panelAt + 0.1
  tl.to(panel.querySelectorAll("[data-label]"), { yPercent: 0, rotate: 0, duration: 1, ease: "power4.out", stagger: 0.08 }, itemsAt)
  tl.to(panel.querySelectorAll("[data-item]"), { "--num-opacity": 1, duration: 0.6, stagger: 0.06 }, itemsAt + 0.1)
  tl.to(panel.querySelectorAll("[data-fade]"), { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", stagger: 0.08 }, panelAt + 0.3)
}

function playClose(wrap: HTMLElement, panel: HTMLElement) {
  gsap.to([...gsap.utils.toArray<HTMLElement>("[data-layer]", wrap), panel], {
    xPercent: 100,
    duration: prefersReducedMotion() ? 0 : 0.32,
    ease: "power3.in",
    overwrite: "auto",
    onComplete: () => resetItems(panel),
  })
}

/**
 * Full-screen site menu (after React Bits "Staggered Menu", as in
 * tsfsolodev): coloured layers sweep in, then the panel, then the numbered
 * links rotate up one by one. Controlled by <MenuToggle> in the header.
 */
export function StaggeredMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const mounted = useRef(false)

  useGSAP(
    () => {
      const wrap = wrapRef.current
      const panel = panelRef.current
      if (!wrap || !panel) return
      gsap.set(wrap.querySelectorAll("[data-layer], [data-panel]"), { xPercent: 100 })
      resetItems(panel)
      wrap.dataset.ready = ""
    },
    { scope: wrapRef }
  )

  useEffect(() => {
    const wrap = wrapRef.current
    const panel = panelRef.current
    if (!wrap || !panel) return
    if (!mounted.current) {
      mounted.current = true
      return
    }
    ScrollSmoother.get()?.paused(open)
    if (!open) return playClose(wrap, panel)
    playOpen(wrap, panel)
    const timer = window.setTimeout(() => panel.querySelector<HTMLElement>("a")?.focus(), 250)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  useEffect(() => () => void ScrollSmoother.get()?.paused(false), [])

  // Close first, then scroll once the smoother is running again.
  const go = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault()
    onClose()
    window.setTimeout(() => scrollToHash(href), 120)
  }

  return (
    <div ref={wrapRef} className={styles.wrapper} data-open={open || undefined}>
      <div className={styles.backdrop} onClick={onClose} aria-hidden />
      <div className={styles.layers} aria-hidden>
        {LAYERS.map((layer) => (
          <div key={layer} className={`${styles.layer} ${layer}`} data-layer />
        ))}
      </div>

      <aside id={MENU_ID} ref={panelRef} className={styles.panel} data-panel aria-label="Site menu" inert={!open}>
        <ul className={styles.list}>
          {menuLinks.map((item) => (
            <li key={item.href} className={styles.itemWrap}>
              <a className={styles.item} href={item.href} onClick={(event) => go(event, item.href)} data-item>
                <span className={styles.label} data-label>
                  {item.label}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.contact}>
          <a href="#contact" className={styles.cta} onClick={(event) => go(event, "#contact")} data-fade>
            Request a quote <Icon name="arrow-right" />
          </a>
          <div className={styles.contactLinks} data-fade>
            <a href={site.phones[0].href}>
              <Icon name="phone" /> <span className="mono">{site.phones[0].display}</span>
            </a>
            <a href={`mailto:${site.email}`}>
              <Icon name="mail" /> {site.email}
            </a>
          </div>
          <p className={styles.address} data-fade>
            {site.address.area}, {site.address.city}
          </p>
        </div>
      </aside>
    </div>
  )
}

function animateToggle(button: HTMLButtonElement, opening: boolean) {
  const reduced = prefersReducedMotion()
  gsap.to(button.querySelector("[data-icon]"), {
    rotate: opening ? 225 : 0,
    duration: reduced ? 0 : opening ? 0.8 : 0.35,
    ease: opening ? "power4.out" : "power3.inOut",
    overwrite: "auto",
  })
  // The label rolls through Menu/Close a few times before settling.
  const inner = button.querySelector<HTMLElement>("[data-roll]")
  if (!inner) return
  const lines = inner.children.length
  gsap.to(inner, {
    yPercent: -((opening ? lines - 1 : 0) / lines) * 100,
    duration: reduced ? 0 : 0.5 + lines * 0.07,
    ease: "power4.out",
    overwrite: "auto",
  })
}

/** "Menu" / "Close" text roll with a plus that spins into a cross. */
export function MenuToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const mounted = useRef(false)

  useEffect(() => {
    const button = buttonRef.current
    if (!button) return
    if (!mounted.current) {
      mounted.current = true
      return
    }
    animateToggle(button, open)
  }, [open])

  return (
    <button
      ref={buttonRef}
      type="button"
      className={styles.toggle}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls={MENU_ID}
      onClick={onToggle}
    >
      <span className={styles.toggleText} aria-hidden>
        <span className={styles.toggleRoll} data-roll>
          {["Menu", "Close", "Menu", "Close", "Menu", "Close"].map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </span>
      </span>
      <span className={styles.toggleIcon} data-icon aria-hidden>
        <span />
        <span />
      </span>
    </button>
  )
}
