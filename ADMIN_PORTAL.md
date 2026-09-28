# ROVIK Admin + Client Portal Guide

## Admin access

Open:

```txt
/admin
```

### Local demo mode

If `.env` does not contain Supabase keys, the admin opens in demo/local mode so you can preview the UI.

### Production mode

When Supabase is connected, `/admin` uses Supabase Auth.

1. Run the SQL migration in `supabase/migrations/001_rovik_platform.sql`.
2. Create a user in Supabase Dashboard → Authentication → Users.
3. Make that user an admin/owner in SQL:

```sql
update public.profiles
set role = 'owner'
where email = 'you@example.com';
```

Allowed admin roles are:

```txt
owner, admin, editor
```

Then sign in at `/admin` using that Supabase user email/password.

## Client portal access

Open:

```txt
/portal
```

The client portal only shows projects assigned to the logged-in client.

## How to assign a client portal

### 1. Create the client user

Supabase Dashboard → Authentication → Users → Invite/Create user.

When the user is created, the migration trigger creates a row in `public.profiles` with `role = client`.

### 2. Confirm the client profile

```sql
select id, email, role
from public.profiles
where email = 'client@example.com';
```

### 3. Create a project for that client

```sql
insert into public.client_projects (
  client_id,
  title,
  description,
  status,
  progress,
  start_date,
  due_date
)
select
  id,
  'Website Redesign',
  'New ROVIK client website build.',
  'active',
  15,
  current_date,
  current_date + interval '30 days'
from public.profiles
where email = 'client@example.com';
```

### 4. Add milestones

```sql
insert into public.milestones (project_id, title, status, due_date, sort_order)
select id, 'Discovery and scope', 'in_progress', current_date + interval '7 days', 1
from public.client_projects
where title = 'Website Redesign';
```

### 5. Add tasks, deliverables, invoices and messages

Use these tables:

```txt
milestones
tasks
deliverables
invoices
portal_messages
support_tickets
```

The client can now sign in at `/portal` with their Supabase Auth account and see only their assigned project data.

## Admin dashboard tabs

The admin dashboard includes these operational tabs:

```txt
Leads
Havali
Project Builder
Clients
Client Projects
Milestones
Tasks
Deliverables
Invoices
Support
Projects
Services
Pricing
Testimonials
Insights
FAQs
Team
Homepage
Media
Newsletter
Contact
SEO
Settings
```

CSV/XLSX export is available from each tab.
