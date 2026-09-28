# ROVIK Platform

Production-ready full-stack agency platform for **ROVIK** using React, TypeScript, Vite, Tailwind, GSAP, Three.js and Supabase.

## What is included

- Premium responsive agency website with Light/Dark/System themes
- Home, Services, individual service pages, Work, case studies, Solutions, About, Pricing, Insights, Contact, Project Builder, Havali AI, Admin, Client Portal, Legal and 404 routes
- Real ROVIK portfolio data: SINDHU, Busal OS, Swift Trip Holidays, IDRAAK, CodaDaily, CodaVybes and CodaTools
- Havali AI hybrid architecture: controlled knowledge base, deterministic intent router, retrieval/RAG layer, session memory and provider abstraction
- Project Builder with generated brief, send, book-call architecture and downloadable Markdown brief
- Admin dashboard for CRM/CMS areas, search and XLSX export
- Client portal structure for projects, milestones, tasks, files, deliverables, invoices, messages and support
- Supabase schema with RLS policies and lead pipeline: New → Contacted → Qualified → Proposal → Won/Lost
- Supabase Edge Functions for notifications and optional Havali provider adapter
- Technical SEO helpers, metadata, JSON-LD, sitemap, robots, semantic routes and accessible UI
- `.env.example` for all secrets and integration points

## Quick start

```bash
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`.

## Supabase setup

1. Create a Supabase project.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env`.
3. Run the SQL migration in `supabase/migrations/001_rovik_platform.sql`.
4. Create the first admin user in Supabase Auth.
5. Insert/update their `profiles.role` as `owner` or `admin`.
6. Deploy functions if needed:

```bash
supabase functions deploy notify --no-verify-jwt
supabase functions deploy havali-provider --no-verify-jwt
```

## Havali AI architecture

Havali is intentionally not locked to one external API.

Current layer:

1. Controlled knowledge from ROVIK services, projects, pricing and FAQs.
2. Intent detection for pricing, project discovery, portfolio, service choice, booking, support and general questions.
3. Retrieval over the local knowledge base.
4. Deterministic provider that gives useful safe answers without paid AI.
5. Provider abstraction for future local/self-hosted/open-source LLMs.

Future upgrade path:

- Add embeddings and pgvector table in Supabase.
- Move retrieval server-side.
- Connect `supabase/functions/havali-provider` to a local/self-hosted endpoint.
- Add evaluation prompts and conversation summarization.

## Production checklist

- Replace `VITE_SITE_URL` with the live domain.
- Replace `public/sitemap.xml` domain with the live domain.
- Configure Supabase Auth redirects.
- Configure Resend env vars for email notifications.
- Add verified testimonials only after client approval.
- Add real media assets through `media_assets` and Supabase Storage.
- Connect booking provider URL in `VITE_CALENDAR_BOOKING_URL`.
- Review legal pages for the jurisdiction and actual processors.
- Run `npm run build` before deploying.

## Deployment

Vercel recommended:

```bash
npm run build
vercel --prod
```

Set all environment variables in the Vercel dashboard. Never commit `.env`.


## Windows install recovery

If `npm install` fails with `ECONNRESET`, use `INSTALL_WINDOWS.md` or run:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/clean-install-win.ps1
```

This project now pins package versions and removes the unsupported ESLint dependency so installs are lighter and more predictable.

## Reference-style UI

The home page is designed to match the supplied premium ROVIK reference direction: dark cinematic hero, device/product mockups, light service grid, dark proof strip, featured work showcase, partner-method section, pricing cards and strong final CTA — while avoiding invented stats, fake testimonials or placeholder links.


## Admin and Client Portal

- Admin dashboard: `/admin`
- Client portal: `/portal`
- Full setup guide: `ADMIN_PORTAL.md`

For production, create a Supabase Auth user and set their profile role:

```sql
update public.profiles
set role = 'owner'
where email = 'you@example.com';
```

To assign a client portal, create the client Auth user, then insert a `client_projects` row with `client_id = profiles.id`. See `ADMIN_PORTAL.md` for the full SQL flow.

## Admin dashboard update

The `/admin` dashboard has been rebuilt as a production control center with role-checked auth, CRM pipeline, CRUD forms, status updates, record drawer, search, refresh, demo localStorage mode and XLSX export. See `ADMIN_PORTAL.md` for production setup and client portal assignment.

## Scroll animations

Global GSAP + ScrollTrigger reveal animations are enabled across the website through `src/components/ui/ScrollAnimations.tsx`. They respect `prefers-reduced-motion` and are disabled for admin workspace areas that should remain stable.

### Build fix note

This build includes `src/vite-env.d.ts` for Vite `import.meta.env` typing and uses ES2021 TypeScript libs so APIs such as `String.replaceAll` compile on Vercel and Windows.

If your deployed GitHub repo still shows `Property env does not exist on type ImportMeta`, make sure these two files are committed:

- `src/vite-env.d.ts`
- `tsconfig.app.json`

Then redeploy.

## Vercel production deploy

This project is ready for Vercel. It includes `vercel.json`, SPA rewrites, production headers, sitemap/robots generation and Vercel environment examples.

```bash
npm install
npm run vercel:check
npm run build
```

Then import the GitHub repo into Vercel. Use:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

Read `VERCEL_DEPLOY.md` for the full production checklist.

