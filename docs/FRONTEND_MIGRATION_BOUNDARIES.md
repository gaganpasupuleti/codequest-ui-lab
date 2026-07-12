# Frontend Migration Boundaries

**Branch:** `phase-ui-lab-01-future-frontend-plan`  
**Applies to:** `codequest-ui-lab` as experimental future frontend

---

## 1. What remains dummy (always in lab default mode)

| Layer | Dummy implementation | Production equivalent |
|-------|---------------------|---------------------|
| Authentication | `loginWithLabFallback()`, `UI_LAB_AUTH=true` | `/auth/login`, Google OAuth, JWT |
| Student profile | `dummyStudent.ts` | `/auth/me`, progress snapshot |
| Courses / paths | `dummyCourses.ts` | `/progress/catalog` |
| Quests | `dummyQuests.ts` | Catalog + enrollment |
| Jobs | `dummyJobs.ts` | JobSpy API |
| Materials | `dummyMaterials.ts` | Static sample (production also static) |
| Progress | `dummyProgress.ts` | `/progress/me` |
| Timeline (future) | `dummyCareerTimeline.ts` | Marketing content / CMS (TBD) |
| Technologies (future) | `dummyTechnologies.ts` | Derived from catalog stats |
| Practice engines | Placeholder UI pages | sql.js, Pyodide, typing, Power BI |
| Feedback | Not implemented | `POST /feedback` |
| Admin | `AdminPage` placeholder | `AdminShell` |

---

## 2. What must NOT connect to production

**Hard prohibitions in the UI lab repository:**

| Prohibited | Reason |
|------------|--------|
| `VITE_API_URL` pointing to production in default `.env` | Accidental live calls |
| Private keys, OAuth secrets, admin keys | Security |
| Production database connection strings | Out of scope |
| Copying `backend/` from `learn-coding-through` | Duplication |
| Copying `lib/api.ts` wholesale into lab pages | Blurs boundary |
| JobSpy `X-Admin-Key` usage | Admin-only |
| Real user PII in dummy data | Privacy |

**Allowed for local developer testing only (opt-in):**

- `VITE_UI_LAB_AUTH=false` to exercise production auth client already in `auth.ts`
- Must be documented in README; never default in CI or demo deploys

---

## 3. Future API adapter boundaries

```
┌─────────────────────────────────────────┐
│  Page component (lab)                    │
│       ↓                                  │
│  Adapter interface (types only)          │
│       ↓                                  │
│  dummyAdapter.ts  │  (future empty slot) │
│  reads src/data/* │  productionAdapter    │
└─────────────────────────────────────────┘
```

| Rule | Detail |
|------|--------|
| Pages never import `fetch` directly | Use adapter functions |
| Adapter interfaces live in `src/adapters/types/` | Shared shape with production |
| Dummy adapters return `{ source: 'dummy' }` metadata | Aids debugging |
| Production migration fills `productionAdapter` in **production repo**, not lab | Lab stays dummy-first |
| Timeline and tech data are **marketing** adapters | May never need API (CMS later) |

---

## 4. Authentication replacement boundary

| Concern | Lab today | On production migration |
|---------|-----------|-------------------------|
| Session storage | `career-portal-token` + lab token | Production JWT only |
| Demo flag | `setDemoFlag(true)` on lab login | Backend `role === 'demo'` only |
| Google button | Present in login motion | Gated by `/auth/config` |
| Register | Dummy redirect | Waitlist + admin approval |
| Protected routes | `ProtectedRoute` + localStorage | Same pattern, real token validation |

**Replacement rule:** Swap `loginWithLabFallback` call path for `loginWithBackend` in production build — do not merge auth files without a dedicated auth branch.

---

## 5. Production migration prerequisites

Before copying any lab landing section into `learn-coding-through`:

| # | Prerequisite |
|---|--------------|
| 1 | Section approved in lab with dummy data |
| 2 | Accessibility checklist passed |
| 3 | Reduced-motion behaviour verified |
| 4 | Mobile layouts verified at 375px width |
| 5 | No new npm dependencies required |
| 6 | Visual tokens added to shared spec (not ad-hoc hex in components) |
| 7 | Production hook identified for dynamic sections (if any) |
| 8 | Rollback plan: feature flag or route toggle |

---

## 6. Risks of directly merging lab into main application

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Auth dual-mode confusion** | Users hit wrong login path | Split auth modules; lab default dummy |
| **API client in lab** | Accidental production calls from demo deploy | Default `UI_LAB_AUTH=true`; no API URL in lab CI |
| **Visual split** | Landing (glass) vs shell (K3) inconsistent | Landing upgrade branch before production merge |
| **Route mismatch** | Lab `/sql-arena` vs production `/practice/sql` | Route map document; aliases during migration |
| **Engine placeholder substitution** | Students expect working SQL in lab | Clear "UI Lab" banner; README |
| **GSAP bundle size** | Production perf regression | Lazy-load ScrollTrigger per section |
| **Over-copying reference sites** | Legal/reputation risk | Specs require inspiration-only |
| **Big-bang merge** | Regression across all student pages | One section per PR per `IMPLEMENTATION_BRANCH_SEQUENCE.md` |
| **README drift** | Contributors connect backend | Fix README in dedicated docs branch |
| **Dummy data in production build** | Wrong metrics shown | Build-time env excludes dummy adapters |

---

## 7. Repository firewall summary

```text
codequest-ui-lab                    learn-coding-through
─────────────────                   ────────────────────
✓ Visual components                 ✓ API clients & hooks
✓ Dummy data                        ✓ Practice engines
✓ GSAP / Framer experiments         ✓ Demo limit enforcement
✓ Landing IA prototypes             ✓ Admin portal
✓ K3 design tokens                ✓ JobSpy integration
✗ Production API (default)          ✗ Experimental-only routes (/aptitude?)
```

---

## 8. Untested boundaries

- Legal review of inspiration-only policy
- CDN / font loading parity between repos
- SEO and meta tags for future landing
- Analytics hooks (none in lab today)
