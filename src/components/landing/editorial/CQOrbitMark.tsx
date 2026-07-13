import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { gsap, useGSAP } from '@/lib/gsapSetup'
import { motionAllowed, pointerTiltAllowed } from '@/lib/motionPreference'

type CQOrbitMarkProps = {
  className?: string
  label?: string
  animate?: boolean
  interactive?: boolean
}

export function CQOrbitMark({
  className,
  label = 'CodeQuest',
  animate = true,
  interactive = true,
}: CQOrbitMarkProps) {
  const rootRef = useRef<SVGSVGElement>(null)
  const floatRef = useRef<SVGGElement>(null)
  const orbitRef = useRef<SVGGElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const floatLayer = floatRef.current
      const orbit = orbitRef.current
      if (!root || !floatLayer || !orbit) return

      if (!animate || !motionAllowed()) return

      gsap.set(floatLayer, { transformOrigin: '50% 50%', transformPerspective: 800 })
      gsap.set(orbit, { transformOrigin: '100px 100px' })

      gsap.to(floatLayer, {
        y: -6,
        rotation: 4,
        duration: 4.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      gsap.to(floatLayer, {
        rotation: -3,
        duration: 6.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.4,
      })

      gsap.to(orbit, {
        rotation: 360,
        duration: 14,
        repeat: -1,
        ease: 'none',
      })

      if (!interactive || !pointerTiltAllowed()) return

      const onMove = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = (event.clientX - cx) / rect.width
        const dy = (event.clientY - cy) / rect.height
        gsap.to(floatLayer, {
          rotationY: dx * 7,
          rotationX: -dy * 5,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }

      const onLeave = () => {
        gsap.to(floatLayer, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.8,
          ease: 'power2.out',
        })
      }

      root.addEventListener('pointermove', onMove)
      root.addEventListener('pointerleave', onLeave)

      return () => {
        root.removeEventListener('pointermove', onMove)
        root.removeEventListener('pointerleave', onLeave)
      }
    },
    { scope: rootRef, dependencies: [animate, interactive] },
  )

  return (
    <svg
      ref={rootRef}
      className={cn('cq-orbit-mark', className)}
      viewBox="0 0 200 200"
      role="img"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{label}</title>
      <g ref={floatRef} className="cq-orbit-mark__float">
        <path
          className="cq-orbit-mark__c-arc"
          d="M 118 36 A 72 72 0 1 0 118 164"
        />
        <circle
          className="cq-orbit-mark__q-ring"
          cx="108"
          cy="100"
          r="44"
          strokeDasharray="240 40"
          strokeDashoffset="-20"
        />
        <path
          className="cq-orbit-mark__q-tail"
          d="M 142 132 C 154 122 166 112 178 104 L 168 104 L 178 104 L 178 94"
        />
        <circle className="cq-orbit-mark__orbit-path" cx="100" cy="100" r="62" />
        <g ref={orbitRef}>
          <circle className="cq-orbit-mark__node" cx="162" cy="100" r="5.5" />
        </g>
      </g>
    </svg>
  )
}
