import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { questGallery } from '../../data/dummyQuests'
import { Badge } from '../ui/Badge'

export function QuestGallery() {
  return (
    <section id="quest-gallery" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <Badge variant="purple" className="mb-4">Quest Gallery</Badge>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Pick Your Next Adventure
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto">
          Hover to explore quests. Each path rewards XP and builds real skills.
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[420px]">
        {questGallery.map((quest, i) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group flex-1 lg:hover:flex-[2.5] transition-all duration-500"
          >
            <Link
              to={quest.href}
              className={`block h-full min-h-[200px] lg:min-h-0 rounded-2xl p-6 glass bg-gradient-to-br ${quest.gradient} border border-white/10 hover:border-neon-blue/30 transition-all overflow-hidden relative`}
            >
              <Badge variant="neon" className="mb-4">{quest.badge}</Badge>
              <h3 className="text-xl font-bold mb-2">{quest.title}</h3>
              <p className="text-sm text-text-secondary mb-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                {quest.benefit}
              </p>
              <span className="inline-flex items-center gap-1 text-sm text-neon-blue font-semibold opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                {quest.cta}
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
