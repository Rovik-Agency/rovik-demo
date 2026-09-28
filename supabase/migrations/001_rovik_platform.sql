-- ROVIK production schema: CMS, CRM, Havali, project builder and client portal.
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

create type lead_status as enum ('New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost');
create type app_role as enum ('owner', 'admin', 'editor', 'client');

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  role app_role not null default 'client',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), 'client')
  on conflict (id) do update set email = excluded.email, updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  phone text,
  source text not null default 'website',
  service text,
  budget text,
  message text,
  brief jsonb,
  status lead_status not null default 'New',
  notes text,
  follow_up_at timestamptz,
  assigned_to uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  author_id uuid references profiles(id),
  note text not null,
  created_at timestamptz not null default now()
);

create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  service text,
  message text not null,
  status lead_status not null default 'New',
  ip_hash text,
  created_at timestamptz not null default now()
);

create table if not exists project_builder_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  service text not null,
  business_type text,
  features text[] not null default '{}',
  design_level text,
  timeline text,
  budget text,
  message text,
  brief jsonb not null,
  status lead_status not null default 'New',
  created_at timestamptz not null default now()
);

create table if not exists havali_conversations (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  lead_id uuid references leads(id) on delete set null,
  last_intent text,
  last_message text,
  extracted_context text[] default '{}',
  qualified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists havali_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references havali_conversations(id) on delete cascade,
  session_id text not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text not null,
  content jsonb not null default '{}',
  seo jsonb not null default '{}',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  url text,
  category text,
  summary text not null,
  case_study jsonb not null default '{}',
  services text[] not null default '{}',
  stack text[] not null default '{}',
  tags text[] not null default '{}',
  featured boolean not null default false,
  sort_order integer not null default 0,
  seo jsonb not null default '{}',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists pricing_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price text not null,
  cadence text,
  summary text,
  features text[] not null default '{}',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  person_name text,
  company text,
  role text,
  verified boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists insights (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  body text not null,
  category text,
  author_id uuid references profiles(id),
  seo jsonb not null default '{}',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  bio text,
  avatar_url text,
  sort_order integer not null default 0,
  published boolean not null default true
);

create table if not exists homepage_content (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  title text,
  alt text,
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text not null default 'website',
  confirmed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists seo_metadata (
  id uuid primary key default gen_random_uuid(),
  path text unique not null,
  title text not null,
  description text not null,
  canonical text,
  og_image text,
  schema jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists client_projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references profiles(id) on delete set null,
  lead_id uuid references leads(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'active',
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  start_date date,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references client_projects(id) on delete cascade,
  title text not null,
  status text not null default 'pending',
  due_date date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references client_projects(id) on delete cascade,
  milestone_id uuid references milestones(id) on delete set null,
  title text not null,
  status text not null default 'todo',
  assignee_id uuid references profiles(id),
  due_date date,
  created_at timestamptz not null default now()
);

create table if not exists deliverables (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references client_projects(id) on delete cascade,
  title text not null,
  file_url text,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references client_projects(id) on delete cascade,
  invoice_number text unique not null,
  amount numeric(12,2) not null,
  currency text not null default 'GBP',
  status text not null default 'draft',
  due_date date,
  file_url text,
  created_at timestamptz not null default now()
);

create table if not exists support_tickets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references profiles(id) on delete set null,
  project_id uuid references client_projects(id) on delete set null,
  subject text not null,
  message text not null,
  status text not null default 'open',
  priority text not null default 'normal',
  created_at timestamptz not null default now()
);

create table if not exists portal_messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references client_projects(id) on delete cascade,
  sender_id uuid references profiles(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  payload jsonb not null default '{}',
  session_id text,
  created_at timestamptz not null default now()
);

create table if not exists rate_limits (
  key text primary key,
  count integer not null default 1,
  window_start timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function is_admin() returns boolean language sql stable security definer as $$
  select exists(select 1 from profiles where id = auth.uid() and role in ('owner','admin','editor'));
$$;

alter table profiles enable row level security;
alter table leads enable row level security;
alter table lead_notes enable row level security;
alter table contact_submissions enable row level security;
alter table project_builder_submissions enable row level security;
alter table havali_conversations enable row level security;
alter table havali_messages enable row level security;
alter table services enable row level security;
alter table projects enable row level security;
alter table pricing_plans enable row level security;
alter table testimonials enable row level security;
alter table insights enable row level security;
alter table faqs enable row level security;
alter table team_members enable row level security;
alter table homepage_content enable row level security;
alter table media_assets enable row level security;
alter table newsletter_subscribers enable row level security;
alter table site_settings enable row level security;
alter table seo_metadata enable row level security;
alter table client_projects enable row level security;
alter table milestones enable row level security;
alter table tasks enable row level security;
alter table deliverables enable row level security;
alter table invoices enable row level security;
alter table support_tickets enable row level security;
alter table portal_messages enable row level security;
alter table analytics_events enable row level security;

-- Public read for published CMS content.
create policy "public_read_published_services" on services for select using (published = true);
create policy "public_read_published_projects" on projects for select using (published = true);
create policy "public_read_published_pricing" on pricing_plans for select using (published = true);
create policy "public_read_published_testimonials" on testimonials for select using (published = true and verified = true);
create policy "public_read_published_insights" on insights for select using (published = true);
create policy "public_read_published_faqs" on faqs for select using (published = true);
create policy "public_read_published_team" on team_members for select using (published = true);
create policy "public_insert_contact" on contact_submissions for insert with check (true);
create policy "public_insert_project_builder" on project_builder_submissions for insert with check (true);
create policy "public_insert_leads" on leads for insert with check (true);
create policy "public_insert_havali" on havali_conversations for insert with check (true);
create policy "public_insert_newsletter" on newsletter_subscribers for insert with check (true);
create policy "public_insert_events" on analytics_events for insert with check (true);

create policy "profiles_read_own" on profiles for select using (id = auth.uid() or is_admin());
create policy "profiles_update_own_basic" on profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = 'client');
create policy "public_insert_havali_messages" on havali_messages for insert with check (true);

-- Admin full access.
do $$
declare t text;
begin
  foreach t in array array['profiles','leads','lead_notes','contact_submissions','project_builder_submissions','havali_conversations','havali_messages','services','projects','pricing_plans','testimonials','insights','faqs','team_members','homepage_content','media_assets','newsletter_subscribers','site_settings','seo_metadata','client_projects','milestones','tasks','deliverables','invoices','support_tickets','portal_messages','analytics_events'] loop
    execute format('drop policy if exists %I on %I', 'admin_all_' || t, t);
    execute format('create policy %I on %I for all using (is_admin()) with check (is_admin())', 'admin_all_' || t, t);
  end loop;
end $$;

-- Client portal access.
create policy "clients_read_own_projects" on client_projects for select using (client_id = auth.uid() or is_admin());
create policy "clients_read_own_milestones" on milestones for select using (exists(select 1 from client_projects p where p.id = project_id and (p.client_id = auth.uid() or is_admin())));
create policy "clients_read_own_tasks" on tasks for select using (exists(select 1 from client_projects p where p.id = project_id and (p.client_id = auth.uid() or is_admin())));
create policy "clients_read_own_deliverables" on deliverables for select using (exists(select 1 from client_projects p where p.id = project_id and (p.client_id = auth.uid() or is_admin())));
create policy "clients_read_own_invoices" on invoices for select using (exists(select 1 from client_projects p where p.id = project_id and (p.client_id = auth.uid() or is_admin())));
create policy "clients_insert_support" on support_tickets for insert with check (client_id = auth.uid() or is_admin());
create policy "clients_read_support" on support_tickets for select using (client_id = auth.uid() or is_admin());
create policy "clients_messages" on portal_messages for select using (exists(select 1 from client_projects p where p.id = project_id and (p.client_id = auth.uid() or is_admin())));
create policy "clients_insert_messages" on portal_messages for insert with check (sender_id = auth.uid() or is_admin());

create index if not exists leads_status_idx on leads(status);
create index if not exists leads_created_idx on leads(created_at desc);
create index if not exists projects_slug_idx on projects(slug);
create index if not exists services_slug_idx on services(slug);
create index if not exists insights_slug_idx on insights(slug);
create index if not exists havali_session_idx on havali_conversations(session_id);
