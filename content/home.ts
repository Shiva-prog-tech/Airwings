import type { ImageKey } from "@/content/images"

export const heroFacts = [
  { label: "Certification", value: "ISO 9001:2015" },
  { label: "Registered", value: "MSME, est. 2022" },
  { label: "Workshop", value: "Peenya, Bengaluru" },
  { label: "Tightest tolerance held", value: "0.02 mm" },
]

/** Giant scrubbed type between Services and Infrastructure. */
export const giantWords = ["Airwing", "Precision engineering"] as const

/** Closing infinite banner (two rows, opposite directions), links to #contact. */
export const bannerLines = ["Have a drawing? Let's machine it", "Request a quote"] as const

export const about = {
  statement:
    "We machine aerospace and special-purpose components, from a CAD file to a measured, certified part, for India's aircraft and engineering programmes.",
  paragraphs: [
    "Airwing Technologies was formed in 2022 and is registered under MSME. The company is run by a team highly skilled in CNC machining, with dedicated tool-room personnel who specialise in designing and manufacturing aerospace components.",
    "Passionate CAM programmers, strict quality control, a state-of-the-art CAD-CAM system and high-precision CNC milling machines take each project from concept to completion. We have spare capacity for new work and we run around the clock.",
  ],
  pillars: [
    {
      title: "Commitment and vision",
      text: "We find timely, accurate solutions to intricate design and tooling problems by investing in new technology, tools and equipment, and by upgrading our people's skills. We are a people-centric organisation that works for the shared success of customers, employees and management, by ethical means and with high integrity.",
    },
    {
      title: "Mission",
      text: "To deliver zero-defect precision machined components for aerospace, avionics and airborne systems with zero wastage, and to reach an INR 10 crore turnover by 2030.",
    },
    {
      title: "Focus",
      text: "Designing and developing new products for the aerospace industry. Supplying sub-assemblies and high-precision components to Indian and overseas customers. Developing high-quality, low-cost export items for engineering applications. Measurement services with a portable height gauge.",
    },
    {
      title: "Quality policy",
      text: "We are committed to total customer satisfaction in quality, delivery and service through state-of-the-art engineering techniques, and to continual improvement in our quality management system, technology, processes and competency.",
    },
    {
      title: "Facility",
      text: "10,000 sq ft of working area with store and fitting facilities, a CAD-CAM room, a quality room and an office. Customer material and components are identified by batch and material grade and stored separately.",
    },
  ],
}

/** Counters under the service rows. */
export const numbers = [
  { value: 10000, unit: "sq ft", label: "Built-up facility", format: "grouped" },
  { value: 0.02, unit: "mm", label: "Tightest position tolerance held" },
  { value: 3.5, unit: "m", label: "Longest part length on our 3-axis machines" },
  { value: 25, unit: "people", label: "Design, CNC, fitting and quality staff" },
] as const

export const infrastructure = {
  statement: "10,000 sq ft built for precision",
  text: "A spacious, modern facility laid out for efficient workflow and large-scale aerospace projects.",
  stats: [
    { value: "10,000 sq ft", label: "Total built-up area", text: "Room for efficient workflow and large-scale projects." },
    { value: "5,500 sq ft", label: "Shop floor", text: "3-axis machines producing parts from small details up to 3.5 m long." },
    { value: "2.1 m", label: "CMM range (being added)", text: "A new coordinate measuring machine is expanding our inspection capacity." },
  ],
  images: ["infrastructure", "machine-bmv65", "qc-surface-table", "hero-engineering"] as const satisfies readonly ImageKey[],
}

export const services = [
  {
    id: "machining",
    title: "Expert machining",
    text: "Parts that need a series of different operations are our speciality. We analyse the design, then manufacture, assemble and deliver the finished product ready for its application.",
    points: ["Multi-operation CNC milling and turning", "Assembly of machined sub-assemblies", "Parts for machine, SPM and fabrication manufacturers"],
    image: "tool-machining",
  },
  {
    id: "design",
    title: "Design and drafting",
    text: "A separate in-house design team designs new products such as components, jigs and fixtures, and prepares production drawings for parts.",
    points: ["Component, jig and fixture design", "Drafting and drawing packages", "Design for manufacture review"],
    image: "tool-weld-jig",
  },
  {
    id: "inspection",
    title: "CMM inspection",
    text: "Every part is checked in a full-fledged quality room with calibrated instruments, and CMM inspection is available when your drawing calls for it.",
    points: ["CMM inspection on request", "Instruments calibrated at approved labs", "Batch and material-grade traceability"],
    image: "cmm-probe",
  },
] as const satisfies readonly {
  id: string
  title: string
  text: string
  points: readonly string[]
  image: ImageKey
}[]

// Derived from the services copy: analyse → program → machine → inspect → deliver.
export const process = [
  { title: "Analyse the design", text: "We study your drawing or model, material and tolerances, and agree how the part will be made." },
  { title: "CAD-CAM programming", text: "Our CAM programmers plan the operations, fixtures and tool paths in-house." },
  { title: "CNC machining", text: "Parts are milled and turned on BFW, MAC POWER and LOKESH machines, around the clock." },
  { title: "Inspection", text: "Every critical dimension is measured with calibrated instruments, plus CMM inspection when required." },
  { title: "Assembly and delivery", text: "Sub-assemblies are fitted, identified by batch and material grade, and delivered on time." },
]
