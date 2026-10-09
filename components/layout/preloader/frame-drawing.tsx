/**
 * Plan view of Airwing's ribbed aerostructure frame (brochure, component 1):
 * raw stock 1150 × 700 × 120 mm in Al 6061-T651, machined to a 4 × 3 pocket
 * grid with ribs, slotted edge walls and bolt holes at the rib crossings.
 * Drawn at 0.4 px/mm. Position tolerance 0.05 mm and profile 0.1 mm are the
 * real callouts for this part.
 *
 * Layers the preloader animates:
 *   [data-draw]     outline strokes (pathLength 1, hidden by CSS until drawn)
 *   [data-billet]   the solid raw block, shown before machining
 *   [data-cut]      clip rect: left of it is machined part, right is billet
 *   [data-fade]     datums, dimensions and tolerance frames
 * Original artwork; decorative.
 */

const X0 = 70
const Y0 = 40
const W = 460 // 1150 mm
const H = 280 // 700 mm
const WALL = 10
const RIB = 8
const COLS = 4
const ROWS = 3
const POCKET_W = (W - 2 * WALL - (COLS - 1) * RIB) / COLS
const POCKET_H = (H - 2 * WALL - (ROWS - 1) * RIB) / ROWS

const rect = (x: number, y: number, w: number, h: number) => `M${x} ${y} h${w} v${h} h${-w} Z`
const r1 = (n: number) => Math.round(n * 10) / 10

const pockets = Array.from({ length: COLS * ROWS }, (_, i) => {
  const c = i % COLS
  const r = Math.floor(i / COLS)
  return {
    x: r1(X0 + WALL + c * (POCKET_W + RIB)),
    y: r1(Y0 + WALL + r * (POCKET_H + RIB)),
  }
})

// Slots along both long edge walls (the comb visible in the photos).
const slots = Array.from({ length: 30 }, (_, i) => X0 + 22 + i * 14.4).map(r1)

// Bolt holes where the ribs cross.
const holes = [1, 2, 3].flatMap((c) =>
  [1, 2].map((r) => ({
    cx: r1(X0 + WALL + c * (POCKET_W + RIB) - RIB / 2),
    cy: r1(Y0 + WALL + r * (POCKET_H + RIB) - RIB / 2),
  }))
)

/** The finished part: outer block minus pockets, slots and holes (even-odd). */
const PART = [
  rect(X0, Y0, W, H),
  ...pockets.map((p) => rect(p.x, p.y, r1(POCKET_W), r1(POCKET_H))),
  ...slots.flatMap((x) => [rect(x, Y0 + 2, 3, 6), rect(x, Y0 + H - 8, 3, 6)]),
].join(" ")

export function FrameDrawing() {
  return (
    <svg viewBox="0 0 640 400" fill="none" aria-hidden focusable="false">
      <defs>
        {/* Brushed aluminium, lit from the top left. */}
        <linearGradient id="awt-alu" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4f5f7" />
          <stop offset="0.35" stopColor="#c9cdd3" />
          <stop offset="0.55" stopColor="#e8eaed" />
          <stop offset="0.8" stopColor="#a4aab2" />
          <stop offset="1" stopColor="#d5d9de" />
        </linearGradient>
        {/* Left of the tool: machined. Right of it: still billet. */}
        <clipPath id="awt-done">
          <rect data-cut x={X0 - 10} y="0" width="0" height="400" />
        </clipPath>
        <clipPath id="awt-todo">
          <rect data-cut-rest x={X0 - 10} y="0" width={W + 20} height="400" />
        </clipPath>
      </defs>

      {/* Raw billet, 1150 × 700 × 120 */}
      <g clipPath="url(#awt-todo)">
        <rect data-billet x={X0} y={Y0} width={W} height={H} fill="url(#awt-alu)" opacity="0.85" />
      </g>

      {/* Machined part with pocket floors a shade deeper */}
      <g clipPath="url(#awt-done)">
        {pockets.map((p) => (
          <rect key={`${p.x}-${p.y}`} x={p.x} y={p.y} width={r1(POCKET_W)} height={r1(POCKET_H)} fill="#5c636d" opacity="0.55" />
        ))}
        <path d={PART} fill="url(#awt-alu)" fillRule="evenodd" />
        {holes.map((h) => (
          <circle key={`${h.cx}-${h.cy}`} cx={h.cx} cy={h.cy} r="5" fill="#16181c" />
        ))}
      </g>

      {/* Outline */}
      <g stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
        <rect data-draw pathLength={1} x={X0} y={Y0} width={W} height={H} />
        {pockets.map((p) => (
          <rect
            key={`o-${p.x}-${p.y}`}
            data-draw
            pathLength={1}
            x={p.x}
            y={p.y}
            width={r1(POCKET_W)}
            height={r1(POCKET_H)}
            rx="3"
            strokeWidth="0.8"
          />
        ))}
        {holes.map((h) => (
          <circle key={`o-${h.cx}-${h.cy}`} data-draw pathLength={1} cx={h.cx} cy={h.cy} r="5" strokeWidth="0.8" />
        ))}
      </g>

      {/* Centrelines */}
      <g data-chain stroke="currentColor" strokeWidth="0.6" strokeDasharray="18 4 3 4" opacity="0.55">
        <path d={`M${X0 - 18} ${Y0 + H / 2} H${X0 + W + 18}`} />
        <path d={`M${X0 + W / 2} ${Y0 - 18} V${Y0 + H + 18}`} />
      </g>

      {/* Dimensions: 1150 overall length, 700 overall width */}
      <g data-fade stroke="currentColor" strokeWidth="0.7" opacity="0.8">
        <path d={`M${X0} ${Y0 + H + 6} V${Y0 + H + 40} M${X0 + W} ${Y0 + H + 6} V${Y0 + H + 40}`} />
        <path d={`M${X0} ${Y0 + H + 32} H${X0 + W}`} />
        <path
          d={`M${X0 + 8} ${Y0 + H + 28} L${X0} ${Y0 + H + 32} L${X0 + 8} ${Y0 + H + 36} M${X0 + W - 8} ${Y0 + H + 28} L${X0 + W} ${Y0 + H + 32} L${X0 + W - 8} ${Y0 + H + 36}`}
        />
        <text x={X0 + W / 2} y={Y0 + H + 27} textAnchor="middle" fill="currentColor" stroke="none" fontSize="11">
          1150
        </text>
        <path d={`M${X0 + W + 6} ${Y0} H${X0 + W + 44} M${X0 + W + 6} ${Y0 + H} H${X0 + W + 44}`} />
        <path d={`M${X0 + W + 36} ${Y0} V${Y0 + H}`} />
        <path
          d={`M${X0 + W + 32} ${Y0 + 8} L${X0 + W + 36} ${Y0} L${X0 + W + 40} ${Y0 + 8} M${X0 + W + 32} ${Y0 + H - 8} L${X0 + W + 36} ${Y0 + H} L${X0 + W + 40} ${Y0 + H - 8}`}
        />
        <text
          x={X0 + W + 30}
          y={Y0 + H / 2}
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          fontSize="11"
          transform={`rotate(-90 ${X0 + W + 30} ${Y0 + H / 2})`}
        >
          700
        </text>
      </g>

      {/* Datum A (left face) and B (bottom face) */}
      <g data-fade stroke="currentColor" strokeWidth="0.8">
        <path d={`M${X0} ${Y0 + 60} H${X0 - 16}`} />
        <path d={`M${X0 - 16} ${Y0 + 54} V${Y0 + 66} L${X0 - 26} ${Y0 + 60} Z`} fill="currentColor" />
        <rect x={X0 - 46} y={Y0 + 51} width="18" height="18" />
        <text x={X0 - 37} y={Y0 + 64} textAnchor="middle" fill="currentColor" stroke="none" fontSize="11">
          A
        </text>
        <path d={`M${X0 + 70} ${Y0 + H} V${Y0 + H + 14}`} />
        <path d={`M${X0 + 64} ${Y0 + H + 14} H${X0 + 76} L${X0 + 70} ${Y0 + H + 24} Z`} fill="currentColor" />
        <rect x={X0 + 61} y={Y0 + H + 26} width="18" height="18" fill="#16181c" />
        <text x={X0 + 70} y={Y0 + H + 39} textAnchor="middle" fill="currentColor" stroke="none" fontSize="11">
          B
        </text>
      </g>

      {/* Position tolerance on the bolt holes: ⌖ Ø0.05 | A | B */}
      <g data-fade stroke="currentColor" strokeWidth="0.85">
        <path d={`M${holes[0].cx + 4} ${holes[0].cy - 4} L${holes[0].cx + 40} ${Y0 - 14} H${holes[0].cx + 60}`} />
        <g transform={`translate(${holes[0].cx + 60} ${Y0 - 27})`}>
          <rect width="150" height="26" fill="#16181c" />
          <path d="M26 0 V26 M96 0 V26 M123 0 V26" />
          <circle cx="13" cy="13" r="6" />
          <path d="M13 4 V22 M4 13 H22" />
          <text x="61" y="17.5" textAnchor="middle" fill="currentColor" stroke="none" fontSize="11">
            Ø0.05
          </text>
          <text x="109.5" y="17.5" textAnchor="middle" fill="currentColor" stroke="none" fontSize="11">
            A
          </text>
          <text x="136.5" y="17.5" textAnchor="middle" fill="currentColor" stroke="none" fontSize="11">
            B
          </text>
        </g>
      </g>

      {/* Profile of a surface on the outer edge: ⌓ 0.1 | A */}
      <g data-fade stroke="currentColor" strokeWidth="0.85">
        <path d={`M${X0 + W} ${Y0 + 200} L${X0 + W + 58} ${Y0 + 236} H${X0 + W + 64}`} />
        <g transform={`translate(${X0 + W + 64} ${Y0 + 223})`}>
          <rect width="96" height="26" fill="#16181c" />
          <path d="M26 0 V26 M69 0 V26" />
          <path d="M6 18 A7 7 0 0 1 20 18 Z" />
          <text x="47.5" y="17.5" textAnchor="middle" fill="currentColor" stroke="none" fontSize="11">
            0.1
          </text>
          <text x="82.5" y="17.5" textAnchor="middle" fill="currentColor" stroke="none" fontSize="11">
            A
          </text>
        </g>
      </g>
    </svg>
  )
}

/** Machining window in SVG units, for the probe and clip tweens. */
export const MACHINING = { start: X0 - 10, width: W + 20 }
