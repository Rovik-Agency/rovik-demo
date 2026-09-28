import type { HavaliMessage } from '@/types';
import { insertRecord } from '@/lib/supabase';
import { detectIntent } from './intents';
import { ProviderRouter } from './provider';
import { searchKnowledge } from './knowledge';

const router = new ProviderRouter();

type HavaliSession = { id: string; facts: Record<string, unknown> };

function getSession(): HavaliSession {
  const existing = sessionStorage.getItem('rovik-havali-session');
  if (existing) return JSON.parse(existing);
  const session = { id: crypto.randomUUID(), facts: {} };
  sessionStorage.setItem('rovik-havali-session', JSON.stringify(session));
  return session;
}

export async function askHavali(message: string, history: HavaliMessage[]) {
  const session = getSession();
  const intent = detectIntent(message);
  const context = searchKnowledge(message);
  const output = await router.generate({ message, intent, context, session: { ...session.facts, historyLength: history.length } });

  await insertRecord('havali_conversations', {
    session_id: session.id,
    last_intent: intent,
    last_message: message,
    extracted_context: context.map((item) => item.id),
    created_at: new Date().toISOString()
  });

  return {
    message: { id: crypto.randomUUID(), role: 'assistant' as const, content: output.content, createdAt: new Date().toISOString(), suggestions: output.suggestions },
    intent,
    context
  };
}

export async function createLeadFromHavali(email: string, name: string, message: string) {
  return insertRecord('leads', { email, name, message, source: 'havali', status: 'New', created_at: new Date().toISOString() });
}
