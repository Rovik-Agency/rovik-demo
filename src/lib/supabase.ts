import { createClient } from '@supabase/supabase-js';
import { env, hasSupabase } from './env';

export const supabase = hasSupabase
  ? createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    })
  : null;

export async function insertRecord<T extends Record<string, unknown>>(table: string, payload: T) {
  if (!supabase) {
    const existing = JSON.parse(localStorage.getItem(`rovik:${table}`) || '[]');
    existing.unshift({ id: crypto.randomUUID(), ...payload, created_at: new Date().toISOString() });
    localStorage.setItem(`rovik:${table}`, JSON.stringify(existing));
    return { data: existing[0], error: null };
  }
  return supabase.from(table).insert(payload).select('*').single();
}

export async function fetchRecords<T>(table: string, limit = 100): Promise<T[]> {
  if (!supabase) {
    return JSON.parse(localStorage.getItem(`rovik:${table}`) || '[]') as T[];
  }
  const first = await supabase.from(table).select('*').order('created_at', { ascending: false }).limit(limit);
  if (!first.error) return (first.data || []) as T[];

  const fallback = await supabase.from(table).select('*').limit(limit);
  if (fallback.error) throw fallback.error;
  return (fallback.data || []) as T[];
}
