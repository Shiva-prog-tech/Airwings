"use client"

import { useEffect, useRef, useState } from "react"

import { useVideoAllowed } from "@/lib/use-video-allowed"
import { cn } from "@/lib/utils"

import styles from "./youtube-background.module.scss"

/**
 * Muted YouTube embed used as a looping background (for footage we may
 * embed but not re-host). It plays only the `start`–`end` window: YouTube's
 * own loop restarts from 0:00, so the frame is remounted at `start` each time
 * the window ends. Mounts only when near the viewport, on the
 * privacy-enhanced domain, and fades in over the poster once loaded.
 * Reduced motion and Save-Data visitors keep the poster only.
 */
export function YouTubeBackground({
  id,
  start = 0,
  end,
  title,
  poster,
  className,
}: {
  id: string
  /** Second the window starts at. */
  start?: number
  /** Second the window ends at; the clip then restarts at `start`. */
  end: number
  /** Accessible title for the frame. */
  title: string
  /** Still shown before load and for reduced motion (YouTube's own thumbnail by default). */
  poster?: string
  className?: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const enabled = useVideoAllowed()
  const [near, setNear] = useState(false)
  const [ready, setReady] = useState(false)
  // Bumped at the end of each window to remount the frame at `start`.
  const [pass, setPass] = useState(0)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!enabled || !wrap) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setNear(true)
        observer.disconnect()
      },
      { rootMargin: "600px 0px" }
    )
    observer.observe(wrap)
    return () => observer.disconnect()
  }, [enabled])

  useEffect(() => {
    if (!enabled || !near) return
    // Load time plus the window, so the restart lands after the clip ends.
    // Hide the remounted frame until its chrome has gone again.
    const timer = window.setTimeout(() => {
      setReady(false)
      setPass((n) => n + 1)
    }, (end - start) * 1000 + 3500)
    return () => window.clearTimeout(timer)
  }, [enabled, near, pass, start, end])

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    disablekb: "1",
    modestbranding: "1",
    playsinline: "1",
    rel: "0",
    iv_load_policy: "3",
    start: String(start),
    end: String(end),
  })

  return (
    <div ref={wrapRef} className={cn(styles.wrap, className)} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element -- remote thumbnail, decorative */}
      <img
        src={poster ?? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
        alt=""
        className={styles.poster}
        loading="lazy"
        decoding="async"
      />
      {enabled && near ? (
        <iframe
          key={pass}
          className={styles.frame}
          data-ready={ready || undefined}
          src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
          title={title}
          tabIndex={-1}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          // The player flashes its chrome and a play glyph for a moment after load.
          onLoad={() => window.setTimeout(() => setReady(true), 3200)}
        />
      ) : null}
    </div>
  )
}
