// @ts-nocheck
// Supabase Edge Function: notify admin/user through Resend.
// Deploy: supabase functions deploy notify --no-verify-jwt
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders });
  if (req.method !== 'POST') return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), { status: 200, headers: corsHeaders });

  try {
    const payload = await req.json().catch(() => ({}));
    const apiKey = Deno.env.get('RESEND_API_KEY');
    const admin = Deno.env.get('ADMIN_NOTIFICATION_EMAIL');
    const from = Deno.env.get('FROM_EMAIL') || 'ROVIK <onboarding@resend.dev>';

    if (!apiKey || !admin) {
      return new Response(JSON.stringify({ ok: true, skipped: true, reason: 'Email env vars not configured' }), { headers: corsHeaders });
    }

    const subject = payload.subject || 'New ROVIK website enquiry';
    const html = `<div style="font-family:Inter,Arial,sans-serif;line-height:1.6"><h2>${escapeHtml(subject)}</h2><pre style="white-space:pre-wrap;background:#f6f6f8;padding:16px;border-radius:12px">${escapeHtml(JSON.stringify(payload, null, 2))}</pre></div>`;
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [admin], subject, html })
    });

    if (!res.ok) {
      const details = await res.text();
      console.error('[notify] Resend failed', details);
      return new Response(JSON.stringify({ ok: false, provider: 'resend', error: details }), { headers: corsHeaders });
    }

    const data = await res.json().catch(() => ({}));
    return new Response(JSON.stringify({ ok: true, data }), { headers: corsHeaders });
  } catch (error) {
    console.error('[notify] unexpected error', error);
    return new Response(JSON.stringify({ ok: false, error: String(error) }), { headers: corsHeaders });
  }
});

function escapeHtml(input: string) {
  return String(input).replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c] || c));
}
