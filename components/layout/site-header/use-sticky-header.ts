"use client"

import { useEffect, useState } from "react"

/**
 * `scrolled`: the page has scrolled past `solidAfter()` px (header gets its
 * bar); defaults to `offset`.
 * `hidden`: scrolling down past `offset` slides the header away; any upward
 * scroll brings it back. Jitters under `threshold` px are ignored.
 */
export function useStickyHeader(offset = 120, threshold = 8, solidAfter?: () => number) {
  const [state, setState] = useState({ scrolled: false, hidden: false })

  useEffect(() => {
    let lastY = window.scrollY
    let frame = 0

    const update = () => {
      frame = 0
      const y = window.scrollY
      const delta = y - lastY
      if (Math.abs(delta) < threshold && y > offset) return
      lastY = y
      const scrolled = y > (solidAfter?.() ?? offset)
      const hidden = scrolled && delta > 0
      setState((prev) =>
        prev.scrolled === scrolled && prev.hidden === hidden ? prev : { scrolled, hidden }
      )
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [offset, threshold, solidAfter])

  return state
}
