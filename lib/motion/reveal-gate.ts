// Scroll reveals (MotionRoot) wait on this gate so they play as the page
// appears, not behind the preloader covering it.

let gate: Promise<void> = Promise.resolve()
let release: (() => void) | null = null

/** Close the gate until `releaseReveals()` (or a 4s fail-safe). */
export function holdReveals() {
  release?.()
  gate = new Promise<void>((resolve) => {
    const timer = window.setTimeout(resolve, 4000)
    release = () => {
      window.clearTimeout(timer)
      release = null
      resolve()
    }
  })
}

export function releaseReveals() {
  release?.()
}

export function revealsReady() {
  return gate
}

// First load: the preloader is showing, so start held.
if (typeof document !== "undefined" && document.documentElement.classList.contains("has-motion")) {
  holdReveals()
}
