import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'
import { login } from '../lib/auth'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    login(email || 'student@codequest.dev', password)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 coding-grid">
      <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-neon-purple/10" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold gradient-text">Code Quest</Link>
          <p className="text-text-secondary mt-2 text-sm">Sign in to continue your quest</p>
        </div>

        <Card>
          <div className="flex items-center gap-2 mb-6">
            <LogIn className="w-5 h-5 text-neon-blue" />
            <h1 className="text-xl font-bold">Login</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-text-secondary mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@student.edu"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-muted focus:border-neon-blue/50 outline-none"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm text-text-secondary mb-1.5">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Any password works"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-muted focus:border-neon-blue/50 outline-none"
              />
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            No account?{' '}
            <Link to="/register" className="text-neon-blue hover:underline">Register</Link>
          </p>
          <p className="text-center text-xs text-text-muted mt-3">
            Dummy auth — any email/password accepted
          </p>
        </Card>
      </motion.div>
    </div>
  )
}
