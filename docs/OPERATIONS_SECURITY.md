# Eagle Technology — Operations & Security Documentation

This document details account lifecycle, role-based access control, private document protection, backup procedures, and audit log review for the private Founder Operations Dashboard.

---

## 1. How Founder Accounts Are Created

1. Five approved role accounts are initialized idempotently during database bootstrap (`src/server/db/seed.ts`):
   - `ceo` — Founder & Chief Executive Officer
   - `frontend` — Frontend Developer
   - `backend` — Backend Developer
   - `design` — Graphic Designer & Video Editor
   - `ai-automation` — AI & Automation Specialist
2. Initial passwords can be supplied via environment variables (`EAGLE_FOUNDER_BOOTSTRAP_PASSWORD` or role-specific `EAGLE_BOOTSTRAP_<ROLE>_PASSWORD`). For local development only, the fallback bootstrap password is `EagleFounders!2026` — **change immediately in Settings after first sign-in or via environment configuration before deployment**.
3. Passwords are stored exclusively as per-user randomly salted `scrypt` hashes (`scrypt$<salt>$<derivedKey>`). Plaintext passwords are never persisted or exposed to client code.

---

## 2. How Roles Are Assigned

- Roles and granular permissions (`project.*`, `task.*`, `comment.create`, `document.*`, `decision.*`, `team.view`, `goal.*`, `audit.view`, `settings.manage`) are normalized in SQLite tables (`roles`, `permissions`, `role_permissions`).
- Every protected page calls `requireFounderPage()` on the server, and every API endpoint calls `requireApiAuth(requiredPermission)` before accessing or mutating data.
- UI controls reflect permissions for clarity, while **all authorization decisions are enforced strictly on the server**.

---

## 3. How Access Is Revoked

- **Immediate User Logout:** Clicking **Sign Out** triggers `POST /api/auth/logout`, setting `revoked_at` on the server-side `sessions` record and expiring the `HttpOnly` signed cookie.
- **Account Deactivation (CEO Only):** In **Settings → Founding Role Accounts**, the CEO can disable any non-CEO founder account (`is_active = 0`). Deactivating an account immediately revokes all active server-side sessions for that user.
- **Session Expiration:** Sessions automatically expire after 12 hours and require fresh authentication.

---

## 4. How Documents Are Protected

- Uploaded files are stored outside `public/` in `storage/documents/` (`EAGLE_STORAGE_DIR`), which is ignored by Git and never directly served by Next.js static hosting.
- Uploads enforce extension allowlists, MIME checks, 10 MB size limits, filename sanitization against path traversal, and file header / SVG `<script>` security checks (`src/server/documents/storage.ts`).
- Every download routes through `GET /api/dashboard/documents/[id]/download`, verifying:
  1. Active authenticated session
  2. `document.view` permission
  3. Document `access_level` (`all_founders`, `ceo_only`, `project_members`, `selected_roles`)
  4. Audit logging (`document.download` / `document.download_denied`)

---

## 5. How Backups Work

- All structured operational data resides in a single SQLite database (`data/eagle-ops.db` or `EAGLE_DB_PATH`) using WAL mode.
- **Recommended Backup Procedure:**
  1. Use SQLite's online backup API (`sqlite3 data/eagle-ops.db ".backup backup/eagle-ops-$(date +%F).db"`) or Node's `node:sqlite` `backup()` utility so backups are transactionally consistent.
  2. Archive both the SQLite backup and `storage/documents/` to encrypted off-site storage on a regular schedule.
  3. Test restore integrity quarterly on a staging instance before relying on backups.

---

## 6. How Data Is Exported

- Operational tables (`projects`, `tasks`, `goals`, `decisions`, `meetings`, `weekly_check_ins`, `audit_logs`) are stored in standard relational SQLite tables and can be exported cleanly to JSON or CSV via SQLite CLI (`sqlite3 -header -csv data/eagle-ops.db "SELECT * FROM tasks;"`) or authenticated admin export scripts.
- Private document binaries in `storage/documents/` correspond 1-to-1 with `documents.storage_key`.

---

## 7. How Audit Records Are Reviewed

- Sensitive events (`auth.login`, `auth.logout`, `auth.permission_denied`, `auth.password_change`, `project.create`, `project.archive`, `decision.approved`, `decision.rejected`, `document.upload`, `document.download`, `document.download_denied`, `document.archive`, `settings.*`) are recorded immutably in `audit_logs`.
- The Founder & CEO (`audit.view`) reviews security and governance events under **Dashboard → Activity → Audit Log**.
- Weekly and monthly team reviews should check for repeated `denied` outcomes, unapproved access changes, or unusual download activity.
