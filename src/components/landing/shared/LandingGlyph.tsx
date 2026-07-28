import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * Original line-art glyphs drawn for the CodeQuest landing page.
 * All shapes are hand-plotted on a 40x40 grid — no external icon or illustration assets.
 */
const GLYPHS: Record<string, ReactNode> = {
  learn: (
    <>
      <path
        className="landing-illus-stroke"
        d="M5 11c5-3 10-2 15 2 5-4 10-5 15-2v18c-5-3-10-2-15 2-5-4-10-5-15-2Z"
      />
      <path className="landing-illus-accent" d="M20 13v18" />
    </>
  ),
  practise: (
    <>
      <rect className="landing-illus-stroke" x="5" y="8" width="30" height="24" rx="3" />
      <path className="landing-illus-accent" d="M11 17l4 4-4 4" />
      <path className="landing-illus-stroke landing-illus-stroke--thin" d="M19 25h9" />
    </>
  ),
  build: (
    <>
      <rect className="landing-illus-stroke" x="7" y="22" width="11" height="10" rx="1.5" />
      <rect className="landing-illus-stroke" x="21" y="22" width="11" height="10" rx="1.5" />
      <rect className="landing-illus-accent" x="14" y="10" width="11" height="10" rx="1.5" />
    </>
  ),
  prepare: (
    <>
      <rect className="landing-illus-stroke" x="9" y="7" width="22" height="26" rx="3" />
      <path className="landing-illus-stroke landing-illus-stroke--thin" d="M15 6h10" />
      <path className="landing-illus-accent" d="M14 18l3.5 3.5L24 15" />
      <path className="landing-illus-stroke landing-illus-stroke--thin" d="M14 26h12" />
    </>
  ),
  apply: (
    <>
      <path className="landing-illus-stroke" d="M6 21 34 8l-9 25-5-9Z" />
      <path className="landing-illus-accent" d="M20 24 34 8" />
    </>
  ),
  loop: (
    <>
      <path className="landing-illus-stroke" d="M34 20a14 14 0 1 1-5-10.7" />
      <path className="landing-illus-flare" d="M23 6.5 30 9.6l-2.6 7" />
      <path className="landing-illus-accent" d="M17 14.5 26 20l-9 5.5Z" />
    </>
  ),
  silence: (
    <>
      <rect className="landing-illus-stroke" x="5" y="9" width="30" height="22" rx="3" />
      <path className="landing-illus-flare" d="M14 17l8 8m0-8-8 8" />
      <path
        className="landing-illus-stroke landing-illus-stroke--thin"
        strokeDasharray="3 4"
        d="M26 20h7"
      />
    </>
  ),
  void: (
    <>
      <ellipse className="landing-illus-stroke" cx="20" cy="29" rx="14" ry="5.5" />
      <ellipse className="landing-illus-flare" cx="20" cy="29" rx="5.5" ry="2.2" />
      <path className="landing-illus-stroke landing-illus-stroke--thin" d="M20 6v15" />
      <path className="landing-illus-flare" d="M15 15.5 20 21l5-5.5" />
    </>
  ),
  path: (
    <>
      <path className="landing-illus-stroke" d="M6 30l8-10 8 6 12-16" />
      <circle className="landing-illus-fill-blue" cx="6" cy="30" r="3" />
      <circle className="landing-illus-fill-paper" cx="14" cy="20" r="3" />
      <circle className="landing-illus-fill-paper" cx="22" cy="26" r="3" />
      <circle className="landing-illus-fill-flare" cx="34" cy="10" r="3" />
    </>
  ),
  terminal: (
    <>
      <rect className="landing-illus-stroke" x="4" y="9" width="32" height="22" rx="3" />
      <path className="landing-illus-stroke landing-illus-stroke--thin" d="M4 15h32" />
      <path className="landing-illus-accent" d="M10 21l3 3-3 3" />
      <path className="landing-illus-stroke landing-illus-stroke--thin" d="M17 24h10" />
    </>
  ),
  blocks: (
    <>
      <rect className="landing-illus-stroke" x="5" y="20" width="13" height="13" rx="2" />
      <rect className="landing-illus-accent" x="21" y="20" width="13" height="13" rx="2" />
      <rect className="landing-illus-stroke" x="13" y="6" width="13" height="11" rx="2" />
    </>
  ),
  meter: (
    <>
      <path className="landing-illus-stroke" d="M6 28a14 14 0 0 1 28 0" />
      <path className="landing-illus-flare" d="M20 28 29 17" />
      <circle className="landing-illus-fill-paper" cx="20" cy="28" r="3" />
      <path className="landing-illus-stroke landing-illus-stroke--thin" d="M6 32h28" />
    </>
  ),
  doc: (
    <>
      <path className="landing-illus-stroke" d="M10 6h14l6 6v22H10Z" />
      <path className="landing-illus-stroke landing-illus-stroke--thin" d="M24 6v6h6" />
      <path className="landing-illus-accent" d="M15 20h10M15 26h7" />
    </>
  ),
  list: (
    <>
      <rect className="landing-illus-stroke landing-illus-stroke--thin" x="6" y="9" width="7" height="7" rx="1.5" />
      <rect className="landing-illus-accent" x="6" y="24" width="7" height="7" rx="1.5" />
      <path className="landing-illus-stroke landing-illus-stroke--thin" d="M17 12h17M17 27h13" />
      <path className="landing-illus-stroke landing-illus-stroke--thin" d="M17 17h11" />
    </>
  ),
  spark: (
    <>
      <path className="landing-illus-flare" d="M20 6v8M20 26v8M6 20h8M26 20h8" />
      <circle className="landing-illus-fill-blue" cx="20" cy="20" r="5" />
    </>
  ),
}

type LandingGlyphProps = {
  name: keyof typeof GLYPHS | string
  className?: string
}

/** Decorative glyph — always paired with adjacent text, so it is hidden from AT. */
export function LandingGlyph({ name, className }: LandingGlyphProps) {
  const shape = GLYPHS[name]
  if (!shape) return null

  return (
    <svg viewBox="0 0 40 40" className={cn('h-9 w-9', className)} aria-hidden="true" focusable="false">
      {shape}
    </svg>
  )
}
