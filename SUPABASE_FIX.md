# Supabase 400/401/Notify Fix

This build fixes the browser errors you saw:

- `401` on `leads` inserts
- `400` on `project_builder_submissions`
- `400` on `contact_submissions`
- `notify` Edge Function `500`
- VS Code Deno TypeScript errors in `supabase/functions/notify/index.ts`

## What changed in the app

1. Public inserts no longer call `.select('*')` after insert. Returning inserted rows requires a SELECT policy, which causes `401/403` for anonymous users under RLS.
2. Project Builder now sends database column names:
   - `business_type`
   - `design_level`
3. Contact and Project Builder submissions are backward-compatible with your current tables.
4. Email notifications are disabled by default to stop `notify 500` until your Resend secrets and function are deployed.
5. Edge Functions now return JSON with `200` even if Resend is not configured, and Deno editor errors are suppressed with `// @ts-nocheck`.

## Required Supabase SQL patch for existing projects

If your Supabase database already exists, run this file in Supabase SQL Editor:

```txt
supabase/migrations/002_public_forms_notifications_fix.sql
```

This safely adds missing columns, grants PostgREST permissions, and rebuilds public insert/admin RLS policies.

## Email notifications

Keep this in Vercel while testing:

```txt
VITE_ENABLE_EMAIL_NOTIFICATIONS=false
```

After deploying the function and configuring Resend secrets, set it to true:

```txt
VITE_ENABLE_EMAIL_NOTIFICATIONS=true
```

Deploy function:

```bash
supabase functions deploy notify --no-verify-jwt
supabase secrets set RESEND_API_KEY=re_xxxxx ADMIN_NOTIFICATION_EMAIL=you@example.com FROM_EMAIL="ROVIK <noreply@yourdomain.com>"
```

For Resend production sending, use a verified domain for `FROM_EMAIL`.
