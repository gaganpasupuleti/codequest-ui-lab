const skills = [
  'Python',
  'SQL',
  'Data Analytics',
  'Power BI',
  'Resume Lab',
  'Job Alerts',
  'Aptitude',
  'DSA',
  'Career Map',
  'Mock Tests',
]

export function SkillsTicker() {
  const items = [...skills, ...skills]

  return (
    <section className="py-6 border-y border-white/8 overflow-hidden bg-white/[0.02]" aria-label="Skills and features">
      <div className="ticker-track">
        {items.map((skill, i) => (
          <span
            key={`${skill}-${i}`}
            className="inline-flex items-center mx-6 text-sm font-semibold uppercase tracking-widest text-text-secondary whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neon-blue mr-3" />
            {skill}
          </span>
        ))}
      </div>
    </section>
  )
}
