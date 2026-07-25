import { useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { wb } from '@/lib/workbench-theme'

type BottomTab = 'tests' | 'hints' | 'mistakes' | 'history'

interface CodeWorkbenchLayoutProps {
  toolbar: ReactNode
  problemPanel: ReactNode
  editorPanel: ReactNode
  outputPanel: ReactNode
  livePreview?: ReactNode
  testResults: ReactNode
  hints: ReactNode
  mistakes: ReactNode
  attemptHistory: ReactNode
  questionPicker?: ReactNode
}

const BOTTOM_TABS: Array<{ id: BottomTab; label: string }> = [
  { id: 'tests', label: 'Tests' },
  { id: 'hints', label: 'Hints' },
  { id: 'mistakes', label: 'Mistakes' },
  { id: 'history', label: 'History' },
]

export function CodeWorkbenchLayout({
  toolbar,
  problemPanel,
  editorPanel,
  outputPanel,
  livePreview,
  testResults,
  hints,
  mistakes,
  attemptHistory,
  questionPicker,
}: CodeWorkbenchLayoutProps) {
  const [bottomTab, setBottomTab] = useState<BottomTab>('tests')

  return (
    <div className={cn('practice-workbench-shell flex min-h-0 flex-1 flex-col overflow-hidden', wb.root)}>
      <div className="min-w-0 shrink-0 overflow-x-auto">{toolbar}</div>
      {questionPicker ? <div className="min-w-0 shrink-0 overflow-x-auto">{questionPicker}</div> : null}

      <div
        className={cn(
          'grid min-h-0 min-w-0 flex-1 grid-cols-1 overflow-y-auto lg:overflow-hidden',
          livePreview
            ? 'lg:grid-cols-[minmax(200px,min(28vw,280px))_minmax(0,1fr)_minmax(200px,min(30vw,300px))]'
            : 'lg:grid-cols-[minmax(200px,min(28vw,280px))_minmax(0,1fr)_minmax(200px,min(28vw,280px))]',
        )}
      >
        <div className="min-h-[min(40dvh,280px)] min-w-0 overflow-hidden border-b lg:min-h-0 lg:border-b-0 lg:border-r lg:border-[#26324A]">
          {problemPanel}
        </div>

        <div
          className={cn(
            'flex min-h-[min(50dvh,360px)] min-w-0 flex-col lg:min-h-0',
            livePreview && 'lg:border-x',
            wb.border,
          )}
        >
          <div className="min-h-0 min-w-0 flex-1 overflow-hidden">{editorPanel}</div>
          {livePreview && (
            <div className={cn('border-t p-2 lg:hidden', wb.border)}>{livePreview}</div>
          )}
        </div>

        <div className="flex min-h-[min(35dvh,240px)] min-w-0 flex-col overflow-hidden border-t lg:min-h-0 lg:border-t-0 lg:border-l lg:border-[#26324A]">
          {livePreview && (
            <div className={cn('hidden max-h-[40%] shrink-0 overflow-hidden border-b p-2 lg:block', wb.border)}>
              {livePreview}
            </div>
          )}
          <div className="min-h-0 min-w-0 flex-1 overflow-hidden">{outputPanel}</div>
        </div>
      </div>

      <div className={cn('shrink-0 border-t', wb.panel, wb.border)}>
        <div className={cn('cq-h-scroll flex gap-0.5 border-b px-2', wb.border)}>
          {BOTTOM_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setBottomTab(tab.id)}
              className={cn(
                'min-h-10 shrink-0 px-3 py-2 text-[12px] font-medium transition-colors',
                bottomTab === tab.id ? wb.tabActive : wb.tabInactive,
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="max-h-[min(40dvh,12rem)] overflow-y-auto">
          {bottomTab === 'tests' && testResults}
          {bottomTab === 'hints' && hints}
          {bottomTab === 'mistakes' && mistakes}
          {bottomTab === 'history' && attemptHistory}
        </div>
      </div>
    </div>
  )
}
