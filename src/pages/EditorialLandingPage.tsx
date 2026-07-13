import '@/styles/editorial-cq.css'
import { EditorialNav } from '@/components/landing/editorial/EditorialNav'
import { EditorialHero } from '@/components/landing/editorial/EditorialHero'
import { EditorialStatement } from '@/components/landing/editorial/EditorialStatement'
import { EditorialSystem } from '@/components/landing/editorial/EditorialSystem'
import { EditorialProductMoment } from '@/components/landing/editorial/EditorialProductMoment'
import { EditorialFinalCTA } from '@/components/landing/editorial/EditorialFinalCTA'

export function EditorialLandingPage() {
  return (
    <div className="editorial-cq min-h-screen">
      <EditorialNav />
      <main>
        <EditorialHero />
        <EditorialStatement />
        <EditorialSystem />
        <EditorialProductMoment />
        <EditorialFinalCTA />
      </main>
    </div>
  )
}
