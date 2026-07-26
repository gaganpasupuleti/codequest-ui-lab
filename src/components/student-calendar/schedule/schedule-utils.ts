import { toIsoDate } from '@/lib/calendar-events'

import type { ScheduleCategory, ScheduleEvent, ScheduleFilters } from './schedule-types'

export const HOUR_START = 8
export const HOUR_END = 18
export const ROW_HEIGHT_PX = 64

export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function getMondayOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function weekDaysFrom(monday: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}

export function formatHourLabel(hour: number): string {
  if (hour === 12) return '12 pm'
  if (hour > 12) return `${hour - 12} pm`
  return `${hour} am`
}

export function formatClockFromMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const ampm = h >= 12 ? 'pm' : 'am'
  const hour12 = h % 12 || 12
  if (m === 0) return `${hour12} ${ampm}`
  return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`
}

/** Google Calendar–style range, e.g. "8:20 - 9:40". */
export function formatTimeRange(startMinutes: number, endMinutes: number): string {
  const fmt = (minutes: number) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h % 12 || 12}:${String(m).padStart(2, '0')}`
  }
  return `${fmt(startMinutes)} - ${fmt(endMinutes)}`
}

export function formatDayHeader(date: Date): { weekday: string; day: number } {
  return {
    weekday: date.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase(),
    day: date.getDate(),
  }
}

export function formatToolbarDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  })
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function minutesNow(): number {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

export function eventBlockStyle(
  startMinutes: number,
  endMinutes: number,
): { top: number; height: number } {
  const top = ((startMinutes - HOUR_START * 60) / 60) * ROW_HEIGHT_PX
  const height = Math.max(((endMinutes - startMinutes) / 60) * ROW_HEIGHT_PX, 36)
  return { top, height }
}

export function filterEvents(
  events: ScheduleEvent[],
  filters: ScheduleFilters,
): ScheduleEvent[] {
  return events.filter((event) => filters[event.category])
}

export function eventsForDate(events: ScheduleEvent[], iso: string): ScheduleEvent[] {
  return events.filter((event) => event.date === iso)
}

export function eventsForWeek(events: ScheduleEvent[], monday: Date): ScheduleEvent[] {
  const days = new Set(weekDaysFrom(monday).map(toIsoDate))
  return events.filter((event) => days.has(event.date))
}

export function dayIndexInWeek(iso: string, monday: Date): number {
  const days = weekDaysFrom(monday).map(toIsoDate)
  return days.indexOf(iso)
}

export function categoryFromFiltersKey(key: keyof ScheduleFilters): ScheduleCategory {
  return key
}

export function buildMonthCells(viewDate: Date): {
  year: number
  month: number
  cells: { iso: string; day: number; inMonth: boolean }[]
} {
  const y = viewDate.getFullYear()
  const m = viewDate.getMonth()
  const first = new Date(y, m, 1)
  const startPad = first.getDay()
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const cells: { iso: string; day: number; inMonth: boolean }[] = []

  const prevMonthDays = new Date(y, m, 0).getDate()
  for (let i = startPad - 1; i >= 0; i -= 1) {
    const day = prevMonthDays - i
    const d = new Date(y, m - 1, day)
    cells.push({ iso: toIsoDate(d), day, inMonth: false })
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    const d = new Date(y, m, day)
    cells.push({ iso: toIsoDate(d), day, inMonth: true })
  }
  while (cells.length % 7 !== 0 || cells.length < 35) {
    const overflow = cells.length - startPad - daysInMonth + 1
    const d = new Date(y, m + 1, overflow)
    cells.push({ iso: toIsoDate(d), day: d.getDate(), inMonth: false })
  }
  return { year: y, month: m, cells }
}
