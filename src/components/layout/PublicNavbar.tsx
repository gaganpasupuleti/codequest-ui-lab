import { useCallback, useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import { LandingCtaButton } from '@/components/landing/LandingCtaButton'
import { handleSectionAnchorClick } from '@/components/landing/landingSectionNav'
import { CQLogo } from '@/components/landing/shared/CQLogo'
import { LANDING_NAV_LINKS } from '@/data/landingContent'
import { prefersReducedMotion } from '@/lib/motionPreference'

const MOBILE_MENU_ID = 'landing-mobile-menu'

type PublicNavbarProps = {
  onStartQuest: () => void
  onHome?: () => void
}

export function PublicNavbar({ onStartQuest, onHome }: PublicNavbarProps) {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const closeMenu = useCallback((returnFocus = true) => {
    setOpen(false)
    if (returnFocus) toggleRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, closeMenu])

  return (
    <header className="landing-nav fixed left-0 right-0 top-0 z-50">
      <nav
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <button type="button" onClick={onHome} className="landing-nav-brand shrink-0">
          <CQLogo size="xs" />
          <span>CodeQuest</span>
        </button>

        <div className="hidden items-center gap-5 lg:flex xl:gap-7">
          {LANDING_NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={`#${link.target}`}
              onClick={handleSectionAnchorClick}
              className="landing-nav-link"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex xl:gap-4">
          <button type="button" onClick={onStartQuest} className="landing-nav-link">
            Log In
          </button>
          <LandingCtaButton tone="primary" onClick={onStartQuest}>
            Start Your Quest
          </LandingCtaButton>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="landing-nav-toggle inline-flex items-center justify-center lg:hidden"
          onClick={() => (open ? closeMenu(false) : setOpen(true))}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls={MOBILE_MENU_ID}
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </nav>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={MOBILE_MENU_ID}
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: prefersReducedMotion() ? 0 : 0.22, ease: 'easeOut' }}
            className="landing-nav-mobile lg:hidden"
          >
            <div className="mx-auto w-full max-w-7xl px-4 pb-5 pt-1 sm:px-6">
              {LANDING_NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={`#${link.target}`}
                  className="landing-nav-link"
                  onClick={(event) => {
                    handleSectionAnchorClick(event)
                    closeMenu()
                  }}
                >
                  {link.label}
                </a>
              ))}

              <div className="mt-4 flex flex-col gap-2.5">
                <LandingCtaButton
                  tone="ghost"
                  className="w-full"
                  onClick={() => {
                    closeMenu(false)
                    onStartQuest()
                  }}
                >
                  Log In
                </LandingCtaButton>
                <LandingCtaButton
                  tone="primary"
                  className="w-full"
                  onClick={() => {
                    closeMenu(false)
                    onStartQuest()
                  }}
                >
                  Start Your Quest
                </LandingCtaButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
