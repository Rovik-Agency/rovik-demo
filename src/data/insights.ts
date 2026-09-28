import type { Insight } from '@/types';

export const insights: Insight[] = [
  {
    slug: 'hybrid-ai-agents-for-business-websites',
    title: 'Why agency websites should use hybrid AI agents, not brittle chat demos',
    excerpt: 'A practical blueprint for combining owned knowledge, workflows, retrieval and optional LLMs.',
    category: 'AI',
    date: '2026-09-28',
    readTime: '6 min read',
    body: [
      'A useful AI assistant should start with controlled business knowledge. Services, pricing, projects and FAQs should be structured before any model is connected.',
      'Deterministic intents handle common tasks: pricing guidance, project discovery, booking actions and contact capture. Retrieval adds flexibility by finding the most relevant knowledge from the site.',
      'A provider abstraction keeps the system future-proof. Teams can begin with deterministic responses and later connect self-hosted or external models without rewriting the interface.'
    ]
  },
  {
    slug: 'portfolio-led-agency-positioning',
    title: 'Portfolio-led positioning: make real products the centerpiece',
    excerpt: 'A premium agency site should prove capability through actual systems, not generic visuals.',
    category: 'Strategy',
    date: '2026-09-24',
    readTime: '4 min read',
    body: [
      'Case studies create trust when they explain problem, objective, solution, engineering decisions and constraints honestly.',
      'Avoid invented numbers. If results are not measured yet, describe concrete delivered outputs such as platform foundations, workflows and reusable architecture.',
      'A portfolio CMS should be designed so future projects can be added without redesigning the site.'
    ]
  },
  {
    slug: 'technical-seo-for-modern-react-sites',
    title: 'Technical SEO foundations for modern React sites',
    excerpt: 'Metadata, schemas, sitemaps and performance should be planned from the first build.',
    category: 'Engineering',
    date: '2026-09-18',
    readTime: '5 min read',
    body: [
      'React sites need strong semantic markup and route-level metadata to communicate clearly with search engines and social platforms.',
      'Organization, Service, Article and Breadcrumb JSON-LD help describe the business and the content architecture.',
      'Performance, accessibility and content structure matter as much as meta tags.'
    ]
  }
];

export function getInsight(slug: string) { return insights.find((insight) => insight.slug === slug); }
