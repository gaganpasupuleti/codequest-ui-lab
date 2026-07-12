# Career Quest Timeline — Specification

**Branch:** `phase-ui-lab-01-future-frontend-plan`  
**Inspiration:** Scroll-based career journey storytelling ([ayushsingh.co.in](https://ayushsingh.co.in/) — concepts only)  
**Component (proposed):** `src/components/landing/CareerQuestTimeline.tsx`  
**Data (proposed):** `src/data/dummyCareerTimeline.ts`

---

## 1. Timeline user experience

The Career Quest Timeline tells a **12-week placement-prep journey** as a vertical scroll story. Each week is a chapter with:

- Week number and title
- Topics covered
- Learning outcomes (bullet list)
- Project or activity name
- Technologies used (tags)
- Estimated duration
- Career skill badge earned
- Supporting image or project preview (placeholder gradient or dummy screenshot)

**User goals:**

- Understand what Code Quest delivers week by week
- Feel progression toward employability
- See concrete projects and technologies before signing up

**Interaction model:**

- Scroll drives narrative; active week highlights as user moves through section
- Progress line fills proportionally to scroll through timeline
- Optional: clicking a week scrolls it into focus (keyboard accessible)

---

## 2. Desktop layout (≥1024px)

```
┌────────────────────────────────────────────────────────────┐
│  CAREER QUEST TIMELINE          [section label - K3 mono] │
│  Your 12-Week Placement Journey   [headline]              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ● Week 01 ──────►  [Content column]     [Image column]   │
│  │                  topics, outcomes      preview card    │
│  │                  project, tech tags                      │
│  ● Week 02 ◄─────  [Image column]        [Content column]  │  alternating
│  │                                                            │
│  ● Week 03 ──────►  ...                                      │
│  │                                                            │
│  │  ← vertical progress line (left, 2px, sticky)           │
└────────────────────────────────────────────────────────────┘
```

- **Alternating columns:** Odd weeks — content left, image right; even weeks — reversed
- **Progress line:** Fixed `left: 48px`, `position: sticky`, height tracks section; fill uses GSAP `scaleY` or height tween tied to ScrollTrigger
- **Active week:** Dot scales up, border brightens, `aria-current="step"`

---

## 3. Mobile layout (<768px)

- Single column: week marker → content → image (always content before image)
- Progress line on **left edge** (16px inset), dots aligned to line
- No horizontal alternating
- No ScrollTrigger pin (performance + viewport height)
- Week cards full width with `16px` horizontal padding
- Images: 16:9 aspect ratio, max-height `200px`

---

## 4. Active-week behaviour

| Signal | Desktop | Mobile |
|--------|---------|--------|
| Detection | ScrollTrigger `start: "top center"` per week ref | Same, looser `start: "top 70%"` |
| Active styles | Dot `scale(1.25)`, white border, week title `text-white` | Same |
| Inactive | Dot `scale(1)`, `opacity-40` | Same |
| Progress line | Fill to active week's center Y | Fill to active week |
| Debounce | `fastScrollEnd: true` on ScrollTrigger | Same |

On `prefers-reduced-motion: reduce`:

- No scrub animation; active week = last week whose top passed 40% viewport (Intersection Observer fallback)
- Progress line shows static fill to active week without tween

---

## 5. Image placement

| Field | Type | Fallback |
|-------|------|----------|
| `imageSrc` | optional string URL | Omit in lab — use CSS gradient |
| `imageAlt` | string (required if image) | `"Week N project preview: {projectTitle}"` |
| `imageGradient` | tailwind gradient class | `from-violet-500/20 to-fuchsia-500/10` |

**Placement rules:**

- Desktop: opposite column from primary text block
- Mobile: below outcomes list
- Rounded `rounded-2xl`, border `border-white/10`
- Optional Framer hover `scale(1.02)` on image container only

---

## 6. Progress-line behaviour (GSAP)

```text
ScrollTrigger.create({
  trigger: timelineSection,
  start: "top top",
  end: "bottom bottom",
  scrub: true,                    // disabled when reduced-motion
  onUpdate: (self) => setLineProgress(self.progress)
})
```

- Line background: `bg-white/10`, width `2px`
- Fill: `bg-white` or `bg-violet-400` in purple-accent variant
- `lineProgress` 0→1 maps to `scaleY` transform origin top

**Boundaries:**

- GSAP only inside `CareerQuestTimeline` via `useGSAP({ scope: ref })`
- No timeline animation in parent `LandingPage`
- Max one ScrollTrigger instance per week for active state (batch or toggle class)

---

## 7. Week data model

```typescript
export type CareerSkillBadge =
  | 'sql-foundations'
  | 'python-core'
  | 'data-analysis'
  | 'portfolio-ready'
  | 'aptitude-ready'
  | 'interview-ready'
  | 'job-ready'

export interface CareerTimelineWeek {
  id: string                    // "week-01"
  weekNumber: number            // 1–12
  title: string                 // "SQL Foundations"
  topics: string[]              // ["SELECT", "JOINs", "Aggregations"]
  outcomes: string[]            // ["Write multi-table queries", "..."]
  projectTitle: string          // "Sales Analytics Mini-Project"
  projectSummary: string        // one sentence
  technologies: string[]        // ["SQL", "PostgreSQL"]
  durationHours: number         // e.g. 8
  durationLabel: string         // "8 hours" | "1 week"
  badge: CareerSkillBadge
  badgeLabel: string            // display: "SQL Foundations"
  moduleHref: string            // "/sql-arena" — link to lab module
  imageAlt?: string
  imageGradient?: string        // tailwind classes
}
```

---

## 8. Badge types

| Badge ID | Label | Color token (proposed) |
|----------|-------|------------------------|
| `sql-foundations` | SQL Foundations | `#38bdf8` |
| `python-core` | Python Core | `#a78bfa` |
| `data-analysis` | Data Analysis | `#34d399` |
| `portfolio-ready` | Portfolio Ready | `#fbbf24` |
| `aptitude-ready` | Aptitude Ready | `#f472b6` |
| `interview-ready` | Interview Ready | `#fb923c` |
| `job-ready` | Job Ready | `#ffffff` |

Rendered as `Badge` component variant or custom pill with icon (Lucide).

---

## 9. Example dummy timeline records

```typescript
export const careerQuestTimeline: CareerTimelineWeek[] = [
  {
    id: 'week-01',
    weekNumber: 1,
    title: 'SQL Foundations',
    topics: ['SELECT & WHERE', 'ORDER BY', 'Basic aggregates'],
    outcomes: [
      'Read and filter relational data confidently',
      'Explain row vs aggregate query results',
    ],
    projectTitle: 'Retail Sales Explorer',
    projectSummary: 'Analyze a sample retail database to answer business questions.',
    technologies: ['SQL', 'PostgreSQL'],
    durationHours: 6,
    durationLabel: 'Week 1 · ~6 hrs',
    badge: 'sql-foundations',
    badgeLabel: 'SQL Foundations',
    moduleHref: '/sql-arena',
    imageAlt: 'Week 1 project preview: Retail Sales Explorer',
    imageGradient: 'from-sky-500/20 to-blue-900/10',
  },
  {
    id: 'week-02',
    weekNumber: 2,
    title: 'JOINs & Subqueries',
    topics: ['INNER/LEFT JOIN', 'Subqueries', 'CTEs intro'],
    outcomes: [
      'Combine tables for reporting queries',
      'Refactor nested queries into readable CTEs',
    ],
    projectTitle: 'Customer Order Report',
    projectSummary: 'Build a multi-table report for a fictional e-commerce store.',
    technologies: ['SQL', 'JOINs'],
    durationHours: 8,
    durationLabel: 'Week 2 · ~8 hrs',
    badge: 'sql-foundations',
    badgeLabel: 'SQL Builder',
    moduleHref: '/sql-arena',
    imageAlt: 'Week 2 project preview: Customer Order Report',
    imageGradient: 'from-cyan-500/15 to-indigo-900/10',
  },
  {
    id: 'week-03',
    weekNumber: 3,
    title: 'Python for Data',
    topics: ['Variables', 'Lists & dicts', 'Functions', 'pandas intro'],
    outcomes: [
      'Automate data cleaning with Python',
      'Load CSV data into structured objects',
    ],
    projectTitle: 'CSV Cleanup Script',
    projectSummary: 'Clean and summarize a messy hiring dataset.',
    technologies: ['Python', 'pandas'],
    durationHours: 10,
    durationLabel: 'Week 3 · ~10 hrs',
    badge: 'python-core',
    badgeLabel: 'Python Core',
    moduleHref: '/python-lab',
    imageAlt: 'Week 3 project preview: CSV Cleanup Script',
    imageGradient: 'from-violet-500/20 to-purple-900/10',
  },
  // ... weeks 04–12 defined in implementation branch
]
```

Weeks 4–12 (outline for dummy data branch):

| Week | Title | Badge |
|------|-------|-------|
| 4 | Data Visualization Basics | data-analysis |
| 5 | Power BI / Dashboards | data-analysis |
| 6 | Aptitude & Logic | aptitude-ready |
| 7 | Resume & ATS Lab | portfolio-ready |
| 8 | DSA Essentials | python-core |
| 9 | Mock Interview Prep | interview-ready |
| 10 | Job Board Sprint | job-ready |
| 11 | Portfolio Capstone | portfolio-ready |
| 12 | Placement Readiness | job-ready |

---

## 10. GSAP animation boundaries

| Allowed | Forbidden |
|---------|-----------|
| Progress line scrub | Pin entire viewport indefinitely |
| Week dot scale/color on enter | Horizontal scroll hijacking |
| Stagger fade-in on section mount (once) | Animating layout reflow every frame |
| `useGSAP` scoped cleanup | Global ScrollTrigger on `LandingPage` |
| Intersection Observer fallback | Copying reference site scroll JS |

**Plugin registration:** `gsap.registerPlugin(ScrollTrigger, useGSAP)` inside component file only.

---

## 11. Accessibility fallback

| Feature | Fallback |
|---------|----------|
| Scroll-driven active week | All weeks expanded; manual `tab` through week headings |
| Progress line animation | Static 100% visible line |
| Alternating layout | DOM order matches reading order on mobile |
| Week links to modules | Standard `<a href>` with visible focus ring |
| Badge icons | Accompanied by text label (never icon-only) |

**Heading structure:** `h2` section title → `h3` per week title (not `h2` repeated).

---

## 12. Relationship to `CareerMapPage`

| Aspect | Landing timeline | `CareerMapPage` |
|--------|------------------|-----------------|
| Audience | Prospective students | Logged-in students |
| Structure | 12-week linear journey | 5 role roadmaps |
| Data | `dummyCareerTimeline.ts` | Inline `roadmaps[]` |
| Motion | GSAP scroll | None today |

Future `career-map redesign` branch should import shared week/step visual components from timeline where possible.
