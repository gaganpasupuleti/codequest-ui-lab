import { Link } from 'react-router-dom'
import { K3_CARD, K3_CTA, K3_SECTION } from './k3Theme'

const PLANS = [
  {
    title: 'Free Lab',
    price: 'Starts at $0/mo',
    desc: 'Ongoing UI exploration with dummy data, all routes, and lab auth for prototyping.',
    perks: ['All student routes', 'Dummy quests & jobs', 'Theme switching', 'Local dev ready'],
    cta: 'Get Started',
    href: '/dashboard',
    primary: false,
  },
  {
    title: 'Pro Track',
    price: 'Starts at Pro+',
    desc: 'Structured placement path with SQL, Python, aptitude, resume lab, and job board access.',
    perks: ['Guided learning paths', 'Progress & streaks', 'Career map', 'Unlimited practice'],
    cta: 'Get Started',
    href: '/practice',
    primary: true,
  },
  {
    title: 'Enterprise',
    price: "Let's Discuss",
    desc: 'Custom cohort programs for colleges and bootcamps with admin, analytics, and branded portals.',
    perks: ['Dedicated cohorts', 'Admin dashboard', 'Custom content', 'Priority support'],
    cta: "Let's Discuss",
    href: '/admin',
    primary: false,
  },
] as const

export function K3Pricing() {
  return (
    <section id="pricing" className="border-b border-white/10 px-4 py-20 md:px-8">
      <div className="mb-12">
        <p className={K3_SECTION}>Pricing</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <article key={plan.title} className={`${K3_CARD} flex flex-col`}>
            <h3 className="text-lg font-medium uppercase tracking-tight text-white">{plan.title}</h3>
            <p className="mt-2 font-mono text-xs text-white/45">{plan.price}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/50">{plan.desc}</p>
            <ul className="mt-6 flex-1 space-y-2 text-sm text-white/55">
              {plan.perks.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-white/30">·</span>
                  {p}
                </li>
              ))}
            </ul>
            <Link
              to={plan.href}
              className={`mt-8 inline-flex justify-center ${plan.primary ? 'bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black' : K3_CTA}`}
            >
              {plan.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
