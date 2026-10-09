# Airwing Technologies — Revamp Plan v2

v2 goals:
- Parody landing page as the base.
- tsfsolodev's menus.
- Smooth scrolling and parallax.
- wion's infinite banner at the end.
- A colour system that doesn't read as generated.

Supersedes the section map in `REVAMP_PLAN.md`; `AGENTS.md` is updated to match once approved.

---

## 1. Template audit (all checked running, 2026-10-09)

Parody ships without `package.json`, a Vite config or its CSS bundle. I rebuilt a preview copy in the scratchpad: Bootstrap, animate.css and free Font Awesome from npm, plus the spacing CSS that tsfsolodev recovered. Every page rendered with no console errors.

| Page | Look | Fit for Airwing | Take |
|---|---|---|---|
| **Home 1 "Design Studio"** (`/`) | Light canvas, huge 3-line headline with inline image chips, giant word marquee, dark project band, italic serif accents | ★★★ Backbone. tsfsolodev already ports it to Next 16 | Hero, intro, service rows, working process, CTA rhythm |
| Home 2 "Startup" | Light, gradient hero, 4-col counters, numbered process cards, FAQ | ★★ | Counter row, hover image-swap list, dual photo marquee |
| Home 3 "Digital studio" | Lime green, editorial serif, S/01 service grid | ★ | — |
| **Home 4 "Creative agency"** | Dark green, Teko condensed, showcase slider, awards, team 4-up | ★★★ Most technical feel | Counter strip with indices, showcase slider, team grid |
| **Home 5 "Bebas"** | Grey paper texture, Bebas, giant parallax image, awards rows | ★★★ | Full-bleed parallax image, awards rows → instrument table |
| Home 6 "Digital marketing" | Teal, inline video in headline, numbered outline portfolio, pricing | ★★ | Scroll text-fill titles, outlined giant numbers |
| Home 7 "Personal" | Brown/serif, luxury | ✗ | — |
| Full-screen slicer / Showcase carousel / Portfolio showcase / Interactive links | Single-screen galleries | ★ | Interactive-links hover list idea for machinery |

| Other source | Take |
|---|---|
| **tsfsolodev** | `StaggeredMenu` (full-screen menu, colour pre-layers, Menu/Close roll), `SiteNav` (Base UI Navigation Menu, the shadcn menu, with a mega panel), ScrollSmoother setup, `data-speed` parallax, zoom collage, stacking panels, pixel preloader, custom cursor, cinematic footer, contact Server Action |
| **wion-reactjs** | **Infinite banner** (two huge opposing text rows above the footer), pinned "explode" scene, scroll-progress ring |

---

## 2. Smooth scrolling: ScrollSmoother is back, done properly

v1 dropped ScrollSmoother because it breaks CSS `position: sticky`. v2 brings it back and replaces every sticky layout with **ScrollTrigger pins**, as tsfsolodev does:

| Element | v1 (CSS sticky) | v2 (ScrollSmoother-safe) |
|---|---|---|
| Service panels | `position: sticky` | Per-panel `pin` + `pinSpacing:false` + `endTrigger` (tsf `service-panels`) |
| Project sheets | sticky stack | Same pin pattern, each sheet offset 14 px |
| Machinery photo viewer | sticky | `usePin` (tsf) |
| Quality aside | sticky | `usePin` |
| Process photo | `usePin` | unchanged |

Smoother settings:
- `smooth: 1.2`, `effects: true`, `smoothTouch: 0.1`.
- Header, menu, preloader, cursor and scroll ring sit **outside** `#smooth-wrapper`.
- Anchor links go through `smoother.scrollTo(el, true, "top 80px")`.
- The menu pauses the smoother while open.
- Reduced motion → no smoother, native scroll, no pins.

## 3. Parallax (Parody / tsf style)

- `data-speed` on images via ScrollSmoother `effects`:
  - Hero full-bleed photo (`0.8`).
  - Intro images (`0.9` / `1.1`).
  - Infrastructure photos.
  - Process photo.
- `data-lag` on decorative shapes (the spinning gear mark).
- Image mask reveals (`data-mask`) on every framed photo; scroll text-fill on section statements.

## 4. Menus (from tsfsolodev)

- **Desktop header** (tsf "inner" variant):
  - Logo, then `SiteNav`, then the "Request a quote" pill and the `MenuToggle`.
  - Hides on scroll down, returns on scroll up.
- **`SiteNav`**: the Base UI Navigation Menu, styled like shadcn (adds `@base-ui/react`).
  - Links: About · **Capabilities ▾** · Projects · Customers · Contact.
  - The Capabilities mega panel holds a brand-colour feature card ("Request a quote") and four rows with one-line taglines:
    - Services
    - Machinery
    - Quality
    - Infrastructure
- **`StaggeredMenu`**: the full-screen menu on every size, opened by `MenuToggle`.
  - Two pre-layers sweep in, then the numbered links rotate up, then the contact block fades in.
  - It closes on Escape, a backdrop click or a link click, and uses `inert`.
- On phones the header is just the logo and the toggle.

## 5. Page composition: Parody "Digital Agency" (Home 5) backbone + Full Screen Slicer

**Decided 2026-10-09:**
- Base: **Home 5 "Digital Agency"** with the **Full Screen Slicer** for projects.
- Palette: **Shop floor**.

| # | Section | Built from | Content |
|---|---|---|---|
| 0 | Preloader | tsf pixel transition (first load only) | Logo, "Wings Beyond Limits" |
| 1 | Header + menus | tsf `SiteHeader` (inner), `SiteNav` (Base UI / shadcn menu, Capabilities mega panel), `StaggeredMenu` | — |
| 2 | **Hero** | **Home 5 hero**: huge condensed 3-line headline with an inline rounded image pill, round "Request a quote" button, then a **full-bleed parallax photo** (`data-speed`) | "Precision [pill] parts / for aerospace / and defence" + real shop-floor photo |
| 3 | About | Home 5 about: centred scroll-filled statement, round "Explore" button, two image reveals at the sides | About copy |
| 4 | Customers strip | Home 5 brand row (logos under the about block) | 6 customer logos |
| 5 | Services | Home 5 service rows (number · title · thumbnail on the right) + counters | 3 services + 10,000 sq ft · 0.02 mm · 3.5 m · 25 people |
| 6 | Giant word band | Home 5 giant "PARODY" / "INNOVATION CULTURE" type, scrubbed horizontally | "AIRWING" / "PRECISION ENGINEERING" |
| 7 | Infrastructure | wion pinned "explode" scene (in place of Home 5's video block; there's no video) | Statement + 3 facility stats |
| 8 | **Projects** | **Full Screen Slicer**: a pinned full-screen section where scrolling (or drag / arrows) moves through the parts one at a time with the creative slide effect. Title in giant condensed type, spec block in mono. Phones: swipeable full-width cards | 8 parts with specs |
| 9 | Machinery | Home 2 hover-swap list, pinned photo | 9 machines |
| 10 | Quality | **Home 5 awards rows** → instrument rows (qty-style index · instrument · range · least count · make) + ISO badge | 16 instruments |
| 11 | Process | Home 1 process rows + pinned photo | 5 real steps |
| 12 | Tooling | Home 2 dual opposing photo marquee | 8 tooling types |
| 13 | Team | Home 5 "Introducing … team" layout with monogram cards (no photos exist) | 4 partners + workforce |
| 14 | Contact / RFQ | tsf contact form + map | Form, phones, email, map |
| 15 | **Infinite banner** | **wion FooterOne**: two huge text rows running in opposite directions, the band links to #contact. Rebuilt on our GSAP `Marquee` (no slick) | "Have a drawing? Let's machine it ✦ Request a quote" |
| 16 | Footer | tsf cinematic footer, dark graphite like Home 5's footer | NAP, GSTIN, brochure |

Phones get tsf-style stand-ins for every pinned scene.

## 6. Colour: grounded in the shop, not generated

What reads as AI-made, and what v1 did:
- A single neon accent on near-black.
- Cream with terracotta.
- Navy with orange.

v1's navy + saffron was squarely the third. v2 takes colour from **what's physically in Airwing's photos**:
- Machined aluminium.
- Graphite machine castings.
- BFW's signature red-orange machine doors.
- The logo's indigo.

See §8 for the options. Rules:
- **Light-first** canvas (as Parody Home 1), with **graphite** dark bands rather than navy.
- Indigo for big brand moments only: zoom card, menu layer, mega-panel card.
- One small hot accent, used only for CTAs and key tolerances.

## 7. Type

- **Bebas Neue** for display (Home 5's face): condensed, uppercase, poster scale.
- **Inter** for body.
- **IBM Plex Mono** for every measured value.
- All are self-hosted via `next/font`.
- Drop single-word colour/italic highlights inside headlines (a template tell).

## 8. Decisions (made)

1. **Palette: Shop floor.**

   | Token | Hex | Role |
   |---|---|---|
   | canvas | `#E8EAED` | Machined-aluminium page |
   | ink | `#16181C` | Graphite text and dark bands |
   | steel | `#7C838E` | Secondary text and hairlines |
   | indigo | `#2E3192` | Logo indigo, for big brand moments only |
   | signal | `#E4572E` | BFW machine-door red-orange: CTAs and key tolerances only |

2. **Base: Parody Home 5 "Digital Agency" + Full Screen Slicer.**

## 9. Build order

1. Tokens, fonts, ScrollSmoother and pins in `lib/motion`; port `SiteNav`, `StaggeredMenu` and `MenuToggle` (+ `@base-ui/react`).
2. Hero, about, customer strip, services and giant word band (Home 5 rhythm).
3. Infrastructure, Full Screen Slicer projects and machinery (pins under the smoother).
4. Quality, process, tooling, customers, team and contact.
5. Infinite banner, cinematic footer and preloader.
6. Phone stand-ins, reduced-motion pass, screenshots at 375/768/1440, then `simplify` + `code-review` + `pnpm build`.
