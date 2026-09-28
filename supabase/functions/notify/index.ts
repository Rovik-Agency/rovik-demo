// Supabase Edge Function: notify admin/user through Resend.
// Deploy: supabase functions deploy notify --no-verify-jwt
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders });

  try {
    const payload = await req.json();
    const apiKey = Deno.env.get('RESEND_API_KEY');
    const admin = Deno.env.get('ADMIN_NOTIFICATION_EMAIL');
    const from = Deno.env.get('FROM_EMAIL') || 'ROVIK <noreply@example.com>';
    if (!apiKey || !admin) return Response.json({ ok: true, skipped: true, reason: 'Email env vars not configured' }, { headers: corsHeaders });

    const subject = payload.subject || 'New ROVIK website enquiry';
    const html = `<div style="font-family:Inter,Arial,sans-serif;line-height:1.6"><h2>${subject}</h2><pre style="white-space:pre-wrap;background:#f6f6f8;padding:16px;border-radius:12px">${escapeHtml(JSON.stringify(payload, null, 2))}</pre></div>`;
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [admin], subject, html })
    });
    if (!res.ok) throw new Error(await res.text());
    return Response.json({ ok: true }, { headers: corsHeaders });
  } catch (error) {
    return Response.json({ ok: false, error: String(error) }, { status: 500, headers: corsHeaders });
  }
});

function escapeHtml(input: string) {
  return input.replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c] || c));
}
