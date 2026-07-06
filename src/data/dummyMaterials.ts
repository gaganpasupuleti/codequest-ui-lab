export interface Material {
  id: string
  title: string
  type: 'article' | 'book' | 'roadmap' | 'collection'
  category: string
  readTime: string
  featured?: boolean
}

export const dummyMaterials: Material[] = [
  { id: 'm1', title: 'SQL Joins Explained for Beginners', type: 'article', category: 'SQL', readTime: '8 min', featured: true },
  { id: 'm2', title: 'Python for Data Analysis', type: 'book', category: 'Python', readTime: '12 chapters' },
  { id: 'm3', title: 'Data Analyst Career Roadmap 2026', type: 'roadmap', category: 'Career', readTime: '15 min', featured: true },
  { id: 'm4', title: 'Placement Aptitude Essentials', type: 'collection', category: 'Aptitude', readTime: '20 topics' },
  { id: 'm5', title: 'Power BI Dashboard Patterns', type: 'article', category: 'Analytics', readTime: '10 min' },
  { id: 'm6', title: 'DSA Patterns for Interviews', type: 'collection', category: 'DSA', readTime: '25 topics' },
  { id: 'm7', title: 'Resume Writing for Tech Roles', type: 'article', category: 'Career', readTime: '6 min' },
  { id: 'm8', title: 'Full Stack Beginner Path', type: 'roadmap', category: 'Development', readTime: '20 min' },
]

export const materialCategories = ['All', 'SQL', 'Python', 'Analytics', 'Career', 'Aptitude', 'DSA']
