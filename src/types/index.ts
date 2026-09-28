export type ThemeMode = 'light' | 'dark' | 'system';

export type Service = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  icon: string;
  capabilities: string[];
  process: string[];
  technologies: string[];
  faq: { q: string; a: string }[];
  relatedProjectSlugs: string[];
};

export type Project = {
  slug: string;
  title: string;
  url: string;
  category: string;
  tags: string[];
  summary: string;
  overview: string;
  featured?: boolean;
  services: string[];
  stack: string[];
  problem: string;
  objective: string;
  solution: string;
  features: string[];
  design: string[];
  engineering: string[];
  challenges: string[];
  results: string[];
  palette: string;
};

export type PricingPlan = {
  name: string;
  price: string;
  cadence: string;
  summary: string;
  features: string[];
  ideal: string;
  cta: string;
};

export type Insight = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  body: string[];
};

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';

export type ProjectBuilderForm = {
  service: string;
  businessType: string;
  features: string[];
  designLevel: string;
  timeline: string;
  budget: string;
  name: string;
  email: string;
  company?: string;
  message?: string;
};

export type ProjectBrief = {
  title: string;
  recommendedServices: string[];
  scope: string[];
  timelineRange: string;
  priceRange: string;
  assumptions: string[];
  nextSteps: string[];
};

export type HavaliMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  suggestions?: string[];
};
