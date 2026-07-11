import { sidebarItems } from '@/components/layout/sidebarItems'

/** Primary header links — always visible on desktop */
export const CQ_PRIMARY_HREFS = [
  '/dashboard',
  '/practice',
  '/sql-arena',
  '/python-lab',
  '/jobs',
  '/progress',
] as const

/** Secondary pill strip — remaining student modules */
export const CQ_SECONDARY_HREFS = [
  '/aptitude',
  '/dsa',
  '/materials',
  '/resume-lab',
  '/career-map',
  '/profile',
  '/settings',
] as const

function pick(hrefs: readonly string[]) {
  return hrefs
    .map((href) => sidebarItems.find((item) => item.href === href))
    .filter((item): item is (typeof sidebarItems)[number] => Boolean(item))
}

export const cqPrimaryNav = pick(CQ_PRIMARY_HREFS)
export const cqSecondaryNav = pick(CQ_SECONDARY_HREFS)
