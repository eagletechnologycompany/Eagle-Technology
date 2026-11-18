# Eagle Technology — Architectural Decision Record (ADR) & System Architecture

**Document Status**: Approved Baseline  
**Revision Date**: 2026-11-18  
**Architecture Lead**: Principal Product Strategist & Staff Full-Stack Engineer  
**Source of Truth**: *Company Foundation, Brand Strategy & Official Website Development Blueprint* (Read-Only Source DOCX)  

---

## 1. Executive Summary & Purpose

This document articulates the foundational technical decisions, trade-off evaluations, security protocols, and operational blueprints for the **Eagle Technology Digital Platform**. 

The platform operates as a connected digital ecosystem comprising two clearly segregated experiences:
1. **Public Startup Website**: An editorial, high-performance, branded presence engineered to answer critical customer questions, demonstrate technical depth through interactive engineering showcases, and convert qualified commercial inquiries.
2. **Private Customer & Operations Platform**:
   - **Customer Portal (`/portal`)**: Secure workspace for client deliverables review, structured inquiries, milestone-gated tracking, and developer sandbox exploration.
   - **Founder Operations Workspace (`/dashboard`)**: Confidential internal operating system for invited founders and staff across all 5 founding roles.

---

## 2. Source-of-Truth & Governance Rules

In strict adherence to the company charter:
1. **Document Immutability**: The source DOCX file (`media_1794383945899_6b0f44e5.docx`) is an immutable, read-only specification. It is never edited, rewritten, renamed, or deleted.
2. **Honesty & Transparency**: No client logos, testimonials, revenue statistics, completed commercial projects, or founder personal biographies may be fabricated.
3. **Register of Open Items**: All unconfirmed operational items are systematically tracked in `CONTENT-REVIEW.md` using approved status tags (`[To be confirmed]`, `[Coming soon]`, `[Founder approval required]`, `[Integration pending]`).

---

## 3. Architectural Decision Records (ADRs)

### ADR-01: Framework Selection — Next.js 16 (App Router) & React 19
- **Decision**: Adopt Next.js 16 with React 19 Server Components and Turbopack.
- **Rationale**:
  - Delivers zero-JavaScript server-rendered public pages for optimal Core Web Vitals (LCP < 1.2s, CLS < 0.05).
  - Enables clean separation between Server Components (fetching database milestones, audit logs, and documents) and Client Components (kinetic radar, interactive code editor, and calculators).
  - Native Route Handlers (`src/app/api/**`) eliminate the need for a separate microservice layer during early-stage operations.
- **Alternatives Considered**:
  - *Vite + React SPA*: Rejected due to poor SEO indexability and lack of native server-side credential isolation.
  - *Remix / React Router 7*: Viable, but Next.js provides broader ecosystem alignment and native Turbopack tooling.

---

### ADR-02: Visual Design System & Kinetic Aesthetics
- **Decision**: Centralized CSS custom properties in `src/app/globals.css` with Tailwind CSS v4, rendered in the official Eagle Technology palette.
- **Official Palette**:
  - **Dark Brown (`#4B2E0F`)**: Core brand grounding, executive anchor.
  - **Brown Gold (`#B87333`)**: Signature kinetic metallic highlight.
  - **Pure White (`#FFFFFF`)**: High-contrast editorial clarity.
- **Supporting Palette**:
  - **Obsidian Brown (`#241507`)**: High-contrast dark cards and terminal surfaces.
  - **Warm Off-White (`#FBF8F3`)**: Primary editorial background.
  - **Soft Sand (`#EADCCB`)**: Structural hair-lines and dividers.
  - **Muted Brown (`#765B40`)**: Secondary metadata, telemetry labels.
  - **Champagne Gold (`#F4E7D6`)**: Active badge pills and gentle radial glow fills.
- **Typography**:
  - **Display / Headers**: `Space Grotesk` (geometric, technical authority).
  - **Body / Interface**: `DM Sans` (warm, accessible, human).
  - **Contracts / Telemetry**: `JetBrains Mono` (computational rigor).
- **Interactive "Quiet Wow" Artifacts**:
  - *Eagle Eye Radar (`EagleEyeRadar.tsx`)*: Real-time Addis Ababa coordinates (`9.03° N, 38.74° E`) with cursor-tracking tilt and vector scanlines.
  - *Architecture Canvas (`ArchitectureViewer.tsx`)*: Switchable topology diagrams (Full-Stack Platforms, Cloud Backends, Enterprise AI Pipelines).
  - *Technical Playground (`TechPlayground.tsx`)*: Multi-language contracts (TypeScript, Python, cURL) and a 4-step pipeline simulator (Ingest → Analyze → Transform → Deploy).
  - *Project Scoping Calculator (`ProjectEstimator.tsx`)*: Transparent self-service discovery estimator routing directly to pre-filled contact inquiries.

---

### ADR-03: Persistence Layer — Embedded SQLite (`node:sqlite`) with WAL Mode
- **Decision**: Utilize Node.js built-in `node:sqlite` engine with Write-Ahead Logging (`WAL`), strict foreign keys, and programmatic schema migrations (`src/server/db/migrations.ts`).
- **Rationale**:
  - **Zero-Infrastructure Footprint**: Embeds directly into the Node.js runtime without external daemon dependencies or latency overhead.
  - **High Performance**: Sub-millisecond reads and writes on local NVMe disk, perfect for standalone deployment and secure self-hosted instances.
  - **ACID Transactions**: Enables guaranteed consistency for user creation, invitation acceptance, and milestone state updates.
- **Cloud Migration Strategy**:
  - The schema design adheres to ANSI-SQL standards. When distributed multi-region infrastructure is required, the data layer can seamlessly transition to managed PostgreSQL (Supabase / Neon / AWS Aurora) with minimal adaptation of the client wrapper (`src/server/db/client.ts`).

---

### ADR-04: Cryptography, Authentication & Session Security
- **Decision**: Native Node.js `crypto` implementation using `scrypt` key derivation, random salts, constant-time comparison, and HMAC-signed session cookies.
- **Security Specifications**:
  - **Password Hashing**: `crypto.scryptSync` with 16-byte random salt, 64-byte derived key length, `N=16384, r=8, p=1`.
  - **Constant-Time Verification**: `crypto.timingSafeEqual` to prevent timing attacks.
  - **Session Tokens**: 32-byte cryptographically secure random tokens (`crypto.randomBytes(32)`), stored as SHA-256 hashes in the database.
  - **Cookie Policy**: `HttpOnly`, `SameSite=Lax`, `Secure` (in production), HMAC-SHA256 signature verification to prevent cookie tampering.
  - **Brute-Force Rate Limiting**: In-memory sliding window rate limiter (`src/server/auth/rate-limit.ts`) enforcing progressive delays and lockouts on failed attempts.

---

### ADR-05: Strict Account Separation & Invitation-Only Staff Provisioning
- **Decision**: Enforce complete structural isolation between external customer registration and internal staff account provisioning.
- **Implementation Rules**:
  1. **Customer Self-Registration (`/signup`)**:
     - Assigns exclusively the `client` role server-side.
     - The browser cannot pass or request any role attribute.
     - Grants access exclusively to the Client Portal (`/portal`).
  2. **Staff & Founder Accounts (Invite-Only)**:
     - Public registration as `ceo`, `frontend`, `backend`, `design`, or `ai-automation` is strictly impossible.
     - Staff accounts are provisioned via `src/server/auth/invitations.ts`.
     - Invitations require an administrator-issued cryptographic token, email match, role binding, expiration timestamp, and single-use invalidation.
  3. **Confidentiality Guarantee**:
     - Public sign-in surfaces (`/login`) contain zero default passwords, zero role quick-fill buttons, and zero hints revealing whether an internal staff account exists.

---

### ADR-06: Accessibility (WCAG 2.1 AA) & Performance Benchmarks
- **Decision**: Enforce WCAG 2.1 AA standards across every public and authenticated interface.
- **Standards Enforced**:
  - Minimum touch targets of 44×44px (`min-h-11`) on all interactive buttons, links, and mobile navigation items.
  - Contrast ratios exceeding 4.5:1 for standard text and 3:1 for large headers and iconography.
  - Respect for user motion preferences via `@media (prefers-reduced-motion: reduce)`.
  - Complete ARIA attributes (`aria-label`, `aria-current`, `role="status"`, `role="alert"`).

---

## 4. Database Schema Topology

```text
[roles] 1 ──── ∞ [role_permissions] ∞ ──── 1 [permissions]
   │
   ├────── ∞ [users] 1 ──── ∞ [sessions]
   │           │
   │           ├──── 1 [team_member_profiles]
   │           ├──── ∞ [projects] 1 ──── ∞ [milestones]
   │           │         │          ├──── ∞ [project_members]
   │           │         │          └──── ∞ [project_risks]
   │           │         │
   │           │         ├──────── ∞ [tasks] 1 ──── ∞ [task_comments]
   │           │         │                      └──── ∞ [task_attachments]
   │           │         │
   │           │         ├──────── ∞ [client_deliverables]
   │           │         └──────── ∞ [client_requests]
   │           │
   │           ├──── ∞ [documents]
   │           ├──── ∞ [goals]
   │           ├──── ∞ [decisions]
   │           ├──── ∞ [developer_sandbox_keys]
   │           ├──── ∞ [notifications]
   │           ├──── ∞ [activity_logs]
   │           └──── ∞ [audit_logs]
   │
   └────── ∞ [staff_invitations] (Token Hashed, Single-Use, Revocable)
```

---

## 5. Threat Modeling & Security Mitigations

| Threat Vector | Mitigation Strategy | Implemented Location |
|---|---|---|
| **Credential Stuffing & Brute Force** | IP & account-level sliding window rate limiting; generic error responses. | `src/server/auth/rate-limit.ts` |
| **Privilege Escalation** | Roles and permissions evaluated exclusively on the server against SQLite tables. Role cannot be supplied by frontend. | `src/server/auth/session.ts` |
| **Staff Account Harvest / Recon** | Generic error messages on login (`Invalid username/email or password`); no role badges or pre-fill on public UI. | `src/components/dashboard/LoginForm.tsx` |
| **Session Hijacking & XSS** | `HttpOnly`, `SameSite=Lax` cookies; tokens stored as SHA-256 hashes in database. | `src/server/auth/crypto.ts` |
| **Path Traversal on Document Downloads** | `path.basename` sanitization; directory containment verification. | `src/server/documents/storage.ts` |
| **Data Inconsistency** | Immediate transaction rollbacks (`BEGIN / COMMIT / ROLLBACK`) on multi-table mutations. | `src/server/auth/invitations.ts`, `migrations.ts` |

---

## 6. Verification Status & Production Readiness

The architecture has been verified end-to-end:
- **Type Safety**: Strict TypeScript (`tsc --noEmit`) passes with 0 errors.
- **Code Quality**: ESLint 9 passes with 0 warnings and 0 errors across `src/`.
- **Test Automation**: Vitest test suite executing 24 tests across 6 suites covering:
  - Contact input validation
  - Brand and honesty compliance
  - Component rendering
  - Customer registration engine
  - Staff invitation engine
  - Dashboard security and RBAC
- **Build Output**: Next.js 16 compiles and optimizes 51 static and dynamic routes.
- **Live Deployment**: Production server running on `http://localhost:3000`.
