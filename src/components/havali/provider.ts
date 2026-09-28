import type { HavaliIntent } from './intents';
import type { KnowledgeItem } from './knowledge';

export type HavaliProviderInput = { message: string; intent: HavaliIntent; context: KnowledgeItem[]; session: Record<string, unknown> };
export type HavaliProviderOutput = { content: string; suggestions: string[]; leadReady?: boolean };

export interface HavaliProvider {
  name: string;
  generate(input: HavaliProviderInput): Promise<HavaliProviderOutput>;
}

export class DeterministicHavaliProvider implements HavaliProvider {
  name = 'deterministic-rag';
  async generate(input: HavaliProviderInput): Promise<HavaliProviderOutput> {
    const contextList = input.context.slice(0, 3).map((item) => `• ${item.title}: ${item.content.split('. ').slice(0, 2).join('. ')}.`).join('\n');
    const fallbackContext = contextList || 'I can help with ROVIK services, projects, pricing, project discovery and contact next steps.';

    if (input.intent === 'pricing') {
      return { content: `ROVIK pricing is scope-based. The visible starting points are Launch £149+, Growth £299+, Product £599+ and Scale £999+. For a useful estimate, tell me the service, features, timeline and budget band.\n\nRelevant context:\n${fallbackContext}`, suggestions: ['Open pricing', 'Build a project brief', 'Ask about SaaS cost'] };
    }
    if (input.intent === 'project_discovery') {
      return { content: `I can turn your idea into a structured brief. Start with these: service type, business type, must-have features, design level, timeline and budget range.\n\nRelevant context:\n${fallbackContext}`, suggestions: ['Open Project Builder', 'I need an e-commerce site', 'I need an AI assistant'] };
    }
    if (input.intent === 'portfolio') {
      return { content: `ROVIK's portfolio includes real product work such as SINDHU, Busal OS, Swift Trip Holidays, IDRAAK, CodaDaily, CodaVybes and CodaTools.\n\nRelevant matches:\n${fallbackContext}`, suggestions: ['View portfolio', 'Show SaaS projects', 'Show e-commerce work'] };
    }
    if (input.intent === 'booking') {
      return { content: `You can book a discovery call after creating a quick brief. That helps ROVIK understand scope before the call.`, suggestions: ['Build project brief', 'Contact ROVIK', 'View pricing'] };
    }
    if (input.intent === 'service_choice') {
      return { content: `Based on your message, these ROVIK capabilities look relevant:\n${fallbackContext}\n\nTell me your business type and goal, and I’ll narrow the service mix.`, suggestions: ['Website for my business', 'SaaS MVP', 'AI automation'] };
    }
    return { content: `I’m Havali AI, ROVIK’s hybrid assistant. I use ROVIK’s controlled knowledge base, intent workflows and retrieval-first answers. I can help with services, projects, pricing, FAQs or a project brief.\n\n${fallbackContext}`, suggestions: ['What can ROVIK build?', 'Open Project Builder', 'Show real work'] };
  }
}

export class ProviderRouter {
  private fallback = new DeterministicHavaliProvider();
  async generate(input: HavaliProviderInput) {
    // Future provider adapter hook: call self-hosted/open-source LLM or external endpoint here.
    // The website continues to work without any external AI API.
    return this.fallback.generate(input);
  }
}
