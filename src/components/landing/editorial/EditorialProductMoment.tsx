import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsapSetup'
import { motionAllowed } from '@/lib/motionPreference'

const STATS = [
  { label: 'Daily Quest', value: 'Python Loops Drill', wide: true },
  { label: 'XP', value: '2,480', accent: 'lemon' as const },
  { label: 'Learning Streak', value: '12 days', accent: 'mint' as const },
  { label: 'Resume Readiness', value: '74%', accent: 'mint' as const },
  { label: 'Career Path', value: 'Data Analyst', wide: true },
]

const JOBS = [
  { role: 'Junior Data Analyst', company: 'FinEdge' },
  { role: 'Python Developer Intern', company: 'NovaStack' },
]

export function EditorialProductMoment() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const poster = section.querySelector<HTMLElement>('[data-product-poster]')

      if (!motionAllowed()) {
        gsap.set(poster, { opacity: 1, y: 0 })
        return
      }

      gsap.from(poster, {
        scrollTrigger: {
          trigger: poster,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 28,
        autoAlpha: 0,
        duration: 0.85,
        ease: 'power3.out',
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} id="ecq-product" className="ecq-product" aria-labelledby="ecq-product-heading">
      <p className="ecq-product-label" id="ecq-product-heading">
        Platform Preview
      </p>
      <article className="ecq-product-poster" data-product-poster aria-label="CodeQuest student dashboard preview">
        <header className="ecq-product-header">
          <span className="ecq-product-title">Student Quest Board</span>
          <span className="ecq-product-xp">+120 XP today</span>
        </header>
        <div className="ecq-product-grid">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className={`ecq-product-stat${stat.wide ? ' ecq-product-stat--wide' : ''}`}
            >
              <span className="ecq-product-stat-label">{stat.label}</span>
              <span
                className={`ecq-product-stat-value${
                  stat.accent === 'mint'
                    ? ' ecq-product-stat-value--mint'
                    : stat.accent === 'lemon'
                      ? ' ecq-product-stat-value--lemon'
                      : ''
                }`}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>
        <div className="ecq-product-jobs">
          <span className="ecq-product-stat-label">Recommended Jobs</span>
          {JOBS.map((job) => (
            <div key={job.role} className="ecq-product-job">
              <strong>{job.role}</strong>
              <span>{job.company}</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}
