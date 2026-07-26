import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import { CATEGORY_META, type ScheduleEvent } from './schedule-types'
import { formatTimeRange } from './schedule-utils'

interface ScheduleEventBlockProps {
  event: ScheduleEvent
  compact?: boolean
  style?: CSSProperties
  onClick?: (event: ScheduleEvent, rect: DOMRect) => void
}

export function ScheduleEventBlock({
  event,
  compact = false,
  style,
  onClick,
}: ScheduleEventBlockProps) {
  const meta = CATEGORY_META[event.category]
  const showAvatars = !compact && Boolean(event.teammates?.length)

  return (
    <button
      type="button"
      onClick={(e) => {
        onClick?.(event, e.currentTarget.getBoundingClientRect())
      }}
      className={cn(
        'absolute inset-x-1 flex flex-col overflow-hidden rounded-md border px-2 py-1.5 text-left transition hover:brightness-[0.98]',
        meta.block,
        meta.text,
      )}
      style={style}
    >
      <p
        className={cn(
          'line-clamp-2 font-semibold leading-tight',
          compact ? 'text-[11px]' : 'text-[12px]',
        )}
      >
        {event.title}
      </p>
      <p className={cn('mt-0.5 opacity-80', compact ? 'text-[10px]' : 'text-[11px]')}>
        {formatTimeRange(event.startMinutes, event.endMinutes)}
      </p>
      {!compact && event.subtitle ? (
        <p className="mt-0.5 line-clamp-1 text-[10px] opacity-65">{event.subtitle}</p>
      ) : null}
      {showAvatars ? (
        <div className="mt-1 flex -space-x-1">
          {event.teammates!.slice(0, 3).map((mate) => (
            <span
              key={mate.id}
              className="grid h-4 w-4 place-items-center rounded-full border border-white bg-[#111827] text-[7px] font-bold text-white"
              title={mate.name}
            >
              {mate.initials}
            </span>
          ))}
        </div>
      ) : null}
    </button>
  )
}
