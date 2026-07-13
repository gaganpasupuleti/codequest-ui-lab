import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsapSetup'
import { motionAllowed } from '@/lib/motionPreference'

const SYSTEM_STEPS = [
  {
    num: '01',
    title: 'Learn',
    body: 'Follow structured paths for Python, SQL, Data, DSA and AI.',
  },
  {
    num: '02',
    title: 'Practice',
    body: 'Solve challenges in interactive learning arenas.',
  },
  {
    num: '03',
    title: 'Build',
    body: 'Create projects that demonstrate real ability.',
  },
  {
    num: '04',
    title: 'Prove',
    body: 'Track progress and improve resume readiness.',
  },
  {
    num: '05',
    title: 'Move Forward',
    body: 'Discover roles that match your growing skills.',
  },
] as const

export function EditorialSystem() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const items = section.querySelectorAll<HTMLElement>('[data-system-item]')

      if (!motionAllowed()) {
        gsap.set(items, { opacity: 1, y: 0 })
        return
      }

      ScrollTrigger.batch(items, {
        start: 'top 88%',
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.75,
            ease: 'power3.out',
            overwrite: true,
          })
        },
        onLeaveBack: (batch) => {
          gsap.set(batch, { autoAlpha: 0, y: 24 })
        },
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} id="ecq-system" className="ecq-system" aria-labelledby="ecq-system-heading">
      <p className="ecq-system-intro" id="ecq-system-heading">
        The CodeQuest System
      </p>
      <div className="ecq-system-grid">
        {SYSTEM_STEPS.map((step) => (
          <article key={step.num} className="ecq-system-item" data-system-item>
            <span className="ecq-system-num">{step.num}</span>
            <h3 className="ecq-system-title">{step.title}</h3>
            <p className="ecq-system-body">{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
