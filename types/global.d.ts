import "react"

declare global {
  interface Window {
    /** Set by MotionRoot once scroll effects are wired (see app/layout.tsx). */
    __motionReady?: boolean
  }
}

// Allow CSS custom properties (e.g. `--gap`) in `style` without casts.
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined
  }
}
