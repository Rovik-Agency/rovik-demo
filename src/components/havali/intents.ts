export type HavaliIntent = 'pricing' | 'project_discovery' | 'portfolio' | 'service_choice' | 'booking' | 'contact' | 'support' | 'general';

const intentPatterns: { intent: HavaliIntent; words: string[] }[] = [
  { intent: 'pricing', words: ['price', 'pricing', 'cost', 'budget', 'quote', 'package'] },
  { intent: 'project_discovery', words: ['build', 'project', 'idea', 'features', 'timeline', 'brief', 'scope'] },
  { intent: 'portfolio', words: ['portfolio', 'work', 'case', 'project', 'sindhu', 'busal', 'codavybes', 'codatools', 'idraak', 'swift'] },
  { intent: 'service_choice', words: ['service', 'web', 'mobile', 'saas', 'ai', 'automation', 'ecommerce', 'cloud', 'seo'] },
  { intent: 'booking', words: ['book', 'call', 'meeting', 'schedule', 'consultation'] },
  { intent: 'contact', words: ['contact', 'email', 'form', 'message', 'lead'] },
  { intent: 'support', words: ['support', 'maintenance', 'fix', 'improve', 'bug'] }
];

export function detectIntent(input: string): HavaliIntent {
  const text = input.toLowerCase();
  const scored = intentPatterns.map((entry) => ({ intent: entry.intent, score: entry.words.reduce((sum, word) => sum + (text.includes(word) ? 1 : 0), 0) })).sort((a, b) => b.score - a.score);
  return scored[0]?.score ? scored[0].intent : 'general';
}
