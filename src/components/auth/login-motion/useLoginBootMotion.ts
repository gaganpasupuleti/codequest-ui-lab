import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SplitText } from 'gsap/SplitText'

import { formatLoginStat } from './loginTheme'

gsap.registerPlugin(useGSAP, SplitText)

/** Set VITE_LOGIN_MOTION=0 at dev/build time to verify static DOM only. */
const LOGIN_MOTION = import.meta.env.VITE_LOGIN_MOTION !== '0'

function motionAllowed(): boolean {
  if (typeof window === 'undefined') return false
  if (!LOGIN_MOTION) return false
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function pointerTiltAllowed(): boolean {
  if (typeof window === 'undefined') return false
  if (!motionAllowed()) return false
  if ('ontouchstart' in window) return false
  return window.matchMedia('(pointer: fine)').matches
}

function settleIntroTargets(targets: gsap.TweenTarget) {
  gsap.set(targets, { opacity: 1, x: 0, y: 0, scale: 1, rotation: 0, clearProps: 'opacity,transform' })
}

function animateStatCounter(
  el: HTMLElement,
  target: number,
  suffix: string,
  tl: gsap.core.Timeline,
  position: number | string,
) {
  const counter = { value: 0 }
  tl.to(
    counter,
    {
      value: target,
      duration: 1,
      ease: 'power2.out',
      snap: { value: 1 },
      onUpdate() {
        el.textContent = formatLoginStat(Math.round(counter.value), suffix)
      },
    },
    position,
  )
}

export function useLoginBootMotion() {
  const portalTiltRef = useRef<HTMLDivElement>(null)
  const portalGlowRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLSpanElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const circuitRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const logoGlowRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const bootRef = useRef<HTMLDivElement>(null)
  const featureChipsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const portalGlow = portalGlowRef.current
      const eyebrow = eyebrowRef.current
      const headline = headlineRef.current
      const circuit = circuitRef.current
      const logo = logoRef.current
      const glow = logoGlowRef.current
      const tagline = taglineRef.current
      const boot = bootRef.current
      const features = featureChipsRef.current
      const stats = statsRef.current
      const card = cardRef.current
      if (!logo || !tagline || !boot || !card) return

      const bootLines = boot.querySelectorAll<HTMLElement>('.login-boot-line')
      const featureChips = features?.querySelectorAll<HTMLElement>('.login-feature-chip') ?? []
      const statValues = stats?.querySelectorAll<HTMLElement>('.login-stat-value') ?? []
      const statLabels = stats?.querySelectorAll<HTMLElement>('.login-stat-label') ?? []
      const cardItems = card.querySelectorAll<HTMLElement>('.login-card-stagger')
      const orbitRings = circuit?.querySelectorAll<SVGElement>('.login-orbit-ring') ?? []
      const circuitGlow = circuit?.querySelector<SVGElement>('.login-circuit-glow')

      if (!motionAllowed()) return

      const split = SplitText.create(tagline, {
        type: 'words',
        tag: 'span',
        wordsClass: 'login-tagline-word inline-block mr-1',
        aria: 'none',
      })

      let eyebrowSplit: SplitText | null = null
      if (eyebrow) {
        eyebrowSplit = SplitText.create(eyebrow, {
          type: 'chars',
          tag: 'span',
          charsClass: 'login-eyebrow-char inline-block',
          aria: 'none',
        })
      }

      let headlineSplit: SplitText | null = null
      if (headline) {
        headlineSplit = SplitText.create(headline, {
          type: 'words',
          tag: 'span',
          wordsClass: 'login-headline-word inline-block mr-[0.25em]',
          aria: 'none',
        })
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => {
          settleIntroTargets([
            portalGlow,
            circuitGlow,
            logo,
            ...(eyebrowSplit?.chars ?? []),
            ...(headlineSplit?.words ?? []),
            ...split.words,
            ...bootLines,
            ...featureChips,
            ...statValues,
            ...statLabels,
            card,
            ...cardItems,
          ])
          if (glow) gsap.set(glow, { opacity: 0.5 })
        },
      })

      gsap.set(
        [
          portalGlow,
          circuitGlow,
          logo,
          ...(eyebrowSplit?.chars ?? []),
          ...(headlineSplit?.words ?? []),
          ...split.words,
          ...bootLines,
          ...featureChips,
          ...statValues,
          ...statLabels,
          card,
        ],
        { opacity: 1 },
      )
      gsap.set(cardItems, { opacity: 1, y: 0, x: 0 })

      if (portalGlow) tl.from(portalGlow, { opacity: 0, scale: 0.9, duration: 0.7 }, 0)
      if (circuitGlow) tl.from(circuitGlow, { opacity: 0, duration: 0.6 }, 0.05)

      tl.from(logo, { scale: 0.78, rotation: -6, duration: 0.8, ease: 'back.out(1.4)' }, 0.1)
      if (glow) {
        tl.fromTo(glow, { opacity: 0.15, scale: 0.92 }, { opacity: 0.5, scale: 1.05, duration: 0.8 }, 0.12)
      }
      tl.to(logo, { rotation: 0, duration: 0.35, ease: 'power1.out' }, 0.5)

      if (eyebrowSplit?.chars.length) {
        tl.from(
          eyebrowSplit.chars,
          { opacity: 0, y: 8, duration: 0.22, stagger: 0.022, ease: 'power2.out' },
          0.16,
        )
      }

      if (headlineSplit?.words.length) {
        tl.from(
          headlineSplit.words,
          { opacity: 0, y: 18, duration: 0.42, stagger: 0.065, ease: 'power3.out' },
          0.26,
        )
      }

      if (split.words.length) {
        tl.from(split.words, { opacity: 0, y: 12, duration: 0.4, stagger: 0.1 }, 0.44)
      }

      if (bootLines.length) {
        tl.from(bootLines, { opacity: 0, x: -10, duration: 0.3, stagger: 0.1 }, 0.6)
      }

      if (featureChips.length) {
        tl.from(featureChips, { opacity: 0, y: 14, duration: 0.38, stagger: 0.07 }, 0.72)
      }

      statValues.forEach((el, index) => {
        const target = Number(el.dataset.statValue ?? 0)
        const suffix = el.dataset.statSuffix ?? ''
        gsap.set(el, { textContent: '0' })
        animateStatCounter(el, target, suffix, tl, 0.82 + index * 0.09)
      })

      if (statLabels.length) {
        tl.from(statLabels, { opacity: 0, y: 6, duration: 0.28, stagger: 0.06 }, 1.05)
      }

      const cardFromX = window.matchMedia('(min-width: 1024px)').matches ? 36 : 0
      const cardFromY = window.matchMedia('(min-width: 1024px)').matches ? 0 : 20
      tl.from(card, { opacity: 0, x: cardFromX, y: cardFromY, duration: 0.55 }, 0.96)
      if (cardItems.length) {
        tl.from(cardItems, { opacity: 0, y: 12, duration: 0.35, stagger: 0.05 }, 1.06)
      }

      if (orbitRings.length) {
        orbitRings.forEach((ring, i) => {
          gsap.to(ring, {
            rotation: i % 2 === 0 ? 360 : -360,
            transformOrigin: '50% 50%',
            duration: 24 + i * 6,
            ease: 'none',
            repeat: -1,
          })
        })
      }

      return () => {
        split.revert()
        eyebrowSplit?.revert()
        headlineSplit?.revert()
      }
    },
    { scope: portalTiltRef },
  )

  useGSAP(
    () => {
      const portal = portalTiltRef.current
      const portalGlow = portalGlowRef.current
      const glow = logoGlowRef.current
      if (!portal || !pointerTiltAllowed()) return

      gsap.set(portal, { transformPerspective: 1000, transformOrigin: 'center center' })

      const rotateX = gsap.quickTo(portal, 'rotationX', { duration: 0.7, ease: 'power2.out' })
      const rotateY = gsap.quickTo(portal, 'rotationY', { duration: 0.7, ease: 'power2.out' })
      const glowX = portalGlow ? gsap.quickTo(portalGlow, 'x', { duration: 0.85, ease: 'power2.out' }) : null
      const glowY = portalGlow ? gsap.quickTo(portalGlow, 'y', { duration: 0.85, ease: 'power2.out' }) : null

      const maxTilt = 4

      const onMove = (event: PointerEvent) => {
        const rect = portal.getBoundingClientRect()
        const px = (event.clientX - rect.left) / rect.width - 0.5
        const py = (event.clientY - rect.top) / rect.height - 0.5
        rotateY(px * maxTilt * 2)
        rotateX(-py * maxTilt * 2)
        if (glowX && glowY && portalGlow) {
          glowX(px * 10)
          glowY(py * 8)
        }
      }

      const onLeave = () => {
        rotateX(0)
        rotateY(0)
        glowX?.(0)
        glowY?.(0)
      }

      portal.addEventListener('pointermove', onMove)
      portal.addEventListener('pointerleave', onLeave)

      return () => {
        portal.removeEventListener('pointermove', onMove)
        portal.removeEventListener('pointerleave', onLeave)
        gsap.set(portal, { rotationX: 0, rotationY: 0, clearProps: 'transform' })
        if (portalGlow) gsap.set(portalGlow, { x: 0, y: 0, clearProps: 'transform' })
        if (glow) gsap.set(glow, { x: 0, y: 0, clearProps: 'transform' })
      }
    },
    { scope: portalTiltRef },
  )

  return {
    portalTiltRef,
    portalGlowRef,
    eyebrowRef,
    headlineRef,
    circuitRef,
    logoRef,
    logoGlowRef,
    taglineRef,
    bootRef,
    featureChipsRef,
    statsRef,
    cardRef,
  }
}
