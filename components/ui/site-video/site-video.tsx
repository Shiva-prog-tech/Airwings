"use client"

import { useEffect, useRef, useState } from "react"

import { useVideoAllowed } from "@/lib/use-video-allowed"
import { cn } from "@/lib/utils"

import styles from "./site-video.module.scss"

export type VideoKey =
  | "hero"
  | "slicer"
  | "turning"
  | "inspection"
  | "milling"
  | "facemill"
  | "toolchange"
  | "drilling"
  | "operator"

/** Keys with a smaller phone encode (public/videos/<key>-mobile.*). */
const HAS_MOBILE: Partial<Record<VideoKey, true>> = { hero: true }

/**
 * Muted, looping background clip from public/videos (see
 * assets/videos/sources.json). The poster is a real <img> so it can be the
 * LCP and so reduced-motion / Save-Data visitors get a still. The video only
 * loads when near the viewport, and pauses when off-screen.
 */
export function SiteVideo({
  name,
  className,
  priority = false,
  alt = "",
  active = true,
}: {
  name: VideoKey
  className?: string
  /** Above the fold: eager poster and start loading right away. */
  priority?: boolean
  /** Decorative by default; stock footage is illustrative. */
  alt?: string
  /** Only play while true (e.g. the current slide of a stack). */
  active?: boolean
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  // Server renders the poster only; the client adds the video if allowed.
  const enabled = useVideoAllowed()
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const wrap = wrapRef.current
    const video = videoRef.current
    if (!enabled || !wrap || !video) return
    if (!active) {
      video.pause()
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.preload !== "auto") {
            video.preload = "auto"
            video.load()
          }
          video.play().catch(() => undefined)
        } else {
          video.pause()
        }
      },
      { rootMargin: "400px 0px" }
    )
    observer.observe(wrap)
    return () => observer.disconnect()
  }, [enabled, active])

  const base = `/videos/${name}`
  return (
    <div ref={wrapRef} className={cn(styles.wrap, className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- pre-built poster, also the LCP */}
      <img
        src={`${base}-poster.webp`}
        alt={alt}
        className={styles.poster}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
      />
      {enabled ? (
        <video
          ref={videoRef}
          className={styles.video}
          data-playing={playing || undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          onPlaying={() => setPlaying(true)}
        >
          {HAS_MOBILE[name] ? (
            <>
              <source src={`${base}-mobile.webm`} type="video/webm" media="(max-width: 767px)" />
              <source src={`${base}-mobile.mp4`} type="video/mp4" media="(max-width: 767px)" />
            </>
          ) : null}
          <source src={`${base}.webm`} type="video/webm" />
          <source src={`${base}.mp4`} type="video/mp4" />
        </video>
      ) : null}
    </div>
  )
}
