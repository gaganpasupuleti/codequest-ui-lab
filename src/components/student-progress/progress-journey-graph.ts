import type { Edge, Node } from '@xyflow/react'

import type { StageProgressRecord } from '@/lib/api'
import type { CareerJourneySummary } from '@/lib/career-local-summary'
import type { SkillNavTarget, SkillProgressItem } from '@/components/student-progress/skill-progress-items'

export type ProgressNodeStatus = 'done' | 'active' | 'todo' | 'blocked'
export type ProgressNodeKind = 'start' | 'process' | 'skill' | 'decision' | 'end'

export interface ProgressNodeData {
  label: string
  status: ProgressNodeStatus
  kind: ProgressNodeKind
  detail: string
  pct?: number
  meta?: string
  action?: { label: string; href: SkillNavTarget }
  [key: string]: unknown
}

function stageStatus(row: StageProgressRecord): ProgressNodeStatus {
  if (!row.unlocked && row.lessons_completed === 0) return 'blocked'
  if (row.total_lessons > 0 && row.lessons_completed >= row.total_lessons) return 'done'
  if (row.lessons_completed > 0 || row.unlocked) return 'active'
  return 'todo'
}

function skillStatus(pct: number): ProgressNodeStatus {
  if (pct >= 100) return 'done'
  if (pct > 0) return 'active'
  return 'todo'
}

function fallbackStages(careerJourney: CareerJourneySummary | null): ProgressNodeData[] {
  const topics = [
    ...(careerJourney?.completedTopics ?? []).slice(0, 3).map((title) => ({
      label: title,
      status: 'done' as const,
      pct: 100,
    })),
    ...(careerJourney?.remainingTopics ?? []).slice(0, 4).map((title, i) => ({
      label: title,
      status: (i === 0 ? 'active' : 'todo') as ProgressNodeStatus,
      pct: i === 0 ? Math.max(careerJourney?.pct ?? 0, 10) : 0,
    })),
  ]

  if (topics.length === 0) {
    return [
      { label: 'Foundations', status: 'todo', kind: 'process', detail: 'Start your path in Career Map', pct: 0 },
      { label: 'Core skills', status: 'todo', kind: 'process', detail: 'Lessons unlock as you progress', pct: 0 },
      { label: 'Projects', status: 'todo', kind: 'process', detail: 'Ship portfolio work', pct: 0 },
      { label: 'Interview prep', status: 'todo', kind: 'process', detail: 'Practice and readiness checks', pct: 0 },
    ]
  }

  return topics.map((t) => ({
    label: t.label,
    status: t.status,
    kind: 'process' as const,
    detail:
      t.status === 'done'
        ? 'Completed in your career path'
        : t.status === 'active'
          ? careerJourney?.nextLessonTitle
            ? `Up next: ${careerJourney.nextLessonTitle}`
            : 'In progress'
          : 'Upcoming in your syllabus',
    pct: t.pct,
    meta: careerJourney?.currentStageLabel ?? undefined,
  }))
}

export function buildProgressJourneyGraph(input: {
  careerJourney: CareerJourneySummary | null
  stageRows: StageProgressRecord[] | null
  skillItems: SkillProgressItem[]
  mistakeTotal: number
}): { nodes: Node<ProgressNodeData>[]; edges: Edge[] } {
  const { careerJourney, stageRows, skillItems, mistakeTotal } = input
  const nodes: Node<ProgressNodeData>[] = []
  const edges: Edge[] = []

  const processData: ProgressNodeData[] =
    stageRows && stageRows.length > 0
      ? stageRows.map((row) => {
          const pct =
            row.total_lessons > 0
              ? Math.round((row.lessons_completed / row.total_lessons) * 100)
              : Math.round(row.exercises_completed_pct)
          const status = stageStatus(row)
          return {
            label: `Stage ${row.stage_id}`,
            status,
            kind: 'process',
            detail: `${row.lessons_completed}/${row.total_lessons} lessons · quiz ${row.latest_quiz_score}%`,
            pct,
            meta: status === 'blocked' ? 'Locked' : undefined,
            action: { label: 'Open Career Map', href: 'roadmapper' },
          }
        })
      : fallbackStages(careerJourney)

  nodes.push({
    id: 'start',
    type: 'progress',
    position: { x: 40, y: 120 },
    data: {
      label: 'Start',
      status: 'done',
      kind: 'start',
      detail: careerJourney?.title
        ? `Path: ${careerJourney.title}`
        : 'Pick a career path to personalize this map',
      action: careerJourney ? undefined : { label: 'Open Career Map', href: 'roadmapper' },
    },
  })

  const processIds: string[] = []
  processData.forEach((data, index) => {
    const id = `stage-${index}`
    processIds.push(id)
    const col = index % 3
    const row = Math.floor(index / 3)
    nodes.push({
      id,
      type: 'progress',
      position: { x: 220 + col * 220, y: 40 + row * 140 },
      data,
    })
  })

  let prev = 'start'
  for (const id of processIds) {
    edges.push({
      id: `e-${prev}-${id}`,
      source: prev,
      target: id,
      type: 'smoothstep',
      animated: nodes.find((n) => n.id === id)?.data.status === 'active',
    })
    prev = id
  }

  const skillY = 40 + Math.ceil(Math.max(processData.length, 1) / 3) * 140 + 40
  skillItems.forEach((item, index) => {
    const id = `skill-${item.id}`
    const col = index % 3
    const row = Math.floor(index / 3)
    nodes.push({
      id,
      type: 'progress',
      position: { x: 220 + col * 220, y: skillY + row * 120 },
      data: {
        label: item.label,
        status: skillStatus(item.pct),
        kind: 'skill',
        detail: item.detail,
        pct: item.pct,
        action: item.href
          ? { label: item.actionLabel ?? 'Open', href: item.href }
          : undefined,
      },
    })
    edges.push({
      id: `e-${prev}-${id}`,
      source: prev,
      target: id,
      type: 'smoothstep',
    })
  })

  const lastSkillId =
    skillItems.length > 0 ? `skill-${skillItems[skillItems.length - 1]!.id}` : prev
  const decisionY = skillY + Math.ceil(Math.max(skillItems.length, 1) / 3) * 120 + 40

  nodes.push({
    id: 'mistakes',
    type: 'progress',
    position: { x: 440, y: decisionY },
    data: {
      label: 'Review mistakes?',
      status: mistakeTotal > 0 ? 'active' : 'done',
      kind: 'decision',
      detail:
        mistakeTotal > 0
          ? `${mistakeTotal} saved mistakes ready to retry`
          : 'No mistakes queued — keep practicing',
      action: { label: 'Code practice', href: 'practice-code' },
    },
  })
  edges.push({
    id: `e-${lastSkillId}-mistakes`,
    source: lastSkillId,
    target: 'mistakes',
    type: 'smoothstep',
    animated: mistakeTotal > 0,
  })

  const coursePct = careerJourney?.pct ?? 0
  nodes.push({
    id: 'ready',
    type: 'progress',
    position: { x: 660, y: decisionY + 20 },
    data: {
      label: 'Career ready',
      status: coursePct >= 80 ? 'done' : coursePct > 0 ? 'active' : 'todo',
      kind: 'end',
      detail: `${coursePct}% course complete · keep shipping practice and projects`,
      pct: coursePct,
      action: { label: 'Open Career Map', href: 'roadmapper' },
    },
  })
  edges.push({
    id: 'e-mistakes-ready',
    source: 'mistakes',
    target: 'ready',
    type: 'smoothstep',
  })

  return { nodes, edges }
}
