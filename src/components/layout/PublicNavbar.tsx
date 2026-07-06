import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'

const navLinks = [
  { label: 'Learning Paths', href: '/#learning-paths' },
  { label: 'Practice', href: '/#quest-gallery' },
  { label: 'Career', href: '/#why-codequest' },
  { label: 'Materials', href: '/materials' },
]

export function PublicNavbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/8">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="gradient-text">Code Quest</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-text-secondary hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <Button size="sm" onClick={() => navigate('/register')}>
            Start Your Quest
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden p-2 text-text-secondary hover:text-white"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-white/8"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-text-secondary hover:text-white py-2"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Button size="sm" className="w-full mt-2" onClick={() => { setOpen(false); navigate('/register') }}>
                Start Your Quest
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
