/**
 * Landing + login shared content.
 *
 * LANDING_SKILLS, HERO_FLOAT_LABELS and QUEST_JOURNEY_STEPS are also consumed by the
 * login motion scenes (LoginPortalScene, LoginBootPortal) — keep their shapes stable.
 * Editorial landing content added below uses the LANDING_* / JOURNEY_* names.
 */
export const LANDING_SKILLS = [
  'Python',
  'SQL',
  'Data Analytics',
  'Power BI',
  'DSA',
  'Aptitude',
  'AI Tools',
  'Career Skills',
] as const

export const HERO_FLOAT_LABELS = [
  'Python',
  'SQL',
  'Analytics',
  'DSA',
  'AI',
] as const

export const QUEST_JOURNEY_STEPS = [
  {
    id: 'learn',
    title: 'Learn',
    description: 'Follow guided paths with lessons, live classes, and curated study materials.',
    icon: 'book',
  },
  {
    id: 'practice',
    title: 'Practice',
    description: 'Sharpen skills in sandboxes, arenas, and daily quests built for real outcomes.',
    icon: 'code',
  },
  {
    id: 'build',
    title: 'Build',
    description: 'Ship portfolio projects that prove you can solve problems end to end.',
    icon: 'layers',
  },
  {
    id: 'prove',
    title: 'Prove',
    description: 'Track XP, streaks, and readiness scores that show measurable progress.',
    icon: 'chart',
  },
  {
    id: 'hired',
    title: 'Get Hired',
    description: 'Polish your resume, prep for ATS, and discover roles matched to your path.',
    icon: 'briefcase',
  },
] as const

export const QUEST_ARENAS = [
  {
    id: 'python',
    title: 'Python Lab',
    tag: 'Core track',
    description: 'Write, run, and debug Python with instant feedback and quest-based challenges.',
    accent: '#1944F1',
  },
  {
    id: 'sql',
    title: 'SQL Arena',
    tag: 'Data skills',
    description: 'Query real datasets, climb difficulty tiers, and master analytics SQL.',
    accent: '#82D173',
  },
  {
    id: 'analytics',
    title: 'Data Analytics',
    tag: 'Insights',
    description: 'Explore dashboards, metrics, and storytelling with hands-on analytics labs.',
    accent: '#FFEF4D',
  },
  {
    id: 'dsa',
    title: 'DSA Practice',
    tag: 'Interview prep',
    description: 'Train patterns, time complexity, and problem-solving under pressure.',
    accent: '#1944F1',
  },
  {
    id: 'aptitude',
    title: 'Aptitude Hub',
    tag: 'Placement',
    description: 'Build logical reasoning and quantitative skills for campus placements.',
    accent: '#82D173',
  },
  {
    id: 'ai',
    title: 'AI Tools',
    tag: 'Future ready',
    description: 'Learn practical AI workflows for coding, research, and career tasks.',
    accent: '#FFEF4D',
  },
] as const

/** Demo progress — not real user data. */
export const CAREER_PROGRESS_DEMO = [
  { label: 'Python', value: 78, color: '#1944F1' },
  { label: 'SQL', value: 64, color: '#82D173' },
  { label: 'Resume Readiness', value: 72, color: '#FFEF4D' },
  { label: 'Career Path', value: 85, color: '#1944F1', caption: 'Data Analyst' },
] as const

export const CAREER_MAP_STEPS = [
  'Skills',
  'Practice',
  'Projects',
  'Resume',
  'Readiness',
  'Jobs',
] as const

export const DASHBOARD_WIDGETS = [
  { id: 'daily', title: 'Daily Quest', meta: 'Complete 3 SQL drills', xp: '+120 XP' },
  { id: 'xp', title: 'XP Progress', meta: 'Level 12 · 2,480 XP', xp: '68% to L13' },
  { id: 'streak', title: 'Learning Streak', meta: '14 days active', xp: 'Keep it going' },
  { id: 'class', title: 'Upcoming Class', meta: 'Data Viz · Today 5 PM', xp: 'Join live' },
  { id: 'sql', title: 'SQL Arena', meta: 'JOIN mastery set', xp: '2/5 done' },
  { id: 'resume', title: 'Resume Quest', meta: 'ATS scan pending', xp: 'Review' },
  { id: 'map', title: 'Career Map', meta: 'Data Analyst track', xp: 'Step 4/6' },
  { id: 'jobs', title: 'Recommended Jobs', meta: '3 new matches', xp: 'View' },
] as const

/** Section ids used by the editorial landing page and its anchor navigation. */
export const LANDING_SECTION_IDS = {
  hero: 'hero',
  pain: 'pain',
  intro: 'why-codequest',
  journey: 'journey',
  features: 'features',
  showcase: 'showcase',
  finalCta: 'final-cta',
} as const

export const LANDING_NAV_LINKS = [
  { label: 'Why CodeQuest', target: LANDING_SECTION_IDS.intro },
  { label: 'The Journey', target: LANDING_SECTION_IDS.journey },
  { label: 'Practice', target: LANDING_SECTION_IDS.features },
  { label: 'Careers', target: LANDING_SECTION_IDS.showcase },
] as const

export const LANDING_PAIN_POINTS = [
  {
    id: 'tutorial-loop',
    numeral: '01',
    title: 'The Tutorial Loop',
    body: 'Save 42 videos, finish three lessons, open another tab and somehow call it a learning plan.',
    glyph: 'loop',
  },
  {
    id: 'no-feedback',
    numeral: '02',
    title: 'Practice Without Feedback',
    body: 'Your code fails. The error message looks angry. Nobody tells you what to fix or what to practise next.',
    glyph: 'silence',
  },
  {
    id: 'job-ready-void',
    numeral: '03',
    title: 'The Job-Ready Black Hole',
    body: 'You finish a course, open a real job description and discover the course never told you what employers actually expect.',
    glyph: 'void',
  },
] as const

/** Five connected stages — hero illustration, marquee and journey section all read from this. */
export const JOURNEY_STAGES = [
  {
    id: 'learn',
    numeral: '01',
    title: 'Learn',
    body: 'Live classes, structured materials and guided learning paths.',
    glyph: 'learn',
  },
  {
    id: 'practise',
    numeral: '02',
    title: 'Practise',
    body: 'Python, SQL, coding, DSA, aptitude, Power BI and targeted exercises.',
    glyph: 'practise',
  },
  {
    id: 'build',
    numeral: '03',
    title: 'Build',
    body: 'Assignments and real projects that turn lessons into proof.',
    glyph: 'build',
  },
  {
    id: 'prepare',
    numeral: '04',
    title: 'Prepare',
    body: 'Progress reviews, resume preparation, readiness checks and interview practice.',
    glyph: 'prepare',
  },
  {
    id: 'apply',
    numeral: '05',
    title: 'Apply',
    body: 'Role discovery, job matching and clearer next actions.',
    glyph: 'apply',
  },
] as const

export const JOURNEY_MARQUEE_WORDS = [
  'LEARN',
  'PRACTISE',
  'BUILD',
  'PREPARE',
  'APPLY',
  'REPEAT',
] as const

/** Modules drawn in the "Introducing CodeQuest" product preview. */
export const INTRO_MODULES = [
  { id: 'classes', label: 'Live Classes', note: 'Scheduled, recorded, attached to notes' },
  { id: 'practice', label: 'Practice Studio', note: 'Python, SQL, DSA, aptitude' },
  { id: 'projects', label: 'Projects', note: 'Briefs with real deliverables' },
  { id: 'assignments', label: 'Assignments', note: 'Submit, review, resubmit' },
  { id: 'resume', label: 'Resume Lab', note: 'Shaped around a target role' },
  { id: 'jobs', label: 'Jobs', note: 'Roles that match your work' },
  { id: 'progress', label: 'Progress', note: 'Gaps, streaks, next actions' },
] as const

export const LANDING_FEATURES = [
  {
    id: 'guided-learning',
    numeral: '01',
    title: 'Guided Learning',
    body: 'Know what to learn now, what comes next and why it matters.',
    visual: 'path',
  },
  {
    id: 'practice-grounds',
    numeral: '02',
    title: 'Practice Grounds',
    body: 'Write code, solve questions, make mistakes and actually understand the errors.',
    visual: 'terminal',
  },
  {
    id: 'project-quests',
    numeral: '03',
    title: 'Project Quests',
    body: 'Turn lessons into working projects instead of another forgotten completion certificate.',
    visual: 'blocks',
  },
  {
    id: 'progress-proof',
    numeral: '04',
    title: 'Progress That Proves It',
    body: 'See completed work, current gaps and the skills that still need attention.',
    visual: 'meter',
  },
  {
    id: 'resume-career',
    numeral: '05',
    title: 'Resume and Career Prep',
    body: 'Shape your resume around real roles and prepare for the questions those roles demand.',
    visual: 'doc',
  },
  {
    id: 'job-discovery',
    numeral: '06',
    title: 'Job Discovery',
    body: "Move from 'What jobs can I apply for?' to a focused list of relevant opportunities.",
    visual: 'list',
  },
] as const

export type ShowcasePanel = {
  id: string
  tab: string
  title: string
  summary: string
  rows?: readonly { label: string; value: string }[]
  meters?: readonly { label: string; value: number }[]
  code?: readonly string[]
}

/** Illustrative product previews — demo content only, never live student data. */
export const SHOWCASE_PANELS: readonly ShowcasePanel[] = [
  {
    id: 'dashboard',
    tab: 'Dashboard',
    title: 'Your week, already sorted',
    summary: 'What is due, what is next and what is quietly slipping.',
    rows: [
      { label: 'Next class', value: 'Python · functions deep dive' },
      { label: 'Due tomorrow', value: 'SQL joins assignment' },
      { label: 'Needs attention', value: 'Aptitude · ratios set' },
    ],
    meters: [
      { label: 'Python track', value: 62 },
      { label: 'SQL track', value: 41 },
    ],
  },
  {
    id: 'classes',
    tab: 'Live Classes',
    title: 'Classes that connect to the work',
    summary: 'Join the session, keep the material, practise the same idea while it is still fresh.',
    rows: [
      { label: 'Live today', value: 'Data storytelling in Power BI' },
      { label: 'Recording', value: 'Python · list comprehensions' },
      { label: 'Materials', value: 'Notes and drills attached per session' },
    ],
  },
  {
    id: 'python',
    tab: 'Python Practice',
    title: 'Write it, run it, read the error',
    summary: 'Short problems with feedback that explains the failure instead of shouting it.',
    code: [
      'def total_score(rows):',
      '    return sum(row["score"] for row in rows)',
      '',
      '# failed on row 3 -> KeyError: "score"',
      '# that record stores "points" instead',
    ],
  },
  {
    id: 'sql',
    tab: 'SQL Practice',
    title: 'Query real tables, not screenshots',
    summary: 'Run it, compare the result set, understand why the join dropped rows.',
    code: [
      'SELECT s.name, COUNT(a.id) AS submissions',
      'FROM students s',
      'LEFT JOIN assignments a ON a.student_id = s.id',
      'GROUP BY s.name',
      'ORDER BY submissions DESC;',
    ],
  },
  {
    id: 'assignments',
    tab: 'Assignments',
    title: 'Work that actually gets reviewed',
    summary: 'Submit it, read the feedback, fix it, keep the receipt.',
    rows: [
      { label: 'Submitted', value: 'Sales dashboard · version 2' },
      { label: 'In review', value: 'Python file parser' },
      { label: 'Reopened', value: 'SQL window functions' },
    ],
  },
  {
    id: 'resume',
    tab: 'Resume Prep',
    title: 'A resume shaped by the role',
    summary: 'Start from the job description and work backwards to what you can prove.',
    rows: [
      { label: 'Target role', value: 'Data Analyst' },
      { label: 'Already provable', value: 'SQL, Power BI, Python basics' },
      { label: 'Still thin', value: 'Project write-ups, aptitude rounds' },
    ],
    meters: [{ label: 'Resume readiness', value: 72 }],
  },
  {
    id: 'jobs',
    tab: 'Job Discovery',
    title: 'From "what can I apply for?" to a list',
    summary: 'Roles filtered down to what you are genuinely building towards.',
    rows: [
      { label: 'Data Analyst', value: 'Matches your SQL and Power BI work' },
      { label: 'Junior Python Developer', value: 'Two project quests short' },
      { label: 'Reporting Analyst', value: 'Expect an aptitude round' },
    ],
  },
]

export const LANDING_FOOTER_LINKS = [
  { label: 'Learning', target: LANDING_SECTION_IDS.journey },
  { label: 'Practice', target: LANDING_SECTION_IDS.features },
  { label: 'Projects', target: LANDING_SECTION_IDS.features },
  { label: 'Careers', target: LANDING_SECTION_IDS.showcase },
] as const

export const FEATURE_STORY_ITEMS = [
  {
    id: 'paths',
    title: 'Guided learning paths',
    body: 'Structured journeys from fundamentals to job-ready skills — no guesswork about what to learn next.',
    tone: 'light' as const,
  },
  {
    id: 'sandboxes',
    title: 'Coding sandboxes',
    body: 'Practice in-browser with instant feedback across Python, SQL, and analytics environments.',
    tone: 'dark' as const,
  },
  {
    id: 'resume',
    title: 'Resume & ATS preparation',
    body: 'Build, scan, and refine resumes tuned for applicant tracking systems and recruiter review.',
    tone: 'light' as const,
  },
  {
    id: 'jobs',
    title: 'Job discovery',
    body: 'Explore roles aligned with your skills, readiness score, and chosen career path.',
    tone: 'dark' as const,
  },
  {
    id: 'progress',
    title: 'Progress & readiness tracking',
    body: 'XP, streaks, and readiness indicators show where you stand — and what to tackle next.',
    tone: 'light' as const,
  },
  {
    id: 'live',
    title: 'Live classes & assignments',
    body: 'Attend sessions, submit work, and stay accountable with instructor-led milestones.',
    tone: 'dark' as const,
  },
  {
    id: 'materials',
    title: 'Books, articles & study materials',
    body: 'Curated resources woven into your quest so learning stays focused and contextual.',
    tone: 'light' as const,
  },
] as const
