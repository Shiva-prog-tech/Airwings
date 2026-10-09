/** Join truthy class names. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

/** 1 → "01" — for genuinely sequential items only (process steps, slides). */
export const pad2 = (n: number) => String(n).padStart(2, "0")
