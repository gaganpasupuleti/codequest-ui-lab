import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Card grid stagger — inspired by https://demos.gsap.com/demo/stagger-items-in-on-scroll/
 * Batches cards as they enter the scrollable nav panel.
 */
export function useNavCardStagger(
  isOpen: boolean,
  scrollerRef: RefObject<HTMLElement | null>,
  itemCount: number,
) {
  useEffect(() => {
    if (!isOpen || !scrollerRef.current) return

    const scroller = scrollerRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const cards = scroller.querySelectorAll<HTMLElement>('.orch-nav-card')
    if (!cards.length) return

    if (reduced) {
      gsap.set(cards, { autoAlpha: 1, scale: 1, y: 0 })
      return
    }

    gsap.set(cards, { autoAlpha: 0, scale: 0.9, y: 20 })

    const triggers = ScrollTrigger.batch(cards, {
      scroller,
      start: 'top 90%',
      onEnter: (batch) =>
        gsap.to(batch, {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.75,
          ease: 'sine.out',
          overwrite: true,
        }),
      onLeave: (batch) =>
        gsap.to(batch, {
          autoAlpha: 0.4,
          scale: 0.96,
          duration: 0.35,
          stagger: 0.04,
          overwrite: true,
        }),
      onEnterBack: (batch) =>
        gsap.to(batch, {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'sine.out',
          overwrite: true,
        }),
    })

  const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      // Animate first visible row immediately (demo-style batch on open)
      const firstBatch: HTMLElement[] = []
      cards.forEach((card) => {
        const top = card.offsetTop - scroller.scrollTop
        if (top < scroller.clientHeight * 0.85) firstBatch.push(card)
      })
      if (firstBatch.length) {
        gsap.to(firstBatch, {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'sine.out',
        })
      }
    })

    return () => {
      cancelAnimationFrame(raf)
      triggers.forEach((t) => t.kill())
      gsap.set(cards, { clearProps: 'all' })
    }
  }, [isOpen, itemCount, scrollerRef])
}
