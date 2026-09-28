// Optional provider adapter for Havali. Connect self-hosted/open-source LLM here.
// The frontend works without this function; this is for future server-side inference.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const endpoint = Deno.env.get('HAVALI_LLM_ENDPOINT');
  const apiKey = Deno.env.get('HAVALI_LLM_API_KEY');
  if (!endpoint) return Response.json({ ok: false, fallback: true, reason: 'No provider configured' });
  const input = await req.json();
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}) },
    body: JSON.stringify(input)
  });
  const data = await res.json();
  return Response.json({ ok: true, data });
});
