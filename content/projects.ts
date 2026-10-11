import type { VideoKey } from "@/components/ui/site-video/site-video"
import type { ImageKey } from "@/content/images"

export type Project = {
  id: string
  title: string
  material: string
  /** Raw stock (or finished size for the gauge), in mm. */
  size: string
  sizeLabel: "Raw material" | "Finished size"
  rawWeight?: string
  finishWeight?: string
  weight?: string
  position: string
  profile?: string
  image: ImageKey
  /** Workshop photo of the finished part, or a CAD render (shown as a blueprint scan). */
  render: "photo" | "cad"
  /** Stock machining clip shown in the slider (illustrative, not this part). */
  video: VideoKey
}

export const projects: Project[] = [
  { id: "c1", title: "Ribbed frame", material: "Al 6061-T651", size: "1150 × 700 × 120", sizeLabel: "Raw material", rawWeight: "274 kg", finishWeight: "15 kg", position: "0.05 mm", profile: "0.1 mm", image: "part-1", render: "photo", video: "slicer" },
  { id: "c2", title: "Machined housing", material: "Al 7075-T6", size: "415 × 370 × 110", sizeLabel: "Raw material", rawWeight: "48 kg", finishWeight: "4 kg", position: "0.05 mm", profile: "0.1 mm", image: "part-2", render: "photo", video: "milling" },
  { id: "c3", title: "Titanium arm", material: "Titanium alloy", size: "650 × 180 × 110", sizeLabel: "Raw material", rawWeight: "76 kg", finishWeight: "3.6 kg", position: "0.05 mm", profile: "0.2 mm", image: "part-3", render: "cad", video: "facemill" },
  { id: "c4", title: "Semicircular ribbed panel", material: "Al 7075-T6", size: "950 × 500 × 45", sizeLabel: "Raw material", rawWeight: "60 kg", finishWeight: "2.5 kg", position: "0.05 mm", profile: "0.2 mm", image: "part-4", render: "cad", video: "hero" },
  { id: "c5", title: "Ribbed bracket", material: "Al 7075-T6", size: "1070 × 500 × 45", sizeLabel: "Raw material", rawWeight: "68 kg", finishWeight: "2.7 kg", position: "0.05 mm", profile: "0.2 mm", image: "part-5", render: "cad", video: "toolchange" },
  { id: "c6", title: "Pocketed structural frame", material: "Al 7075-T6", size: "900 × 400 × 130", sizeLabel: "Raw material", rawWeight: "131 kg", finishWeight: "3.95 kg", position: "0.05 mm", profile: "0.2 mm", image: "part-6", render: "cad", video: "drilling" },
  { id: "c7", title: "Tapered ribbed beam", material: "Al 7075-T6", size: "2030 × 650 × 45", sizeLabel: "Raw material", rawWeight: "220 kg", finishWeight: "8.5 kg", position: "0.05 mm", profile: "0.2 mm", image: "part-7", render: "cad", video: "operator" },
  { id: "gauge", title: "Air-filter checking gauge", material: "Al 6082-T6", size: "2000 × 1000 × 205", sizeLabel: "Finished size", weight: "127 kg", position: "0.02 mm", profile: "0.05 mm", image: "gauge", render: "cad", video: "inspection" },
]

export const tooling: { title: string; image: ImageKey }[] = [
  { title: "Jobrock master moulds", image: "tool-jobrock" },
  { title: "Assembly pipe weld jigs", image: "tool-weld-jig" },
  { title: "Vacuum fixtures", image: "tool-vacuum" },
  { title: "Sheet metal form tools", image: "tool-form" },
  { title: "Checking fixtures and gauges", image: "tool-checking" },
  { title: "Die moulds", image: "tool-die" },
  { title: "Automotive CNC parts", image: "tool-automotive" },
  { title: "Medical CNC equipment", image: "tool-machining" },
]
