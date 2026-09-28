import { env } from './env';
import { supabase } from './supabase';

export async function notifyAdmin(subject: string, payload: Record<string, unknown>) {
  if (!supabase || !env.enableEmailNotifications) {
    return { ok: true, skipped: true, reason: 'Email notifications disabled' };
  }

  try {
    const { data, error } = await supabase.functions.invoke('notify', {
      body: { subject, ...payload }
    });
    if (error) return { ok: false, error: error.message };
    return data || { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Notify failed' };
  }
}
