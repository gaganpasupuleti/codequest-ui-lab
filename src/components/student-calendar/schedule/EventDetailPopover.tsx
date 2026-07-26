import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

import { CQ_CARD, CQ_LABEL } from '@/components/student-dashboard/cq/cqTheme'
import { cn } from '@/lib/utils'

import {
  CATEGORY_META,
  SCHEDULE_TRACKS,
  type ScheduleCategory,
  type ScheduleEvent,
} from './schedule-types'
import { formatTimeRange, parseIsoDate } from './schedule-utils'

gsap.registerPlugin(useGSAP)

const CATEGORIES: ScheduleCategory[] = ['class', 'quiz', 'project', 'practice', 'focus']

interface EventDetailPopoverProps {
  event: ScheduleEvent
  anchorRect: DOMRect | null
  onClose: () => void
}

export function EventDetailPopover({ event, anchorRect, onClose }: EventDetailPopoverProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const track = SCHEDULE_TRACKS.find((item) => item.id === event.trackId)
  const dateLabel = parseIsoDate(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  useGSAP(
    () => {
      if (!panelRef.current) return
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' },
      )
    },
    { dependencies: [event.id] },
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const top = Math.min(
    Math.max((anchorRect?.bottom ?? 120) + 8, 16),
    typeof window !== 'undefined' ? window.innerHeight - 300 : 120,
  )
  const left = Math.min(
    Math.max((anchorRect?.left ?? 120), 16),
    typeof window !== 'undefined' ? window.innerWidth - 340 : 120,
  )

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 cursor-default bg-black/20"
        aria-label="Close event details"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-label={event.title}
        className={cn(CQ_CARD, 'fixed z-50 w-[min(100vw-2rem,320px)] p-3.5 shadow-lg')}
        style={{ top, left }}
      >
        <div className="mb-2.5 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-[#111827]">{event.title}</p>
            {event.subtitle ? (
              <p className="mt-0.5 text-[12px] text-[#6B7280]">{event.subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-[#9CA3AF] transition hover:bg-[#F3F4F6] hover:text-[#111827]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-3 flex flex-wrap gap-1">
          {CATEGORIES.map((category) => {
            const active = category === event.category
            return (
              <span
                key={category}
                className={cn(
                  'rounded-md px-2 py-0.5 text-[11px] font-semibold',
                  active
                    ? cn(CATEGORY_META[category].block, CATEGORY_META[category].text)
                    : 'bg-[#F3F4F6] text-[#6B7280]',
                )}
              >
                {CATEGORY_META[category].label}
              </span>
            )
          })}
        </div>

        <dl className="space-y-1.5 text-[13px]">
          <div className="flex justify-between gap-3">
            <dt className="text-[#6B7280]">Date</dt>
            <dd className="font-medium text-[#111827]">{dateLabel}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[#6B7280]">Time</dt>
            <dd className="font-medium text-[#111827]">
              {formatTimeRange(event.startMinutes, event.endMinutes)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[#6B7280]">Track</dt>
            <dd className="font-medium text-[#111827]">{track?.label ?? event.trackId}</dd>
          </div>
        </dl>

        {event.teammates && event.teammates.length > 0 ? (
          <div className="mt-3 border-t border-[#E5E7EB] pt-2.5">
            <p className={cn(CQ_LABEL, 'mb-1.5')}>With</p>
            <ul className="space-y-1.5">
              {event.teammates.map((mate) => (
                <li key={mate.id} className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-md bg-[#111827] text-[10px] font-bold text-white">
                    {mate.initials}
                  </span>
                  <span className="text-[13px] font-medium text-[#111827]">{mate.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </>
  )
}
