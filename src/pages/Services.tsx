import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { SEO } from '@/components/ui/SEO';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { services } from '@/data/services';

export function Services() {
  return <><SEO title="ROVIK Services — Web, SaaS, AI, E-commerce and Support" description="Explore ROVIK services across web apps, mobile, SaaS, AI automation, e-commerce, UI/UX, cloud, QA, SEO and ongoing support." path="/services" /><section className="section-pad"><div className="container"><SectionHeader eyebrow="Services" title="Technology services for build, improve and grow">Each service page includes capabilities, process, technologies, related work, FAQs and a CTA.</SectionHeader><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{services.map((service) => { const Icon = (Icons as any)[service.icon] || Icons.Sparkles; return <Link key={service.slug} to={`/services/${service.slug}`} className="rounded-[2rem] border border-soft bg-card p-7 transition hover:-translate-y-1 hover:shadow-glass"><Icon className="h-8 w-8 text-electric"/><p className="kicker mt-6">{service.eyebrow}</p><h2 className="mt-3 font-display text-3xl font-black">{service.title}</h2><p className="mt-4 text-muted">{service.summary}</p><div className="mt-6 flex flex-wrap gap-2">{service.capabilities.slice(0,3).map((c) => <span className="rounded-full border border-soft px-3 py-1 text-xs font-bold" key={c}>{c}</span>)}</div></Link>; })}</div></div></section></>;
}
