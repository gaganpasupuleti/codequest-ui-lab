import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

import { LandingMeter } from '@/components/landing/shared/LandingMeter'
import { LANDING_SECTION_IDS, SHOWCASE_PANELS } from '@/data/landingContent'
import { gsap, useGSAP } from '@/lib/gsapSetup'
import { motionAllowed } from '@/lib/motionPreference'

export function ShowcaseSection() {
  const rootRef = useRef<HTMLElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const activePanel = SHOWCASE_PANELS[activeIndex]

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      if (!motionAllowed()) return

      const panel = root.querySelector('[data-showcase-panel]')
      if (!panel) return

      gsap.from(panel, { autoAlpha: 0, y: 14, duration: 0.4, ease: 'power2.out' })

      const fills = gsap.utils.toArray<HTMLElement>('[data-meter-fill]', root)
      if (fills.length) {
        gsap.from(fills, { scaleX: 0, duration: 0.7, ease: 'power2.out', stagger: 0.08 })
      }
    },
    { scope: rootRef, dependencies: [activeIndex], revertOnUpdate: true },
  )

  const focusTab = (index: number) => {
    const next = (index + SHOWCASE_PANELS.length) % SHOWCASE_PANELS.length
    setActiveIndex(next)
    tabRefs.current[next]?.focus()
  }

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      focusTab(index + 1)
      return
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      focusTab(index - 1)
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      focusTab(0)
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      focusTab(SHOWCASE_PANELS.length - 1)
    }
  }

  return (
    <section
      ref={rootRef}
      id={LANDING_SECTION_IDS.showcase}
      className="landing-surface-ink relative overflow-hidden"
      aria-labelledby="showcase-heading"
    >
      {/* Decorative wash kept inside its own clipped layer instead of relying on a page-level clip. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="landing-showcase-decor absolute -right-32 top-10 h-80 w-80 rounded-full" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mb-8 max-w-3xl sm:mb-12">
          <p className="landing-label landing-label--flare mb-5">06 — Inside the platform</p>
          <h2 id="showcase-heading" className="landing-h2 mb-4">
            Not another course library
          </h2>
          <p className="landing-lede max-w-[52ch]">
            CodeQuest is where learning turns into visible work.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="CodeQuest product previews"
          className="mb-6 flex flex-wrap gap-2"
        >
          {SHOWCASE_PANELS.map((panel, index) => (
            <button
              key={panel.id}
              ref={(node) => {
                tabRefs.current[index] = node
              }}
              type="button"
              role="tab"
              id={`showcase-tab-${panel.id}`}
              aria-selected={index === activeIndex}
              aria-controls={`showcase-panel-${panel.id}`}
              tabIndex={index === activeIndex ? 0 : -1}
              className="landing-tab"
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              {panel.tab}
            </button>
          ))}
        </div>

        <div
          data-showcase-panel
          role="tabpanel"
          id={`showcase-panel-${activePanel.id}`}
          aria-labelledby={`showcase-tab-${activePanel.id}`}
          tabIndex={0}
          className="landing-showcase-frame overflow-hidden"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-[rgba(220,229,255,0.28)] px-4 py-4 sm:px-6">
            <div className="min-w-0">
              <h3 className="landing-h3">{activePanel.title}</h3>
              <p className="landing-copy mt-1 max-w-[56ch]">{activePanel.summary}</p>
            </div>
            <p className="landing-label">{activePanel.tab}</p>
          </div>

          <div className="grid gap-5 px-4 py-5 sm:px-6 sm:py-6">
            {activePanel.rows && (
              <ul>
                {activePanel.rows.map((row) => (
                  <li
                    key={row.label}
                    className="landing-preview-row flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <span className="landing-preview-label font-mono text-[0.72rem] font-bold uppercase tracking-[0.14em]">
                      {row.label}
                    </span>
                    <span className="min-w-0 font-semibold sm:text-right">{row.value}</span>
                  </li>
                ))}
              </ul>
            )}

            {activePanel.code && (
              <pre className="landing-preview-code overflow-x-auto p-4 text-[0.8rem] leading-relaxed">
                <code>
                  {activePanel.code.map((line, index) => (
                    <span
                      key={`${activePanel.id}-line-${index}`}
                      className={
                        line.trimStart().startsWith('#')
                          ? 'landing-preview-code-comment block'
                          : 'block'
                      }
                    >
                      {line || ' '}
                    </span>
                  ))}
                </code>
              </pre>
            )}

            {activePanel.meters && (
              <div className="grid gap-4 sm:grid-cols-2">
                {activePanel.meters.map((meter) => (
                  <LandingMeter key={meter.label} label={meter.label} value={meter.value} />
                ))}
              </div>
            )}

            <p className="landing-copy text-[0.78rem]">
              Illustrative product preview built with demo content — not live student data.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
