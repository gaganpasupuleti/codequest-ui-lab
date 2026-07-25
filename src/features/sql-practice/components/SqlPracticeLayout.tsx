import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { wb } from '@/lib/workbench-theme'
import type { ResizableSqlLayout } from '../hooks/useResizableSqlLayout'
import { SqlExpandRail } from './SqlExpandRail'
import { SqlPaneResizeHandle } from './SqlPaneResizeHandle'

interface SqlPracticeLayoutProps {
  topBar: ReactNode
  objectExplorer: ReactNode
  editorPanel: ReactNode
  questionPanel: ReactNode
  bottomPanel: ReactNode
  statusBar: ReactNode
  layout: ResizableSqlLayout
}

export function SqlPracticeLayout({
  topBar,
  objectExplorer,
  editorPanel,
  questionPanel,
  bottomPanel,
  statusBar,
  layout,
}: SqlPracticeLayoutProps) {
  const { layout: state, desktopLayout, startResizeLeft, startResizeRight, startResizeBottom, toggleLeftCollapsed, toggleRightCollapsed, toggleBottomCollapsed } =
    layout

  if (!desktopLayout) {
    return (
      <div className={cn('practice-workbench-shell flex min-h-0 flex-1 flex-col', wb.root)}>
        <div className="min-w-0 shrink-0 overflow-x-auto">{topBar}</div>
        <div className="grid min-h-0 min-w-0 flex-1 grid-cols-1 overflow-y-auto">
          <div className="min-h-[min(35dvh,240px)] min-w-0 border-b">{objectExplorer}</div>
          <div className={cn('flex min-h-[min(50dvh,360px)] min-w-0 flex-col', wb.border, 'border-b')}>
            {editorPanel}
          </div>
          <div className="min-h-[min(35dvh,240px)] min-w-0 border-b">{questionPanel}</div>
        </div>
        <div className="min-w-0 shrink-0">{bottomPanel}</div>
        <div className="min-w-0 shrink-0 overflow-x-auto">{statusBar}</div>
      </div>
    )
  }

  return (
    <div className={cn('practice-workbench-shell flex min-h-0 flex-1 flex-col overflow-hidden', wb.root)}>
      <div className="min-w-0 shrink-0 overflow-x-auto">{topBar}</div>
      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        {state.isLeftCollapsed ? (
          <SqlExpandRail side="left" label="Object Explorer" onExpand={toggleLeftCollapsed} />
        ) : (
          <>
            <div
              className={cn('flex min-h-0 shrink-0 flex-col overflow-hidden border-r', wb.border)}
              style={{ width: state.leftWidth }}
            >
              {objectExplorer}
            </div>
            <SqlPaneResizeHandle direction="horizontal" onMouseDown={startResizeLeft} />
          </>
        )}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{editorPanel}</div>
          {state.isBottomCollapsed ? (
            <SqlExpandRail side="bottom" label="Results" onExpand={toggleBottomCollapsed} />
          ) : (
            <>
              <SqlPaneResizeHandle direction="vertical" onMouseDown={startResizeBottom} />
              <div
                className={cn('flex min-h-0 shrink-0 flex-col overflow-hidden border-t', wb.border)}
                style={{ height: state.bottomHeight }}
              >
                {bottomPanel}
              </div>
            </>
          )}
        </div>

        {state.isRightCollapsed ? (
          <SqlExpandRail side="right" label="Practice Question" onExpand={toggleRightCollapsed} />
        ) : (
          <>
            <SqlPaneResizeHandle direction="horizontal" onMouseDown={startResizeRight} />
            <div
              className={cn('flex min-h-0 shrink-0 flex-col overflow-hidden border-l', wb.border)}
              style={{ width: state.rightWidth }}
            >
              {questionPanel}
            </div>
          </>
        )}
      </div>
      {statusBar}
    </div>
  )
}
