import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

const footerColumns = [
  {
    title: 'Platform',
    links: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Progress', href: '/progress' },
      { label: 'Profile', href: '/profile' },
      { label: 'Settings', href: '/settings' },
    ],
  },
  {
    title: 'Practice',
    links: [
      { label: 'SQL Arena', href: '/sql-arena' },
      { label: 'Python Lab', href: '/python-lab' },
      { label: 'Aptitude', href: '/aptitude' },
      { label: 'DSA', href: '/dsa' },
    ],
  },
  {
    title: 'Career',
    links: [
      { label: 'Resume Lab', href: '/resume-lab' },
      { label: 'Jobs Portal', href: '/jobs' },
      { label: 'Career Map', href: '/career-map' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Materials', href: '/materials' },
      { label: 'Mock Tests', href: '/aptitude' },
      { label: 'Admin', href: '/admin' },
    ],
  },
]

export function LandingFooter() {
  return (
    <footer className="border-t border-white/8 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Start your coding quest today.
          </h2>
          <Link to="/register">
            <Button size="lg">Start Your Quest</Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-text-secondary hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold gradient-text">Code Quest UI Lab</span>
          <p className="text-xs text-text-muted">
            Frontend skeleton prototype — design review only. No backend connected.
          </p>
        </div>
      </div>
    </footer>
  )
}
