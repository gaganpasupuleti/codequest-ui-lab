import { CareerMapperPage } from '@/components/career-mapper'

/** Career Map route — responsive shell wraps canonical mapper page. */
export function RoadmapperPage() {
  return (
    <div className="min-w-0 w-full overflow-x-hidden">
      <CareerMapperPage />
    </div>
  )
}
