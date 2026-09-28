import { createClient, type PostgrestError } from '@supabase/supabase-js';
import { env, hasSupabase } from './env';

export const supabase = hasSupabase
  ? createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    })
  : null;

type LocalRow = Record<string, unknown> & { id?: string; created_at?: string; updated_at?: string };
type MutationResult<T = unknown> = { data: T | null; error: PostgrestError | Error | null };

function localKey(table: string) {
  return `rovik:${table}`;
}

function readLocal<T>(table: string): T[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(localKey(table)) || '[]') as T[];
  } catch {
    return [];
  }
}

function writeLocal<T>(table: string, rows: T[]) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(localKey(table), JSON.stringify(rows));
}

export function seedLocalTable<T extends LocalRow>(table: string, rows: T[]) {
  if (supabase || typeof localStorage === 'undefined') return;
  const existing = readLocal<T>(table);
  if (existing.length) return;
  writeLocal(table, rows.map((row) => ({ id: crypto.randomUUID(), created_at: new Date().toISOString(), ...row })));
}

function withTimestamps<T extends Record<string, unknown>>(payload: T) {
  const now = new Date().toISOString();
  return {
    ...payload,
    created_at: payload.created_at || now,
    updated_at: payload.updated_at || now
  };
}

/**
 * Public form tables are protected by RLS. Do not use `.select()` after insert,
 * because that requires a SELECT policy and causes 401/403 for anonymous visitors.
 */
export async function insertRecord<T extends Record<string, unknown>>(table: string, payload: T): Promise<MutationResult<LocalRow>> {
  if (!supabase) {
    const existing = readLocal<LocalRow>(table);
    const row = { id: crypto.randomUUID(), ...withTimestamps(payload) };
    existing.unshift(row);
    writeLocal(table, existing);
    return { data: row, error: null };
  }

  const { error } = await supabase.from(table).insert(payload);
  return { data: null, error };
}

export async function updateRecord<T extends Record<string, unknown>>(table: string, id: string, payload: T, idColumn = 'id'): Promise<MutationResult<LocalRow>> {
  if (!supabase) {
    const existing = readLocal<LocalRow>(table);
    const updated = existing.map((row) => String(row[idColumn]) === String(id) ? { ...row, ...payload, updated_at: new Date().toISOString() } : row);
    writeLocal(table, updated);
    return { data: updated.find((row) => String(row[idColumn]) === String(id)) || null, error: null };
  }
  const { data, error } = await supabase.from(table).update(payload).eq(idColumn, id).select('*').maybeSingle();
  return { data: (data as LocalRow | null) ?? null, error };
}

export async function deleteRecord(table: string, id: string, idColumn = 'id') {
  if (!supabase) {
    const existing = readLocal<LocalRow>(table);
    const next = existing.filter((row) => String(row[idColumn]) !== String(id));
    writeLocal(table, next);
    return { error: null };
  }
  return supabase.from(table).delete().eq(idColumn, id);
}

export async function fetchRecords<T>(table: string, limit = 200): Promise<T[]> {
  if (!supabase) return readLocal<T>(table);

  const first = await supabase.from(table).select('*').order('created_at', { ascending: false }).limit(limit);
  if (!first.error) return (first.data || []) as T[];

  const fallback = await supabase.from(table).select('*').limit(limit);
  if (fallback.error) throw fallback.error;
  return (fallback.data || []) as T[];
}

export async function getCurrentProfile() {
  if (!supabase) return { id: 'local-owner', email: 'demo@rovik.local', full_name: 'Local Owner', role: 'owner' };
  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError || !userResult.user) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('id,email,full_name,role,avatar_url')
    .eq('id', userResult.user.id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
