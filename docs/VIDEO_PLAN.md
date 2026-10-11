# Video plan (free stock)

**Goal:** add motion footage that matches what Airwing actually does: precision **CNC milling and turning of aluminium and titanium aerospace parts, then measuring them**. Nothing that suggests a different business.

## 1. What fits, and what doesn't

| ✅ Use | ❌ Avoid |
|---|---|
| CNC milling close-ups, coolant spray, chips flying off aluminium | Rocket launches. Airwing supplies parts and doesn't build or launch rockets, so it would mislead. |
| Lathe / turning centre cutting metal | Laser or plasma cutting. Not their process. |
| Calipers, micrometers, height gauge measuring a machined part | Welding, sparks, foundries, textile "QC" |
| Aero-engine / turbine close-ups (the industry they serve), used only as mood | Footage with readable competitor brand names, or people shown as "our team" |

**Honesty rule:**
- Stock clips are illustrative. Captions never say "our shop floor" over stock footage.
- The client's own BFW/MAC POWER footage, even 30–60 s phone clips of the machines running, beats any stock clip. Ask them for it.

## 2. Licence

Pexels (primary), Pixabay (backup):
- **Free for commercial websites, no attribution required, edits allowed.**
- Not allowed: implying a person or brand in the clip endorses Airwing, redistributing the raw files as stock, or using a clip in a logo or trademark.
- We record each clip's source URL in `assets/videos/sources.json`.

## 3. Where videos go

| Spot | Change | Candidate clips (Pexels unless noted) |
|---|---|---|
| **Hero** | Becomes a **full-screen video background**: CNC milling with coolant, slow and dark-graded, headline in white over a scrim. **The image pill in the headline is removed.** The current shop photo stays as the poster and LCP image. | `cnc-machine-tool-cutting-metal-with-coolant-spray-5998850`, `precision-metal-milling-in-workshop-31801781`, `high-precision-cnc-machine-operation-31751330`, `aluminium-automatic-machinery-drill-cnc-18883365` |
| **Projects slicer** | One looping machining clip runs **full-screen behind the sheets**, darkened. Each part stays a real photo or CAD render in a framed card on top. The parts are Airwing's real work, so they aren't replaced by stock footage. | `cnc-milling-machine-in-operation-with-operator-31474685`, `a-machine-is-cutting-metal-with-a-metal-cutting-tool-9033891`, `precision-cnc-machine-metalworking-process-36591394` |
| **Service rows** (hover thumbnails) | The hover reveal plays a short clip instead of a still. | Machining: `turning-steel-on-a-cnc-machine-19791092`. Inspection: `person-measuring-metal-5846660` / `5846664`. Design: keep the CAD still (no stock clip is truthful here). |
| Optional: Infrastructure | Muted aero-engine close-up behind the stats, as industry mood only | `close-up-view-of-turbofan-engine-on-runway-32208738` |

Backup sources: Pixabay `drill-milling-manufacturing-machine-80356` (4K) and `machine-drill-steel-cnc-80355` (4K).

## 4. Technical spec

- **Encoding (ffmpeg, available locally):**
  - Trimmed to a seamless 8–12 s loop with no audio.
  - Graded to the Shop floor palette: slight desaturation and cool steel tint.
  - Hero 1920 px wide, others 1280 px.
  - **WebM (AV1/VP9) + MP4 (H.264)** fallback.
  - Size targets: hero ≤ 2.5 MB, others ≤ 1.5 MB each.
- **Markup:** `<video muted loop playsinline autoplay preload="none" poster>` in a new `ui/site-video` component.
  - Lazy-loads when near the viewport and pauses off-screen (IntersectionObserver).
- **Fallbacks:**
  - **Reduced motion** or **Save-Data**: poster image only, no video.
  - Phones get a 720 px encode.
- **Performance:** the poster image stays the LCP, so Lighthouse doesn't regress.

## 5. Steps

1. Download low-res previews of the candidates into the scratchpad and make a frame contact sheet so we can see what each clip actually shows.
2. You or the client pick one clip per spot.
3. Download the full-res originals and encode the loops into `public/videos/`.
4. Build `SiteVideo` and wire up the hero (remove the pill), the slicer background and the service rows.
5. Screenshot at 1440 and 390, check page weight, then `pnpm build`.
