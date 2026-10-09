import type { ImageKey } from "@/content/images"

export type Machine = {
  id: string
  name: string
  make: string
  model?: string
  capacity?: string
  quantity: number
  image?: ImageKey
}

// Brochure list (quantities) with the website's model names; see docs/info.md.
export const machines: Machine[] = [
  { id: "bmv50", name: "Vertical milling centre", make: "BFW", model: "BMV-50 TC24", capacity: "850 × 510 × 510", quantity: 3, image: "machine-bmv50" },
  { id: "bmv65", name: "Vertical milling centre", make: "BFW", model: "BMV-65 TC24", capacity: "1500 × 710 × 700", quantity: 1, image: "machine-bmv65" },
  { id: "virat1530", name: "Double column milling centre", make: "BFW", model: "VIRAT-1530", capacity: "3100 × 1700 × 1000", quantity: 1, image: "machine-virat1530" },
  { id: "xtron544", name: "Vertical milling centre", make: "BFW", model: "XTRON-544", capacity: "500 × 400 × 400", quantity: 1, image: "machine-xtron544" },
  { id: "challenger200", name: "Turning centre", make: "MAC POWER", model: "CHALLENGER-200", capacity: "500 × 280", quantity: 1, image: "machine-macpower" },
  { id: "tl20", name: "Turning centre", make: "LOKESH MACHINES", model: "TL-20", capacity: "300 × 250", quantity: 1, image: "machine-lokesh" },
  { id: "itco", name: "Drilling machine", make: "ITCO", model: "19 mm", quantity: 1, image: "machine-itco" },
  { id: "grinder", name: "Bench grinding machine", make: "STANLEY", quantity: 1 },
  { id: "stacker", name: "Stacker (forklift), 2000 kg", make: "Newgen", quantity: 1, image: "machine-stacker" },
]

export type Instrument = {
  name: string
  range: string
  leastCount: string
  make: string
}

export const instruments: Instrument[] = [
  { name: "Digital vernier", range: "0–200 mm", leastCount: "0.01 mm", make: "Mitutoyo" },
  { name: "Dial vernier", range: "0–300 mm", leastCount: "0.01 mm", make: "Mitutoyo" },
  { name: "Vernier caliper", range: "0–200 mm", leastCount: "0.01 mm", make: "Mitutoyo" },
  { name: "Digital height gauge", range: "0–600 mm", leastCount: "0.001 mm", make: "Mitutoyo" },
  { name: "Digital micrometer", range: "0–25 mm", leastCount: "0.001 mm", make: "Mitutoyo" },
  { name: "Micrometer", range: "0–25 mm", leastCount: "0.01 mm", make: "Mitutoyo" },
  { name: "Micrometer", range: "25–50 mm", leastCount: "0.01 mm", make: "Mitutoyo" },
  { name: "Dial stand", range: "1 set", leastCount: "—", make: "Dasaqua" },
  { name: "Dial indicator", range: "—", leastCount: "0.01 mm", make: "Mitutoyo" },
  { name: "Dial indicator", range: "—", leastCount: "0.002 mm", make: "Mitutoyo" },
  { name: "Slip gauge set", range: "1.005–100 mm", leastCount: "0.005 mm", make: "Jefuji" },
  { name: "Bore gauge set", range: "10–60 mm", leastCount: "0.001 mm", make: "Mitutoyo" },
  { name: "V blocks", range: "0–150 mm", leastCount: "—", make: "Mitutoyo" },
  { name: "Pin gauge set", range: "1–12 mm", leastCount: "0.01 mm", make: "AIK" },
  { name: "Surface table", range: "2000 × 1000 × 200 mm", leastCount: "0.006 mm", make: "MI & S" },
  { name: "Height master", range: "0–765 mm", leastCount: "0.001 mm", make: "TESA" },
]
