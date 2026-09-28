// @ts-nocheck
// Optional provider adapter for Havali. Connect self-hosted/open-source LLM here.
// The frontend works without this function; this is for future server-side inference.
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
    const endpoint = Deno.env.get('HAVALI_LLM_ENDPOINT');
    const apiKey = Deno.env.get('HAVALI_LLM_API_KEY');
    if (!endpoint) return new Response(JSON.stringify({ ok: false, fallback: true, reason: 'No provider configured' }), { headers: corsHeaders });

    const input = await req.json().catch(() => ({}));
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}) },
      body: JSON.stringify(input)
    });
    const data = await res.json().catch(() => ({}));
    return new Response(JSON.stringify({ ok: res.ok, data }), { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, fallback: true, error: String(error) }), { headers: corsHeaders });
  }
});
