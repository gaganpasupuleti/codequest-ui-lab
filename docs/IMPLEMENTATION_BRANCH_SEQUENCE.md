# Implementation Branch Sequence

**Branch:** `phase-ui-lab-01-future-frontend-plan`  
**Rule:** One clear purpose per branch. No mixed landing + dashboard + production migration.

---

## Phase 0 — Planning (current)

| Branch | Purpose | Deliverables |
|--------|---------|--------------|
| `phase-ui-lab-01-future-frontend-plan` | Future frontend vision + specs | `docs/FUTURE_*.md`, `docs/LANDING_*.md`, `docs/CAREER_*.md`, `docs/TECH_*.md`, `docs/FRONTEND_*.md`, `docs/IMPLEMENTATION_*.md` |

**Exit:** Docs reviewed. No runtime changes. No PR merge yet.

---

## Phase 1 — Design tokens and dummy data (UI lab)

| Branch | Purpose | Changes |
|--------|---------|---------|
| `phase-ui-lab-02-landing-tokens` | Purple tech zone + landing token extensions | `cqLandingTokens.ts`, `globals.css` variables only |
| `phase-ui-lab-03-dummy-timeline-data` | Timeline dataset | `dummyCareerTimeline.ts` only |
| `phase-ui-lab-04-dummy-tech-data` | Technology dataset | `dummyTechnologies.ts` only |
| `phase-ui-lab-05-dummy-landing-data` | Capabilities, projects, outcomes | `dummyCapabilities.ts`, `dummyStudentProjects.ts`, `dummyCareerOutcomes.ts` |

---

## Phase 2 — Landing section builds (UI lab)

Each branch adds **one** landing section + wires into `LandingPage.tsx`.

| Branch | Purpose | Component |
|--------|---------|-----------|
| `phase-ui-lab-06-landing-hero` | Hero upgrade | Modify `Hero.tsx` — K3 scale, badges, GSAP intro optional |
| `phase-ui-lab-07-platform-badges` | Platform badges row | `PlatformBadges.tsx` |
| `phase-ui-lab-08-capabilities` | Code Quest capabilities grid | `CodeQuestCapabilities.tsx` |
| `phase-ui-lab-09-career-timeline` | Career Quest Timeline | `CareerQuestTimeline.tsx` + GSAP ScrollTrigger |
| `phase-ui-lab-10-tech-stack` | Technologies You Will Master | `TechnologiesMaster.tsx` |
| `phase-ui-lab-11-module-showcase` | Module gallery refresh | Modify `QuestGallery.tsx` |
| `phase-ui-lab-12-student-projects` | Student projects showcase | `StudentProjectsShowcase.tsx` |
| `phase-ui-lab-13-career-outcomes` | Career outcomes section | `CareerOutcomes.tsx` |
| `phase-ui-lab-14-progress-preview` | Dashboard teaser strip | `ProgressPreview.tsx` |
| `phase-ui-lab-15-landing-footer-nav` | Footer + navbar anchors | `PublicNavbar`, `LandingFooter` |

**Suggested merge order:** 06 → 07 → 08 → 09 → 10 → 11 → 12 → 13 → 14 → 15

---

## Phase 3 — Quality pass (UI lab)

| Branch | Purpose |
|--------|---------|
| `phase-ui-lab-16-mobile-a11y-pass` | Mobile layouts, keyboard, reduced motion, contrast audit for all landing sections |
| `phase-ui-lab-17-landing-performance` | Lazy-load sections, GSAP cleanup audit, Lighthouse pass |

---

## Phase 4 — Authenticated shell alignment (UI lab)

| Branch | Purpose |
|--------|---------|
| `phase-ui-lab-18-dashboard-student-restore` | Replace agency K3 dashboard blocks with XP, streak, quests, activity (per parity audit) |
| `phase-ui-lab-19-career-map-redesign` | Align `CareerMapPage` with timeline visual language |
| `phase-ui-lab-20-shell-nav-dedupe` | Single canonical nav; remove duplicate module lists |

**Note:** Phase 4 can run parallel to Phase 2 after `phase-ui-lab-02-landing-tokens` lands.

---

## Phase 5 — Production integration planning (documentation + production repo)

| Branch | Repo | Purpose |
|--------|------|---------|
| `phase-prod-01-landing-migration-plan` | `learn-coding-through` | Map lab sections → production `LandingPage.tsx` |
| `phase-prod-02-landing-hero` | Production | Port approved hero only |
| `phase-prod-03-landing-timeline` | Production | Port timeline section with static CMS/data |
| `phase-prod-04-landing-tech` | Production | Port tech section |
| `phase-prod-05-route-alignment` | Production | Align practice route paths with lab IA |

**Rule:** Production branches do not add new backend endpoints for marketing sections unless explicitly scheduled.

---

## Branch dependency graph

```text
phase-ui-lab-01-future-frontend-plan (docs)
  → 02-landing-tokens
  → 03-dummy-timeline-data ──┐
  → 04-dummy-tech-data ──────┤
  → 05-dummy-landing-data ───┤
                              ↓
  06-landing-hero → 07-badges → 08-capabilities
                              ↓
  09-career-timeline (needs 03)
  10-tech-stack (needs 04, 02)
  11-module-showcase → 12-projects → 13-outcomes → 14-progress-preview → 15-footer-nav
                              ↓
  16-mobile-a11y-pass → 17-landing-performance
                              ↓
  18-dashboard-student-restore | 19-career-map-redesign | 20-shell-nav-dedupe
                              ↓
  phase-prod-* (production repo, one section per branch)
```

---

## What each branch must NOT do

| Branch type | Forbidden |
|-------------|-----------|
| Landing section | Modify dashboard or auth |
| Dummy data | Change component layouts |
| Token branch | Add React components |
| A11y pass | Add new features |
| Production port | Change API contracts |
| Planning (current) | Any runtime file changes |

---

## Recommended next implementation branch

**`phase-ui-lab-02-landing-tokens`**

Rationale: Purple tech atmosphere and shared landing/K3 tokens must exist before timeline and tech stack branches. No component logic — variables only — low risk.

**After that:** `phase-ui-lab-03-dummy-timeline-data` and `phase-ui-lab-06-landing-hero` in parallel if two contributors.

---

## Untested in this sequence

- Effort estimates per branch
- Reviewer availability between phases
- Production `LandingPage` file structure may differ from lab
- Whether production will adopt React Router for landing in future
