import { cn } from '@/lib/utils'
import { wb } from '@/lib/workbench-theme'

interface TypingPromptDisplayProps {
  source: string
  typed: string
  emptyLabel?: string
  className?: string
}

export function TypingPromptDisplay({ source, typed, emptyLabel, className }: TypingPromptDisplayProps) {
  if (!source) {
    return (
      <p className={cn('p-3 text-[13px]', wb.textMuted, className)}>
        {emptyLabel ?? 'Choose a mode and press Start to load a typing challenge.'}
      </p>
    )
  }

  return (
    <pre
      className={cn(
        'min-h-0 flex-1 overflow-auto p-3 font-mono text-[13px] leading-relaxed whitespace-pre-wrap select-none md:text-[14px]',
        wb.textSecondary,
        className,
      )}
      aria-label="Typing prompt"
    >
      {source.split('').map((char, index) => {
        if (index < typed.length) {
          const isCorrect = typed[index] === char
          return (
            <span
              key={`${index}-${char}`}
              className={isCorrect ? 'text-emerald-400' : 'rounded-sm bg-red-950/60 text-red-300'}
            >
              {char}
            </span>
          )
        }
        if (index === typed.length) {
          return (
            <span key={`${index}-${char}`} className="rounded-sm bg-sky-500/35 text-sky-50">
              {char}
            </span>
          )
        }
        return (
          <span key={`${index}-${char}`} className={wb.textMuted}>
            {char}
          </span>
        )
      })}
    </pre>
  )
}
