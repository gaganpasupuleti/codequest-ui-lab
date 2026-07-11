import { Link } from 'react-router-dom'
import { K3_HEADLINE } from './k3Theme'
import { MissionFeedTicker } from '@/components/theme/MissionFeedTicker'
import { K3ServiceMarquee } from '@/components/theme/K3ServiceMarquee'

export function K3CTA() {
  return (
    <>
      <K3ServiceMarquee className="border-b border-white/10" speed={24} />
      <section className="px-4 py-24 md:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/40">Let&apos;s Build</p>
        <h2 className={`${K3_HEADLINE} mt-4 text-[clamp(2rem,6vw,4rem)]`}>Together</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">Email</p>
            <p className="mt-2 text-white">lab@codequest.dev</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">Location</p>
            <p className="mt-2 text-white">UI Lab · Localhost</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">Social</p>
            <div className="mt-2 flex gap-4 text-sm text-white/60">
              <Link to="/profile" className="hover:text-white">Profile</Link>
              <Link to="/progress" className="hover:text-white">Progress</Link>
            </div>
          </div>
        </div>
        <p className="mt-16 border-t border-white/10 pt-8 font-mono text-[10px] text-white/30">
          Code Quest UI Lab — placement learning prototype. © {new Date().getFullYear()}
        </p>
      </section>
      <MissionFeedTicker active label="What's new" speed={38} className="border-t border-white/10 bg-[#0a0a0a]" />
    </>
  )
}
