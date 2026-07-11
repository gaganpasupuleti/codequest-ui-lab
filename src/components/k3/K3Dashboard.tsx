import { K3Hero } from './K3Hero'
import { K3Stats } from './K3Stats'
import { K3SelectedWork } from './K3SelectedWork'
import { K3Audience } from './K3Audience'
import { K3Services } from './K3Services'
import { K3Pricing } from './K3Pricing'
import { K3CTA } from './K3CTA'
import { K3ServiceMarquee } from '@/components/theme/K3ServiceMarquee'

type K3DashboardProps = {
  firstName: string
}

/** Full K3 Studios–style dashboard — https://k3studios.ae/ */
export function K3Dashboard({ firstName }: K3DashboardProps) {
  return (
    <div className="bg-[#0a0a0a] text-white">
      <K3Hero firstName={firstName} />
      <K3ServiceMarquee speed={26} />
      <K3Stats />
      <K3SelectedWork />
      <K3Audience />
      <K3Services />
      <K3Pricing />
      <K3CTA />
    </div>
  )
}
