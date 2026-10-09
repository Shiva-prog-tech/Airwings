export const site = {
  name: "Airwing Technologies",
  legalName: "Airwing Technologies",
  tagline: "Shaping the Future of Aerospace",
  motto: "Wings Beyond Limits",
  description:
    "Precision aerospace and defence machining in Peenya, Bengaluru. ISO 9001:2015 certified CNC milling, turning, design and CMM inspection for HAL, Indo-MIM and MANN+HUMMEL.",
  url: "https://www.airwingtechnologies.com",
  founded: 2022,
  certification: "ISO 9001:2015",
  registration: "MSME registered",
  gstin: "29ABPFA1825P1ZT",
  email: "airwingtechnologies@gmail.com",
  phones: [
    { display: "+91 81477 76954", href: "tel:+918147776954" },
    { display: "+91 87480 55511", href: "tel:+918748055511" },
  ],
  address: {
    street: "#47, 5th Cross, Thigalarapalya Main Road, Balaji Nagar",
    area: "Peenya Industrial Estate, Peenya 2nd Stage",
    city: "Bengaluru",
    region: "Karnataka",
    postalCode: "560058",
    country: "IN",
  },
  // Google Maps search for the address (no API key needed for the embed).
  mapEmbed:
    "https://www.google.com/maps?q=Thigalarapalya+Main+Road+Balaji+Nagar+Peenya+2nd+Stage+Bengaluru+560058&output=embed",
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=Thigalarapalya+Main+Road+Balaji+Nagar+Peenya+2nd+Stage+Bengaluru+560058",
  brochure: "/brochure.pdf",
} as const

export type NavItem = { label: string; href: `#${string}` }

export const nav: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Infrastructure", href: "#infrastructure" },
  { label: "Services", href: "#services" },
  { label: "Machinery", href: "#machinery" },
  { label: "Quality", href: "#quality" },
  { label: "Projects", href: "#projects" },
  { label: "Customers", href: "#customers" },
  { label: "Contact", href: "#contact" },
]
