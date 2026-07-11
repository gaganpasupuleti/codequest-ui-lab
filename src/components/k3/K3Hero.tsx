import { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { K3_CTA, K3_CTA_FILLED, K3_HEADLINE } from './k3Theme'

gsap.registerPlugin(useGSAP)

type K3HeroProps = {
  firstName: string
}

export function K3Hero({ firstName }: K3HeroProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      gsap.from(el.querySelectorAll('.k3-hero-line'), {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
      })
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="relative min-h-[85vh] border-b border-white/10 px-4 pb-16 pt-24 md:px-8 md:pt-28">
      <p className="k3-hero-line mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-white/45">
        Learning Platform · Placement Prep
      </p>

      <h1 className={K3_HEADLINE}>
        <span className="k3-hero-line block">Full-Service</span>
        <span className="k3-hero-line block">Learning Platform</span>
        <span className="k3-hero-line block text-white/55">For {firstName}</span>
      </h1>

      <p className="k3-hero-line mt-8 max-w-xl text-sm leading-relaxed text-white/50">
        SQL, Python, DSA, aptitude, resume labs, and job readiness —
        built for students who need clearer placement growth online.
      </p>

      <div className="k3-hero-line mt-10 flex flex-wrap gap-4">
        <Link to="/practice" className={K3_CTA_FILLED}>
          See Our Quests
        </Link>
        <Link to="/sql-arena" className={K3_CTA}>
          Start Practice →
        </Link>
      </div>

      <p className="absolute bottom-8 right-8 hidden font-mono text-[10px] uppercase tracking-[0.35em] text-white/30 md:block [writing-mode:vertical-rl] rotate-180">
        Scroll
      </p>
    </section>
  )
}
