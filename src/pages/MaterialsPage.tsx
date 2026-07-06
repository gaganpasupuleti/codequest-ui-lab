import { useState } from 'react'
import { BookOpen, FileText, Map, FolderOpen } from 'lucide-react'
import { dummyMaterials, materialCategories } from '../data/dummyMaterials'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'

const typeIcons = {
  article: FileText,
  book: BookOpen,
  roadmap: Map,
  collection: FolderOpen,
}

export function MaterialsPage() {
  const [category, setCategory] = useState('All')

  const filtered = category === 'All'
    ? dummyMaterials
    : dummyMaterials.filter((m) => m.category === category)

  const featured = dummyMaterials.filter((m) => m.featured)

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="neon" className="mb-2">Resources</Badge>
        <h1 className="text-2xl font-bold">Materials</h1>
        <p className="text-text-secondary text-sm mt-1">Articles, books, roadmaps, and collections.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {materialCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              category === cat
                ? 'bg-neon-blue/15 text-neon-blue border border-neon-blue/30'
                : 'bg-white/5 text-text-secondary border border-white/10 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {featured.length > 0 && category === 'All' && (
        <div>
          <h3 className="font-semibold mb-4">Featured</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {featured.map((m) => {
              const Icon = typeIcons[m.type]
              return (
                <Card key={m.id} hover className="gradient-border">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-neon-blue/10">
                      <Icon className="w-5 h-5 text-neon-blue" />
                    </div>
                    <div>
                      <Badge variant="neon" className="mb-2">Featured</Badge>
                      <h4 className="font-semibold">{m.title}</h4>
                      <p className="text-xs text-text-secondary mt-1">{m.category} · {m.readTime}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((m) => {
          const Icon = typeIcons[m.type]
          return (
            <Card key={m.id} hover>
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-text-secondary" />
                <Badge variant="muted">{m.type}</Badge>
              </div>
              <h4 className="font-semibold text-sm mb-1">{m.title}</h4>
              <p className="text-xs text-text-secondary">{m.category} · {m.readTime}</p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
