import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  Swords,
  Video,
  Map,
  FileText,
  Briefcase,
  Library,
  TrendingUp,
  Settings,
} from 'lucide-react'

export type PastelNavItem = {
  label: string
  href?: string
  icon: LucideIcon
  disabled?: boolean
  hint?: string
}

/** Valid existing routes only — Live Classes is disabled until a route exists. */
export const PASTEL_NAV: PastelNavItem[] = [
  { label: 'Explore', href: '/practice', icon: Compass },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Learning', href: '/materials', icon: BookOpen },
  { label: 'Practice', href: '/practice', icon: Swords },
  { label: 'Live Classes', icon: Video, disabled: true, hint: 'Coming soon' },
  { label: 'Career Map', href: '/career-map', icon: Map },
  { label: 'Resume Quest', href: '/resume-lab', icon: FileText },
  { label: 'Jobs', href: '/jobs', icon: Briefcase },
  { label: 'Materials', href: '/materials', icon: Library },
  { label: 'Progress', href: '/progress', icon: TrendingUp },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export const POPULAR_TRACKS = [
  { label: 'Python', href: '/python-lab' },
  { label: 'SQL', href: '/sql-arena' },
  { label: 'Data Analytics', href: '/materials' },
  { label: 'DSA', href: '/dsa' },
  { label: 'Aptitude', href: '/aptitude' },
  { label: 'AI Tools', href: '/practice' },
] as const

/** Illustrative mentor/live-class when no live backend exists. */
export const ILLUSTRATIVE = {
  mentor: {
    name: 'Priya Nair',
    subject: 'SQL & Analytics',
    experience: '8 yrs',
    nextSlot: 'Thu · 5:00 pm',
    available: true,
  },
  liveClass: {
    title: 'Window Functions Live Lab',
    teacher: 'Priya Nair',
    time: 'Today · 5:00 pm',
    duration: '45 min',
  },
  weeklyGoal: {
    targetHours: 8,
    completedHours: 5.5,
  },
} as const
