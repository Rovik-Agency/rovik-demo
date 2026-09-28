# Deployment Guide

## 1. Configure environment

Copy `.env.example` to `.env` and fill values.

Do not expose service-role keys to the browser. Use them only in Supabase functions or secure server contexts.

## 2. Run locally

```bash
npm install
npm run dev
```

## 3. Build

```bash
npm run build
npm run preview
```

## 4. Deploy frontend

Deploy to Vercel, Netlify or Cloudflare Pages. Vercel works well for this Vite app.

## 5. Supabase

Run migration in `supabase/migrations/001_rovik_platform.sql` and create first admin profile.

Example:

```sql
update profiles set role = 'owner' where email = 'your@email.com';
```

## 6. Email notifications

Add `RESEND_API_KEY`, `ADMIN_NOTIFICATION_EMAIL` and `FROM_EMAIL` to Supabase function secrets, then deploy `notify`.

## 7. SEO

Update:

- `VITE_SITE_URL`
- `public/robots.txt`
- `public/sitemap.xml`
- live OpenGraph image
- verified Organization schema links
