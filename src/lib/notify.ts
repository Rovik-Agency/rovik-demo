import { supabase } from './supabase';

export async function notifyAdmin(subject: string, payload: Record<string, unknown>) {
  if (!supabase) return { skipped: true };
  try {
    const { data, error } = await supabase.functions.invoke('notify', { body: { subject, ...payload } });
    if (error) throw error;
    return data;
  } catch (error) {
    if (import.meta.env.DEV) console.warn('[notify]', error);
    return { ok: false, error };
  }
}
