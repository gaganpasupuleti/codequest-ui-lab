import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsapSetup'
import { motionAllowed } from '@/lib/motionPreference'

const LIGHT_ITEMS = [
  'Guided learning paths',
  'Practical coding arenas',
  'Project proof',
  'Resume readiness',
  'Career mapping',
  'Relevant jobs',
]

export function EditorialStatement() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const headline = section.querySelector<HTMLElement>('[data-light-headline]')
      const items = section.querySelectorAll<HTMLElement>('[data-light-item]')

      if (!motionAllowed()) {
        gsap.set([headline, items], { opacity: 1, y: 0 })
        return
      }

      gsap.from(headline, {
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
        y: 48,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
      })

      gsap.from(items, {
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
        y: 20,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power2.out',
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="ecq-light-section" aria-labelledby="ecq-light-heading">
      <h2 id="ecq-light-heading" className="ecq-light-headline" data-light-headline>
        Designed for students. Built for real careers.
      </h2>
      <ul className="ecq-light-grid">
        {LIGHT_ITEMS.map((item) => (
          <li key={item} className="ecq-light-item" data-light-item>
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
