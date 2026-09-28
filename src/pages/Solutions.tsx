import { SEO } from '@/components/ui/SEO';
import { SectionHeader } from '@/components/ui/SectionHeader';
const solutions = [
  ['For service businesses', 'Premium websites, enquiry systems, booking architecture, SEO and ongoing support.'],
  ['For product founders', 'SaaS MVPs, dashboards, auth, data models, admin systems and launch support.'],
  ['For e-commerce brands', 'Product catalogues, checkout flows, order operations, receipts and conversion-focused design.'],
  ['For teams adopting AI', 'Hybrid agents, RAG knowledge systems, workflow automations and internal copilots.']
];
export function Solutions() { return <><SEO title="ROVIK Solutions" description="ROVIK solutions for service businesses, product founders, e-commerce brands and AI automation teams." path="/solutions" /><section className="section-pad"><div className="container"><SectionHeader eyebrow="Solutions" title="Designed around business context">Choose a path based on your business and what you need to achieve.</SectionHeader><div className="grid gap-5 md:grid-cols-2">{solutions.map(([title, body]) => <div key={title} className="rounded-[2rem] border border-soft bg-card p-8"><h2 className="font-display text-3xl font-black">{title}</h2><p className="mt-4 text-muted">{body}</p></div>)}</div></div></section></>; }
