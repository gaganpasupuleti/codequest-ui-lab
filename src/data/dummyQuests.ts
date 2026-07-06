export interface Quest {
  id: string
  title: string
  description: string
  xp: number
  progress: number
  badge: string
  category: string
  href: string
}

export const currentQuests: Quest[] = [
  {
    id: 'q1',
    title: 'SQL Joins Mastery',
    description: 'Complete 5 join challenges to unlock advanced queries.',
    xp: 250,
    progress: 60,
    badge: 'Practice',
    category: 'SQL Arena',
    href: '/sql-arena',
  },
  {
    id: 'q2',
    title: 'Python Functions Sprint',
    description: 'Write and test 3 function-based exercises.',
    xp: 180,
    progress: 33,
    badge: 'Daily',
    category: 'Python Lab',
    href: '/python-lab',
  },
  {
    id: 'q3',
    title: 'Resume Quest',
    description: 'Optimize your resume for ATS scoring above 80%.',
    xp: 300,
    progress: 45,
    badge: 'Career',
    category: 'Resume Lab',
    href: '/resume-lab',
  },
]

export const questGallery = [
  {
    id: 'g1',
    title: 'SQL Arena',
    benefit: 'Master queries with real-world challenge patterns.',
    cta: 'Enter Arena',
    badge: 'Beginner',
    href: '/sql-arena',
    gradient: 'from-neon-blue/20 to-electric-blue/20',
  },
  {
    id: 'g2',
    title: 'Python Lab',
    benefit: 'Build Python skills through guided practice labs.',
    cta: 'Start Lab',
    badge: 'Practice',
    href: '/python-lab',
    gradient: 'from-neon-purple/20 to-neon-blue/20',
  },
  {
    id: 'g3',
    title: 'Resume Quest',
    benefit: 'Craft an ATS-ready resume with actionable feedback.',
    cta: 'Open Lab',
    badge: 'Career',
    href: '/resume-lab',
    gradient: 'from-mantis-green/20 to-neon-blue/20',
  },
  {
    id: 'g4',
    title: 'Career Map',
    benefit: 'Follow role-based roadmaps to your dream job.',
    cta: 'View Map',
    badge: 'XP',
    href: '/career-map',
    gradient: 'from-lemon-yellow/20 to-neon-purple/20',
  },
  {
    id: 'g5',
    title: 'Aptitude Sprint',
    benefit: 'Sharpen quant, logic, and verbal for placements.',
    cta: 'Start Sprint',
    badge: 'Daily Streak',
    href: '/aptitude',
    gradient: 'from-electric-blue/20 to-neon-purple/20',
  },
]
