import { useState } from 'react'
import { Bell, Moon, Target } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

const SETTINGS_KEY = 'codequest_settings'

interface Settings {
  theme: 'dark' | 'light'
  notifications: boolean
  learningGoal: string
}

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) return JSON.parse(raw) as Settings
  } catch { /* ignore */ }
  return { theme: 'dark', notifications: true, learningGoal: 'data-analyst' }
}

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(loadSettings)
  const [saved, setSaved] = useState(false)

  const update = (patch: Partial<Settings>) => {
    const next = { ...settings, ...patch }
    setSettings(next)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Badge variant="muted" className="mb-2">Settings</Badge>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-text-secondary text-sm mt-1">Dummy preferences — stored in localStorage only.</p>
      </div>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Moon className="w-5 h-5 text-neon-blue" />
          <h3 className="font-semibold">Theme Preference</h3>
        </div>
        <div className="flex gap-3">
          {(['dark', 'light'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => update({ theme: t })}
              className={`px-4 py-2 rounded-full text-sm capitalize transition-colors ${
                settings.theme === t
                  ? 'bg-neon-blue/15 text-neon-blue border border-neon-blue/30'
                  : 'bg-white/5 text-text-secondary border border-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="text-xs text-text-muted mt-2">Theme toggle is UI-only in this prototype.</p>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-neon-purple" />
            <div>
              <h3 className="font-semibold">Notifications</h3>
              <p className="text-xs text-text-secondary">Daily quest reminders & job alerts</p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.notifications}
            aria-label="Toggle notifications"
            onClick={() => update({ notifications: !settings.notifications })}
            className={`w-12 h-6 rounded-full transition-colors relative ${settings.notifications ? 'bg-neon-blue' : 'bg-white/20'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${settings.notifications ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-5 h-5 text-mantis-green" />
          <h3 className="font-semibold">Learning Goal</h3>
        </div>
        <select
          value={settings.learningGoal}
          onChange={(e) => update({ learningGoal: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none"
          aria-label="Learning goal preference"
        >
          <option value="data-analyst">Data Analyst</option>
          <option value="python-dev">Python Developer</option>
          <option value="sql-dev">SQL Developer</option>
          <option value="full-stack">Full Stack Beginner</option>
          <option value="placement">Placement Preparation</option>
        </select>
      </Card>

      {saved && (
        <p className="text-sm text-mantis-green">Settings saved to localStorage.</p>
      )}

      <Button variant="secondary" onClick={() => update(loadSettings())}>
        Reset to Defaults
      </Button>
    </div>
  )
}
