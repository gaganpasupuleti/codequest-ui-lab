import { useMemo } from 'react'
import { Eye } from 'lucide-react'
import { SandpackPreview, SandpackProvider } from '@codesandbox/sandpack-react'
import type { CodePracticeLanguageMode } from '../types/codePractice.types'
import { buildSandpackAppCode } from '../utils/sandpackReact'
import { wb } from '@/lib/workbench-theme'
import { cn } from '@/lib/utils'

interface LivePreviewPanelProps {
  language: CodePracticeLanguageMode
  code: string
  questionTitle?: string
}

export function LivePreviewPanel({ language, code, questionTitle }: LivePreviewPanelProps) {
  const isReact = language === 'react'

  const sandpackFiles = useMemo(() => {
    if (!isReact) return null
    return {
      '/App.js': {
        code: buildSandpackAppCode(code),
        active: true,
      },
    }
  }, [code, isReact])

  if (!isReact) {
    return null
  }

  return (
    <div className={cn('flex h-full min-h-[160px] flex-col overflow-hidden rounded-md border', wb.border, wb.panel)}>
      <div className={cn('flex items-center justify-between gap-2 border-b px-2.5 py-1.5', wb.border, 'bg-[#111827]')}>
        <div className={cn('flex items-center gap-1.5 text-[12px] font-semibold', wb.textPrimary)}>
          <Eye className="h-3.5 w-3.5 text-violet-300" />
          Live Preview
        </div>
        {questionTitle && (
          <span className={cn('truncate text-[11px]', wb.textMuted)}>{questionTitle}</span>
        )}
      </div>
      <div className="min-h-0 flex-1 [&_.sp-preview-container]:!rounded-none [&_.sp-preview-iframe]:!bg-white">
        <SandpackProvider
          template="react"
          theme="dark"
          files={sandpackFiles ?? undefined}
          options={{
            autorun: true,
            recompileMode: 'immediate',
            recompileDelay: 300,
          }}
        >
          <SandpackPreview
            showNavigator={false}
            showOpenInCodeSandbox={false}
            showRefreshButton={false}
          />
        </SandpackProvider>
      </div>
    </div>
  )
}
