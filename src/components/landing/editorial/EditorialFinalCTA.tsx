import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CQOrbitMark } from '@/components/landing/editorial/CQOrbitMark'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsapSetup'
import { motionAllowed, pointerTiltAllowed } from '@/lib/motionPreference'

export function EditorialFinalCTA() {
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const headline = section.querySelector<HTMLElement>('[data-final-headline]')
      const ctas = section.querySelector<HTMLElement>('[data-final-ctas]')

      if (!motionAllowed()) {
        gsap.set([headline, ctas?.children ? Array.from(ctas.children) : []], { opacity: 1, y: 0 })
        return
      }

      gsap.from(headline, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 36,
        autoAlpha: 0,
        duration: 0.85,
        ease: 'power3.out',
      })

      gsap.from(ctas?.children ? Array.from(ctas.children) : [], {
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        y: 16,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.55,
        ease: 'power2.out',
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="ecq-final" aria-labelledby="ecq-final-heading">
      <div className="ecq-final-logo">
        <CQOrbitMark interactive={pointerTiltAllowed()} />
      </div>
      <h2 id="ecq-final-heading" className="ecq-final-headline" data-final-headline>
        Your next level starts with one quest.
      </h2>
      <div className="ecq-final-ctas" data-final-ctas>
        <button type="button" className="ecq-btn-primary" onClick={() => navigate('/register')}>
          Start Your Quest
        </button>
        <button type="button" className="ecq-btn-secondary" onClick={() => navigate('/practice')}>
          View Learning Paths
        </button>
      </div>
    </section>
  )
}
