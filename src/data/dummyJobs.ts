export interface Job {
  id: string
  role: string
  company: string
  location: string
  type: string
  matchScore: number
  readiness: 'Ready' | 'Almost' | 'Building'
  salary: string
  posted: string
}

export const dummyJobs: Job[] = [
  {
    id: 'j1',
    role: 'Junior Data Analyst',
    company: 'TechCorp Analytics',
    location: 'Bangalore',
    type: 'Full-time',
    matchScore: 87,
    readiness: 'Ready',
    salary: '₹4–6 LPA',
    posted: '2 days ago',
  },
  {
    id: 'j2',
    role: 'Python Developer Intern',
    company: 'StartupForge',
    location: 'Remote',
    type: 'Internship',
    matchScore: 74,
    readiness: 'Almost',
    salary: '₹25k/month',
    posted: '1 day ago',
  },
  {
    id: 'j3',
    role: 'SQL Developer',
    company: 'DataBridge Solutions',
    location: 'Hyderabad',
    type: 'Full-time',
    matchScore: 68,
    readiness: 'Almost',
    salary: '₹5–7 LPA',
    posted: '3 days ago',
  },
  {
    id: 'j4',
    role: 'Power BI Analyst',
    company: 'Insight Labs',
    location: 'Pune',
    type: 'Full-time',
    matchScore: 55,
    readiness: 'Building',
    salary: '₹4–5.5 LPA',
    posted: '5 days ago',
  },
  {
    id: 'j5',
    role: 'Business Analyst Trainee',
    company: 'Global Systems',
    location: 'Chennai',
    type: 'Trainee',
    matchScore: 62,
    readiness: 'Building',
    salary: '₹3.5–4.5 LPA',
    posted: '1 week ago',
  },
]
