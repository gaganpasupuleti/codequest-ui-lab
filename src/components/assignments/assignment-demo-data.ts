export type AssignmentKind = 'hackerrank' | 'quiz' | 'practice' | 'studio' | 'project'

export type AssignmentNavTarget =
  | 'practice-code'
  | 'practice-sql'
  | 'practice-typing'
  | 'practice-studio'
  | 'projects'
  | 'roadmapper'
  | 'calendar'
  | 'quiz'

export interface PathAssignment {
  id: string
  title: string
  blurb: string
  pathLabel: string
  kind: AssignmentKind
  dueOffsetDays: number
  minutes: number
  status: 'open' | 'done'
  /** Practice / studio / projects navigation */
  navTarget?: AssignmentNavTarget
  /** Open HackerRank challenge */
  challengeId?: string
  /** Open quiz by catalog id */
  quizId?: string
}

export interface HackerRankChallenge {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  language: 'python' | 'javascript'
  pathLabel: string
  minutes: number
  prompt: string
  examples: { input: string; output: string }[]
  starterCode: string
  /** Simple local check: code must include this substring (demo only) */
  mustInclude: string
}

function offsetDate(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function assignmentDueIso(a: PathAssignment): string {
  return offsetDate(a.dueOffsetDays)
}

export const PATH_CONTEXT = {
  stage: 'Foundation',
  month: 1,
  week: 1,
  focus: 'SQL Fundamentals + first coding drills',
} as const

export const PATH_ASSIGNMENTS: PathAssignment[] = [
  {
    id: 'hr-sum-pair',
    title: 'HackerRank: Sum of Two Numbers',
    blurb: 'Write a function that returns the sum of two integers.',
    pathLabel: 'Foundation · Week 1',
    kind: 'hackerrank',
    dueOffsetDays: 0,
    minutes: 25,
    status: 'open',
    challengeId: 'sum-two',
  },
  {
    id: 'hr-fizz',
    title: 'HackerRank: FizzBuzz Lite',
    blurb: 'Print rules for multiples of 3 and 5.',
    pathLabel: 'Foundation · Week 1',
    kind: 'hackerrank',
    dueOffsetDays: 1,
    minutes: 30,
    status: 'open',
    challengeId: 'fizzbuzz-lite',
  },
  {
    id: 'quiz-modeling',
    title: 'Quiz: Data modeling basics',
    blurb: 'Short check on entities, keys, and relationships.',
    pathLabel: 'Foundation · Week 1',
    kind: 'quiz',
    dueOffsetDays: 0,
    minutes: 15,
    status: 'open',
    quizId: undefined,
    navTarget: 'quiz',
  },
  {
    id: 'sql-pass-3',
    title: 'SQL Practice: pass 3 questions',
    blurb: 'Complete three SQL drills in Practice Studio.',
    pathLabel: 'Foundation · Week 1',
    kind: 'practice',
    dueOffsetDays: 0,
    minutes: 40,
    status: 'open',
    navTarget: 'practice-sql',
  },
  {
    id: 'code-easy',
    title: 'Code Workbench: 1 easy task',
    blurb: 'Warm-up in the Code Workbench before HackerRank.',
    pathLabel: 'Foundation · Week 1',
    kind: 'studio',
    dueOffsetDays: 1,
    minutes: 20,
    status: 'open',
    navTarget: 'practice-code',
  },
  {
    id: 'typing-40',
    title: 'Typing: hit 40+ WPM',
    blurb: 'Accuracy drill tied to this week’s path.',
    pathLabel: 'Foundation · Week 1',
    kind: 'practice',
    dueOffsetDays: 5,
    minutes: 15,
    status: 'open',
    navTarget: 'practice-typing',
  },
  {
    id: 'project-milestone',
    title: 'Project: milestone 1 draft',
    blurb: 'Submit a short draft for mentor review.',
    pathLabel: 'Foundation · Week 2',
    kind: 'project',
    dueOffsetDays: 2,
    minutes: 60,
    status: 'open',
    navTarget: 'projects',
  },
  {
    id: 'welcome-done',
    title: 'Welcome checklist',
    blurb: 'Orientation complete.',
    pathLabel: 'Onboarding',
    kind: 'studio',
    dueOffsetDays: -2,
    minutes: 10,
    status: 'done',
    navTarget: 'practice-studio',
  },
]

export const HACKERRANK_CHALLENGES: HackerRankChallenge[] = [
  {
    id: 'sum-two',
    title: 'Sum of Two Numbers',
    difficulty: 'Easy',
    language: 'python',
    pathLabel: 'Foundation · Week 1',
    minutes: 25,
    prompt:
      'Implement `add(a, b)` that returns the sum of two integers. Keep it simple — this assignment checks that you can write and submit code from Assignments.',
    examples: [
      { input: 'add(2, 3)', output: '5' },
      { input: 'add(-1, 1)', output: '0' },
    ],
    starterCode: `def add(a, b):\n    # Write your code here\n    pass\n\n# Quick self-check (optional)\nif __name__ == "__main__":\n    print(add(2, 3))\n`,
    mustInclude: 'return',
  },
  {
    id: 'fizzbuzz-lite',
    title: 'FizzBuzz Lite',
    difficulty: 'Easy',
    language: 'javascript',
    pathLabel: 'Foundation · Week 1',
    minutes: 30,
    prompt:
      'Implement `fizzBuzz(n)` that returns an array of strings from 1..n. Multiples of 3 → "Fizz", 5 → "Buzz", both → "FizzBuzz", else the number as a string.',
    examples: [
      { input: 'fizzBuzz(5)', output: '["1","2","Fizz","4","Buzz"]' },
    ],
    starterCode: `function fizzBuzz(n) {\n  // Write your code here\n  const out = [];\n  for (let i = 1; i <= n; i++) {\n    // ...\n  }\n  return out;\n}\n\nconsole.log(fizzBuzz(5));\n`,
    mustInclude: 'Fizz',
  },
  {
    id: 'reverse-words',
    title: 'Reverse Words',
    difficulty: 'Medium',
    language: 'python',
    pathLabel: 'Foundation · Week 2',
    minutes: 35,
    prompt:
      'Implement `reverse_words(s)` that reverses the order of words in a sentence. Trim extra spaces.',
    examples: [
      { input: 'reverse_words("hello world")', output: 'world hello' },
    ],
    starterCode: `def reverse_words(s):\n    # Write your code here\n    pass\n\nif __name__ == "__main__":\n    print(reverse_words("hello world"))\n`,
    mustInclude: 'split',
  },
]

export function getChallenge(id: string): HackerRankChallenge | undefined {
  return HACKERRANK_CHALLENGES.find((c) => c.id === id)
}
