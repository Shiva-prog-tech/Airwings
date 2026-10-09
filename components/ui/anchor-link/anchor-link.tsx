"use client"

import type { ComponentProps } from "react"

import { scrollToHash } from "@/lib/motion/gsap"

/**
 * In-page link (#section): smooth-scrolls (instant under reduced motion)
 * and keeps the URL hash in sync.
 */
export function AnchorLink({
  href,
  onClick,
  ...props
}: ComponentProps<"a"> & { href: `#${string}` }) {
  return (
    <a
      href={href}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || event.metaKey || event.ctrlKey) return
        event.preventDefault()
        scrollToHash(href)
      }}
      {...props}
    />
  )
}
