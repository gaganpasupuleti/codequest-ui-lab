import { AlertTriangle, Lightbulb, Terminal } from 'lucide-react'
import { formatDuration } from '../utils/executionTimer'
import type { CodePracticeFeedback } from '../types/codePractice.types'
import { cn } from '@/lib/utils'
import { wb } from '@/lib/workbench-theme'

interface OutputPanelProps {
  output: string
  error: string | null
  consoleLines: string[]
  lastRunMs: number | null
  sampleInput?: string
  executionNote?: string | null
  runtimeLabel?: string | null
  feedbackItems?: CodePracticeFeedback[]
}

export function OutputPanel({
  output,
  error,
  consoleLines,
  lastRunMs,
  sampleInput,
  executionNote,
  runtimeLabel,
  feedbackItems = [],
}: OutputPanelProps) {
  return (
    <aside className={cn('flex h-full min-h-0 flex-col', wb.panel)}>
      <div className={cn('flex shrink-0 items-center justify-between border-b px-3 py-1.5', wb.border)}>
        <div className={cn('flex items-center gap-1.5 text-[12px] font-semibold', wb.textPrimary)}>
          <Terminal className="h-3.5 w-3.5 text-sky-300" />
          Output
        </div>
        <div className="flex flex-col items-end gap-0.5">
          {runtimeLabel && <span className="text-[11px] text-emerald-400">Runtime: {runtimeLabel}</span>}
          <span className={cn('text-[11px]', wb.textMuted)}>{formatDuration(lastRunMs)}</span>
        </div>
      </div>

      <div
        className={cn(
          'min-h-0 flex-1 space-y-3 overflow-y-auto p-3 text-[12px] font-mono leading-relaxed',
          wb.textSecondary,
        )}
      >
        {sampleInput && (
          <div>
            <p className={wb.sectionLabel}>Stdin</p>
            <pre className={cn('whitespace-pre-wrap', wb.cardMono)}>{sampleInput}</pre>
          </div>
        )}

        {executionNote && <p className="font-sans text-[12px] text-amber-300">{executionNote}</p>}

        {feedbackItems.length > 0 && (
          <div className="space-y-2">
            <p className={wb.sectionLabel}>Feedback</p>
            {feedbackItems.map((item, index) => (
              <div
                key={`${item.ruleId}-${item.lineNumber ?? index}`}
                className={cn(
                  'rounded-md border p-2.5 font-sans text-[12px]',
                  item.severity === 'error' && 'border-red-800/70 bg-red-950/40 text-red-100',
                  item.severity === 'warning' && 'border-amber-800/60 bg-amber-950/30 text-amber-50',
                  item.severity === 'info' && 'border-sky-800/60 bg-sky-950/30 text-sky-50',
                )}
              >
                <div className="mb-1 flex items-center gap-1.5 font-medium">
                  <Lightbulb className="h-3.5 w-3.5 shrink-0 opacity-90" />
                  {item.title}
                  {item.lineNumber ? (
                    <span className={cn('text-[11px] font-normal', wb.textMuted)}>
                      · line {item.lineNumber}
                    </span>
                  ) : null}
                </div>
                <p className="leading-relaxed">{item.message}</p>
                {item.suggestion && (
                  <p className="mt-1.5 text-[12px] text-sky-200">Suggestion: {item.suggestion}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-800/70 bg-red-950/50 p-2.5 text-red-100">
            <div className="mb-1 flex items-center gap-1.5 text-red-300">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span className="text-[12px] font-semibold">Error</span>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-[12px] leading-relaxed">{error}</pre>
          </div>
        )}

        <div>
          <p className={wb.sectionLabel}>Stdout</p>
          <pre className={cn('whitespace-pre-wrap', wb.textPrimary)}>
            {output || <span className={wb.textMuted}>Run code to see output…</span>}
          </pre>
        </div>

        {consoleLines.length > 0 && (
          <div>
            <p className={wb.sectionLabel}>Console</p>
            <pre className={cn('whitespace-pre-wrap', wb.textSecondary)}>{consoleLines.join('\n')}</pre>
          </div>
        )}
      </div>
    </aside>
  )
}
