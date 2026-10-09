import { z } from "zod"

/** Vercel caps a function request body at 4.5 MB; leave room for the form fields. */
export const MAX_DRAWING_BYTES = 4 * 1024 * 1024
export const DRAWING_EXTENSIONS = [".pdf", ".step", ".stp", ".igs", ".iges", ".dwg", ".dxf", ".jpg", ".jpeg", ".png"]

export const rfqSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(100),
  company: z.string().trim().min(1, "Enter your company name.").max(120),
  email: z.email("Enter a valid email address, for example you@company.com."),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s()-]{6,20}$/, "Enter a phone number, for example +91 81477 76954."),
  material: z.string().trim().max(80).optional(),
  quantity: z.string().trim().max(40).optional(),
  details: z
    .string()
    .trim()
    .min(20, "Describe the part in at least 20 characters: what it is, tolerances and deadline.")
    .max(4000, "Keep the description under 4000 characters."),
})

export type RfqInput = z.infer<typeof rfqSchema>
export type RfqField = keyof RfqInput | "drawing"

export type RfqState =
  | { status: "idle" }
  | { status: "success"; name: string }
  | {
      status: "error"
      errors: Partial<Record<RfqField, string>>
      values: Partial<Record<keyof RfqInput, string>>
    }

/** Returns an error message, or null when the (optional) file is acceptable. */
export function checkDrawing(file: File | null): string | null {
  if (!file || file.size === 0) return null
  if (file.size > MAX_DRAWING_BYTES) return "Attach a file up to 4 MB, or email larger drawings to us."
  const name = file.name.toLowerCase()
  if (!DRAWING_EXTENSIONS.some((ext) => name.endsWith(ext)))
    return "Attach a PDF, STEP, IGES, DWG, DXF or image file."
  return null
}
