import { dummyStudent } from './dummyStudent'
import { dummyJobs } from './dummyJobs'
import { dummyMaterials } from './dummyMaterials'

export type FeedItemKind = 'deadline' | 'job' | 'book'

export interface MissionFeedItem {
  id: string
  kind: FeedItemKind
  title: string
  meta: string
  badge?: string
}

export const missionFeedItems: MissionFeedItem[] = [
  ...dummyStudent.upcomingTasks.map((t) => ({
    id: `deadline-${t.id}`,
    kind: 'deadline' as const,
    title: t.title,
    meta: `Due ${t.due}`,
    badge: 'Deadline',
  })),
  ...dummyJobs.slice(0, 4).map((j) => ({
    id: `job-${j.id}`,
    kind: 'job' as const,
    title: `${j.role} @ ${j.company}`,
    meta: j.posted,
    badge: 'New job',
  })),
  ...dummyMaterials
    .filter((m) => m.type === 'book' || m.featured)
    .slice(0, 5)
    .map((m) => ({
      id: `book-${m.id}`,
      kind: 'book' as const,
      title: m.title,
      meta: m.category,
      badge: m.type === 'book' ? 'New book' : 'New material',
    })),
]
