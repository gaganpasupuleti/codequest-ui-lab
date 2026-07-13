import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CQOrbitMark } from '@/components/landing/editorial/CQOrbitMark'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsapSetup'
import { motionAllowed, pointerTiltAllowed } from '@/lib/motionPreference'

const TICKER_ITEMS = [
  'LEARN',
  'PRACTICE',
  'BUILD',
  'PROVE',
  'GET HIRED',
  'PYTHON',
  'SQL',
  'DATA',
  'DSA',
  'AI',
  'CAREER',
]

function TickerRow({ reverse = false }: { reverse?: boolean }) {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className={`ecq-ticker-row${reverse ? ' ecq-ticker-row--reverse' : ''}`} aria-hidden="true">
      <div className="ecq-ticker-track" data-ticker-track={reverse ? 'reverse' : 'forward'}>
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className="ecq-ticker-item">
            {item}
            <span className="ecq-ticker-sep">•</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function EditorialHero() {
  const navigate = useNavigate()
  const rootRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const tickerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const logoWrap = logoRef.current
      const ticker = tickerRef.current
      if (!root || !logoWrap || !ticker) return

      const eyebrow = root.querySelector<HTMLElement>('[data-hero-eyebrow]')
      const wordSpans = root.querySelectorAll<HTMLElement>('[data-word-reveal]')
      const metaLeft = root.querySelector<HTMLElement>('[data-meta-left]')
      const metaRight = root.querySelector<HTMLElement>('[data-meta-right]')
      const copy = root.querySelector<HTMLElement>('[data-hero-copy]')
      const ctas = root.querySelector<HTMLElement>('[data-hero-ctas]')
      const wordmark = root.querySelector<HTMLElement>('[data-bg-wordmark]')
      const forwardTrack = ticker.querySelector<HTMLElement>('[data-ticker-track="forward"]')
      const reverseTrack = ticker.querySelector<HTMLElement>('[data-ticker-track="reverse"]')

      const reduced = !motionAllowed()

      if (reduced) {
        gsap.set([eyebrow, logoWrap, metaLeft, metaRight, copy, ctas, ticker, wordSpans], {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
        })
        gsap.set(logoWrap, { className: 'ecq-logo-wrap ecq-logo-wrap--bridge' })
        ticker.classList.add('ecq-ticker--static')
        return
      }

      gsap.set(logoWrap, { scale: 0.85, transformOrigin: '50% 50%' })

      const loadTl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      loadTl
        .from(
          wordSpans,
          {
            xPercent: -110,
            duration: 1.1,
            stagger: 0.12,
            ease: 'power4.out',
          },
          0.2,
        )
        .to(logoWrap, { scale: 1, autoAlpha: 1, duration: 0.9, ease: 'power2.out' }, 0.35)
        .from(eyebrow, { autoAlpha: 0, y: 10, duration: 0.6 }, 0.55)
        .from(metaLeft, { autoAlpha: 0, x: -28, duration: 0.7 }, 0.65)
        .from(metaRight, { autoAlpha: 0, x: 28, duration: 0.7 }, 0.65)
        .from(copy, { autoAlpha: 0, y: 14, duration: 0.65 }, 0.85)
        .from(ctas?.children ? Array.from(ctas.children) : [], { autoAlpha: 0, y: 18, stagger: 0.08, duration: 0.55 }, 0.95)

      const mm = gsap.matchMedia()

      mm.add(
        {
          isMobile: '(max-width: 767px)',
          isDesktop: '(min-width: 768px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isMobile, reduceMotion } = context.conditions as {
            isMobile: boolean
            isDesktop: boolean
            reduceMotion: boolean
          }

          if (reduceMotion) return

          ScrollTrigger.create({
            trigger: root,
            start: 'top top',
            end: 'bottom top',
            scrub: isMobile ? 0.6 : 1,
            invalidateOnRefresh: true,
            animation: gsap.timeline().to(wordmark, { y: isMobile ? 40 : 80, ease: 'none' }, 0).to(
              logoWrap,
              {
                y: isMobile ? 120 : 180,
                scale: isMobile ? 0.72 : 0.62,
                rotation: isMobile ? 4 : 6,
                ease: 'none',
              },
              0,
            ),
          })

          ScrollTrigger.create({
            trigger: root,
            start: 'bottom 85%',
            end: 'bottom top',
            scrub: 0.5,
            onUpdate: (self) => {
              if (self.progress > 0.15) {
                logoWrap.classList.add('ecq-logo-wrap--bridge')
              } else {
                logoWrap.classList.remove('ecq-logo-wrap--bridge')
              }
            },
          })

          ScrollTrigger.create({
            trigger: ticker,
            start: 'top 92%',
            toggleActions: 'play none none reverse',
            onEnter: () => {
              gsap.to(ticker, { autoAlpha: 1, duration: 0.5 })
            },
            onLeaveBack: () => {
              gsap.to(ticker, { autoAlpha: 0, duration: 0.35 })
            },
          })

          if (forwardTrack && reverseTrack) {
            gsap.to(forwardTrack, {
              xPercent: -50,
              duration: 28,
              repeat: -1,
              ease: 'none',
            })
            gsap.fromTo(
              reverseTrack,
              { xPercent: -50 },
              { xPercent: 0, duration: 32, repeat: -1, ease: 'none' },
            )
          }

          if (!isMobile && pointerTiltAllowed()) {
            ScrollTrigger.create({
              trigger: root,
              start: 'top top',
              end: 'bottom top',
              scrub: 1,
              onUpdate: (self) => {
                gsap.to(logoWrap, {
                  rotationY: self.progress * 8,
                  duration: 0.3,
                  overwrite: 'auto',
                })
              },
            })
          }
        },
      )

      return () => mm.revert()
    },
    { scope: rootRef },
  )

  return (
    <>
      <section ref={rootRef} className="ecq-hero" aria-labelledby="ecq-hero-title">
        <p className="ecq-hero-eyebrow" data-hero-eyebrow id="ecq-hero-title">
          CodeQuest / Student Career Platform
        </p>

        <div className="ecq-bg-wordmark" data-bg-wordmark aria-hidden="true">
          <div className="ecq-bg-wordmark-line">
            <span data-word-reveal>CODE</span>
          </div>
          <div className="ecq-bg-wordmark-line">
            <span data-word-reveal>QUEST</span>
          </div>
        </div>

        <div className="ecq-hero-stage">
          <div className="ecq-meta-block ecq-meta-block--left" data-meta-left>
            <span className="ecq-meta-label">Learn</span>
            <span className="ecq-meta-items">Python · SQL · Data</span>
          </div>

          <div ref={logoRef} className="ecq-logo-wrap" data-hero-logo>
            <CQOrbitMark interactive={pointerTiltAllowed()} />
          </div>

          <div className="ecq-meta-block ecq-meta-block--right" data-meta-right>
            <span className="ecq-meta-label">Build</span>
            <span className="ecq-meta-items">Projects · Resume · Portfolio</span>
          </div>
        </div>

        <p className="ecq-hero-copy" data-hero-copy>
          Learn with direction. Build with proof. Move towards the right career.
        </p>

        <div className="ecq-hero-ctas" data-hero-ctas>
          <button type="button" className="ecq-btn-primary" onClick={() => navigate('/register')}>
            Start Your Quest
          </button>
          <button type="button" className="ecq-btn-secondary" onClick={() => navigate('/practice')}>
            Explore the Journey
          </button>
        </div>

        <div className="ecq-hero-scroll-zone" aria-hidden="true" />
      </section>

      <div ref={tickerRef} className="ecq-ticker" aria-hidden="true">
        <TickerRow />
        <TickerRow reverse />
      </div>
    </>
  )
}
