export const weeklyProgress = [
  { day: 'Mon', xp: 120, active: true },
  { day: 'Tue', xp: 85, active: true },
  { day: 'Wed', xp: 200, active: true },
  { day: 'Thu', xp: 0, active: false },
  { day: 'Fri', xp: 150, active: true },
  { day: 'Sat', xp: 90, active: true },
  { day: 'Sun', xp: 60, active: true },
]

export const skillProgress = [
  { skill: 'SQL', progress: 65, color: '#00f0ff' },
  { skill: 'Python', progress: 48, color: '#b026ff' },
  { skill: 'Aptitude', progress: 35, color: '#ffef4d' },
  { skill: 'DSA', progress: 20, color: '#1944f1' },
  { skill: 'Resume', progress: 72, color: '#82d173' },
]

export const xpHistory = [
  { id: 'x1', action: 'SQL Challenge Completed', xp: 50, date: 'Jul 5' },
  { id: 'x2', action: 'Daily Streak Bonus', xp: 25, date: 'Jul 5' },
  { id: 'x3', action: 'Python Lab Finished', xp: 75, date: 'Jul 4' },
  { id: 'x4', action: 'Aptitude Mock Test', xp: 100, date: 'Jul 3' },
  { id: 'x5', action: 'Resume Review', xp: 40, date: 'Jul 2' },
]

export const completedQuests = [
  { id: 'cq1', title: 'SQL Basics Bootcamp', completedAt: 'Jul 1', xp: 300 },
  { id: 'cq2', title: 'Python Variables Quest', completedAt: 'Jun 28', xp: 150 },
  { id: 'cq3', title: 'First Resume Draft', completedAt: 'Jun 25', xp: 200 },
]

export const streakCalendar = Array.from({ length: 28 }, (_, i) => ({
  day: i + 1,
  active: i < 14 || (i >= 18 && i < 22),
}))
