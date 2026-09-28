import type { PricingPlan } from '@/types';

export const pricingPlans: PricingPlan[] = [
  {
    name: 'Launch',
    price: '£149+',
    cadence: 'starter scope',
    summary: 'Focused landing page, audit or small improvement sprint.',
    ideal: 'New brands, campaign pages and quick fixes.',
    cta: 'Start small',
    features: ['Discovery call', 'Responsive build', 'Basic SEO setup', 'Contact form', 'Launch checklist']
  },
  {
    name: 'Growth',
    price: '£299+',
    cadence: 'project sprint',
    summary: 'Custom business website or feature-focused rebuild.',
    ideal: 'Service businesses and small teams improving credibility.',
    cta: 'Plan growth',
    features: ['Custom page design', 'CMS-ready structure', 'Animations with restraint', 'Analytics events', 'Performance pass']
  },
  {
    name: 'Product',
    price: '£599+',
    cadence: 'MVP module',
    summary: 'Web app, portal, e-commerce or SaaS foundations.',
    ideal: 'Businesses building real product workflows.',
    cta: 'Build product',
    features: ['Product architecture', 'Auth-ready flow', 'Database design', 'Admin-ready screens', 'QA checklist']
  },
  {
    name: 'Scale',
    price: '£999+',
    cadence: 'custom proposal',
    summary: 'Larger platforms, AI agents, integrations and ongoing support.',
    ideal: 'Teams needing end-to-end delivery and retained support.',
    cta: 'Scope platform',
    features: ['Full discovery', 'Advanced integrations', 'Havali-style AI architecture', 'Client portal', 'Retainer options']
  }
];
