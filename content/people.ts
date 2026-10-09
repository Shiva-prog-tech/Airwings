import type { ImageKey } from "@/content/images"

export type Customer = {
  id: string
  name: string
  division?: string
  logo: ImageKey
}

// Names only: the old site's descriptions were unverified marketing copy.
// Skyroot and L&T are on the current website but not in the brochure;
// confirm logo permission with the client (docs/info.md).
export const customers: Customer[] = [
  { id: "hal-lca", name: "Hindustan Aeronautics Limited", division: "LCA Tejas Division", logo: "logo-hal-lca" },
  { id: "hal-aero", name: "Hindustan Aeronautics Limited", division: "Aerospace Division", logo: "logo-hal-aero" },
  { id: "indomim", name: "Indo-MIM", logo: "logo-indomim" },
  { id: "mann-hummel", name: "MANN+HUMMEL", logo: "logo-mann-hummel" },
  { id: "skyroot", name: "Skyroot Aerospace", logo: "logo-skyroot" },
  { id: "lt", name: "Larsen & Toubro, Coimbatore", logo: "logo-lt" },
]

export type Partner = {
  name: string
  role: string
  phone: { display: string; href: string }
}

export const team: Partner[] = [
  { name: "Arunkumar D.N", role: "Planning and business development", phone: { display: "+91 81477 76954", href: "tel:+918147776954" } },
  { name: "Shivaprasada D.S", role: "Production and projects", phone: { display: "+91 87480 55511", href: "tel:+918748055511" } },
  { name: "Eshwar C.J", role: "Marketing and finance", phone: { display: "+91 97435 40623", href: "tel:+919743540623" } },
  { name: "Vijay A.V", role: "Manufacturing and technical", phone: { display: "+91 93532 14013", href: "tel:+919353214013" } },
]

export const workforce = [
  { role: "CNC operators", count: 8 },
  { role: "Fitters", count: 6 },
  { role: "Quality", count: 4 },
  { role: "CNC programmers", count: 3 },
  { role: "Design and drafting", count: 2 },
  { role: "Office and accounts", count: 1 },
  { role: "Housekeeping", count: 1 },
]
