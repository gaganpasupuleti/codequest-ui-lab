import { type RefObject, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, SplitText)

const LOGIN_MOTION = import.meta.env.VITE_LOGIN_MOTION !== '0'

function motionAllowed(): boolean {
  if (typeof window === 'undefined') return false
  if (!LOGIN_MOTION) return false
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Animates auth panel content when switching login / signup / forgot / pending. */
export function useLoginAuthPanelMotion(
  panelRef: RefObject<HTMLElement | null>,
  modeKey: string,
) {
  const isFirstMount = useRef(true)

  useGSAP(
    () => {
      const panel = panelRef.current
      if (!panel || !motionAllowed()) return

      if (isFirstMount.current) {
        isFirstMount.current = false
        return
      }

      const items = panel.querySelectorAll<HTMLElement>('.login-card-stagger')
      const title = panel.querySelector<HTMLElement>('h2.login-card-title')
      if (!items.length) return

      gsap.set(items, { opacity: 0, y: 14 })

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
      let titleSplit: SplitText | null = null

      if (title) {
        titleSplit = SplitText.create(title, {
          type: 'words',
          tag: 'span',
          wordsClass: 'login-card-title-word inline-block mr-[0.2em]',
          aria: 'none',
        })
        gsap.set(titleSplit.words, { opacity: 0, y: 12 })
        tl.to(titleSplit.words, { opacity: 1, y: 0, duration: 0.32, stagger: 0.05 }, 0)
      }

      tl.to(
        items,
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.045 },
        titleSplit ? 0.12 : 0,
      )

      return () => {
        titleSplit?.revert()
      }
    },
    { dependencies: [modeKey], scope: panelRef },
  )
}
