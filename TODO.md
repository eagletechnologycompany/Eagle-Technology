# TODO — Eagle Technology Founder Operations Dashboard

- [x] Inspect repository, project docs, and verify `main` baseline commit
- [x] Create feature branch `feat/founder-operations-dashboard`
- [x] Write implementation plan (`docs/DASHBOARD_IMPLEMENTATION_PLAN.md`) and `TODO.md`
- [x] Isolate public site layout under `src/app/(public)/` and disallow private routes in `robots.ts`
- [x] Build `node:sqlite` database client, migrations, and blueprint seed (`src/server/db/`)
- [x] Implement authentication, salted password hashing, HMAC session cookies, rate limiting, and server-side RBAC (`src/server/auth/`)
- [x] Implement secure private document upload/download storage (`src/server/documents/`)
- [x] Build all authenticated API routes (`/api/auth/*`, `/api/dashboard/*`)
- [x] Build Login (`/login`), Unauthorized (`/unauthorized`), and Private Dashboard Shell (`Sidebar`, `Topbar`, `QuickCreate`, `GlobalSearch`, `Notifications`)
- [x] Build all 11 dashboard pages + project detail 8-tab view
- [x] Write Vitest tests for DB migrations, RBAC security enforcement, password/session security, and private file validation
- [x] Document operations, security, backup, and account management (`docs/OPERATIONS_SECURITY.md`)
- [x] Run `typecheck`, `lint`, `test`, `build`, and live browser verification
