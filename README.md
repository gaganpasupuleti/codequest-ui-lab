# Code Quest UI Lab

**Full Frontend Skeleton Prototype** for the Code Quest student coding dashboard and quest-based learning platform.

> This is a design/lab repo only. No backend, no real auth, no production APIs.

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Framer Motion
- Lucide React

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Dummy Auth

- Login/register accepts any credentials
- User stored in `localStorage` (`codequest_dummy_user`)
- Protected routes redirect to `/login` when logged out

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Dummy login |
| `/register` | Dummy register |
| `/dashboard` | Student dashboard |
| `/practice` | Practice arena |
| `/sql-arena` | SQL Arena |
| `/python-lab` | Python Lab |
| `/aptitude` | Aptitude Hub |
| `/dsa` | DSA placeholder |
| `/materials` | Resources |
| `/resume-lab` | Resume/ATS lab |
| `/jobs` | Jobs portal |
| `/career-map` | Career roadmap |
| `/progress` | Progress tracker |
| `/profile` | Student profile |
| `/settings` | Settings |
| `/admin` | Admin placeholder |

## Build

```bash
npm run build
npm run preview
```

## Notes

- All data is static dummy data in `src/data/`
- No external API calls except Google Fonts
- Ready for design review only — do not connect to production Code Quest
