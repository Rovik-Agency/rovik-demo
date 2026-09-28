import type { Service } from '@/types';

export const services: Service[] = [
  {
    slug: 'web-apps',
    title: 'Web & Web Apps',
    eyebrow: 'Premium web platforms',
    summary: 'Responsive marketing sites, dashboards and full web applications engineered for growth.',
    description: 'ROVIK builds fast, accessible and scalable web experiences that combine premium design with reliable engineering.',
    icon: 'LayoutDashboard',
    capabilities: ['Marketing websites', 'Custom dashboards', 'CMS-backed platforms', 'Progressive web apps', 'Technical SEO'],
    process: ['Discovery and information architecture', 'UX/UI system design', 'Frontend build', 'CMS/API integration', 'QA, launch and optimization'],
    technologies: ['React', 'TypeScript', 'Vite', 'Supabase', 'PostgreSQL', 'Tailwind CSS'],
    relatedProjectSlugs: ['codadaily', 'swift-trip-holidays', 'codatools'],
    faq: [
      { q: 'Can ROVIK redesign an existing website?', a: 'Yes. ROVIK can audit, redesign, rebuild or incrementally improve an existing site depending on risk and timeline.' },
      { q: 'Do web projects include SEO?', a: 'Technical SEO, metadata, semantic HTML and performance foundations are included. Ongoing content SEO can be added.' }
    ]
  },
  {
    slug: 'mobile-apps',
    title: 'Mobile Apps',
    eyebrow: 'Product-grade mobile',
    summary: 'Mobile app strategy, UI, cross-platform builds and backend integrations.',
    description: 'From MVP to production mobile experiences, ROVIK designs and builds apps that feel clear, fast and reliable.',
    icon: 'Smartphone',
    capabilities: ['App UX/UI', 'Cross-platform planning', 'API integration', 'Push notification architecture', 'Release support'],
    process: ['Product scope', 'Mobile UX prototypes', 'App build', 'Testing across devices', 'Launch support'],
    technologies: ['React Native-ready architecture', 'Capacitor', 'Supabase', 'REST APIs', 'Push providers'],
    relatedProjectSlugs: ['codavybes'],
    faq: [{ q: 'Can you connect a mobile app to the same web backend?', a: 'Yes. ROVIK prefers shared backend architecture where practical to reduce cost and complexity.' }]
  },
  {
    slug: 'saas',
    title: 'SaaS Platforms',
    eyebrow: 'Software businesses',
    summary: 'MVPs, dashboards, billing-ready architecture and operational SaaS systems.',
    description: 'ROVIK designs SaaS products around roles, workflows, data, security and future growth.',
    icon: 'Boxes',
    capabilities: ['MVP architecture', 'User roles', 'Dashboards', 'Subscriptions architecture', 'Admin operations'],
    process: ['Business model mapping', 'Data model', 'Product UX', 'Core build', 'Launch and iteration'],
    technologies: ['React', 'Supabase', 'PostgreSQL', 'Edge Functions', 'Stripe-ready architecture'],
    relatedProjectSlugs: ['busal-os', 'idraak'],
    faq: [{ q: 'Can ROVIK build only an MVP first?', a: 'Yes. ROVIK can scope a lean MVP and design it so future modules can be added safely.' }]
  },
  {
    slug: 'ai-automation',
    title: 'AI & Automation',
    eyebrow: 'Practical AI systems',
    summary: 'AI agents, workflow automation, RAG systems and business process intelligence.',
    description: 'ROVIK builds AI features with controlled knowledge, safe fallbacks and provider abstraction rather than fragile demos.',
    icon: 'Bot',
    capabilities: ['Hybrid AI agents', 'RAG knowledge bases', 'Workflow automation', 'Lead qualification', 'Internal copilots'],
    process: ['Use-case discovery', 'Knowledge mapping', 'Workflow design', 'Provider abstraction', 'Evaluation and safety'],
    technologies: ['Supabase pgvector-ready design', 'Embeddings-ready RAG', 'Edge Functions', 'Provider adapters', 'Open-source LLM-ready architecture'],
    relatedProjectSlugs: ['busal-os'],
    faq: [{ q: 'Is Havali dependent on one AI API?', a: 'No. Havali is designed around owned knowledge, deterministic workflows and pluggable providers.' }]
  },
  {
    slug: 'ecommerce',
    title: 'E-commerce',
    eyebrow: 'Stores that sell clearly',
    summary: 'Product catalogues, checkout flows, admin operations and commerce-ready SEO.',
    description: 'ROVIK creates e-commerce experiences for brands that need strong presentation and practical operations.',
    icon: 'ShoppingBag',
    capabilities: ['Product catalogues', 'Cart and checkout', 'Order workflows', 'Payment architecture', 'Receipts and notifications'],
    process: ['Product model', 'Storefront UX', 'Checkout architecture', 'Admin workflows', 'Launch support'],
    technologies: ['React', 'Supabase', 'Stripe architecture', 'Storage', 'Resend-ready email'],
    relatedProjectSlugs: ['sindhu-heritage-of-sindh'],
    faq: [{ q: 'Can ROVIK support manual and online payments?', a: 'Yes. Payment workflows can be designed around the market and operational requirements.' }]
  },
  {
    slug: 'ui-ux',
    title: 'UI/UX Design',
    eyebrow: 'Premium product design',
    summary: 'Design systems, product UX, conversion-focused interfaces and polished interactions.',
    description: 'ROVIK designs products with structure, hierarchy, accessibility and long-term maintainability.',
    icon: 'PenTool',
    capabilities: ['Design systems', 'Wireframes', 'High-fidelity UI', 'Prototypes', 'Interaction design'],
    process: ['Research', 'UX flows', 'Visual direction', 'Component system', 'Developer handoff'],
    technologies: ['Figma', 'Design tokens', 'Tailwind systems', 'GSAP interaction planning'],
    relatedProjectSlugs: ['sindhu-heritage-of-sindh', 'busal-os', 'codavybes'],
    faq: [{ q: 'Can ROVIK design before development starts?', a: 'Yes. Design can be a standalone phase or integrated into the full build.' }]
  },
  {
    slug: 'cloud-devops',
    title: 'Cloud & DevOps',
    eyebrow: 'Reliable launches',
    summary: 'Deployment, database, storage, environments, monitoring and production hardening.',
    description: 'ROVIK prepares products for real users with stable deployment practices and secure environment architecture.',
    icon: 'CloudCog',
    capabilities: ['Vercel deployment', 'Supabase setup', 'Storage architecture', 'Environment management', 'Monitoring hooks'],
    process: ['Infrastructure planning', 'Environment setup', 'CI/CD guidance', 'Security checks', 'Launch support'],
    technologies: ['Vercel', 'Supabase', 'PostgreSQL', 'Edge Functions', 'Cloudflare-ready architecture'],
    relatedProjectSlugs: ['codatools', 'codadaily'],
    faq: [{ q: 'Can ROVIK fix production deployment issues?', a: 'Yes. ROVIK can review deployment, environment variables, logs and data migrations.' }]
  },
  {
    slug: 'qa-testing',
    title: 'QA & Testing',
    eyebrow: 'Ship with confidence',
    summary: 'Responsive QA, functional testing, accessibility reviews and launch checklists.',
    description: 'ROVIK helps teams catch issues before launch and create repeatable QA systems.',
    icon: 'ShieldCheck',
    capabilities: ['Functional testing', 'Device testing', 'Accessibility review', 'Performance checks', 'Launch QA'],
    process: ['Test plan', 'Issue logging', 'Fix verification', 'Regression checks', 'Launch approval'],
    technologies: ['Manual QA', 'Lighthouse', 'Accessibility tooling', 'Browser testing'],
    relatedProjectSlugs: ['codavybes', 'codatools'],
    faq: [{ q: 'Can QA be added to an existing project?', a: 'Yes. ROVIK can audit and test an existing product before a release.' }]
  },
  {
    slug: 'seo-marketing',
    title: 'SEO & Digital Marketing',
    eyebrow: 'Growth foundations',
    summary: 'Technical SEO, content architecture, analytics, campaigns and conversion improvements.',
    description: 'ROVIK builds growth systems around search visibility, performance and better conversion journeys.',
    icon: 'TrendingUp',
    capabilities: ['Technical SEO', 'Analytics setup', 'Content structure', 'Landing pages', 'Campaign tracking'],
    process: ['Audit', 'Keyword and content map', 'Implementation', 'Measurement', 'Iteration'],
    technologies: ['Schema.org', 'Search Console', 'Analytics events', 'Sitemaps', 'OpenGraph'],
    relatedProjectSlugs: ['codadaily', 'swift-trip-holidays'],
    faq: [{ q: 'Do you guarantee rankings?', a: 'No responsible agency can guarantee rankings. ROVIK focuses on technical quality, content structure and measurable improvements.' }]
  },
  {
    slug: 'support',
    title: 'Ongoing Technology Support',
    eyebrow: 'Long-term partner',
    summary: 'Maintenance, improvements, monitoring, content support and retained engineering help.',
    description: 'ROVIK supports launched products so businesses can keep improving without rebuilding from scratch.',
    icon: 'LifeBuoy',
    capabilities: ['Bug fixes', 'Feature iterations', 'Security updates', 'CMS support', 'Monthly improvements'],
    process: ['Support plan', 'Backlog setup', 'Priority handling', 'Monthly reporting', 'Continuous improvement'],
    technologies: ['Supabase', 'Vercel', 'React', 'Monitoring', 'Support workflows'],
    relatedProjectSlugs: ['sindhu-heritage-of-sindh', 'codadaily', 'codatools'],
    faq: [{ q: 'Can support start after launch?', a: 'Yes. ROVIK can provide retained support after a new build or take over an existing product.' }]
  }
];

export function getService(slug: string) { return services.find((service) => service.slug === slug); }
