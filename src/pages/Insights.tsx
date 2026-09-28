import { Link } from 'react-router-dom';
import { SEO } from '@/components/ui/SEO';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { insights } from '@/data/insights';
export function Insights() { return <><SEO title="ROVIK Insights" description="ROVIK insights about web, SaaS, AI, automation, SEO and premium product engineering." path="/insights" /><section className="section-pad"><div className="container"><SectionHeader eyebrow="Insights" title="Product, AI and growth notes"/><div className="grid gap-5 md:grid-cols-3">{insights.map((insight) => <Link to={`/insights/${insight.slug}`} key={insight.slug} className="rounded-[2rem] border border-soft bg-card p-7"><p className="kicker">{insight.category}</p><h2 className="mt-4 font-display text-3xl font-black">{insight.title}</h2><p className="mt-4 text-muted">{insight.excerpt}</p><p className="mt-6 text-xs font-bold text-muted">{insight.date} · {insight.readTime}</p></Link>)}</div></div></section></>; }
