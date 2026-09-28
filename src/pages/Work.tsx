import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/ui/SEO';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { projectCategories, projects } from '@/data/projects';

export function Work() {
  const [category, setCategory] = useState('All');
  const visible = useMemo(() => category === 'All' ? projects : projects.filter((project) => project.category === category), [category]);
  return <><SEO title="ROVIK Work — Real Projects and Case Studies" description="Explore ROVIK portfolio work including SINDHU, Busal OS, Swift Trip Holidays, IDRAAK, CodaDaily, CodaVybes and CodaTools." path="/work" /><section className="section-pad"><div className="container"><SectionHeader eyebrow="Work" title="Portfolio built around real products">Filter by project type and open detailed case studies with honest scope, architecture and outcomes.</SectionHeader><div className="mb-8 flex flex-wrap gap-2">{projectCategories.map((cat) => <button key={cat} onClick={() => setCategory(cat)} className={`focus-ring rounded-full border px-4 py-2 text-sm font-bold ${category === cat ? 'border-electric bg-electric text-white' : 'border-soft bg-card'}`}>{cat}</button>)}</div><div className="grid gap-5 md:grid-cols-2">{visible.map((project) => <Link key={project.slug} to={`/work/${project.slug}`} className="group overflow-hidden rounded-[2rem] border border-soft bg-card"><div className={`h-52 bg-gradient-to-br ${project.palette} transition group-hover:scale-[1.02]`} /><div className="p-6"><p className="kicker">{project.category}</p><h2 className="mt-3 font-display text-3xl font-black">{project.title}</h2><p className="mt-3 text-muted">{project.summary}</p><div className="mt-5 flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="rounded-full border border-soft px-3 py-1 text-xs font-bold">{tag}</span>)}</div></div></Link>)}</div></div></section></>;
}
