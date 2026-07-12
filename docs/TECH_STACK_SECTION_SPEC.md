# Technologies You Will Master — Specification

**Branch:** `phase-ui-lab-01-future-frontend-plan`  
**Inspiration:** Technology stack presentation ([redoyanulhaque.me](https://www.redoyanulhaque.me/) — concepts only)  
**Component (proposed):** `src/components/landing/TechnologiesMaster.tsx`  
**Data (proposed):** `src/data/dummyTechnologies.ts`

---

## 1. Visual direction

A **dark purple atmosphere** section distinct from K3-black hero but visually related — signals "skills inventory" without copying reference site branding.

### Proposed atmosphere

| Token | Value | Usage |
|-------|-------|-------|
| Section background | `#12081f` → `#0a0a0a` gradient | Full-bleed section |
| Card surface | `rgba(255,255,255,0.04)` + `backdrop-blur` | Glass cards |
| Card border | `rgba(167, 139, 250, 0.18)` | Default state |
| Card border hover | `rgba(167, 139, 250, 0.45)` | Hover/focus |
| Accent | `#8b5cf6` | Badges, icons, category tabs |
| Muted text | `rgba(255,255,255,0.55)` | Descriptions |

**Do not:** Copy exact layout grid, card dimensions, or typography scale from reference site.

**Do:** Use existing lab primitives — `.glass`, `Badge`, `Card`, Lucide icons — extended with purple tokens.

---

## 2. Technology categories

| Category ID | Label | Description |
|-------------|-------|-------------|
| `languages` | Languages | Python, SQL, JavaScript |
| `data` | Data & Analytics | Power BI, DAX, Excel, pandas |
| `engineering` | Engineering | Git, APIs, debugging |
| `career` | Career Skills | Resume, aptitude, interviews |
| `platform` | Code Quest Modules | Direct links to lab routes |

Category selector:

- Desktop: horizontal tab pills (Framer `layoutId` underline optional)
- Mobile: horizontal scroll snap pills or accordion

Default selected: `languages` or `all`.

---

## 3. Card information hierarchy

Each technology card displays (top → bottom):

```
┌─────────────────────────────┐
│  [Icon]          [Category] │  ← row 1: icon + category badge
│  Technology Name            │  ← row 2: bold name
│  Related module link        │  ← row 3: mono link "SQL Arena →"
│  Skill level ████░░  Intermediate │  ← row 4: level bar + label
│  12 quests · 3 projects     │  ← row 5: counts
└─────────────────────────────┘
```

| Field | Priority | Required |
|-------|----------|----------|
| Icon | Visual anchor | Yes (Lucide mapping) |
| Name | Primary label | Yes |
| Category badge | Scan grouping | Yes |
| Module link | Code Quest connection | Yes |
| Skill level | 1–5 or enum | Yes |
| Quest count | Number | Yes |
| Project count | Number | Optional |
| Description | One line | Optional |

---

## 4. Badge system

| Badge type | When | Style |
|------------|------|-------|
| Category | Every card | Purple outline, mono uppercase |
| Skill: Beginner | level 1–2 | `muted` variant |
| Skill: Intermediate | level 3 | `neon` variant |
| Skill: Advanced | level 4–5 | `purple` variant |
| Module | On module link | Text link with arrow |

Skill level mapping:

```typescript
type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'
```

---

## 5. Hover behaviour

| Element | Desktop | Motion library |
|---------|---------|----------------|
| Card | `translateY(-4px)`, border brighten, subtle shadow | Framer `whileHover` |
| Icon | `scale(1.08)` | Framer |
| Module link | underline + color shift | CSS transition |
| Category tab | background fill | Framer or CSS |

**GSAP (optional):** Stagger reveal on first `whileInView` only — `gsap.from('.tech-card', { opacity: 0, y: 24, stagger: 0.06 })` inside `useGSAP` when section enters viewport. Do not re-stagger on category filter change (use Framer `AnimatePresence` for cross-fade).

---

## 6. Mobile behaviour

- Single column card list below category pills
- Cards min-height consistent for scanability
- No hover-dependent information (all fields visible)
- Touch targets ≥ 44px for tabs and module links
- Optional collapse: show 4 cards + "Show all in category" button

---

## 7. Technology data model

```typescript
export type TechnologyCategory =
  | 'languages'
  | 'data'
  | 'engineering'
  | 'career'
  | 'platform'

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export interface TechnologyRecord {
  id: string
  name: string
  category: TechnologyCategory
  icon: string              // lucide icon key
  moduleLabel: string       // "SQL Arena"
  moduleHref: string        // "/sql-arena"
  skillLevel: SkillLevel
  questCount: number
  projectCount: number
  description?: string
}
```

---

## 8. Example dummy technology records

```typescript
export const technologiesMaster: TechnologyRecord[] = [
  {
    id: 'tech-sql',
    name: 'SQL',
    category: 'languages',
    icon: 'database',
    moduleLabel: 'SQL Arena',
    moduleHref: '/sql-arena',
    skillLevel: 'intermediate',
    questCount: 24,
    projectCount: 4,
    description: 'Query, join, and aggregate data for analytics interviews.',
  },
  {
    id: 'tech-python',
    name: 'Python',
    category: 'languages',
    icon: 'code',
    moduleLabel: 'Python Lab',
    moduleHref: '/python-lab',
    skillLevel: 'intermediate',
    questCount: 18,
    projectCount: 3,
    description: 'Scripting, data cleaning, and interview coding patterns.',
  },
  {
    id: 'tech-powerbi',
    name: 'Power BI',
    category: 'data',
    icon: 'bar-chart-3',
    moduleLabel: 'Materials',
    moduleHref: '/materials',
    skillLevel: 'beginner',
    questCount: 8,
    projectCount: 2,
    description: 'Dashboards and business reporting workflows.',
  },
  {
    id: 'tech-dax',
    name: 'DAX',
    category: 'data',
    icon: 'sigma',
    moduleLabel: 'Materials',
    moduleHref: '/materials',
    skillLevel: 'beginner',
    questCount: 6,
    projectCount: 1,
    description: 'Measures, calculated columns, and analytical expressions.',
  },
  {
    id: 'tech-git',
    name: 'Git',
    category: 'engineering',
    icon: 'git-branch',
    moduleLabel: 'Practice',
    moduleHref: '/practice',
    skillLevel: 'beginner',
    questCount: 5,
    projectCount: 0,
  },
  {
    id: 'tech-aptitude',
    name: 'Aptitude',
    category: 'career',
    icon: 'brain',
    moduleLabel: 'Aptitude',
    moduleHref: '/aptitude',
    skillLevel: 'intermediate',
    questCount: 40,
    projectCount: 0,
    description: 'Quant, logic, and verbal placement mocks.',
  },
  {
    id: 'tech-resume',
    name: 'ATS Resume',
    category: 'career',
    icon: 'file-text',
    moduleLabel: 'Resume Lab',
    moduleHref: '/resume-lab',
    skillLevel: 'beginner',
    questCount: 4,
    projectCount: 1,
  },
  {
    id: 'tech-dsa',
    name: 'DSA',
    category: 'engineering',
    icon: 'workflow',
    moduleLabel: 'DSA',
    moduleHref: '/dsa',
    skillLevel: 'beginner',
    questCount: 15,
    projectCount: 0,
  },
]
```

---

## 9. Animation boundaries

| GSAP | Framer Motion |
|------|---------------|
| Initial grid stagger on section enter (once) | Card hover lift |
| Optional category filter: fade container | Tab indicator slide |
| ScrollTrigger: `start: "top 75%"` once | `AnimatePresence` on filtered cards |
| Kill tweens on unmount via `useGSAP` | Mobile menu pattern (already in navbar) |

**Reduced motion:** Show all cards immediately; no stagger; category switch is instant display toggle.

---

## 10. Accessibility requirements

| Requirement | Implementation |
|-------------|----------------|
| Category tabs | `role="tablist"`, `aria-selected`, keyboard arrows |
| Cards | `article` or `li` in `list`; heading per technology name |
| Skill level | Text label always visible (not color-only) |
| Counts | Readable by screen readers: "24 quests, 3 projects" |
| Contrast | Purple on `#12081f` ≥ 4.5:1 for body text |
| Focus | Visible ring `outline-white` on cards and tabs |

---

## 11. Section header copy (proposed)

```text
Section label:  TECHNOLOGIES
Headline:       Technologies You Will Master
Subcopy:        Every tool connects to a Code Quest module — practice quests and projects included.
```

Uses `K3_SECTION` + adapted headline from `k3Theme.ts`.
