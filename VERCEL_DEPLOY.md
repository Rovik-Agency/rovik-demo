# ROVIK Vercel Production Deployment

## 1. Push the project to GitHub

Make sure the repository root contains:

- `package.json`
- `vite.config.ts`
- `vercel.json`
- `index.html`
- `src/`
- `public/`

If your GitHub repo contains an extra parent folder, set Vercel's **Root Directory** to `rovik-platform`.

## 2. Import in Vercel

Use these project settings:

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Install Command | `npm install --no-audit --no-fund` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

These are already defined in `vercel.json`, so Vercel should pick them up automatically.

## 3. Environment variables

Add these in **Vercel → Project → Settings → Environment Variables** for Production, Preview and Development as needed:

```txt
VITE_SITE_URL=https://your-rovik-domain.com
VITE_SITE_NAME=ROVIK
VITE_ENABLE_DEMO_MODE=false
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
VITE_CALENDAR_BOOKING_URL=https://cal.com/rovik/discovery
VITE_PLAUSIBLE_DOMAIN=your-rovik-domain.com
VITE_HAVALI_PROVIDER=hybrid
```

Do **not** put these server-only secrets in Vercel unless you later add Vercel serverless API routes:

```txt
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
HAVALI_LLM_API_KEY
JWT_SECRET
RATE_LIMIT_SECRET
```

For the current project, those belong in Supabase Edge Function secrets.

## 4. Supabase production setup

1. Create a Supabase project.
2. Run `supabase/migrations/001_rovik_platform.sql` in the SQL editor or with the Supabase CLI.
3. Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to Vercel.
4. Create your owner account in Supabase Auth.
5. Promote the user:

```sql
update public.profiles
set role = 'owner'
where email = 'you@example.com';
```

## 5. Admin and client portal URLs

```txt
/admin
/portal
```

Admin requires a Supabase Auth user with role `owner` or `admin`.
Client portal requires a Supabase Auth user assigned to rows in `client_projects`.

## 6. Production checks

Run locally before pushing:

```bash
npm install
npm run vercel:check
npm run build
```

After deployment, test these direct URLs in a fresh browser tab:

```txt
/
/services
/work
/project-builder
/havali
/admin
/portal
/contact
```

`vercel.json` includes SPA rewrites, so direct refreshes on routes like `/admin` and `/work/busal-os` should load the React app instead of a Vercel 404.

## 7. Domain and SEO

Set `VITE_SITE_URL` to the final production domain before the final deploy. During build, `scripts/generate-seo.mjs` generates `public/robots.txt` and `public/sitemap.xml` using that domain.
