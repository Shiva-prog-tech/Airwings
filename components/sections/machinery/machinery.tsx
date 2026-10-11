"use client"

import { useEffect, useRef } from "react"

import { Icon } from "@/components/ui/icon/icon"
import { SiteImage } from "@/components/ui/site-image/site-image"
import { machines, type Machine } from "@/content/machinery"
import { site } from "@/content/site"
import { DESKTOP_MEDIA, gsap, prefersReducedMotion, useGSAP } from "@/lib/motion/gsap"
import { pad2 } from "@/lib/utils"

import styles from "./machinery.module.scss"

type Rect = { x: number; y: number; w: number; h: number }

/** The collage board, in layout units (its CSS aspect ratio is 1.8). */
const BOARD = { w: 1800, h: 1000 }

/** The heading card, centred on the board (its middle is 900, 500). */
const CARD: Rect = { x: 640, y: 345, w: 520, h: 310 }

/**
 * The collage: three staggered columns around the heading card. Every gap is
 * the same 30-unit gutter, so as the camera zooms the spacing grows evenly
 * with the photos; inner edges sit flush with the card, outer edges are left
 * ragged. `speed` scales how fast a tile flies out from (and back to) the
 * card during the zoom, for parallax depth; `cover` fills the tile edge to
 * edge, for photos shot on the shop floor rather than on white.
 */
const SLOTS: Record<string, Rect & { speed: number; cover?: boolean }> = {
  challenger200: { x: 210, y: 70, w: 400, h: 245, speed: 1.15 },
  tl20: { x: 100, y: 345, w: 510, h: 310, speed: 0.95 },
  stacker: { x: 240, y: 685, w: 370, h: 240, speed: 1.1, cover: true },
  bmv65: { x: 640, y: 15, w: 520, h: 300, speed: 0.9, cover: true },
  virat1530: { x: 640, y: 685, w: 520, h: 300, speed: 0.9 },
  bmv50: { x: 1190, y: 110, w: 360, h: 205, speed: 1.2 },
  itco: { x: 1190, y: 345, w: 360, h: 310, speed: 1 },
  xtron544: { x: 1190, y: 685, w: 470, h: 230, speed: 1.1 },
}

const SHOWN = machines.filter((machine) => machine.image && SLOTS[machine.id])

// Every machine on the floor, including any without a photo.
const UNITS = machines.reduce((sum, machine) => sum + machine.quantity, 0)

/** Altitude the drone camera reads out at the top of its climb, in metres. */
const CEILING = 320

/** A board rect as percentage CSS variables (read by .card and .tile). */
const place = ({ x, y, w, h }: Rect) =>
  ({
    "--x": `${(x / BOARD.w) * 100}%`,
    "--y": `${(y / BOARD.h) * 100}%`,
    "--w": `${(w / BOARD.w) * 100}%`,
    "--h": `${(h / BOARD.h) * 100}%`,
  }) as React.CSSProperties

/**
 * A tileable cloud texture: fractal noise turned into white cloud with soft
 * alpha, as an SVG data URI (baked to a bitmap on the client, see
 * bakeClouds). `gain` / `bias` set
 * how much sky shows between the clouds (more gain, thicker cloud); `tint`
 * is the cloud colour (baked in, so no CSS filter has to recolour it live).
 */
const clouds = (seed: number, fx: number, fy: number, gain: number, bias: number, tint = [0.97, 0.96, 0.98]) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'>` +
      `<filter id='c' x='0' y='0' width='100%' height='100%'>` +
      `<feTurbulence type='fractalNoise' baseFrequency='${fx} ${fy}' numOctaves='5' seed='${seed}' stitchTiles='stitch'/>` +
      `<feColorMatrix values='0 0 0 0 ${tint[0]} 0 0 0 0 ${tint[1]} 0 0 0 0 ${tint[2]} ${gain} 0 0 0 ${bias}'/>` +
      `</filter><rect width='100%' height='100%' filter='url(#c)'/></svg>`
  )}`

/** Cloud textures, read by machinery.module.scss through these variables. */
const CLOUD_SOURCES = {
  // High cloud picks up the sky's blue; low cloud is lit warm by the sun.
  "--clouds-far": clouds(4, 0.0026, 0.0085, 1.7, -0.78, [0.74, 0.8, 0.92]),
  "--clouds-near": clouds(11, 0.0034, 0.011, 2.1, -0.9, [1, 0.87, 0.78]),
  "--clouds-thick": clouds(23, 0.003, 0.006, 3, -0.95),
}

const CLOUDS = Object.fromEntries(
  Object.entries(CLOUD_SOURCES).map(([name, src]) => [name, `url("${src}")`])
) as React.CSSProperties

/**
 * Re-draws each cloud SVG once into a plain bitmap. A browser re-runs an SVG
 * noise filter every time the layer showing it changes size, which is every
 * frame while the camera zooms; a bitmap only needs resampling. Resolves to
 * blob URLs keyed like CLOUD_SOURCES (the SVGs stay in place on failure).
 */
async function bakeClouds() {
  const baked: Record<string, string> = {}
  for (const [name, src] of Object.entries(CLOUD_SOURCES)) {
    const image = new Image()
    image.src = src
    await image.decode()
    const canvas = document.createElement("canvas")
    canvas.width = 1200
    canvas.height = 600
    canvas.getContext("2d")?.drawImage(image, 0, 0)
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"))
    if (blob) baked[name] = URL.createObjectURL(blob)
  }
  return baked
}

/**
 * Machinery as a zoom collage (after TSF's "What I build" zoom grid). On
 * desktop the stage pins and opens on the workshop from a drone camera over
 * Google Maps. Scrolling lifts the drone: the map tilts away below as the
 * altitude climbs, cloud rushes past the lens, and it breaks out into a dusk
 * sky with drifting cloud and fog, where "Our machines" surfaces last. Then
 * the camera pulls back and the machine tiles gather in from the edges (each
 * at its own pace) until the collage settles flush around the card. Phones
 * and reduced motion get the sky card and a plain grid.
 */
export function Machinery() {
  const rootRef = useRef<HTMLElement>(null)

  // Swap the cloud SVGs for baked bitmaps once the page is up.
  useEffect(() => {
    const card = rootRef.current?.querySelector<HTMLElement>("[data-card]")
    if (!card) return
    let urls: string[] = []
    let cancelled = false
    bakeClouds()
      .then((baked) => {
        urls = Object.values(baked)
        if (cancelled) return
        for (const [name, url] of Object.entries(baked)) card.style.setProperty(name, `url("${url}")`)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root || prefersReducedMotion()) return
      const mm = gsap.matchMedia()
      mm.add(DESKTOP_MEDIA, () => {
        const stage = root.querySelector<HTMLElement>("[data-stage]")
        const grid = root.querySelector<HTMLElement>("[data-grid]")
        const card = root.querySelector<HTMLElement>("[data-card]")
        const altitude = root.querySelector<HTMLElement>("[data-altitude]")
        if (!stage || !grid || !card) return
        root.dataset.animated = ""
        const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]", grid)
        const puffs = gsap.utils.toArray<HTMLElement>("[data-puff]", card)

        // The card's centre in grid coordinates, at rest (scale 1).
        const origin = () => ({ x: card.offsetLeft + card.offsetWidth / 2, y: card.offsetTop + card.offsetHeight / 2 })
        // Zoomed in, the card covers the whole stage edge to edge, like a
        // camera pushed right up to it; the collage sits off screen around it.
        const zoom = () =>
          Math.max(stage.clientWidth / card.offsetWidth, stage.clientHeight / card.offsetHeight) * 1.02

        // The map renders at the zoomed size and is scaled down into the card,
        // so it is pin-sharp at full zoom. --safe-x / --safe-y are how far the
        // zoomed card overhangs the screen, so the overlays stay in view.
        const syncZoom = () => {
          const z = zoom()
          card.style.setProperty("--zoom", String(z))
          card.style.setProperty("--safe-x", `${Math.max(0, (card.offsetWidth * z - stage.clientWidth) / 2)}px`)
          card.style.setProperty("--safe-y", `${Math.max(0, (card.offsetHeight * z - stage.clientHeight) / 2)}px`)
        }
        syncZoom()

        // On top of the camera zoom, each tile is pushed out along the line
        // from the card's centre through its own, so the collage scatters
        // away far faster than the card grows (and gathers back as it pulls
        // out). Read from data-drift: ScrollSmoother claims data-speed.
        const scatter = (tile: HTMLElement, axis: "x" | "y") => {
          const speed = Number(tile.dataset.drift ?? 1)
          const from =
            axis === "x"
              ? tile.offsetLeft + tile.offsetWidth / 2 - origin().x
              : tile.offsetTop + tile.offsetHeight / 2 - origin().y
          return from * 1.1 * speed
        }

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${window.innerHeight * 2.6}`,
            pin: true,
            // Short lag, so scrolling back up never shows a later beat
            // (sky, cloud) after the section has already come back into view.
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: syncZoom,
          },
        })

        // 1. Drone climb: the map pitches back and drops away below while
        //    the altitude counts up; the location tag clears first.
        const climb = { metres: 0 }
        tl.to("[data-map-ui]", { autoAlpha: 0, duration: 0.06 }, 0.03)
          .fromTo(
            "[data-drone]",
            { scale: 1.12, rotateX: 0, rotateZ: 0, autoAlpha: 1 },
            { scale: 0.52, rotateX: 42, rotateZ: -9, autoAlpha: 0.75, ease: "power1.in", duration: 0.36 },
            0.04
          )
          .to(
            climb,
            {
              metres: CEILING,
              ease: "power1.in",
              duration: 0.38,
              onUpdate: () => {
                if (altitude) altitude.textContent = String(Math.round(climb.metres)).padStart(3, "0")
              },
            },
            0.04
          )
          // 2. Through the cloud: thick banks swell past the lens, the map
          //    goes under them, and they thin out onto open sky.
          .fromTo(
            puffs,
            { autoAlpha: 0, scale: 0.6 },
            { autoAlpha: 1, scale: 1.2, ease: "sine.in", duration: 0.13, stagger: 0.03 },
            0.18
          )
          .to("[data-map]", { autoAlpha: 0, duration: 0.05 }, 0.31)
          .to(puffs, { autoAlpha: 0, scale: 2.4, ease: "sine.out", duration: 0.17, stagger: 0.03 }, 0.32)

        // 3. Camera pulls back out of the sky card; corners round off.
        tl.fromTo(
          grid,
          {
            // Scale about the card's centre, shifted so it sits mid-stage.
            transformOrigin: () => `${origin().x}px ${origin().y}px`,
            x: () => stage.clientWidth / 2 - (grid.offsetLeft + origin().x),
            y: () => stage.clientHeight / 2 - (grid.offsetTop + origin().y),
            scale: zoom,
          },
          // Starts while the last cloud is still clearing, so there is no
          // dead beat between the sky opening up and the camera pulling back.
          { x: 0, y: 0, scale: 1, ease: "power2.inOut", duration: 0.9 },
          0.42
        )
          .fromTo(card, { borderRadius: 0 }, { borderRadius: 28, ease: "power2.in", duration: 0.5 }, 0.42)
          // 4. "Our machines" surfaces last, out of the haze.
          .fromTo(
            "[data-copy]",
            // Opacity, scale and drift only: an animated blur on a layer this
            // large is the costliest thing a browser can be asked to scrub.
            { autoAlpha: 0, scale: 1.1, yPercent: 6 },
            { autoAlpha: 1, scale: 1, yPercent: 0, ease: "power2.out", duration: 0.3 },
            0.46
          )
          // 5. The collage gathers in and settles flush around the card.
          .fromTo(
            tiles,
            { x: (_, tile) => scatter(tile, "x"), y: (_, tile) => scatter(tile, "y") },
            { x: 0, y: 0, ease: "power2.inOut", duration: 0.7 },
            0.62
          )
          // A slight push inside each photo for depth.
          .fromTo(
            tiles.map((tile) => tile.querySelector("[data-tile-image]")),
            { scale: 1.14 },
            { scale: 1, ease: "power2.out", duration: 0.9 },
            0.42
          )
          // A beat at rest before the pin lets go.
          .to({}, { duration: 0.12 })

        return () => {
          delete root.dataset.animated
          for (const name of ["--zoom", "--safe-x", "--safe-y"]) card.style.removeProperty(name)
        }
      })
      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <section ref={rootRef} id="machinery" className={styles.section} aria-labelledby="machinery-title">
      <div className={styles.band}>
        <div data-stage className={styles.stage}>
          <div data-grid className={styles.grid}>
            <div data-card className={styles.card} style={{ ...place(CARD), ...CLOUDS }}>
              {/* Dusk sky: low sun, two drifting cloud decks and a fog bank. */}
              <div className={styles.sky} aria-hidden>
                <span className={styles.sun} />
                <span className={`${styles.deck} ${styles.deckFar}`} />
                <span className={`${styles.deck} ${styles.deckNear}`} />
                <span className={styles.fogBank} />
              </div>

              <div data-copy className={styles.copy}>
                <span className={`mono ${styles.code}`}>Machinery · Peenya, Bengaluru</span>
                <h2 id="machinery-title" className={styles.title}>
                  Our
                  <br />
                  machines
                </h2>
                <p className={`mono ${styles.tally}`}>
                  <span>{UNITS} machines</span>
                  <span aria-hidden>·</span>
                  <span>Up to 3100 × 1700 × 1000 mm</span>
                </p>
              </div>

              {/* The workshop from a drone camera (desktop zoom only). */}
              <div data-map className={styles.map}>
                <div className={styles.mapInner}>
                  <div data-drone className={styles.drone}>
                    <iframe
                      src={site.mapEmbed}
                      title="Map showing the Airwing Technologies workshop in Peenya, Bengaluru"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      tabIndex={-1}
                    />
                  </div>

                  {/* Crosshair on the workshop pin (the map centres on it). */}
                  <span className={styles.crosshair} aria-hidden />

                  {/* Drone camera overlay. */}
                  <div className={styles.hud} aria-hidden>
                    <span className={styles.frame} />
                    <span className={`mono ${styles.readout} ${styles.readoutTop}`}>
                      <span className={styles.rec}>Rec</span>
                      <span>Cam 01 · 4K</span>
                    </span>
                    <span className={`mono ${styles.readout} ${styles.readoutSide}`}>
                      <span>
                        Alt <b data-altitude>000</b> m
                      </span>
                      <span>13.03° N · 77.52° E</span>
                    </span>
                  </div>

                  <div data-map-ui className={styles.mapUi}>
                    <div className={styles.mapTag}>
                      <span className={styles.pin} aria-hidden />
                      <span className={styles.mapText}>
                        <strong>Airwing Technologies</strong>
                        <span>Peenya Industrial Estate, Bengaluru 560058</span>
                      </span>
                      <a href={site.mapLink} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
                        Open in Maps
                        <Icon name="arrow-up-right" />
                      </a>
                    </div>
                    <span className={`mono ${styles.scrollHint}`} aria-hidden>
                      Scroll to take off
                    </span>
                  </div>
                </div>
              </div>

              {/* Cloud banks the drone climbs through (desktop zoom only). */}
              <div className={styles.puffs} aria-hidden>
                <span data-puff className={styles.puff} />
                <span data-puff className={styles.puff} />
                <span data-puff className={styles.puff} />
              </div>
            </div>

            {SHOWN.map((machine, i) => (
              <MachineTile key={machine.id} machine={machine} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function MachineTile({ machine, index }: { machine: Machine; index: number }) {
  const slot = SLOTS[machine.id]
  return (
    <figure
      data-tile
      data-drift={slot.speed}
      data-cover={slot.cover || undefined}
      className={styles.tile}
      style={place(slot)}
    >
      <div data-tile-image className={styles.photo}>
        <SiteImage
          name={machine.image!}
          sizes="(min-width: 992px) 30vw, (min-width: 576px) 45vw, 90vw"
          placeholder={false}
        />
      </div>
      <span className={`mono ${styles.index}`}>M-{pad2(index + 1)}</span>
      {machine.quantity > 1 ? <span className={`mono ${styles.qty}`}>× {machine.quantity}</span> : null}
      <figcaption className={styles.label}>
        <span className={styles.labelText}>
          <span className={styles.make}>
            {machine.make} {machine.model}
          </span>
          <span className={styles.kind}>{machine.name}</span>
        </span>
        {machine.capacity ? <span className={`mono ${styles.capacity}`}>{machine.capacity}</span> : null}
      </figcaption>
    </figure>
  )
}
