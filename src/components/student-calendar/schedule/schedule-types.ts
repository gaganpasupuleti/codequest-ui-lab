export type ScheduleView = 'month' | 'week' | 'day'

export type ScheduleCategory = 'class' | 'quiz' | 'project' | 'practice' | 'focus'

export type ScheduleTrackId = 'live' | 'sql' | 'code' | 'mentor' | 'focus'

export interface ScheduleTrack {
  id: ScheduleTrackId
  label: string
  role: string
  initials: string
}

export interface ScheduleTeammate {
  id: string
  name: string
  initials: string
}

export interface ScheduleEvent {
  id: string
  title: string
  category: ScheduleCategory
  date: string
  startMinutes: number
  endMinutes: number
  trackId: ScheduleTrackId
  subtitle?: string
  teammates?: ScheduleTeammate[]
}

export interface ScheduleFilters {
  class: boolean
  quiz: boolean
  project: boolean
  practice: boolean
  focus: boolean
}

export const SCHEDULE_TRACKS: ScheduleTrack[] = [
  { id: 'live', label: 'Live Class', role: 'Instructor', initials: 'LC' },
  { id: 'sql', label: 'SQL Practice', role: 'Studio', initials: 'SQ' },
  { id: 'code', label: 'Code Workbench', role: 'Studio', initials: 'CW' },
  { id: 'mentor', label: 'Mentoring', role: '1:1', initials: 'MN' },
  { id: 'focus', label: 'Focus Block', role: 'Self', initials: 'FB' },
]

/** Cool CQ-aligned event tints — no purple / lime mockup palette. */
export const CATEGORY_META: Record<
  ScheduleCategory,
  { label: string; swatch: string; block: string; text: string }
> = {
  class: {
    label: 'Classes',
    swatch: 'bg-[#2563EB]',
    block: 'bg-[#EFF6FF] border-[#BFDBFE]',
    text: 'text-[#1E3A8A]',
  },
  quiz: {
    label: 'Quizzes',
    swatch: 'bg-[#D97706]',
    block: 'bg-[#FFFBEB] border-[#FDE68A]',
    text: 'text-[#92400E]',
  },
  project: {
    label: 'Projects',
    swatch: 'bg-[#059669]',
    block: 'bg-[#ECFDF5] border-[#A7F3D0]',
    text: 'text-[#065F46]',
  },
  practice: {
    label: 'Practice',
    swatch: 'bg-[#0284C7]',
    block: 'bg-[#F0F9FF] border-[#BAE6FD]',
    text: 'text-[#0C4A6E]',
  },
  focus: {
    label: 'Study time',
    swatch: 'bg-[#6B7280]',
    block: 'bg-[#F3F4F6] border-[#E5E7EB]',
    text: 'text-[#374151]',
  },
}

export const DEFAULT_FILTERS: ScheduleFilters = {
  class: true,
  quiz: true,
  project: true,
  practice: true,
  focus: true,
}
