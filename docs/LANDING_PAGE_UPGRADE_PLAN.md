# Landing Page Upgrade Plan

**Branch:** `phase-ui-lab-01-future-frontend-plan`  
**Scope:** Documentation only — no component changes on this branch

---

## 1. Current landing-page structure

**File:** `src/pages/LandingPage.tsx`

| Order | Section | Component | Data source | Animation |
|-------|---------|-----------|-------------|-----------|
| 0 | Fixed navbar | `PublicNavbar` | Hardcoded `navLinks` | Framer `AnimatePresence` mobile menu |
| 1 | Hero | `Hero` | Inline copy | Framer entrance |
| 2 | Skills strip | `SkillsTicker` | Hardcoded `skills[]` | CSS `ticker-track` keyframes |
| 3 | Learning paths | `LearningPaths` | `dummyCourses.learningPaths` | Framer `whileInView` |
| 4 | Quest gallery | `QuestGallery` | `dummyQuests.questGallery` | Framer + CSS flex hover |
| 5 | Why Code Quest | `WhyCodeQuest` | Hardcoded `stats[]` | Framer `whileInView` |
| 6 | Footer + CTA | `LandingFooter` | Hardcoded columns | None |

**Gaps vs future vision:**

- No platform badges row
- No Code Quest capabilities grid (distinct from WhyCodeQuest stats)
- No Career Quest Timeline
- No Technologies You Will Master section
- No student projects showcase
- No career outcomes section
- No progress preview (dashboard teaser)
- Navbar anchors do not match future section IDs
- Visual language predates K3 shell (glass/neon vs black/mono)

---

## 2. Proposed future structure

| Order | Section ID | Component (proposed) | Purpose |
|-------|------------|----------------------|---------|
| 1 | — | `PublicNavbar` (modified) | Anchors to new sections; K3-adjacent styling |
| 2 | `#hero` | `LandingHero` (modify `Hero`) | Value prop, dual CTA, scroll cue |
| 3 | `#badges` | `PlatformBadges` **(new)** | Trust / capability pills (placement prep, SQL, Python, jobs) |
| 4 | `#capabilities` | `CodeQuestCapabilities` **(new)** | 4–6 feature cards (practice, career, progress, jobs) |
| 5 | `#career-timeline` | `CareerQuestTimeline` **(new)** | Week-by-week journey (see timeline spec) |
| 6 | `#technologies` | `TechnologiesMaster` **(new)** | Categorized tech cards (see tech spec) |
| 7 | `#learning-paths` | `LearningPaths` (modified) | Structured tracks (existing) |
| 8 | `#module-gallery` | `QuestGallery` / `ModuleGallery` (modified) | Expandable module cards |
| 9 | `#student-projects` | `StudentProjectsShowcase` **(new)** | Dummy portfolio previews |
| 10 | `#career-outcomes` | `CareerOutcomes` **(new)** | Roles, readiness metrics, placement stats |
| 11 | `#progress-preview` | `ProgressPreview` **(new)** | Static dashboard teaser (XP, streak, badges) |
| 12 | `#cta` | `LandingFooter` (modified) | Final CTA + links |
| 13 | — | `SkillsTicker` (optional) | Reposition below hero or merge into badges |

**Optional:** Absorb K3 marketing blocks from authenticated dashboard (`K3SelectedWork`, `K3Audience`, `K3Pricing`) into `#module-gallery`, `#career-outcomes`, `#cta` per prior parity audit — not duplicated on student `/dashboard`.

---

## 3. Component reuse map

| Existing component | Future role | Action |
|--------------------|-------------|--------|
| `PublicNavbar` | Top nav | **Modify** — new anchor links, K3 typography option |
| `Hero` | `#hero` | **Modify** — K3 headline scale, badge row, GSAP optional intro |
| `SkillsTicker` | `#badges` or hero sub-strip | **Modify** — rename concepts to platform badges |
| `LearningPaths` | `#learning-paths` | **Reuse** — restyle cards; keep `dummyCourses` |
| `QuestGallery` | `#module-gallery` | **Modify** — align with K3 numbered rows option |
| `WhyCodeQuest` | Split | **Modify** — capabilities → `#capabilities`; copy → outcomes |
| `LandingFooter` | `#cta` + footer | **Reuse** — extend link columns |
| `Badge` | All sections | **Reuse** |
| `Button` | CTAs | **Reuse** |
| `Card` | Capabilities, outcomes | **Reuse** |
| `ProgressBar` | Paths, progress preview | **Reuse** |
| `K3ServiceMarquee` | Between sections | **Reuse** — optional divider |
| `K3_SECTION`, `K3_HEADLINE` | Section headers | **Reuse** from `k3Theme.ts` |

---

## 4. Components to add

| Component | Spec document | Dummy data file (future) |
|-----------|---------------|--------------------------|
| `PlatformBadges` | This doc §2 | `dummyPlatformBadges.ts` |
| `CodeQuestCapabilities` | This doc §2 | `dummyCapabilities.ts` |
| `CareerQuestTimeline` | `CAREER_QUEST_TIMELINE_SPEC.md` | `dummyCareerTimeline.ts` |
| `TechnologiesMaster` | `TECH_STACK_SECTION_SPEC.md` | `dummyTechnologies.ts` |
| `StudentProjectsShowcase` | This doc §2 | `dummyStudentProjects.ts` |
| `CareerOutcomes` | This doc §2 | `dummyCareerOutcomes.ts` |
| `ProgressPreview` | This doc §2 | `dummyStudent.ts` (partial reuse) |

---

## 5. Section order rationale

1. **Hero** — immediate value prop  
2. **Badges** — quick trust scan  
3. **Capabilities** — what the platform does  
4. **Timeline** — emotional career story (Ayush-style scroll narrative)  
5. **Technologies** — rational skill inventory (Redoyan-style glass grid)  
6. **Learning paths** — choose a track  
7. **Module gallery** — explore modules  
8. **Student projects** — social proof  
9. **Career outcomes** — placement framing  
10. **Progress preview** — product tangibility  
11. **CTA / footer** — convert  

---

## 6. Responsive behaviour

| Section | Desktop (≥1024px) | Tablet (768–1023px) | Mobile (<768px) |
|---------|-------------------|---------------------|-----------------|
| Hero | Centered, large type | Same, reduced clamp | Stacked CTAs, shorter hero min-height |
| Badges | Horizontal wrap | 2-row wrap | Horizontal scroll snap |
| Capabilities | 3-column grid | 2-column | 1-column stack |
| Timeline | Alternating L/R + sticky progress line | Single column, line left | Vertical stack, line left, no pin |
| Technologies | Category tabs + 3–4 col grid | 2-col grid | 1-col, category accordion |
| Learning paths | 3-col grid (existing) | 2-col | 1-col |
| Quest gallery | Horizontal expand (existing) | Stacked cards | Full-width cards, no flex-grow |
| Projects | 2–3 col masonry | 2 col | 1 col |
| Progress preview | Side-by-side mock + copy | Stacked | Stacked |
| Footer | 4-col links | 2-col | 2-col |

---

## 7. Accessibility requirements

| Requirement | Implementation plan |
|-------------|---------------------|
| Keyboard nav | All timeline weeks and tech cards focusable; skip link to `#career-timeline` |
| Screen readers | `aria-current="step"` on active timeline week; section `aria-labelledby` |
| Reduced motion | `prefers-reduced-motion`: disable ScrollTrigger pin/scrub; show full timeline static |
| Color contrast | Purple tech zone must meet WCAG AA on `#1a1028` base (spec in tech doc) |
| Anchor links | Navbar hash links match section `id`s; focus management on navigate |
| Images | Project previews: `alt` text from dummy data `imageAlt` field |
| Live regions | Optional polite announcement when active timeline week changes |

---

## 8. Loading and reduced-motion behaviour

| State | Behaviour |
|-------|-----------|
| Initial load | Lazy sections below fold via React `Suspense` boundaries per section (future branch) |
| Images | `loading="lazy"` on timeline and project previews; placeholder gradient if missing |
| GSAP | Register plugins once per section; `useGSAP` cleanup on unmount |
| Reduced motion | CSS global override already in `globals.css`; GSAP branches check `matchMedia('(prefers-reduced-motion: reduce)')` (pattern in `MissionFeedTicker`, `useOrchestratedNavMotion`) |
| Timeline without JS | All weeks visible in document order; progress line shown at 100% width static |
| Tech grid without JS | All cards visible; no stagger |

---

## 9. Design token notes

**Current landing tokens** (`globals.css`): `--color-bg-primary: #0a0a0a`, legacy names `--color-neon-blue` mapped to white; utilities `.glass`, `.gradient-text`, `.coding-grid`.

**K3 tokens** (`k3Theme.ts`): black surfaces, mono section labels, uppercase headlines.

**Future purple zone** (tech section only — proposed, not implemented):

```text
--cq-purple-bg: #12081f
--cq-purple-surface: #1a1028
--cq-purple-glass: rgba(139, 92, 246, 0.08)
--cq-purple-accent: #8b5cf6
--cq-purple-border: rgba(167, 139, 250, 0.2)
```

Landing hero remains K3-black; tech section introduces purple atmosphere without copying reference site hex values exactly.

---

## 10. `CareerMapPage.tsx` relationship

`CareerMapPage` is an **authenticated** horizontal step roadmap (5 roles × 6 steps). It is **not** the landing timeline but shares semantics:

| CareerMapPage | Career Quest Timeline (landing) |
|---------------|--------------------------------|
| Role-based roadmaps | Single default 12-week journey |
| Horizontal step dots | Vertical scroll chapters |
| In-app `/career-map` | Public `/#career-timeline` |
| Static inline data | Future `dummyCareerTimeline.ts` |

Future branch `career-map redesign` should align visual language after landing timeline ships.

---

## 11. Navbar anchor updates (planned)

| Current `navLinks` | Future anchor |
|--------------------|---------------|
| Learning Paths | `/#learning-paths` |
| Practice | `/#module-gallery` |
| Career | `/#career-timeline` |
| Materials | `/materials` (unchanged) |

Add: Technologies → `/#technologies`, Outcomes → `/#career-outcomes`
