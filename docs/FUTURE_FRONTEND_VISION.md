# Future Frontend Vision

**Branch:** `phase-ui-lab-01-future-frontend-plan`  
**Repository:** [gaganpasupuleti/codequest-ui-lab](https://github.com/gaganpasupuleti/codequest-ui-lab)  
**Production reference:** [gaganpasupuleti/learn-coding-through](https://github.com/gaganpasupuleti/learn-coding-through) (read-only reference; no connection)

---

## 1. Purpose of the UI lab

`codequest-ui-lab` is an **experimental frontend laboratory** that may become the future Code Quest student experience. It exists to:

- Prototype visual design, motion, and information architecture without risking production stability
- Validate landing-page storytelling (career journey, technology mastery, learning paths)
- Prove component patterns (K3 shell, GSAP scroll narratives, glass tech cards) before production migration
- Hold **dummy data adapters** shaped like production responses

The lab runs fully in the browser with static/dummy data. It is optimized for design review, stakeholder demos, and incremental migration planning.

---

## 2. Relationship with production Code Quest

| Aspect | UI lab | Production (`learn-coding-through`) |
|--------|--------|-------------------------------------|
| Role | Future frontend candidate | Current source of truth |
| Backend | **Must not connect** | FastAPI + practice engines |
| Auth | Lab fallback (`UI_LAB_AUTH`) | JWT, Google OAuth, demo role |
| Data | `src/data/*.ts` dummy files | APIs + localStorage merges |
| Routing | React Router (`src/app/routes.tsx`) | State-based `studentPage` in `App.tsx` |
| Admin | Dummy placeholder page | Full `AdminShell` |

**Rule:** Production informs *shapes and semantics*; the lab never rewrites production APIs or copies backend logic.

---

## 3. Target users

| User | Lab need |
|------|----------|
| **Students (primary)** | Understand the learning journey, see technologies mastered, start quests |
| **Placement cohorts** | See week-by-week structure and career outcomes |
| **Career switchers** | Scan capabilities and timeline before committing |
| **Product / design reviewers** | Evaluate future landing and authenticated shell separately |
| **Engineers (migration)** | Use lab as visual spec; wire production hooks later |

---

## 4. Product goals

1. **Career Quest Timeline** — Week-by-week scroll narrative showing topics, outcomes, projects, tech, duration, and skill badges (inspired by scroll timelines; not copied from [ayushsingh.co.in](https://ayushsingh.co.in/)).
2. **Technologies You Will Master** — Categorized glass cards linking tech to Code Quest modules, skill level, and quest counts (inspired by stack sections; not copied from [redoyanulhaque.me](https://www.redoyanulhaque.me/)).
3. **Unified future landing** — Hero → capabilities → timeline → tech stack → paths → gallery → outcomes → CTA.
4. **Visual coherence** — Reconcile pre-K3 landing (glass/neon) with K3 authenticated shell (`#0a0a0a`, mono uppercase).
5. **Motion discipline** — GSAP for scroll stories; Framer Motion for micro-interactions (already installed; no new packages).

---

## 5. Non-goals

- Connecting to production backend, database, or real APIs
- Real authentication, OAuth, or private keys
- Copying layouts, text, assets, or source from reference websites
- Replacing production practice engines (sql.js, Pyodide, typing) in the lab
- Merging the lab into production in a single PR
- Admin portal redesign in this vision phase
- Building aptitude/DSA as production features (lab prototypes only until production exists)

---

## 6. Future migration conditions

Migration to production may begin only when **all** are true:

| # | Condition |
|---|-----------|
| 1 | Landing page sections approved on lab `/` |
| 2 | Career Quest Timeline dummy data model frozen |
| 3 | Tech stack section dummy data model frozen |
| 4 | Dummy adapters match production TypeScript interfaces |
| 5 | Accessibility pass completed (keyboard, reduced motion, contrast) |
| 6 | Mobile layouts signed off for timeline + tech grid |
| 7 | K3 + purple tech atmosphere tokens documented in one design-system file |
| 8 | Production migration branch sequence agreed (`IMPLEMENTATION_BRANCH_SEQUENCE.md`) |
| 9 | No production API URLs in default lab build |
| 10 | README accurately describes lab-only auth |

**Migration unit:** one page or one section per PR into `learn-coding-through`.

---

## 7. Inspiration boundaries (reference sites)

### [ayushsingh.co.in](https://ayushsingh.co.in/) — borrow concepts only

| Borrow | Do not copy |
|--------|-------------|
| Scroll-linked timeline progression | Exact layout, typography, colors |
| Alternating text / visual columns | Personal branding, resume content |
| Active step highlighting on scroll | Image assets, copy |
| Career chapter storytelling pattern | Component markup or CSS |

### [redoyanulhaque.me](https://www.redoyanulhaque.me/) — borrow concepts only

| Borrow | Do not copy |
|--------|-------------|
| Dark purple atmosphere for tech section | Exact purple values without adaptation |
| Glass morphism on technology cards | Portfolio project list structure |
| Category groupings + badges | Personal project data |
| Hover elevation on cards | Site navigation or hero |

Code Quest will use a **purple accent zone** for the tech stack section while keeping K3 black for global shell and landing hero.

---

## 8. Animation library roles (installed; do not add packages)

| Library | Version (package.json) | Use for |
|---------|------------------------|---------|
| **GSAP** | `^3.15.0` | Career timeline scroll progress, progress-line draw, section pin (if needed), tech grid stagger reveals, marquee (existing `K3ServiceMarquee`) |
| **@gsap/react** | `^2.1.2` | `useGSAP` hooks with React cleanup (pattern in `K3Hero`, `K3Stats`) |
| **ScrollTrigger** | (GSAP plugin) | Timeline active-week detection, counter triggers (already in `K3Stats`) |
| **Framer Motion** | `^12.42.2` | Card hover, badge pop, dialog/menu (existing `PublicNavbar`), path/gallery `whileInView`, page transitions |

**Current usage split:**

- Landing page today: **Framer Motion only** (`Hero`, `LearningPaths`, `QuestGallery`, `WhyCodeQuest`, `PublicNavbar`)
- Authenticated shell: **GSAP-heavy** (K3 dashboard, nav overlay, login motion, tickers)
- Future landing: **both** — GSAP for timeline + tech grid; Framer for cards and nav

---

## 9. Repository diagnosis summary (2026-07-12)

| Area | State |
|------|-------|
| Routes | 17 user routes + catch-all; landing at `/` |
| Landing | 6 sections, pre-K3 glass aesthetic |
| Student shell | K3 black theme, two-row header, explore overlay |
| Data | 7 dummy files; no timeline or tech-stack datasets yet |
| Build | Passes (`tsc -b && vite build`) |
| Auth | Dual-mode (`UI_LAB_AUTH`); README partially outdated |
| Visual split | Landing ≠ authenticated K3 styling |

See `LANDING_PAGE_UPGRADE_PLAN.md` for section-level detail.
