"use client"

import { useActionState, useState } from "react"

import { submitRfq } from "@/app/actions/rfq"
import { Icon } from "@/components/ui/icon/icon"
import { DRAWING_EXTENSIONS, type RfqField, type RfqState } from "@/lib/schemas/rfq"
import { cn } from "@/lib/utils"

import styles from "./contact.module.scss"

const initialState: RfqState = { status: "idle" }

/** Request-for-quote form: Server Action + zod on the server; drawing upload optional. */
export function RfqForm() {
  const [state, formAction, pending] = useActionState(submitRfq, initialState)
  const [fileName, setFileName] = useState("")

  if (state.status === "success") {
    return (
      <div className={styles.success} role="status">
        <span className={styles.successMark} aria-hidden>
          <Icon name="check" />
        </span>
        <h3>Thanks, {state.name}. Your enquiry is in.</h3>
        <p>We will review the details and reply by email or phone with a quote and lead time.</p>
      </div>
    )
  }

  const errors = state.status === "error" ? state.errors : {}
  const values = state.status === "error" ? state.values : {}

  const field = (name: RfqField) => ({
    id: `rfq-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `rfq-${name}-error` : undefined,
  })
  const error = (name: RfqField) =>
    errors[name] ? (
      <span id={`rfq-${name}-error`} className={styles.error}>
        {errors[name]}
      </span>
    ) : null

  return (
    <form action={formAction} className={styles.form} noValidate>
      {/* Honeypot: hidden from people, filled by bots. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className={styles.honeypot} />

      <div className={styles.field}>
        <label htmlFor="rfq-name">Full name</label>
        <input {...field("name")} type="text" autoComplete="name" defaultValue={values.name} required />
        {error("name")}
      </div>
      <div className={styles.field}>
        <label htmlFor="rfq-company">Company</label>
        <input {...field("company")} type="text" autoComplete="organization" defaultValue={values.company} required />
        {error("company")}
      </div>
      <div className={styles.field}>
        <label htmlFor="rfq-email">Email</label>
        <input
          {...field("email")}
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          defaultValue={values.email}
          required
        />
        {error("email")}
      </div>
      <div className={styles.field}>
        <label htmlFor="rfq-phone">Phone</label>
        <input {...field("phone")} type="tel" inputMode="tel" autoComplete="tel" defaultValue={values.phone} required />
        {error("phone")}
      </div>
      <div className={styles.field}>
        <label htmlFor="rfq-material">
          Material <span className={styles.optional}>(optional)</span>
        </label>
        <input {...field("material")} type="text" placeholder="e.g. Al 7075-T6" defaultValue={values.material} />
        {error("material")}
      </div>
      <div className={styles.field}>
        <label htmlFor="rfq-quantity">
          Quantity <span className={styles.optional}>(optional)</span>
        </label>
        <input {...field("quantity")} type="text" placeholder="e.g. 20 pcs" defaultValue={values.quantity} />
        {error("quantity")}
      </div>
      <div className={cn(styles.field, styles.full)}>
        <label htmlFor="rfq-details">What do you need made?</label>
        <textarea
          {...field("details")}
          rows={5}
          placeholder="Part description, critical tolerances, finish, and when you need it."
          defaultValue={values.details}
          required
        />
        {error("details")}
      </div>
      <div className={cn(styles.field, styles.full)}>
        <span className={styles.labelText} id="rfq-drawing-label">
          Drawing <span className={styles.optional}>(optional, up to 4 MB)</span>
        </span>
        <label className={styles.file} data-has-file={fileName ? "" : undefined}>
          <Icon name="paperclip" />
          <span>{fileName || "Attach PDF, STEP, IGES, DWG, DXF or an image"}</span>
          <input
            {...field("drawing")}
            type="file"
            accept={DRAWING_EXTENSIONS.join(",")}
            aria-labelledby="rfq-drawing-label"
            onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
          />
        </label>
        {error("drawing")}
      </div>

      <div className={cn(styles.full, styles.submitRow)}>
        <button type="submit" className={styles.submit} disabled={pending}>
          {pending ? "Sending…" : "Send enquiry"}
          <Icon name="arrow-right" />
        </button>
        <p className={styles.formStatus} aria-live="polite">
          {state.status === "error" ? "Some fields need attention. Check the messages above." : ""}
        </p>
      </div>
    </form>
  )
}
