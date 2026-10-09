"use server"

import { z } from "zod"

import { checkDrawing, rfqSchema, type RfqField, type RfqInput, type RfqState } from "@/lib/schemas/rfq"

const FIELDS: (keyof RfqInput)[] = ["name", "company", "email", "phone", "material", "quantity", "details"]

export async function submitRfq(_prev: RfqState, formData: FormData): Promise<RfqState> {
  // Honeypot: bots fill hidden fields. Pretend success.
  if (formData.get("website")) return { status: "success", name: "there" }

  const raw = Object.fromEntries(
    FIELDS.map((field) => [field, String(formData.get(field) ?? "")])
  ) as Record<keyof RfqInput, string>

  const drawing = formData.get("drawing")
  const file = drawing instanceof File ? drawing : null
  const drawingError = checkDrawing(file)

  const result = rfqSchema.safeParse(raw)
  if (!result.success || drawingError) {
    const errors: Partial<Record<RfqField, string>> = {}
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors as Partial<Record<keyof RfqInput, string[]>>
      for (const field of FIELDS) {
        const message = fieldErrors[field]?.[0]
        if (message) errors[field] = message
      }
    }
    if (drawingError) errors.drawing = drawingError
    return { status: "error", errors, values: raw }
  }

  // TODO(client): choose email delivery (Resend / SMTP) and send the enquiry
  // with the drawing attached. Until then it is only logged on the server.
  console.info("[rfq] enquiry received", {
    ...result.data,
    details: `${result.data.details.slice(0, 80)}…`,
    drawing: file && file.size ? `${file.name} (${file.size} bytes)` : null,
  })

  return { status: "success", name: result.data.name.split(" ")[0] }
}
