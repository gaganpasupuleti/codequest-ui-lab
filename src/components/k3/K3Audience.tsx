import { K3_SECTION } from './k3Theme'

const AUDIENCE = [
  {
    num: '01',
    title: 'Students',
    body: 'Launch faster with practice labs, quests, and placement prep built for first-time job seekers.',
  },
  {
    num: '02',
    title: 'Career Switchers',
    body: 'Add SQL, Python, and resume support without slowing your learning roadmap or bloating your stack.',
  },
  {
    num: '03',
    title: 'Placement Cohorts',
    body: 'Build trust with aptitude mocks, job boards, progress tracking, and materials your cohort can act on.',
  },
] as const

export function K3Audience() {
  return (
    <section className="border-b border-white/10 px-4 py-20 md:px-8">
      <div className="mb-12">
        <p className={K3_SECTION}>Who We</p>
        <h2 className="mt-2 text-[clamp(2rem,5vw,3.5rem)] font-medium uppercase leading-none text-white">
          Work With
        </h2>
      </div>
      <div className="grid gap-12 md:grid-cols-3">
        {AUDIENCE.map((item) => (
          <article key={item.num}>
            <span className="font-mono text-sm text-white/35">{item.num}</span>
            <h3 className="mt-4 text-lg font-medium uppercase tracking-tight text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
