# Airwing Technologies: Landing Page Revamp Plan

Content source: `docs/info.md`. Images: `public/` (already in this repo).

---

## 1. Verdict: which template?

| | **tsfsolodev** | **Parody (React)** | **wion-reactjs** |
|---|---|---|---|
| What it is | Your Next.js 16 port of Parody Home 1 (TSF client site) | The original licensed template, 7 homes + showcase pages | A creative-agency Vite template |
| Stack fit | ✅ Next App Router, real SCSS, GSAP + `@gsap/react` | ⚠️ Vite + react-router, **doesn't build as shipped** (missing package.json, Bootstrap/spacing CSS, fonts) | ⚠️ Vite; **no SCSS source**, only compiled CSS |
| GSAP quality | ✅ Best: `useGSAP` scoped, `matchMedia` desktop gating, reduced-motion everywhere, ScrollSmoother set up before pins | ⚠️ Good effects, but global `ScrollTrigger.getAll().kill()` and selector-based hooks | ❌ Only 4 effects, global kills, unscoped selectors, pin-spacer CSS hack |
| Best assets | Motion system, image pipeline, zoom collage, stacking panels, cinematic footer, staggered menu, RFQ form | Section **designs**: dark industrial Home 4, poster hero Home 5, hover image-swap list, awards rows, counters | 3 effects: pinned "explode" scene, sticky stacking cards, scroll-progress ring |

**Decision:** use **tsfsolodev as the engineering base** (its `lib/motion`, `components/ui`, layout pieces, image script, Next config). Take **Parody's section layouts** (mainly Homes 2, 4 and 5) and **wion's 3 effects**, all rewritten onto tsf's motion system.

**Leave behind:**
- Bootstrap and Parody's `td-*` spacing utilities. Use our own SCSS grid and tokens instead.
- The 5-font stack and all stock imagery.
- Redux, Swiper, slick and AOS.
- vinext/Cloudflare, unless we deploy there.

---

## 2. Design direction: "Precision Spec Sheet"

Dark aerospace engineering look with blueprint hairlines, spec data set in monospace, and colours taken from the logo.

**Logo colours:** indigo-navy wordmark, saffron/green stripes, tagline **"Wings Beyond Limits"**.

| Token | Value | Use |
|---|---|---|
| `--ink` | `#070B1A` | Page background (deep night navy) |
| `--panel` | `#0E1430` | Cards, bands |
| `--brand` | `#2B2F8F` | Logo indigo: big fills, zoom card |
| `--saffron` | `#F7931E` | **The one accent**: CTAs, active states, tolerance numbers ("use like a scalpel") |
| `--green` | `#1FA44A` | Tiny details only (status dots, "ISO certified" tick) |
| `--steel` | `#9AA3B8` | Body text on dark |
| `--paper` | `#F2F3F7` | Light bands (quality and customer sections) for light↔dark rhythm |
| `--line` | `rgba(255,255,255,.08)` | Blueprint grid / hairlines |

**Type**
- **Teko**: condensed uppercase display, from Parody Home 4. It reads as engineering stencil.
- **Inter**: body text.
- **JetBrains Mono**: every spec value (`0.02 mm`, `Al 7075-T6`, `3100×1700×1000`).
- All three self-hosted via `next/font`.

**Motifs**
- Dashed blueprint grid (tsf `.tsf-pattern-lines`).
- Crosshair corner ticks on images.
- Section indices like `[ 03 / MACHINERY ]`.
- Thin dimension lines with arrows under big numbers, like an engineering drawing.

---

## 3. Page composition (single page, anchor nav)

| # | Section (anchor) | Content (`info.md`) | Built from | Images |
|---|---|---|---|---|
| 0 | **Preloader** | Logo + "Wings Beyond Limits" | tsf `page-transition` pixel dissolve, shortened, first load only | logo |
| 1 | **Header** | Logo, nav, "Request a Quote" pill | tsf `site-header` (hide on scroll down) + `staggered-menu` (anchors via `smoother.scrollTo`) | logo |
| 2 | **Hero** `#top` | "SHAPING THE FUTURE OF AEROSPACE", 4 slide captions | Parody **Home 5 hero** (huge headline, full-bleed `data-speed` parallax image) + tsf `FadeSlides` crossfading the 4 slides with Ken Burns + blueprint grid | `slideshow/*` |
| 3 | **Credential ticker** | ISO 9001:2015 · MSME · Est. 2022 · Peenya, Bengaluru · Aerospace · Defence | tsf `TextMarquee` | none |
| 4 | **About** `#about` | About copy as a scroll text-fill statement, then Vision / Mission / Focus / Quality Policy / Facility | tsf `.td-text-invert` line fill with inline image chips, plus Parody **Home 5 Awards rows** as the accordion | `about`, `pai/*` |
| 5 | **Numbers** | 10,000 sq ft · 5,500 sq ft shop floor · 0.02 mm · 3.5 m · 11 machines · 25 people | Parody **Home 4 Counter** layout (`01–04` indices) + tsf `StatCounter`, with dimension-line motif | none |
| 6 | **Infrastructure** `#infrastructure` | Facility statement + 3 stat cards (built-up area, shop floor, CMM 2.1 m) | wion **pinned "explode" scene**: 4 photos fly to the corners while the centre statement scales in. Rewritten in `useGSAP`, desktop only | `infrastructure`, `machines/m1,m4`, `cmmtypeshi/cmm` |
| 7 | **Services** `#services` | Expert Machining · Design & Drafting · CMM Inspection | tsf **`service-panels`**: full-screen pinned panels stacking over each other | `cmmtypeshi/*` |
| 8 | **Machinery** `#machinery` | 11 machines (make, model, capacity in mono) | Parody **Home 2 hover list**: hovering a row swaps the large photo on the left. Phones get a stacked card list | `machines/m1–m8` |
| 9 | **Quality** `#quality` (light band) | 16 instruments table + ISO badge + calibration copy | Parody Awards-row styling on a real `<table>`, rows staggered in with `data-reveal-group` | none |
| 10 | **Projects intro** | "Showcase Projects" | tsf **`ZoomCollage`**: 6 part photos scale out, indigo centre card fills the screen | `products/p1–p6` |
| 11 | **Projects** `#projects` | 7 components + precision gauge, each with a spec sheet (material, raw size, raw→finish weight, tolerances) | wion **sticky stacking cards**, each card laid out like a drawing title-block. Phones get a plain list | `products/p1–p7`, gauge = `p12` |
| 12 | **Tooling wall** | 8 tooling types | Parody **Home 2 dual opposing marquee** (photo + label), pauses on hover | Jobrock moulds `p9` · pipe weld jigs `p10` · vacuum fixtures `p11` · sheet-metal form tools `p8` · checking fixtures `p14` · die moulds `p15` · automotive parts `p16` · CNC machining `p13` |
| 13 | **Process** | Analyse design → CAD/CAM → CNC machining → Inspection → Assembly & delivery (taken from the services copy) | tsf `working-process` with a `usePin` sticky image | `pai/pai2` |
| 14 | **Customers** `#customers` (light band) | 6 customers + descriptions | Parody **Home 7 bordered logo grid**, which looks credible for OEMs. Hover shows the description | `customers/*` |
| 15 | **Leadership** `#team` | 4 Managing Partners, roles, tap-to-call | Typographic cards (no team photos exist): initials monogram, role, phone. Based on the Parody Home 4 team layout | none |
| 16 | **Contact / RFQ** `#contact` | Form (name, company, email, phone, material, qty, message, drawing upload), map, address, phones, email, brochure | tsf `contact-form` + Server Action + zod + honeypot; tsf `contact-map` | none |
| 17 | **Footer** | Giant "AIRWING" wordmark, magnetic pills (Call · Email · Brochure · WhatsApp), address, GSTIN | tsf **`CinematicFooter`** curtain reveal | none |
| | Global | Scroll-progress back-to-top ring, custom cursor (fine pointers only) | wion `scroll-to-top` ring, tsf `custom-cursor` | none |

**Phones (< md):** keep tsf's rule that every pinned scene (6, 7, 10, 11, 13, 17) gets a simple stand-in. Reduced motion means all end states, with no pins.

---

## 4. Code structure

The folder layout, stack and coding rules are defined in [`AGENTS.md`](../AGENTS.md) (§1–§7).

## 5. Build steps

1. **Scaffold:** a fresh Next.js app (same versions as tsf), SCSS, GSAP, `@gsap/react`, zod, sharp. Remove Tailwind, shadcn and genkit.
2. **Foundations:** tokens, typography, grid, then copy `lib/motion` and `components/ui` from tsf and strip the TSF branding.
3. **Content:** convert `info.md` into typed `content/*.ts`.
4. **Images:** run the pipeline on the existing JPEGs, with a cool steel grade instead of tsf's crimson grade.
5. **Sections:** build top to bottom (hero → footer), then add phone stand-ins.
6. **RFQ form:** wire up email delivery.
7. **SEO and finish:** OG image, sitemap, Lighthouse pass (target ≥ 90 / 100 / 100 / 100), `prefers-reduced-motion` check.

---

## 6. Open items

- **Email delivery for the RFQ form:** Resend / SMTP / Formspree.
- **Hosting:** Vercel (plain `next build`) vs Cloudflare (keep vinext).
- **Client confirmation:** AS9100D claim, machine model names, Skyroot/L&T permission, a vector logo, any team photos, a WhatsApp number.


> **Image mapping note:** the old live site paired several product photos with the wrong labels (e.g. its "Precision Gauge" showed a sheet-metal form tool). The mapping above follows what each photo actually shows.
