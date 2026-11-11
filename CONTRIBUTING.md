# Contributing to Eagle Technology Website

Welcome! This repository is built for structured collaboration among the Eagle Technology five-person founding team:

- **Founder & CEO** — Strategic direction, content approval, project priorities
- **Frontend Developer** — UI implementation, responsive layouts, accessibility, performance
- **Backend Developer** — API routes, contact delivery, security, database integrations when needed
- **Graphic Designer & Video Editor** — Brand consistency, visual assets, media optimization
- **AI & Automation Specialist** — Practical workflow automation and intelligent integrations

---

## Branching Strategy

- `main` — Production-ready, protected branch. Never commit directly to `main`.
- `dev` — Integration branch for reviewed features prior to release (optional for multi-PR batches).
- Feature / fix branches from `main`:
  - `feat/<short-description>` (e.g. `feat/team-portraits`)
  - `fix/<short-description>` (e.g. `fix/mobile-nav-focus`)
  - `docs/<short-description>` (e.g. `docs/update-brand-guide`)
  - `chore/<short-description>` (e.g. `chore/update-dependencies`)

---

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat: add smtp transport for contact inquiries`
- `fix: improve focus outline contrast on dark sections`
- `docs: update content inventory with confirmed team names`
- `test: add validation cases for contact api`

---

## Local Quality Checklist Before Opening a PR

Run all checks locally before pushing:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

---

## Content & Honesty Guidelines

1. **Do not invent** clients, testimonials, awards, user statistics, or extra departments/roles.
2. **Keep brand tokens centralized** in `src/app/globals.css`; avoid hardcoding off-palette hex colors.
3. **Preserve logo integrity** — always use the clean vector assets in `src/components/ui/EagleLogo.tsx` or `public/brand/`.
4. **Update `docs/CONTENT_INVENTORY.md`** whenever a placeholder item is replaced with approved company information.
