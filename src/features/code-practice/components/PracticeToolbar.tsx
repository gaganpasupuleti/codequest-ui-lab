import { Play, RotateCcw, Save, Send, Palette } from 'lucide-react'
import { LanguageSelector } from './LanguageSelector'
import type { CodePracticeEditorTheme, CodePracticeLanguageMode } from '../types/codePractice.types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { wb } from '@/lib/workbench-theme'
import { cn } from '@/lib/utils'

interface PracticeToolbarProps {
  language: CodePracticeLanguageMode
  theme: CodePracticeEditorTheme
  isRunning: boolean
  onLanguageChange: (language: CodePracticeLanguageMode) => void
  onThemeChange: (theme: CodePracticeEditorTheme) => void
  onRun: () => void
  onSubmit: () => void
  onReset: () => void
  onSaveAttempt: () => void
}

const THEMES: Array<{ id: CodePracticeEditorTheme; label: string }> = [
  { id: 'vs-dark', label: 'VS Dark' },
  { id: 'vs', label: 'VS Light' },
  { id: 'hc-black', label: 'High Contrast' },
]

export function PracticeToolbar({
  language,
  theme: editorTheme,
  isRunning,
  onLanguageChange,
  onThemeChange,
  onRun,
  onSubmit,
  onReset,
  onSaveAttempt,
}: PracticeToolbarProps) {
  return (
    <header
      className={cn(
        'flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2',
        wb.panelHeader,
        wb.border,
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-2.5">
        <span className="shrink-0 text-[12px] font-bold uppercase tracking-wider text-sky-300">
          Code Workbench
        </span>
        <LanguageSelector value={language} onChange={onLanguageChange} onComingSoon={onLanguageChange} />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className={wb.toolbarBtn}>
              <Palette className="h-3.5 w-3.5" />
              Theme
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-[#26324A] bg-[#0F172A] text-[#E5E7EB]">
            {THEMES.map((t) => (
              <DropdownMenuItem
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className="text-[13px] focus:bg-[#1a2332]"
              >
                {t.label}
                {editorTheme === t.id ? ' ·' : ''}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button type="button" onClick={onReset} className={wb.toolbarBtn}>
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>

        <button type="button" onClick={onSaveAttempt} className={wb.toolbarBtn}>
          <Save className="h-3.5 w-3.5" />
          Save
        </button>

        <button
          type="button"
          onClick={onRun}
          disabled={isRunning}
          className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500 px-3 py-1.5 text-[12px] font-semibold text-white shadow-sm hover:bg-emerald-400 disabled:opacity-50"
        >
          <Play className="h-3.5 w-3.5" />
          {isRunning ? 'Running…' : 'Run'}
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isRunning}
          className="inline-flex items-center gap-1.5 rounded-md bg-sky-500 px-3 py-1.5 text-[12px] font-semibold text-white shadow-sm hover:bg-sky-400 disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" />
          Submit
        </button>
      </div>
    </header>
  )
}
