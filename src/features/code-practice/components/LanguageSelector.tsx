import { CODE_PRACTICE_LANGUAGE_MODES, type CodePracticeLanguageMode } from '../types/codePractice.types'
import { wb } from '@/lib/workbench-theme'
import { cn } from '@/lib/utils'

interface LanguageSelectorProps {
  value: CodePracticeLanguageMode
  onChange: (language: CodePracticeLanguageMode) => void
  onComingSoon?: (language: CodePracticeLanguageMode) => void
}

export function LanguageSelector({ value, onChange, onComingSoon }: LanguageSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {CODE_PRACTICE_LANGUAGE_MODES.map((mode) => {
        const active = value === mode.id
        const comingSoon = mode.status === 'coming-soon'
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => {
              if (comingSoon) {
                onComingSoon?.(mode.id)
                return
              }
              onChange(mode.id)
            }}
            className={cn(
              'rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors',
              active && !comingSoon && wb.langActive,
              !active && !comingSoon && wb.langInactive,
              comingSoon && `${wb.langSoon} px-2 py-1 text-[11px]`,
            )}
            title={
              comingSoon
                ? `${mode.label} — execution coming in a later phase`
                : mode.id === 'java'
                  ? `${mode.label} — backend JDK (javac + java)`
                  : mode.label
            }
          >
            {mode.label}
            {comingSoon ? ' · soon' : ''}
          </button>
        )
      })}
    </div>
  )
}
