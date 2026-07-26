import { toIsoDate } from '@/lib/calendar-events'

import type { ScheduleEvent } from './schedule-types'
import { addDays, getMondayOfWeek } from './schedule-utils'

function offsetFromMonday(days: number): string {
  const monday = getMondayOfWeek(new Date())
  return toIsoDate(addDays(monday, days))
}

const teammates = {
  alex: { id: 't1', name: 'Alex Mentor', initials: 'AM' },
  priya: { id: 't2', name: 'Priya Coach', initials: 'PC' },
  jordan: { id: 't3', name: 'Jordan TA', initials: 'JT' },
  sam: { id: 't4', name: 'Sam Peer', initials: 'SP' },
}

/**
 * Student timetable for the current week — Google Calendar style class blocks.
 * Dense enough that week view reads as a real class schedule.
 */
export function buildScheduleDemoEvents(): ScheduleEvent[] {
  return [
    // Monday
    {
      id: 'c-mon-1',
      title: 'SQL Fundamentals',
      category: 'class',
      date: offsetFromMonday(0),
      startMinutes: 8 * 60 + 20,
      endMinutes: 9 * 60 + 40,
      trackId: 'live',
      subtitle: 'Live class · Joins',
      teammates: [teammates.alex, teammates.jordan],
    },
    {
      id: 'c-mon-2',
      title: 'SQL Practice drills',
      category: 'practice',
      date: offsetFromMonday(0),
      startMinutes: 10 * 60,
      endMinutes: 11 * 60 + 20,
      trackId: 'sql',
      subtitle: 'Studio · 12 problems',
      teammates: [teammates.sam],
    },
    {
      id: 'c-mon-3',
      title: 'Study hall',
      category: 'focus',
      date: offsetFromMonday(0),
      startMinutes: 13 * 60,
      endMinutes: 14 * 60 + 30,
      trackId: 'focus',
      subtitle: 'Workbook catch-up',
    },

    // Tuesday
    {
      id: 'c-tue-1',
      title: 'Python functions lab',
      category: 'class',
      date: offsetFromMonday(1),
      startMinutes: 8 * 60 + 30,
      endMinutes: 9 * 60 + 50,
      trackId: 'live',
      subtitle: 'Live class · Modules',
      teammates: [teammates.priya],
    },
    {
      id: 'c-tue-2',
      title: 'Code Workbench',
      category: 'practice',
      date: offsetFromMonday(1),
      startMinutes: 11 * 60,
      endMinutes: 12 * 60 + 30,
      trackId: 'code',
      subtitle: 'Easy → Medium',
      teammates: [teammates.jordan, teammates.sam],
    },
    {
      id: 'c-tue-3',
      title: 'Mentor office hours',
      category: 'class',
      date: offsetFromMonday(1),
      startMinutes: 14 * 60,
      endMinutes: 15 * 60,
      trackId: 'mentor',
      subtitle: '1:1 drop-in',
      teammates: [teammates.alex],
    },

    // Wednesday
    {
      id: 'c-wed-1',
      title: 'Data modeling quiz',
      category: 'quiz',
      date: offsetFromMonday(2),
      startMinutes: 9 * 60,
      endMinutes: 9 * 60 + 45,
      trackId: 'live',
      subtitle: 'Module quiz · 15 Qs',
    },
    {
      id: 'c-wed-2',
      title: 'UX of data stories',
      category: 'class',
      date: offsetFromMonday(2),
      startMinutes: 10 * 60 + 30,
      endMinutes: 12 * 60,
      trackId: 'live',
      subtitle: 'Live class',
      teammates: [teammates.priya, teammates.jordan],
    },
    {
      id: 'c-wed-3',
      title: 'Typing practice',
      category: 'practice',
      date: offsetFromMonday(2),
      startMinutes: 14 * 60 + 30,
      endMinutes: 15 * 60 + 20,
      trackId: 'focus',
      subtitle: 'Target 40 WPM',
    },

    // Thursday
    {
      id: 'c-thu-1',
      title: 'SQL advanced joins',
      category: 'class',
      date: offsetFromMonday(3),
      startMinutes: 8 * 60 + 20,
      endMinutes: 9 * 60 + 40,
      trackId: 'live',
      subtitle: 'Live class',
      teammates: [teammates.alex],
    },
    {
      id: 'c-thu-2',
      title: 'Mini project draft',
      category: 'project',
      date: offsetFromMonday(3),
      startMinutes: 11 * 60,
      endMinutes: 13 * 60,
      trackId: 'code',
      subtitle: 'Milestone 1',
      teammates: [teammates.priya, teammates.sam],
    },
    {
      id: 'c-thu-3',
      title: 'Peer review circle',
      category: 'class',
      date: offsetFromMonday(3),
      startMinutes: 14 * 60,
      endMinutes: 15 * 60,
      trackId: 'mentor',
      subtitle: 'Group critique',
      teammates: [teammates.jordan, teammates.sam],
    },

    // Friday
    {
      id: 'c-fri-1',
      title: 'Power BI visuals',
      category: 'class',
      date: offsetFromMonday(4),
      startMinutes: 9 * 60,
      endMinutes: 10 * 60 + 30,
      trackId: 'live',
      subtitle: 'Live workshop',
      teammates: [teammates.priya],
    },
    {
      id: 'c-fri-2',
      title: 'SQL Practice studio',
      category: 'practice',
      date: offsetFromMonday(4),
      startMinutes: 11 * 60 + 30,
      endMinutes: 12 * 60 + 30,
      trackId: 'sql',
      subtitle: 'Open lab',
    },
    {
      id: 'c-fri-3',
      title: 'Portfolio ship check',
      category: 'project',
      date: offsetFromMonday(4),
      startMinutes: 14 * 60,
      endMinutes: 15 * 60 + 30,
      trackId: 'code',
      subtitle: 'README + demo',
      teammates: [teammates.alex],
    },

    // Saturday
    {
      id: 'c-sat-1',
      title: 'Weekend catch-up',
      category: 'focus',
      date: offsetFromMonday(5),
      startMinutes: 10 * 60,
      endMinutes: 11 * 60 + 30,
      trackId: 'focus',
      subtitle: 'Optional study',
    },
    {
      id: 'c-sat-2',
      title: 'Code Workbench',
      category: 'practice',
      date: offsetFromMonday(5),
      startMinutes: 13 * 60,
      endMinutes: 14 * 60 + 20,
      trackId: 'code',
      subtitle: 'Practice set',
    },

    // Sunday
    {
      id: 'c-sun-1',
      title: 'Week preview',
      category: 'class',
      date: offsetFromMonday(6),
      startMinutes: 11 * 60,
      endMinutes: 12 * 60,
      trackId: 'live',
      subtitle: 'Async briefing',
      teammates: [teammates.jordan],
    },
  ]
}
