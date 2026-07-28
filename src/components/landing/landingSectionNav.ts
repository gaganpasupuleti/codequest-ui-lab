import type { MouseEvent } from 'react'

import { motionAllowed } from '@/lib/motionPreference'

/** Scrolls to a landing section id, honouring the reduced-motion preference. */
export function scrollToLandingSection(id: string): void {
  if (typeof document === 'undefined') return
  const target = document.getElementById(id)
  if (!target) return
  target.scrollIntoView({ behavior: motionAllowed() ? 'smooth' : 'auto', block: 'start' })
}

/**
 * Progressive enhancement for in-page anchors: the href still works without JS,
 * and with JS we get reduced-motion-aware scrolling instead of a hard jump.
 */
export function handleSectionAnchorClick(event: MouseEvent<HTMLAnchorElement>): void {
  const href = event.currentTarget.getAttribute('href')
  if (!href || !href.startsWith('#')) return
  const id = href.slice(1)
  if (!document.getElementById(id)) return
  event.preventDefault()
  scrollToLandingSection(id)
}

export function scrollLandingToTop(): void {
  if (typeof window === 'undefined') return
  window.scrollTo({ top: 0, behavior: motionAllowed() ? 'smooth' : 'auto' })
}
