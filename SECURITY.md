# Security Policy

## Reporting a Vulnerability

If you discover a security issue in the Eagle Technology website or API routes:

1. **Do not** open a public GitHub issue with exploit details.
2. Report the issue privately to the Founder & CEO / Backend Lead via official team channels (or the official security contact once provisioned).
3. Include steps to reproduce, affected files/routes, and potential impact.

## Security Standards for Contributors

- Never commit `.env`, `.env.local`, API keys, SMTP passwords, or private credentials.
- Validate and sanitize all user-supplied inputs on both client and server (`src/lib/contact-validation.ts`).
- Keep dependencies updated and review automated CI check results before merging.
