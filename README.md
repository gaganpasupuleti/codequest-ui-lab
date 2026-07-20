# CodeQuest UI Lab

Frontend checkout synced from [`learn-coding-through`](https://github.com/gaganpasupuleti/learn-coding-through) `main`.

This repo keeps the **frontend only** (no `backend/`). Point `VITE_API_PROXY_TARGET` at a running API when you need live data.

## Scripts

```bash
npm install
npm run dev      # http://localhost:5000
npm run build
npm run preview
```

## Notes

- Sourced from CodeQuest main frontend (`src/`, `public/`, `Book_Reports/`, Vite/Tailwind configs, frontend scripts).
- Monorepo workspaces (`developer-roadmap`) were omitted for a lighter UI-lab install.
- Auth and API calls expect the CodeQuest backend when not in demo/local modes.
