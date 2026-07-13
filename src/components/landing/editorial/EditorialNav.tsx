import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap, useGSAP } from '@/lib/gsapSetup'
import { motionAllowed } from '@/lib/motionPreference'

export function EditorialNav() {
  const navRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  useGSAP(
    () => {
      const nav = navRef.current
      if (!nav) return

      if (!motionAllowed()) {
        gsap.set(nav, { opacity: 1 })
        return
      }

      gsap.from(nav, { autoAlpha: 0, y: -12, duration: 0.8, ease: 'power2.out', delay: 0.15 })
    },
    { scope: navRef },
  )

  return (
    <header ref={navRef} className="ecq-nav">
      <span className="ecq-nav-brand">CodeQuest</span>
      <nav className="ecq-nav-links" aria-label="Editorial landing">
        <a className="ecq-nav-link" href="#ecq-system">
          System
        </a>
        <a className="ecq-nav-link" href="#ecq-product">
          Platform
        </a>
        <Link className="ecq-nav-link" to="/login">
          Sign in
        </Link>
      </nav>
      <button type="button" className="ecq-nav-cta" onClick={() => navigate('/register')}>
        Start
      </button>
    </header>
  )
}
