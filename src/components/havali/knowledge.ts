import { projects } from '@/data/projects';
import { services } from '@/data/services';
import { pricingPlans } from '@/data/pricing';
import { faqs } from '@/data/faqs';

export type KnowledgeItem = { id: string; type: 'service' | 'project' | 'pricing' | 'faq' | 'company'; title: string; content: string; url: string; tags: string[] };

export const knowledgeBase: KnowledgeItem[] = [
  { id: 'company-rovik', type: 'company', title: 'ROVIK', url: '/', tags: ['agency', 'technology', 'web', 'ai'], content: 'ROVIK is a technology agency helping businesses build, improve and grow through Web, Mobile, SaaS, AI, Automation, E-commerce, Cloud, UI/UX, Marketing and ongoing support.' },
  ...services.map((s) => ({ id: `service-${s.slug}`, type: 'service' as const, title: s.title, url: `/services/${s.slug}`, tags: [s.title, ...s.capabilities], content: `${s.title}. ${s.summary} ${s.description} Capabilities: ${s.capabilities.join(', ')}. Technologies: ${s.technologies.join(', ')}.` })),
  ...projects.map((p) => ({ id: `project-${p.slug}`, type: 'project' as const, title: p.title, url: `/work/${p.slug}`, tags: [p.category, ...p.tags], content: `${p.title}. ${p.summary} ${p.overview} Services: ${p.services.join(', ')}. Stack: ${p.stack.join(', ')}.` })),
  ...pricingPlans.map((p) => ({ id: `pricing-${p.name}`, type: 'pricing' as const, title: p.name, url: '/pricing', tags: ['pricing', p.name, p.price], content: `${p.name} plan starts at ${p.price} ${p.cadence}. ${p.summary} Ideal for ${p.ideal}. Includes ${p.features.join(', ')}.` })),
  ...faqs.map((f, index) => ({ id: `faq-${index}`, type: 'faq' as const, title: f.q, url: '/contact', tags: ['faq'], content: `${f.q} ${f.a}` }))
];

export function searchKnowledge(query: string, limit = 5) {
  const q = query.toLowerCase();
  const terms = q.split(/\W+/).filter(Boolean);
  return knowledgeBase
    .map((item) => {
      const haystack = `${item.title} ${item.content} ${item.tags.join(' ')}`.toLowerCase();
      const score = terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0) + (haystack.includes(q) ? 3 : 0);
      return { item, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((result) => result.item);
}
