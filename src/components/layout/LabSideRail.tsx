import { ExternalLink, Plus } from 'lucide-react'
import { LAB_LOCAL_URL } from '@/lib/labConfig'

/** K3 Studios–inspired right rail — https://k3studios.ae/ */
export function LabSideRail() {
  const openLocal = () => {
    window.open(LAB_LOCAL_URL, '_blank', 'noopener,noreferrer')
  }

  return (
    <aside
      className="fixed right-0 top-0 z-[1300] hidden h-screen w-14 flex-col items-center border-l border-[color:var(--cq-border-subtle)] bg-bg-primary py-5 md:flex"
      aria-label="Lab controls"
    >
      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white">
        CQ
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="inline-flex h-6 w-6 items-center justify-center font-mono text-sm text-white/45"
            aria-hidden
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.25} />
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-col items-center gap-4 pb-2">
        <button
          type="button"
          onClick={openLocal}
          title="Open local dev server in new tab"
          className="group flex flex-col items-center gap-1 rounded-lg border border-white/15 px-2 py-2.5 transition-colors hover:border-white/40 hover:bg-white/5"
        >
          <ExternalLink className="h-4 w-4 text-white" />
          <span className="font-mono text-[8px] font-semibold uppercase tracking-wide text-white/45">
            Local
          </span>
          <span className="font-mono text-[7px] text-white/45 opacity-60">:5173</span>
        </button>

        <p className="origin-center rotate-180 font-mono text-[9px] font-semibold uppercase tracking-[0.35em] text-white/45 [writing-mode:vertical-rl]">
          Scroll
        </p>
      </div>
    </aside>
  )
}
