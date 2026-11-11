# Pre-Launch Content Inventory & Placeholders

This checklist tracks every explicitly marked placeholder in the codebase that the Eagle Technology founding team should review and replace as Month 2–3 milestones are completed.

| Area | File | Current Placeholder | Action Required Before Launch |
| --- | --- | --- | --- |
| Official Email | `src/data/site.ts` | `hello@eagle-technology.placeholder` | Provision official domain email and update `SITE_CONFIG.contact.emailPlaceholder` |
| Office Location | `src/data/site.ts` | `Ethiopia (Official office address pending confirmation)` | Confirm city/address details for public listing |
| Social Channels | `src/data/site.ts` | Pending notice | Add verified LinkedIn, GitHub, X/Telegram URLs once created |
| Founding Team Names | `src/data/team.ts` | `[Founder Name — Placeholder]` etc. | Confirm approved public names for all 5 founding members |
| Founding Team Portraits | `src/data/team.ts`, `src/app/about/page.tsx` | Portrait placeholder icons | Replace with approved, consistent team portraits |
| Demonstration Projects | `src/data/work.ts` | Pre-launch demonstration slots | Replace with verified demonstration builds or approved client case studies |
| Insights Articles | `src/data/insights.ts` | 3 planned editorial outlines | Publish real technical articles post-launch when cadence is ready |
| Contact Email Delivery | `src/app/api/contact/route.ts`, `.env.example` | Validation-only preview mode | Configure `CONTACT_RECIPIENT_EMAIL` and SMTP/email provider |
| Canonical Site URL | `src/app/sitemap.ts`, `src/app/robots.ts` | `https://eagle-technology.example` | Set `NEXT_PUBLIC_SITE_URL` in Vercel / hosting environment |
