import { memo, useCallback, useEffect, useMemo, useState, type MouseEvent } from 'react'
import type { Node, NodeProps, NodeTypes } from '@xyflow/react'
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Check, Diamond, Flag, Hexagon, Play, X } from 'lucide-react'

import type { StageProgressRecord } from '@/lib/api'
import type { CareerJourneySummary } from '@/lib/career-local-summary'
import { getMistakesSummary } from '@/lib/practice-progress-summary'
import {
  buildProgressJourneyGraph,
  type ProgressNodeData,
  type ProgressNodeStatus,
} from '@/components/student-progress/progress-journey-graph'
import type { SkillNavTarget, SkillProgressItem } from '@/components/student-progress/skill-progress-items'
import { CQ_BODY, CQ_BODY_STRONG, CQ_LABEL, CQ_META, CQ_SECTION_TITLE } from '@/components/student-dashboard/cq/cqTheme'
import { cn } from '@/lib/utils'

const NODE_SURFACE: Record<ProgressNodeStatus, string> = {
  done: 'border-[#A8C07A] bg-[#C2CDB0] text-[#1A2E0A]',
  active: 'border-[#7C5CBF] bg-[#DDD0F5] text-[#2E1065]',
  todo: 'border-[#708090]/25 bg-[#FFFDF6] text-[#111827]',
  blocked: 'border-[#708090]/20 bg-[#F2EBD6] text-[#708090]',
}

const ProgressNode = memo(function ProgressNode({ data, selected }: NodeProps) {
  const node = data as ProgressNodeData
  const isDecision = node.kind === 'decision'
  const isEndpoint = node.kind === 'start' || node.kind === 'end'

  return (
    <div
      className={cn(
        'relative min-w-[148px] max-w-[180px] border shadow-[0_10px_24px_-18px_rgba(10,16,32,0.55)] transition-transform',
        selected && 'ring-2 ring-[#2563EB]/45 ring-offset-2 ring-offset-[#F2EBD6]',
        isDecision
          ? 'rotate-0 rounded-2xl px-3 py-3'
          : isEndpoint
            ? 'rounded-full px-4 py-2.5'
            : 'rounded-2xl px-3.5 py-3',
        NODE_SURFACE[node.status],
        node.kind === 'start' && 'bg-[#0A1020] text-[#FAF3E0] border-[#0A1020]',
        node.kind === 'end' && node.status === 'done' && 'bg-[#0A1020] text-[#FAF3E0] border-[#0A1020]',
      )}
    >
      <Handle type="target" position={Position.Left} className="!h-2 !w-2 !border-0 !bg-[#0A1020]/40" />
      <div className="flex items-start gap-2">
        <span className="mt-0.5 shrink-0 opacity-80">
          {node.kind === 'start' ? (
            <Play className="h-3.5 w-3.5" />
          ) : node.kind === 'end' ? (
            <Flag className="h-3.5 w-3.5" />
          ) : node.kind === 'decision' ? (
            <Diamond className="h-3.5 w-3.5" />
          ) : node.kind === 'skill' ? (
            <Hexagon className="h-3.5 w-3.5" />
          ) : node.status === 'done' ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Hexagon className="h-3.5 w-3.5" />
          )}
        </span>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold leading-snug">{node.label}</p>
          {typeof node.pct === 'number' && (
            <p className="mt-0.5 text-[11px] font-medium tabular-nums opacity-80">{node.pct}%</p>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !border-0 !bg-[#0A1020]/40" />
    </div>
  )
})

const nodeTypes: NodeTypes = {
  progress: ProgressNode,
}

function FitViewOnReady({ nodeCount }: { nodeCount: number }) {
  const { fitView } = useReactFlow()
  useEffect(() => {
    const t = window.setTimeout(() => {
      void fitView({ padding: 0.18, duration: 240, minZoom: 0.55, maxZoom: 1.15 })
    }, 40)
    return () => window.clearTimeout(t)
  }, [fitView, nodeCount])
  return null
}

interface ProgressJourneyFlowProps {
  careerJourney: CareerJourneySummary | null
  stageRows: StageProgressRecord[] | null
  skillItems: SkillProgressItem[]
  onNavigate: (page: SkillNavTarget) => void
}

function ProgressJourneyFlowInner({
  careerJourney,
  stageRows,
  skillItems,
  onNavigate,
}: ProgressJourneyFlowProps) {
  const mistakeTotal = getMistakesSummary().total
  const graph = useMemo(
    () =>
      buildProgressJourneyGraph({
        careerJourney,
        stageRows,
        skillItems,
        mistakeTotal,
      }),
    [careerJourney, mistakeTotal, skillItems, stageRows],
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(graph.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(graph.edges)
  const [selected, setSelected] = useState<ProgressNodeData | null>(null)

  useEffect(() => {
    setNodes(graph.nodes)
    setEdges(graph.edges)
    setSelected(null)
  }, [graph, setEdges, setNodes])

  const onNodeClick = useCallback((_: MouseEvent, node: Node) => {
    setSelected(node.data as ProgressNodeData)
  }, [])

  const onPaneClick = useCallback(() => setSelected(null), [])

  return (
    <div className="relative h-full min-h-0 w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.4}
        maxZoom={1.4}
        proOptions={{ hideAttribution: true }}
        className="bg-[#F2EBD6]"
        defaultEdgeOptions={{
          style: { stroke: '#708090', strokeWidth: 1.75 },
        }}
      >
        <Background
          id="progress-dots"
          variant={BackgroundVariant.Dots}
          gap={18}
          size={1.4}
          color="#0A1020"
          className="opacity-[0.12]"
        />
        <Controls
          showInteractive={false}
          className="!overflow-hidden !rounded-xl !border !border-[#708090]/25 !bg-[#FFFDF6] !shadow-sm [&>button]:!border-[#708090]/20 [&>button]:!bg-[#FFFDF6]"
        />
        <MiniMap
          pannable
          zoomable
          className="!overflow-hidden !rounded-xl !border !border-[#708090]/25 !bg-[#FFFDF6]"
          maskColor="rgba(10,16,32,0.08)"
          nodeColor={(n) => {
            const status = (n.data as ProgressNodeData | undefined)?.status
            if (status === 'done') return '#C2CDB0'
            if (status === 'active') return '#DDD0F5'
            return '#FFFDF6'
          }}
        />
        <FitViewOnReady nodeCount={nodes.length} />
      </ReactFlow>

      {selected && (
        <aside className="absolute right-3 top-3 z-10 w-[min(100%-1.5rem,300px)] overflow-hidden rounded-2xl border border-[#708090]/20 bg-[#FFFDF6] shadow-[0_18px_40px_-24px_rgba(10,16,32,0.55)]">
          <div
            className={cn(
              'flex items-start justify-between gap-2 px-3.5 py-3',
              selected.status === 'done' && 'bg-[#C2CDB0]',
              selected.status === 'active' && 'bg-[#DDD0F5]',
              (selected.status === 'todo' || selected.status === 'blocked') && 'bg-[#F3DFA0]',
              selected.kind === 'start' && 'bg-[#0A1020] text-[#FAF3E0]',
            )}
          >
            <div className="min-w-0">
              <p
                className={cn(
                  CQ_LABEL,
                  selected.kind === 'start' ? 'text-[#FAF3E0]/70' : 'text-[#0A1020]/60',
                )}
              >
                {selected.kind === 'decision' ? 'Checkpoint' : selected.kind}
              </p>
              <h3
                className={cn(
                  CQ_SECTION_TITLE,
                  'mt-0.5 text-[15px]',
                  selected.kind === 'start' && 'text-[#FAF3E0]',
                )}
              >
                {selected.label}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className={cn(
                'grid h-7 w-7 place-items-center rounded-full transition-colors',
                selected.kind === 'start'
                  ? 'text-[#FAF3E0]/80 hover:bg-white/10'
                  : 'text-[#374151] hover:bg-[#0A1020]/8',
              )}
              aria-label="Close details"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3 px-3.5 py-3">
            <p className={CQ_BODY}>{selected.detail}</p>
            {typeof selected.pct === 'number' && (
              <div>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className={CQ_META}>Progress</span>
                  <span className={cn(CQ_BODY_STRONG, 'tabular-nums')}>{selected.pct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#0A1020]/10">
                  <div
                    className="h-full rounded-full bg-[#0A1020]/75"
                    style={{ width: `${Math.max(0, Math.min(100, selected.pct))}%` }}
                  />
                </div>
              </div>
            )}
            {selected.meta && <p className={CQ_META}>{selected.meta}</p>}
            {selected.action && (
              <button
                type="button"
                onClick={() => onNavigate(selected.action!.href)}
                className="inline-flex w-full items-center justify-center rounded-full bg-[#0A1020] px-4 py-2 text-[13px] font-semibold text-[#FAF3E0] transition-colors hover:bg-[#121A2E]"
              >
                {selected.action.label}
              </button>
            )}
          </div>
        </aside>
      )}
    </div>
  )
}

export function ProgressJourneyFlow(props: ProgressJourneyFlowProps) {
  return (
    <ReactFlowProvider>
      <ProgressJourneyFlowInner {...props} />
    </ReactFlowProvider>
  )
}
