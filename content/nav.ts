export type NavLink = { label: string; href: `#${string}` }

export type NavGroup = {
  label: string
  /** Capability rows in the mega panel, each with a one-line tagline. */
  items: (NavLink & { tagline: string })[]
}

export const navGroups: (NavLink | NavGroup)[] = [
  { label: "About", href: "#about" },
  {
    label: "Capabilities",
    items: [
      { label: "Services", href: "#services", tagline: "Machining, design and drafting, CMM inspection" },
      { label: "Infrastructure", href: "#infrastructure", tagline: "10,000 sq ft facility, 5,500 sq ft shop floor" },
      { label: "Machinery", href: "#machinery", tagline: "BFW milling centres up to 3100 × 1700 × 1000 mm" },
      { label: "Quality", href: "#quality", tagline: "ISO 9001:2015, 16 calibrated instruments" },
    ],
  },
  { label: "Projects", href: "#projects" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
]

/** Flat list for the full-screen menu and the footer. */
export const menuLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Infrastructure", href: "#infrastructure" },
  { label: "Projects", href: "#projects" },
  { label: "Machinery", href: "#machinery" },
  { label: "Quality", href: "#quality" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
]
