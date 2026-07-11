import { useRef, useLayoutEffect, useEffect, useCallback } from 'react'
import gsap from 'gsap'

type EaseReverseTweenVars = gsap.TweenVars & { easeReverse?: string | boolean }

const ER = 'power3.out'

/**
 * Full-screen nav page motion — island expands, page fades/slides in.
 */
export function useOrchestratedNavMotion(isOpen: boolean) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const islandRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLSpanElement>(null)
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const isOpenRef = useRef(isOpen)
  isOpenRef.current = isOpen

  const buildTimeline = useCallback(() => {
    const overlay = overlayRef.current
    const island = islandRef.current
    const panel = panelRef.current
    const logo = logoRef.current
    const menuBtn = menuBtnRef.current
    if (!overlay || !panel) return null

    const cards = panel.querySelectorAll<HTMLElement>('.orch-nav-card')
    const bars = menuBtn?.querySelectorAll<SVGLineElement>('.orch-bar')

    const tl = gsap.timeline({ paused: true })

    tl.set(overlay, { pointerEvents: 'auto' })

    if (island) {
      tl.to(
        island,
        {
          opacity: 0,
          scale: 0.9,
          duration: 0.35,
          ease: 'power2.in',
          easeReverse: ER,
        } as EaseReverseTweenVars,
        0,
      )
    }

    if (logo) {
      tl.to(
        logo,
        {
          opacity: 1,
          rotation: 180,
          duration: 0.4,
          ease: 'back.out',
          easeReverse: 'power4.out',
        } as EaseReverseTweenVars,
        0.05,
      )
    }

    if (bars && bars.length >= 3) {
      tl.to(bars[1], { opacity: 0, duration: 0.12, ease: 'power2.in', easeReverse: ER }, 0)
      tl.to(
        bars[0],
        { attr: { x1: 3, y1: 3, x2: 13, y2: 13 }, duration: 0.25, ease: 'power3.inOut' },
        0,
      )
      tl.to(
        bars[2],
        { attr: { x1: 13, y1: 3, x2: 3, y2: 13 }, duration: 0.25, ease: 'power3.inOut' },
        0,
      )
    }

    tl.fromTo(
      overlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out', easeReverse: ER } as EaseReverseTweenVars,
      0,
    )

    tl.fromTo(
      panel,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power3.out',
        easeReverse: ER,
      } as EaseReverseTweenVars,
      0.08,
    )

    if (cards.length) {
      tl.set(cards, { autoAlpha: 0, scale: 0.88, y: 28 }, 0.08)
    }

    return tl
  }, [])

  const resetClosedState = useCallback(() => {
    const overlay = overlayRef.current
    const panel = panelRef.current
    const island = islandRef.current
    const logo = logoRef.current
    const menuBtn = menuBtnRef.current
    const bars = menuBtn?.querySelectorAll<SVGLineElement>('.orch-bar')

    if (island) gsap.set(island, { opacity: 1, scale: 1, clearProps: 'transform' })
    if (logo) gsap.set(logo, { opacity: 0, rotation: 0 })
    if (panel) gsap.set(panel, { opacity: 0, y: 40, clearProps: 'transform' })
    if (overlay) {
      gsap.set(overlay, { opacity: 0, pointerEvents: 'none' })
    }

    if (bars && bars.length >= 3) {
      gsap.set(bars[0], { attr: { x1: 2, y1: 5, x2: 14, y2: 5 } })
      gsap.set(bars[1], { opacity: 1 })
      gsap.set(bars[2], { attr: { x1: 2, y1: 11, x2: 14, y2: 11 } })
    }
  }, [])

  const showOpenInstant = useCallback(() => {
    const overlay = overlayRef.current
    const panel = panelRef.current
    const island = islandRef.current
    const cards = panel?.querySelectorAll<HTMLElement>('.orch-nav-card')

    if (overlay) gsap.set(overlay, { opacity: 1, pointerEvents: 'auto' })
    if (panel) gsap.set(panel, { opacity: 1, y: 0 })
    if (island) gsap.set(island, { opacity: 0, scale: 0.9 })
    if (cards?.length) gsap.set(cards, { autoAlpha: 1, scale: 1, y: 0 })
  }, [])

  useLayoutEffect(() => {
    resetClosedState()
  }, [resetClosedState])

  useEffect(() => {
    if (!isOpen) return
    tlRef.current?.kill()
    tlRef.current = buildTimeline()
  }, [isOpen, buildTimeline])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      if (isOpen) showOpenInstant()
      else resetClosedState()
      return
    }

    if (isOpen) {
      if (!tlRef.current) tlRef.current = buildTimeline()
      const tl = tlRef.current
      if (!tl) {
        showOpenInstant()
        return
      }
      tl.eventCallback('onReverseComplete', null)
      tl.timeScale(1).play(0)
      return
    }

    const tl = tlRef.current
    if (tl && tl.progress() > 0) {
      tl.eventCallback('onReverseComplete', () => resetClosedState())
      tl.timeScale(1.3).reverse()
      return
    }

    resetClosedState()
  }, [isOpen, buildTimeline, resetClosedState, showOpenInstant])

  useEffect(() => {
    const onResize = () => {
      const open = isOpenRef.current
      if (open) showOpenInstant()
      tlRef.current?.kill()
      tlRef.current = open ? buildTimeline() : null
      if (open && tlRef.current) tlRef.current.progress(1).pause()
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [buildTimeline, showOpenInstant])

  return { overlayRef, islandRef, panelRef, logoRef, menuBtnRef }
}
