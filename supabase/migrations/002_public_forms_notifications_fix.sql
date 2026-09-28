-- Fix public form submissions, admin RLS access and existing database schema drift.
-- Run this in Supabase SQL Editor if your project was created before the latest ZIP.

create extension if not exists pgcrypto;

alter table if exists public.contact_submissions
  add column if not exists source text not null default 'contact';

alter table if exists public.project_builder_submissions
  add column if not exists source text not null default 'project-builder';

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('owner','admin','editor')
  );
$$;

grant usage on schema public to anon, authenticated;
grant insert on public.leads, public.contact_submissions, public.project_builder_submissions, public.havali_conversations, public.havali_messages, public.newsletter_subscribers, public.analytics_events to anon, authenticated;
grant select on public.services, public.projects, public.pricing_plans, public.testimonials, public.insights, public.faqs, public.team_members to anon, authenticated;
grant all on public.profiles, public.leads, public.lead_notes, public.contact_submissions, public.project_builder_submissions, public.havali_conversations, public.havali_messages, public.services, public.projects, public.pricing_plans, public.testimonials, public.insights, public.faqs, public.team_members, public.homepage_content, public.media_assets, public.newsletter_subscribers, public.site_settings, public.seo_metadata, public.client_projects, public.milestones, public.tasks, public.deliverables, public.invoices, public.support_tickets, public.portal_messages, public.analytics_events to authenticated;

alter table if exists public.leads enable row level security;
alter table if exists public.contact_submissions enable row level security;
alter table if exists public.project_builder_submissions enable row level security;
alter table if exists public.havali_conversations enable row level security;
alter table if exists public.havali_messages enable row level security;
alter table if exists public.newsletter_subscribers enable row level security;
alter table if exists public.analytics_events enable row level security;

drop policy if exists "public_insert_contact" on public.contact_submissions;
create policy "public_insert_contact" on public.contact_submissions
  for insert to anon, authenticated
  with check (true);

drop policy if exists "public_insert_project_builder" on public.project_builder_submissions;
create policy "public_insert_project_builder" on public.project_builder_submissions
  for insert to anon, authenticated
  with check (true);

drop policy if exists "public_insert_leads" on public.leads;
create policy "public_insert_leads" on public.leads
  for insert to anon, authenticated
  with check (true);

drop policy if exists "public_insert_havali" on public.havali_conversations;
create policy "public_insert_havali" on public.havali_conversations
  for insert to anon, authenticated
  with check (true);

drop policy if exists "public_insert_havali_messages" on public.havali_messages;
create policy "public_insert_havali_messages" on public.havali_messages
  for insert to anon, authenticated
  with check (true);

drop policy if exists "public_insert_newsletter" on public.newsletter_subscribers;
create policy "public_insert_newsletter" on public.newsletter_subscribers
  for insert to anon, authenticated
  with check (true);

drop policy if exists "public_insert_events" on public.analytics_events;
create policy "public_insert_events" on public.analytics_events
  for insert to anon, authenticated
  with check (true);

-- Rebuild admin policies so authenticated admin users can manage all dashboard modules.
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','leads','lead_notes','contact_submissions','project_builder_submissions','havali_conversations','havali_messages','services','projects','pricing_plans','testimonials','insights','faqs','team_members','homepage_content','media_assets','newsletter_subscribers','site_settings','seo_metadata','client_projects','milestones','tasks','deliverables','invoices','support_tickets','portal_messages','analytics_events'
  ] loop
    execute format('drop policy if exists %I on public.%I', 'admin_all_' || t, t);
    execute format('create policy %I on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', 'admin_all_' || t, t);
  end loop;
end $$;
