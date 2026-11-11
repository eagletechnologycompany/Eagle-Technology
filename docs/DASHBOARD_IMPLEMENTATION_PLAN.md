# Implementation Plan — Eagle Technology Private Founder Operations Dashboard

**Branch:** `feat/founder-operations-dashboard`  
**Source of Truth:** *Eagle Technology Company Foundation, Brand Strategy & Official Website Development Blueprint*

---

## 1. Architectural Separation

- **Public Routes (`src/app/(public)/`)**: Preserves the public website (`/`, `/about`, `/solutions`, `/work`, `/insights`, `/contact`) with public navigation and footer.
- **Private Auth Routes**: `/login` and `/unauthorized` (excluded from search indexing via `robots.txt` and `noindex` metadata).
- **Private Dashboard Routes (`src/app/dashboard/**`)**: Server-protected workspace with role-aware sidebar, responsive top bar, global search, notifications, and quick-create actions.

---

## 2. Database & Storage Layer

- **SQLite Engine**: Built-in Node.js `node:sqlite` (`DatabaseSync`) with WAL mode, foreign keys, prepared statements, and versioned SQL migrations (`src/server/db/migrations.ts`).
- **Private Document Storage**: Stored outside `public/` in `storage/documents/` with strict MIME, extension, size, filename sanitization, and server-side access-level enforcement.
- **Core Entities**: `roles`, `permissions`, `role_permissions`, `users`, `team_member_profiles`, `sessions`, `projects`, `project_members`, `milestones`, `project_risks`, `tasks`, `task_comments`, `task_attachments`, `weekly_check_ins`, `goals`, `key_results`, `decisions`, `meetings`, `meeting_action_items`, `documents`, `notifications`, `activity_logs`, `audit_logs`.

---

## 3. Security & RBAC Model

- **Authentication**: Per-user salted `scrypt` password hashes, HMAC-SHA256 signed `HttpOnly` / `SameSite=Lax` session cookies backed by revocable server-side `sessions` records, and sliding-window login rate limiting.
- **Authorization**: Granular permission matrix (`project.*`, `task.*`, `comment.create`, `document.*`, `decision.*`, `team.view`, `goal.*`, `audit.view`, `settings.manage`) enforced on every API route and Server Component.
- **Auditability**: Sensitive mutations, login outcomes, access denials, and document operations recorded in `audit_logs`.

---

## 4. Implementation Sequence

1. Restructure public routes into `src/app/(public)/` route group so `/dashboard` and `/login` use isolated private layouts.
2. Implement database client, migrations, RBAC permission definitions, password/session security, rate limiter, and honest blueprint seed data.
3. Implement authenticated `/api/auth/*` and `/api/dashboard/*` endpoints (overview, tasks, projects, milestones/risks, check-ins, calendar, team, goals, decisions, meetings, documents, notifications, activity/audit, search, settings).
4. Build the responsive Dashboard Shell (Sidebar, Topbar, Global Search, Notifications, Quick Create) and all 11 dashboard pages plus `/login` and `/unauthorized`.
5. Add comprehensive unit, security/RBAC, API integration, and UI component tests using Vitest.
6. Document founder account setup, security operations, backups, and audit review in `docs/OPERATIONS_SECURITY.md`, update `README.md`, and verify build + tests + live browser QA.
