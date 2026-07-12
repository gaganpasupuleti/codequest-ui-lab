# Shared Visual Token Contract

**Branch:** `phase-ui-lab-02-landing-tokens`  
**Source of truth:** `src/styles/globals.css` (`:root` custom properties)  
**TypeScript mirror:** `src/styles/cqTokens.ts` (var references only)  
**K3 re-export:** `src/components/k3/k3Theme.ts`

---

## 1. Diagnosis summary

### Public landing (before)

| Token / pattern | Value | Consumers |
|-----------------|-------|-----------|
| `bg-bg-primary` | `#0a0a0a` flat black | `LandingPage`, `PageLoader` |
| `--color-neon-blue` | `#ffffff` (misnamed) | `Hero`, `Button`, `Badge`, `SkillsTicker` |
| `--color-neon-purple` | `rgba(255,255,255,0.6)` | `Hero` gradients, `Badge` |
| `.glass` / `.glass-strong` | white rgba borders | `PublicNavbar`, `QuestGallery`, `Card` |
| `.gradient-text` | white → white 55% | `Hero`, `PublicNavbar`, footer |
| Framer Motion | section entrances | landing sections |

### K3 shell (before)

| Token / pattern | Value | Consumers |
|-----------------|-------|-----------|
| Hard-coded `#0a0a0a`, `#111` | flat black | `StudentShell`, `K3Header`, overlay, marquees |
| `k3Theme.ts` K3 object | duplicate hex | K3 components |
| `border-white/10`, `white/15` | opacity borders | K3 cards, header, overlay |
| GSAP | nav, dashboard, login | motion layers |

### Duplicated / conflicting

| Issue | Detail |
|-------|--------|
| Duplicate page bg | `#0a0a0a` in CSS, body, K3, shell (×8 files) |
| Misleading legacy names | `neon-blue` = white, `neon-purple` = white 60% |
| Split glass definitions | `.glass` in CSS vs `Card` `bg-white/5` |
| Login isolated | `loginTheme.ts` mission green palette (intentionally separate) |
| Dummy data colors | `#00f0ff`, `#b026ff` in `dummyCourses.ts` (per-card accents) |

### Safe to unify now

- Page background, elevated surfaces, card bg
- Text primary/secondary/muted
- Purple/lavender accent mapping via legacy Tailwind names
- Glass surfaces, borders, focus ring
- K3 shell backgrounds and borders (token class swap only)

### Must remain component-specific

- `loginTheme.ts` — mission-control green auth portal (until dedicated login token branch)
- `dummyCourses.ts` / `dummyQuests.ts` per-path `color` fields
- `CareerMapPage` inline roadmap `color` per role
- `ProgressPage` streak orange accents
- Orchestrated nav card gradient stops (`from-white/[0.06]`)
- GSAP animation durations (not CSS duration vars yet in components)

---

## 2. Token categories and names

### Core surfaces

| CSS variable | Intended usage |
|--------------|----------------|
| `--cq-bg-page` | Page background (landing + shell) |
| `--cq-bg-elevated` | Headers, side rails, inputs |
| `--cq-bg-card` | K3 cards, elevated panels |
| `--cq-bg-glass` | `.glass` utility |
| `--cq-bg-glass-strong` | `.glass-strong`, mobile nav |
| `--cq-bg-overlay` | Fixed headers, modal backdrops |

### Text

| CSS variable | Intended usage |
|--------------|----------------|
| `--cq-text-primary` | Headlines, body |
| `--cq-text-secondary` | Descriptions, nav links |
| `--cq-text-muted` | Labels, meta, K3 section tags |
| `--cq-text-disabled` | Inactive controls (reserved) |

### Brand and accents

| CSS variable | Intended usage |
|--------------|----------------|
| `--cq-purple-primary` | Primary accent, badges (`neon-purple`) |
| `--cq-purple-bright` | Secondary accent (`electric-blue`) |
| `--cq-lavender` | Highlights, focus, CTA outline (`neon-blue`) |
| `--cq-blue-accent` | Links, info (reserved) |
| `--cq-success` | Success states (`mantis-green`) |
| `--cq-warning` | Warnings (`lemon-yellow`) |
| `--cq-destructive` | Errors |

### Borders and effects

| CSS variable | Intended usage |
|--------------|----------------|
| `--cq-border-subtle` | Cards, glass, dividers |
| `--cq-border-strong` | Hover borders, inputs |
| `--cq-focus-ring` | `:focus-visible` |
| `--cq-glow-soft` | `.glass` shadow |
| `--cq-glow-strong` | Hero emphasis (reserved) |
| `--cq-shadow-card` | Card elevation (reserved) |

### Layout and shape

| CSS variable | Value |
|--------------|-------|
| `--cq-radius-sm` | `0.5rem` |
| `--cq-radius-md` | `0.75rem` |
| `--cq-radius-lg` | `1rem` |
| `--cq-radius-pill` | `9999px` |

### Motion

| CSS variable | Value |
|--------------|-------|
| `--cq-duration-fast` | `150ms` |
| `--cq-duration-normal` | `250ms` |
| `--cq-duration-slow` | `400ms` |
| `--cq-ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` |

### Tailwind v4 `@theme` aliases (legacy compatibility)

| Tailwind token | Maps to |
|----------------|---------|
| `--color-bg-primary` | `--cq-bg-page` |
| `--color-neon-blue` | `--cq-lavender` |
| `--color-neon-purple` | `--cq-purple-primary` |
| `--color-electric-blue` | `--cq-purple-bright` |
| `--color-text-secondary` | `--cq-text-secondary` |
| `--color-ring` | `--cq-focus-ring` |
| `--color-border` | `--cq-border-subtle` |

---

## 3. Public landing usage

| Element | Token path |
|---------|------------|
| Page bg | `bg-bg-primary` → `--cq-bg-page` |
| Hero badge / accents | `text-neon-blue`, gradients → lavender/purple |
| Navbar | `.glass` → `--cq-bg-glass`, `--cq-border-subtle` |
| Cards | `.glass` + `Card` component |
| Buttons primary | `neon-blue` → `electric-blue` gradient |
| Skills ticker | `text-text-secondary`, dot `bg-neon-blue` |
| Focus | global `:focus-visible` → `--cq-focus-ring` |

**Structural identity unchanged** — same sections, markup, and Framer animations.

---

## 4. K3 shell usage

| Element | Token path |
|---------|------------|
| Shell bg | `bg-bg-primary` |
| Header / overlay | `--cq-bg-overlay`, `--cq-border-subtle` |
| K3 cards | `K3_CARD` → `--cq-bg-card`, `--cq-border-subtle` |
| CTAs | `K3_CTA`, `K3_CTA_FILLED` (white fill preserved) |
| Marquees / ticker | `bg-bg-primary`, `border-[color:var(--cq-border-subtle)]` |

---

## 5. Accessibility notes

- Focus ring: `--cq-focus-ring` (`#c4b5fd`) on `#0a0812` — visible lavender outline
- Secondary text: `--cq-text-secondary` at ~78% opacity on purple-black — meets readable marketing copy targets; verify per section in a11y pass branch
- Glass surfaces retain visible `border` + soft glow (not borderless transparency)
- `prefers-reduced-motion` global override unchanged in `globals.css`
- State not communicated by colour alone: badges retain text labels

---

## 6. Rules for future branches

### Career Quest Timeline (`phase-ui-lab-09-career-timeline`)

- Use `--cq-bg-page` / `--cq-bg-card` for week panels
- Progress line: `--cq-purple-primary` or `--cq-lavender`
- Do not introduce new page background hex values

### Technologies section (`phase-ui-lab-10-tech-stack`)

- May add `--cq-tech-zone-bg: #12081f` as extension in `globals.css` only
- Must reference parent `--cq-purple-*` and `--cq-lavender` tokens
- Glass cards use `--cq-bg-glass` + `--cq-border-subtle`

### Login alignment (future optional branch)

- Map `loginTheme.ts` surfaces to `--cq-*` when auth portal is redesigned
- Until then: login stays mission-green (documented exception)

---

## 7. TypeScript usage

```typescript
import { CQ_TOKEN, K3 } from '@/styles/cqTokens'
// or
import { K3_SECTION } from '@/components/k3/k3Theme'
```

Never duplicate hex in TS files — add new tokens to `:root` first.

---

## 8. Values intentionally unchanged

| Location | Reason |
|----------|--------|
| `loginTheme.ts` | Separate auth portal palette; no contrast regression |
| `dummyCourses.ts` path colors | Per-card marketing accents |
| `CareerMapPage` roadmap colors | Role differentiation |
| `ProgressPage` orange streak | Semantic heat map |
| K3 component `text-white/40` opacity utilities | Typography rhythm; mapped via muted token in new work only |
| `index.html` fonts | No change this branch |
