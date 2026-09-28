# ROVIK Architecture

## Frontend

- React + TypeScript + Vite
- React Router route system
- Tailwind design tokens with CSS variables for themes
- GSAP/ScrollTrigger loaded dynamically for scroll animation
- Three.js loaded only for the hero visual
- Lazy-friendly architecture through route-level component separation

## Data model

The app ships with static seed data for immediate operation and a Supabase schema for live CMS mode. The static data mirrors the CMS structure so migration to live data is straightforward.

## Admin/CMS

The `/admin` dashboard is a secure Supabase Auth route in production. It is designed to manage:

- Leads
- Havali conversations/leads
- Project Builder submissions
- Projects and case studies
- Services
- Pricing
- Testimonials
- Insights/articles
- FAQs
- Team
- Homepage content
- Media
- Newsletter
- Contact submissions
- SEO metadata
- Site settings

## Client portal

The portal schema supports:

- Client projects
- Milestones
- Tasks
- Deliverables
- Invoices
- Support tickets
- Project messages

RLS policies restrict client reads to their own projects and allow admin oversight.

## Security notes

- Public insert policies are limited to lead/contact/project submission style tables.
- Admin read/write requires `profiles.role` in `owner`, `admin` or `editor`.
- Client portal policies check `client_id = auth.uid()`.
- Secrets must only be used server-side or in Supabase Edge Functions.
- Honeypot spam control is included on contact forms; add CAPTCHA or Turnstile for high-traffic production.
