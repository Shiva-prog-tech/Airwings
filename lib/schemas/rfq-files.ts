// Upload rules shared by the form (client) and the Server Action. Kept apart
// from rfq.ts so the browser bundle doesn't pull in zod.

/** Vercel caps a function request body at 4.5 MB; leave room for the form fields. */
export const MAX_DRAWING_BYTES = 4 * 1024 * 1024
export const DRAWING_EXTENSIONS = [".pdf", ".step", ".stp", ".igs", ".iges", ".dwg", ".dxf", ".jpg", ".jpeg", ".png"]

/** Returns an error message, or null when the (optional) file is acceptable. */
export function checkDrawing(file: File | null): string | null {
  if (!file || file.size === 0) return null
  if (file.size > MAX_DRAWING_BYTES) return "Attach a file up to 4 MB, or email larger drawings to us."
  const name = file.name.toLowerCase()
  if (!DRAWING_EXTENSIONS.some((ext) => name.endsWith(ext)))
    return "Attach a PDF, STEP, IGES, DWG, DXF or image file."
  return null
}
