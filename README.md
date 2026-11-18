# Eagle Technology — Digital Platform & Operational Ecosystem

> **"See Further. Build Smarter."**  
> Ethiopian-founded technology company in formation · Addis Ababa, Ethiopia (`9.03° N, 38.74° E`)  
> Official Digital Platform, Customer Onboarding Engine & Founder Operations Workspace

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Turbopack](https://img.shields.io/badge/Turbopack-Ready-blueviolet?style=flat-square)](https://turbo.build/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![SQLite WAL](https://img.shields.io/badge/SQLite-WAL_Mode-003B57?style=flat-square&logo=sqlite)](https://sqlite.org/)
[![Vitest](https://img.shields.io/badge/Tests-24%2F24_Passing-emerald?style=flat-square&logo=vitest)](https://vitest.dev/)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG_2.1_AA-success?style=flat-square)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Security](https://img.shields.io/badge/Security-Zero_Leakage_RBAC-darkred?style=flat-square)](docs/OPERATIONS_SECURITY.md)

---

## 1. Executive Platform Architecture

Eagle Technology is an Ethiopian-founded technology company currently in formal corporate formation in Addis Ababa, Ethiopia. This digital platform showcases practical engineering horsepower, custom software delivery, and creative digital systems across a tri-tier architecture:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      EAGLE TECHNOLOGY PLATFORM                         │
├──────────────────────────┬──────────────────────────┬──────────────────┤
│   1. PUBLIC WEBSITE      │   2. CUSTOMER PLATFORM   │ 3. FOUNDER OPS   │
│   (Open & Frictionless)  │   (Self-Service / Client)│ (Private / Team) │
├──────────────────────────┼──────────────────────────┼──────────────────┤
│ • Kinetic Telemetry      │ • Split-Screen /signup   │ • 5 Founder Roles│
│   ("Eagle Eye" Radar)    │ • NIST Password Scoring  │ • CR-01..12 Goals│
│ • 5-Language Playground  │ • Confirm Pwd + Eye Eye  │ • Project Kanban │
│ • Multi-Tier Arch Canvas │ • Customer Portal Walk-  │ • Secure Storage │
│ • Milestone Estimator    │   through (/portal)      │ • Decision Logs  │
│ • Solutions, Work, About │ • Deliverables & Figma   │ • Single-Use     │
│ • Terms & Privacy Legal  │ • Scope Inquiries        │   Staff Invites  │
│ • Contact & Inquiry Form │ • Dev Sandbox (eag_test_)│ • Audit Trail    │
└──────────────────────────┴──────────────────────────┴──────────────────┘
```

1. **Public Showcase Platform** (`/`, `/solutions`, `/work`, `/about`, `/contact`, `/terms`, `/privacy`, `/insights`): Open, accessible, editorial, and interactive. Allows prospective enterprise clients and entrepreneurs to explore capabilities, run code contracts, estimate project milestones, and submit structured inquiries without forced registration.
2. **Customer & Partner Ecosystem** (`/signup`, `/login`, `/portal`, `/portal/developer`, `/portal/deliverables`, `/portal/requests`): Dedicated self-service platform for commercial clients and project stakeholders. Provides milestone-backed deliverables inspection, Figma asset review, formal change request submissions, and developer sandbox access (`eag_test_`).
3. **Founder Operations Workspace** (`/dashboard`): Secure, role-isolated internal operations hub for the 5 founding roles. Features real-time foundation goals tracking (CR-01 through CR-12), project milestone delivery, private document repositories with granular access levels, decision approval logging, cryptographic staff invitation issuance, and immutable audit logs.

---

## 2. Core Brand Identity & Design System Tokens

The visual language follows the official Eagle Technology Brand Strategy: authoritative, quiet, luxurious, and technologically sovereign.

### Palette Tokens (`src/app/globals.css`)

| Token | Name | Hex | Role & Application |
| :--- | :--- | :--- | :--- |
| `--color-dark-brown` | **Dark Brown** | `#4B2E0F` | Primary brand anchor, headers, authority accents |
| `--color-brown-gold` | **Brown Gold** | `#B87333` | Signature metallic accent, primary CTAs, radar focus |
| `--color-white` | **Pure White** | `#FFFFFF` | Crisp surface cards, maximum contrast canvas |
| `--color-deep-brown` | **Deep Brown / Obsidian**| `#241507` | Terminal viewports, dark cards, footer grounding |
| `--color-warm-off-white` | **Warm Off-White** | `#FBF8F3` | Primary body background, soft editorial surface |
| `--color-soft-sand` | **Soft Sand** | `#EADCCB` | Hairline dividers, subtle vector lines, borders |
| `--color-muted-brown` | **Muted Brown** | `#765B40` | Secondary copy, metadata badges, telemetry labels |
| `--color-pale-gold` | **Pale Gold** | `#F4E7D6` | Subtle highlight pills, surface badge fills |

### Typography Hierarchy

- **Display & Section Headers:** `Space Grotesk` — Architectural, geometric, modern technical authority.
- **Body & Interface:** `DM Sans` — Warm, human, exceptionally readable across high-density layouts.
- **Monospace, Code & Telemetry:** `JetBrains Mono` — Code contracts, CLI simulators, radar coordinates, and cryptographic hashes.

---

## 3. The 5 Core Founding Roles & Access Model (RBAC)

The founding team structure is modeled directly after the founding company blueprint. The platform features strict **Server-Enforced Role-Based Access Control (RBAC)** across normalized SQLite tables (`roles`, `permissions`, `role_permissions`, `users`).

### Founding Roles Definition

| Role ID | Title | Username | Default Local User ID | Primary Operational Responsibilities |
| :--- | :--- | :--- | :--- | :--- |
| `ceo` | **Founder & Chief Executive Officer** | `ceo` | `usr_ceo` | Company direction, strategic roadmap, business development, client relationships, team coordination, project priorities, key decision-making, staff invitation issuance. |
| `frontend` | **Frontend Developer** | `frontend` | `usr_frontend` | Responsive UI engineering, reusable component design systems, accessibility (WCAG 2.1 AA), frontend API integration, client-side performance. |
| `backend` | **Backend Developer** | `backend` | `usr_backend` | Server-side runtime, SQLite/PostgreSQL architecture, authentication & session security, API contracts, deployment pipelines, performance & reliability. |
| `design` | **Graphic Designer & Video Editor**| `design` | `usr_design` | Visual brand consistency, UI/UX mockups, marketing materials, video production/editing, creative direction, design asset repository. |
| `ai_automation` | **AI & Automation Specialist** | `ai-automation` | `usr_ai_automation`| Workflow automation, cognitive APIs, intelligent data ingestion, local LLM evaluation, agent pipelines, developer productivity tooling. |
| `client` | **Registered Customer / Partner** | *(user email)* | `usr_<id>` | Milestone inspection, deliverable sign-offs, structured scope inquiry submissions, sandbox API key management. |

### Granular Permissions Matrix

| Permission | Description | `ceo` | `frontend` | `backend` | `design` | `ai_automation` | `client` |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `project.view` | View assigned or company projects | **✓** | **✓** | **✓** | **✓** | **✓** | **✓** |
| `project.create` | Create new commercial projects | **✓** | — | — | — | — | — |
| `project.edit` | Modify project scope & milestones | **✓** | — | — | — | — | — |
| `project.archive` | Archive completed projects | **✓** | — | — | — | — | — |
| `task.view` | View project milestone tasks | **✓** | **✓** | **✓** | **✓** | **✓** | **✓** |
| `task.create` | Create tasks & technical issues | **✓** | **✓** | **✓** | **✓** | **✓** | — |
| `task.assign` | Assign tasks to team members | **✓** | — | — | — | — | — |
| `task.edit` | Update task progress / status | **✓** | **✓** | **✓** | **✓** | **✓** | — |
| `task.delete` | Delete milestone tasks | **✓** | — | — | — | — | — |
| `comment.create` | Post task updates & discussions | **✓** | **✓** | **✓** | **✓** | **✓** | — |
| `document.view` | Access private document library | **✓** | **✓** | **✓** | **✓** | **✓** | **✓** |
| `document.upload` | Upload technical / design assets | **✓** | **✓** | **✓** | **✓** | **✓** | — |
| `document.delete` | Delete stored documents | **✓** | — | — | — | — | — |
| `decision.create` | Propose architectural decisions | **✓** | **✓** | **✓** | **✓** | **✓** | — |
| `decision.approve` | Formally approve company decisions | **✓** | — | — | — | — | — |
| `team.view` | Inspect team profiles & capacity | **✓** | **✓** | **✓** | **✓** | **✓** | — |
| `goal.create` | Define company foundation goals | **✓** | — | — | — | — | — |
| `goal.edit` | Update progress on CR-01..12 | **✓** | — | — | — | — | — |
| `audit.view` | Inspect immutable security audit log| **✓** | — | — | — | — | — |
| `settings.manage` | Manage security & team invitations | **✓** | — | — | — | — | — |
| `portal.view` | Access client portal workspace | **✓** | — | — | — | — | **✓** |
| `portal.deliverables`| Review & approve milestone deliverables| **✓** | — | — | — | — | **✓** |
| `portal.requests` | Submit structured change inquiries | **✓** | — | — | — | — | **✓** |
| `developer.access` | Generate sandbox API keys (`eag_test_`)| **✓** | — | **✓** | — | **✓** | **✓** |

---

## 4. Authentication, Roles & Operator Passwords Guide

### Development Environment Bootstrap Accounts

When the application starts with an uninitialized or empty SQLite database (`data/eagle-ops.db`), `src/server/db/seed.ts` automatically provisions the 5 official founding roles and a sample client account for local development and testing.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                 LOCAL DEVELOPMENT BOOTSTRAP CREDENTIALS                     │
├───────────────┬─────────────────┬───────────────────┬───────────────────────┤
│ ROLE          │ USERNAME        │ DEFAULT PASSWORD  │ OVERRIDE ENV VARIABLE │
├───────────────┼─────────────────┼───────────────────┼───────────────────────┤
│ Founder & CEO │ ceo             │ EagleFounders!2026│ EAGLE_BOOTSTRAP_CEO_..│
│ Frontend Dev  │ frontend        │ EagleFounders!2026│ EAGLE_BOOTSTRAP_FR..  │
│ Backend Dev   │ backend         │ EagleFounders!2026│ EAGLE_BOOTSTRAP_BA..  │
│ Designer      │ design          │ EagleFounders!2026│ EAGLE_BOOTSTRAP_DE..  │
│ AI Specialist │ ai-automation   │ EagleFounders!2026│ EAGLE_BOOTSTRAP_AI..  │
│ Client Demo   │ client          │ EagleClient!2026  │ EAGLE_BOOTSTRAP_CL..  │
└───────────────┴─────────────────┴───────────────────┴───────────────────────┘
```

> **IMPORTANT SECURITY NOTE FOR PRODUCTION:**
> - The fallback passwords (`EagleFounders!2026` / `EagleClient!2026`) are strictly for **local development and automated testing**.
> - In production environments, set `EAGLE_FOUNDER_BOOTSTRAP_PASSWORD` and `EAGLE_BOOTSTRAP_CLIENT_PASSWORD` to cryptographically random strings in `.env.local` before initial startup, or use the **Settings → Change Password** screen immediately after initial sign-in.
> - Founder passwords must be at least 8 characters (12+ recommended with uppercase, lowercase, numbers, and symbols).

### Production Staff Provisioning (Cryptographic Single-Use Invitations)

In production, **public self-registration for internal staff accounts is strictly disabled**:
1. Visitors navigating to `/signup` can **only** register as a commercial `client`. Any role parameter supplied by the client browser is rejected by the server (`src/app/api/auth/signup/route.ts`).
2. Internal staff accounts (CEO, Developers, Designers, AI Specialists) must be created exclusively via the **Cryptographic Staff Invitation Engine** (`src/server/auth/invitations.ts`):
   - The Founder & CEO navigates to **Dashboard → Team → Invite Team Member**.
   - The system generates a **64-character SHA-256 hashed token** linked to the specific role with a 7-day expiration.
   - The recipient accepts the invitation at `/invite?token=...`, chooses a password, and the server atomically invalidates the token (`used_at = CURRENT_TIMESTAMP`).
   - Tokens can be revoked at any time (`revoked_at = CURRENT_TIMESTAMP`) and are logged in the immutable audit trail.

### Cryptographic Rigor & Security Safeguards

- **Password Hashing:** Node.js native `crypto.scrypt` with a 16-byte cryptographically secure random salt, 64-byte key length. Stored format: `scrypt$<salt>$<derivedKey>`.
- **Constant-Time Verification:** Password comparison uses `crypto.timingSafeEqual` to prevent side-channel timing attacks.
- **Session Protection:** Session identifiers are stored in `HttpOnly`, `SameSite=Lax`, signed cookies using HMAC-SHA256 (`EAGLE_SESSION_SECRET`). Sessions expire automatically after 12 hours.
- **Brute-Force Rate Limiting:** In-memory sliding-window rate limiters defend `/api/auth/login` (5 attempts per minute) and `/api/auth/signup` (3 registrations per minute).
- **Private Account Enumeration Masking:** Sign-in returns generic responses (*"Invalid username/email or password"*) regardless of whether the account exists.

---

## 5. "Trigger Wow" Kinetic UI/UX & Interaction Engineering

The platform delivers a quiet, high-conviction visual experience built with Tailwind CSS v4, Framer Motion, and custom SVG mathematical linework:

1. **"Eagle Eye" Kinetic Telemetry & Radar (`src/components/home/EagleEyeRadar.tsx`):**
   - Cursor-reactive kinetic radar viewport with concentric vector rings, sweeping scanline gradients, and Addis Ababa coordinates (`9.03° N, 38.74° E`).
   - Parallax mouse-tracking tilt effect with soft radial gold glow.
2. **Interactive Technical Playground (`src/components/home/TechPlayground.tsx`):**
   - 5-Language Code Contract Viewer with syntax-highlighted contracts for **TypeScript**, **Python**, **Rust**, **Go**, and **cURL**.
   - Copy micro-interaction with clipboard feedback.
   - Live 4-Step Pipeline Simulation (`Ingest` → `Analyze` → `Transform` → `Deploy`) with simulated millisecond latencies and terminal log output.
3. **Interactive Multi-Tier Architecture Canvas (`src/components/home/ArchitectureViewer.tsx`):**
   - Switchable architectural views: *Full-Stack Web & Mobile Platforms*, *Cloud Infrastructure & Microservices*, and *Enterprise AI & Automation Pipelines*.
   - Animated SVG data pulses along connection vectors.
4. **Self-Service Project Scope & Milestone Estimator (`src/components/home/ProjectEstimator.tsx`):**
   - Interactive discovery calculator allowing clients to choose capability pillars, select scope tiers (Foundation MVP, Growth, Enterprise), and preview milestone delivery breakdowns (Phase 1: 25%, Phase 2: 40%, Phase 3: 20%, Phase 4: 15%).
   - Seamless one-click transition into `/contact` pre-populating configured scope parameters.
5. **Customer Onboarding Guided Walkthrough (`src/components/portal/OnboardingModal.tsx`):**
   - Triggered upon customer registration (`/portal?onboarding=true`).
   - 3-step interactive tour explaining deliverables inspection, scope change requests, and developer sandbox keys.
6. **Accessibility & Motion Safety:**
   - Strict WCAG 2.1 AA compliance with minimum 44px (`min-h-11`) touch targets across all mobile navigation and interactive buttons.
   - Complete `@media (prefers-reduced-motion: reduce)` support disabling kinetic loops and transforms for users requesting reduced motion.

---

## 6. Data Layer, Migrations & File Storage

- **Embedded SQLite (`node:sqlite`):** Native Node.js 22/24 SQLite engine requiring zero external database daemon for local development and self-hosted deployments.
- **Write-Ahead Logging (WAL):** Configured with `PRAGMA journal_mode = WAL;` and `PRAGMA busy_timeout = 5000;` to ensure high-throughput concurrent reads and writes without locking.
- **Programmatic Schema Migrations (`src/server/db/migrations.ts`):** Automatically applies incremental SQL schema versions (`001_initial_ops.sql`, `002_customer_portal_and_invitations.sql`) tracked in the `schema_migrations` table with automatic transaction rollbacks on failure.
- **PostgreSQL / Supabase Portability:** Schema written with ANSI-SQL compliance for seamless migration to multi-region cloud PostgreSQL when enterprise scale demands it.
- **Private Document Vault (`src/server/documents/storage.ts`):** Uploaded files are stored in `storage/documents/` outside the Next.js `public/` web root, requiring active session verification and role permissions before streaming bytes via `GET /api/dashboard/documents/[id]/download`.

---

## 7. Local Development & Setup

### Prerequisites

- **Node.js:** 20.x or 22.x/24.x (developed and verified on Node.js 24)
- **Package Manager:** npm 10+
- **Git**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/eagletechnologycompany/Eagle-Technology.git
cd Eagle-Technology

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
```

### Environment Configuration (`.env.local`)

```env
# Server Session HMAC Key (minimum 32 characters in production)
EAGLE_SESSION_SECRET=local-development-session-secret-change-in-production-min32chars

# SQLite Database Location
EAGLE_DB_PATH=data/eagle-ops.db

# Private Document Storage Directory
EAGLE_STORAGE_DIR=storage/documents

# Optional: Custom Bootstrap Passwords for Initial Seeding
# EAGLE_FOUNDER_BOOTSTRAP_PASSWORD=YourStrongCustomPassword!2026
# EAGLE_BOOTSTRAP_CLIENT_PASSWORD=YourStrongClientPassword!2026
```

### Starting Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 8. Available NPM Scripts & Verification Protocol

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `next dev` | Start local development server with Turbopack |
| `npm run build` | `next build` | Compile optimized production build (Turbopack) |
| `npm run start` | `next start` | Serve production build locally |
| `npm run lint` | `eslint` | Run ESLint across all codebase files |
| `npm run typecheck`| `tsc --noEmit` | Run TypeScript typechecker with zero errors |
| `npm run test` | `vitest run --fileParallelism=false` | Execute full automated test suite sequentially |
| `npm run test:watch` | `vitest` | Run test suite in interactive watch mode |

### Automated Test Suites (`src/test/`)

All 6 test suites execute cleanly and verify critical security boundaries:

1. `src/test/dashboard-security.test.ts`: Seeds 5 role accounts, enforces RBAC, verifies session revocation, and audits private document access controls.
2. `src/test/signup-flow.test.ts`: Verifies customer self-registration, password strength validation, session creation, duplicate email rejection, and `client` role enforcement.
3. `src/test/staff-invitations.test.ts`: Verifies 64-character SHA-256 token creation, single-use invalidation, role assignment, and revocation.
4. `src/test/components.test.tsx`: Validates rendering of `Header`, `Footer`, `QuietHero`, `EagleLogo`, and `EagleEyeRadar`.
5. `src/test/brand-and-honesty.test.ts`: Scans content data to ensure zero fabricated clients, fake testimonials, or unauthorized claims exist in public data.
6. `src/test/contact-validation.test.ts`: Validates Zod payload schemas, anti-bot honeypot protection, and error formatting.

---

## 9. Truth-in-Advertising & Governance

- **Immutable Blueprint Rule:** The foundational specification document (`media_1794383945899_6b0f44e5.docx`) is **strictly read-only** and is never modified, deleted, or overwritten.
- **Absolute Honesty:** The public platform contains **zero** synthetic client logos, fake quotes, fabricated case metrics, or fictitious office addresses. All case studies are transparently identified as *Capability & Demonstration Studies*.
- **Review Register:** All unconfirmed pre-launch operational details are tracked under version control in [`docs/CONTENT-REVIEW.md`](docs/CONTENT-REVIEW.md) across items **CR-01 through CR-12** with approved governance flags:
  - `[To be confirmed]`
  - `[Coming soon]`
  - `[Founder approval required]`
  - `[Integration pending]`

---

## 10. Repository File Structure

```text
.
├── docs/
│   ├── ARCHITECTURE-DECISION.md       # Full architectural decisions & tech evaluation
│   ├── BRAND_GUIDELINES.md            # Official logo, color tokens, and design rules
│   ├── CONTENT-REVIEW.md              # Governance register for CR-01..12 placeholders
│   ├── DASHBOARD_IMPLEMENTATION_PLAN.md# Founder operations architecture
│   └── OPERATIONS_SECURITY.md         # Account lifecycle, RBAC, backups & audit review
├── public/
│   └── brand/                         # Clean SVG & transparent PNG vector logo assets
├── src/
│   ├── app/
│   │   ├── (public)/                  # Public website routes (home, about, solutions, work, etc.)
│   │   ├── api/                       # Public & private REST APIs (auth, contact, portal, dashboard)
│   │   ├── dashboard/                 # Private Founder Operations Workspace (5 founding roles)
│   │   ├── login/                     # Secure platform sign-in (clients & staff)
│   │   ├── portal/                    # Customer & Partner Portal (milestones, sandbox, deliverables)
│   │   ├── signup/                    # Customer self-registration engine
│   │   ├── globals.css                # Tailwind v4 configuration & centralized brand tokens
│   │   └── layout.tsx                 # Root HTML layout with Space Grotesk & DM Sans fonts
│   ├── components/
│   │   ├── auth/                      # SignUpForm, PasswordStrengthMeter, Show/Hide toggles
│   │   ├── dashboard/                 # Kanban, Goals tracker, Document vault, LoginForm
│   │   ├── home/                      # QuietHero, EagleEyeRadar, TechPlayground, ProjectEstimator
│   │   ├── layout/                    # Header (responsive mobile menu), Footer
│   │   ├── portal/                    # OnboardingModal, DeliverablesList, SandboxKeyManager
│   │   └── ui/                        # EagleLogo mark, MotionReveal, Button, Badge
│   ├── data/                          # Public structured content (solutions, studies, navigation)
│   ├── lib/                           # Shared constants, RBAC definitions, Zod schemas
│   ├── server/
│   │   ├── auth/                      # scrypt hashing, sessions, crypto tokens, invitations
│   │   ├── db/                        # node:sqlite client, migrations (001, 002), seed engine
│   │   └── documents/                 # Private file vault, MIME validation, access control
│   └── test/                          # 6 automated Vitest test suites (24 tests)
├── CONTENT-REVIEW.md                  # Root copy of the governance register
├── CONTRIBUTING.md                    # Git workflow, branch conventions & PR guidelines
├── CODE_OF_CONDUCT.md                 # Contributor code of conduct
├── SECURITY.md                        # Vulnerability disclosure policy
├── package.json                       # Dependencies & scripts
└── tsconfig.json                      # Strict TypeScript compiler configuration
```

---

## 11. Handoff & Operational Verification Checklist

Before moving from pre-launch foundation to production deployment:

- [x] Run `npm run typecheck` — exits with 0 errors.
- [x] Run `npm run lint` — exits with 0 warnings/errors.
- [x] Run `npm run test` — all 6 test suites (24 tests) pass cleanly.
- [x] Run `npm run build` — all 51 static & dynamic routes compile cleanly.
- [x] Verify live server on `http://localhost:3000` (HTTP 200 on all routes).
- [x] Verify password confirmation field & show/hide visibility eye toggles.
- [x] Verify zero leakage of CEO or internal founder credentials in public HTML/JS bundles.
- [x] Synchronize latest commits with `origin/main` on GitHub.

---

**Eagle Technology** · *See Further. Build Smarter.*  
Addis Ababa, Ethiopia · [https://github.com/eagletechnologycompany/Eagle-Technology](https://github.com/eagletechnologycompany/Eagle-Technology)
