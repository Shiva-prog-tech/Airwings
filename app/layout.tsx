import type { Metadata, Viewport } from "next"
import { Bebas_Neue, IBM_Plex_Mono, Inter } from "next/font/google"

import "@/styles/globals.scss"

import { Preloader } from "@/components/layout/preloader/preloader"
import { ScrollProgress } from "@/components/layout/scroll-progress/scroll-progress"
import { site } from "@/content/site"
import { MotionRoot } from "@/lib/motion/motion-root"
import { organizationJsonLd } from "@/lib/seo"

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} | Precision aerospace and defence machining, Bengaluru`,
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    locale: "en_IN",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: "#e8eaed",
}

// Runs before first paint: turns on the pre-animation states
// (styles/base/_motion.scss) unless reduced motion is requested, and turns
// them off again after 3s if the motion bundle never runs.
const motionBootstrap = `if(!matchMedia("(prefers-reduced-motion: reduce)").matches){var d=document.documentElement;d.classList.add("has-motion");setTimeout(function(){if(!window.__motionReady)d.classList.remove("has-motion")},3000)}`

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      className={[bebas.variable, inter.variable, plexMono.variable].join(" ")}
      // The bootstrap script adds a class before hydration.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <ScrollProgress />
        <Preloader />
        <MotionRoot />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  )
}
