import { Badge } from '@/components/ui/badge'
import type { CodePracticeQuestion } from '../types/codePractice.types'
import { resolveQuestionTestCases } from '../utils/executionAdapter'
import { wb } from '@/lib/workbench-theme'
import { cn } from '@/lib/utils'

interface ProblemPanelProps {
  question: CodePracticeQuestion | null
  languageLabel: string
}

export function ProblemPanel({ question, languageLabel }: ProblemPanelProps) {
  if (!question) {
    return (
      <aside className={cn('flex h-full flex-col p-3', wb.panel)}>
        <p className={cn('text-[13px] font-semibold', wb.textPrimary)}>{languageLabel}</p>
        <p className={cn('mt-2 text-[13px] leading-relaxed', wb.textSecondary)}>
          Questions for this language are coming soon. Select Python, JavaScript, Java, or React.
        </p>
      </aside>
    )
  }

  return (
    <aside className={cn('flex h-full min-h-0 flex-col overflow-hidden', wb.panel)}>
      <div className={cn('shrink-0 border-b px-3 py-2.5', wb.border)}>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant="outline"
            className={cn('border-[#3d4f6f] text-[10px] uppercase', wb.textSecondary)}
          >
            {question.difficulty}
          </Badge>
          <Badge variant="outline" className="border-sky-600/60 text-[10px] text-sky-200">
            {question.topic}
          </Badge>
        </div>
        <h2 className={cn('mt-1.5 text-[14px] font-semibold leading-snug', wb.textPrimary)}>
          {question.title}
        </h2>
      </div>

      <div
        className={cn(
          'min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-3 text-[13px] leading-relaxed',
          wb.textSecondary,
        )}
      >
        <section>
          <h3 className={wb.sectionLabel}>Problem</h3>
          <p className={wb.textPrimary}>{question.description}</p>
        </section>

        <section>
          <h3 className={wb.sectionLabel}>Examples</h3>
          <div className="space-y-2">
            {question.examples.map((ex, i) => (
              <div key={i} className={wb.cardMono}>
                <div>
                  <span className={wb.textMuted}>Input:</span> {ex.input}
                </div>
                <div>
                  <span className={wb.textMuted}>Output:</span> {ex.output}
                </div>
                {ex.explanation && (
                  <p className={cn('mt-1.5 font-sans text-[12px] leading-relaxed', wb.textMuted)}>
                    {ex.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {(question.defaultInput || (question.testCases?.length ?? 0) > 0) && (
          <section>
            <h3 className={wb.sectionLabel}>Sample input</h3>
            {question.defaultInput && (
              <pre className={cn(wb.cardMono, 'whitespace-pre-wrap')}>{question.defaultInput}</pre>
            )}
            <div className="mt-2 space-y-1.5">
              {resolveQuestionTestCases(question).map((tc) => (
                <div
                  key={tc.id}
                  className={cn(
                    'rounded-md border px-2.5 py-1.5 text-[12px]',
                    wb.border,
                    'bg-[#111827]',
                    wb.textMuted,
                  )}
                >
                  <span className={wb.textSecondary}>{tc.label}:</span>{' '}
                  {tc.input ? `input → ${tc.input.replace(/\n/g, '\\n')}` : 'no stdin'} →{' '}
                  {tc.expectedOutput.replace(/\n/g, '\\n')}
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h3 className={wb.sectionLabel}>Constraints</h3>
          <ul className={cn('list-disc space-y-1 pl-4', wb.textSecondary)}>
            {question.constraints.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  )
}
