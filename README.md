# Eagle Technology — Official Website

**“See Further. Build Smarter.”**

Official website repository for **Eagle Technology**, an Ethiopian-founded technology company building practical, reliable digital solutions across software development, web platforms, UI/UX & creative design, AI & workflow automation, and digital transformation.

---

## Project Principles

- **Honest Early-Stage Positioning:** Content strictly reflects the five-person founding structure (Founder & CEO, Frontend Developer, Backend Developer, Graphic Designer & Video Editor, AI & Automation Specialist) without invented clients, testimonials, metrics, or non-existent departments.
- **Centralized Brand Tokens:** All colors, typography, and surface styles live in CSS custom properties in `src/app/globals.css` and Tailwind `@theme` tokens.
- **Clean Vector & Raster Brand Assets:** The official Eagle mark and wordmark are stored as clean, watermark-free SVG and transparent PNG assets under `public/brand/` and `src/components/ui/EagleLogo.tsx`.

---

## Brand Color Tokens

| Token | Name | Hex | Role |
| --- | --- | --- | --- |
| `--color-dark-brown` | Dark Brown | `#4B2E0F` | Primary brand color, headings, dark accents |
| `--color-brown-gold` | Brown Gold | `#B87333` | Primary CTAs, highlights, interactive accents |
| `--color-white` | White | `#FFFFFF` | Cards, clean surfaces, dark-surface text |
| `--color-deep-brown` | Deep Brown | `#241507` | Footer, dark contrast sections, body ink |
| `--color-warm-off-white` | Warm Off-White | `#FBF8F3` | Primary page background |
| `--color-soft-sand` | Soft Sand | `#EADCCB` | Hairline borders and dividers |
| `--color-muted-brown` | Muted Brown | `#765B40` | Secondary body copy and captions |
| `--color-pale-gold` | Pale Gold | `#F4E7D6` | Subtle highlights and surface badges |

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 + centralized CSS custom properties
- **Motion:** Framer Motion (reduced-motion aware)
- **Icons:** Lucide React
- **Testing:** Vitest + React Testing Library + jsdom
- **CI:** GitHub Actions (`.github/workflows/ci.yml`)

---

## Local Development

### Prerequisites

- Node.js 20+ (tested with Node.js 24)
- npm 10+

### Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start local development server |
| `npm run build` | Build production bundle |
| `npm run start` | Serve production build locally |
| `npm run lint` | Run ESLint across the repository |
| `npm run typecheck` | Run TypeScript compiler check (`tsc --noEmit`) |
| `npm test` | Run Vitest unit & component test suite |

---

## Repository Structure

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/        # Bug report & feature request templates
│   ├── workflows/ci.yml       # Automated lint, typecheck, test & build CI
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/
│   ├── BRAND_GUIDELINES.md    # Logo, color tokens, and tone rules
│   └── CONTENT_INVENTORY.md   # Checklist of placeholders to replace before launch
├── public/
│   └── brand/                 # Clean SVG & transparent PNG logo assets
├── src/
│   ├── app/                   # Next.js App Router pages & /api/contact route
│   ├── components/            # Layout (Header, Footer), ContactForm, UI primitives
│   ├── data/                  # Structured company, team, solutions, work & insights data
│   ├── lib/                   # Shared validation & domain helpers
│   └── test/                  # Automated Vitest test suite
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── SECURITY.md
```

---

## Collaboration & Placeholders

Before moving from pre-launch foundation to live public launch (Roadmap Month 3), review [`docs/CONTENT_INVENTORY.md`](docs/CONTENT_INVENTORY.md) to replace all explicitly marked placeholders (team names/portraits, official email/domain, social links, and demonstration case studies).

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for branching, commit conventions, and pull request standards.
