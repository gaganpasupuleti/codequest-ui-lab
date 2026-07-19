import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

const footerColumns = [
  {
    title: 'Explore',
    links: [
      { label: 'How It Works', href: '/#how-it-works' },
      { label: 'Arenas', href: '/#quest-arenas' },
      { label: 'Career Map', href: '/#career-map' },
      { label: 'Features', href: '/#features' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Login', href: '/login' },
      { label: 'Start Your Quest', href: '/login' },
    ],
  },
]

export function LandingFooter() {
  return (
    <footer className="landing-section-footer landing-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="landing-footer-heading text-2xl sm:text-3xl font-bold mb-4">
            Start your coding quest today.
          </h2>
          <Link to="/login">
            <Button size="lg">Start Your Quest</Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12 max-w-xl mx-auto">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="landing-footer-col-title text-xs font-semibold uppercase tracking-widest mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="landing-footer-link text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="landing-footer-divider border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="landing-footer-brand font-bold">CodeQuest UI Lab</span>
          <p className="landing-footer-fine-print text-xs">
            Frontend skeleton prototype — design review only. No backend connected.
          </p>
        </div>
      </div>
    </footer>
  )
}
