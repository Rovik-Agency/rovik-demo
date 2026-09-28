# ROVIK Admin + Client Portal

## Admin access

Open:

```txt
/admin
```

### Local demo mode

If `.env` does not contain Supabase keys, the admin opens in local demo mode. Data is stored in browser `localStorage`, so you can test create/edit/delete/export immediately.

### Production mode

1. Create a Supabase project.
2. Run `supabase/migrations/001_rovik_platform.sql` in the SQL editor or Supabase CLI.
3. Create your admin user in Supabase Authentication.
4. Set the profile role:

```sql
update public.profiles
set role = 'owner'
where email = 'you@example.com';
```

Allowed admin roles are `owner`, `admin`, and `editor`.

## What the admin can manage

The rebuilt dashboard supports live CRUD for:

- Leads and lead pipeline: `New → Contacted → Qualified → Proposal → Won/Lost`
- Havali conversations and qualified AI leads
- Project Builder submissions
- Contact submissions
- Newsletter subscribers
- Clients / profiles
- Client projects
- Milestones, tasks, deliverables, invoices and support tickets
- Projects / case studies
- Services
- Pricing
- Testimonials
- Insights/articles
- FAQs
- Team
- Homepage content
- Media metadata
- SEO metadata
- Site settings

Every module includes search, create, edit, view, delete, status updates where applicable, refresh and XLSX export.

## Assigning a client portal project

Open:

```txt
/admin
```

Then:

1. Create or invite the user in Supabase Authentication.
2. Go to Admin → Clients and confirm their profile exists.
3. Set their profile role to `client`.
4. Copy their `profiles.id`.
5. Go to Admin → Client Projects.
6. Create a new project with `client_id = profiles.id`.
7. Add milestones, tasks, deliverables, invoices and support tickets using the created project id.
8. The client logs in at `/portal` using their Supabase Auth email and password.

## Important production security note

Do not expose a Supabase service-role key in the frontend. Creating Auth users must happen in Supabase Dashboard or a secure server/edge function. The frontend admin safely manages public tables through Supabase Auth + RLS.
