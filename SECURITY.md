# Security Notes

- Never commit `.env`.
- Use Supabase RLS in production.
- Public insert is allowed only for lead-generation tables.
- Admin CMS requires Supabase Auth and admin/editor role.
- Client portal data is restricted to the authenticated client or admins.
- Add CAPTCHA/Turnstile for public forms before heavy paid traffic.
- Add server-side validation in Edge Functions for sensitive workflows.
- Use signed URLs for private deliverables and invoices.
- Connect proper monitoring and backups before launch.
