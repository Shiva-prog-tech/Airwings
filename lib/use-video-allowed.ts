"use client"

import { useSyncExternalStore } from "react"

const REDUCED = "(prefers-reduced-motion: reduce)"

function subscribe(onChange: () => void) {
  const query = window.matchMedia(REDUCED)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

function videoAllowed() {
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
  return !window.matchMedia(REDUCED).matches && !saveData
}

const serverSnapshot = () => false

/** Background video is allowed unless reduced motion or Save-Data is on (false on the server). */
export function useVideoAllowed() {
  return useSyncExternalStore(subscribe, videoAllowed, serverSnapshot)
}
