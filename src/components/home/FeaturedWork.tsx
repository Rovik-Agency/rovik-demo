import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { featuredProjects } from '@/data/projects';

export function FeaturedWork() {
  const [active, setActive] = useState(0);
  const project = featuredProjects[active] ?? featuredProjects[0];
  const next = () => setActive((value) => (value + 1) % featuredProjects.length);
  const prev = () => setActive((value) => (value - 1 + featuredProjects.length) % featuredProjects.length);

  return (
    <section className="overflow-hidden bg-ink py-20 text-white sm:py-24">
      <div className="container grid gap-10 lg:grid-cols-[.38fr_.62fr] lg:items-center">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-black uppercase tracking-[.18em] text-white/60">Featured work</p>
          <h2 className="font-display text-5xl font-black leading-[1.02] tracking-tight">Real Projects. <br />Real Proof.</h2>
          <p className="mt-5 max-w-sm text-lg leading-8 text-white/60">ROVIK’s strongest selling point is shipped products, product thinking and practical engineering — not stock images or fake numbers.</p>
          <Link to="/work" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-ink transition hover:-translate-y-1">View All Projects <ArrowRight className="h-4 w-4" /></Link>
        </div>

        <div className="relative">
          <Link to={`/work/${project.slug}`} className="group block overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-[0_35px_120px_rgba(0,0,0,.36)] backdrop-blur">
            <div className={`relative min-h-[360px] overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${project.palette} p-7`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_28%,rgba(255,255,255,.25),transparent_25%),linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.38))]" />
              <div className="absolute right-6 top-8 hidden h-52 w-72 rotate-3 rounded-[1.4rem] border border-white/20 bg-ink/60 p-4 shadow-glass backdrop-blur md:block">
                <div className="mb-4 h-3 w-24 rounded-full bg-white/20" />
                <div className="grid grid-cols-3 gap-3">
                  {[0,1,2,3,4,5].map((item) => <span key={item} className="h-16 rounded-2xl bg-white/10" />)}
                </div>
              </div>
              <div className="relative z-10 flex min-h-[310px] max-w-md flex-col justify-end">
                <p className="text-sm font-black uppercase tracking-[.18em] text-white/60">{project.category}</p>
                <h3 className="mt-4 font-display text-4xl font-black tracking-tight">{project.title}</h3>
                <p className="mt-4 text-white/70">{project.summary}</p>
                <div className="mt-6 flex flex-wrap gap-2">{project.tags.slice(0, 4).map((tag) => <span key={tag} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold text-white/70">{tag}</span>)}</div>
                <span className="mt-7 inline-flex w-max items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-ink">View Case Study <ArrowRight className="h-4 w-4" /></span>
              </div>
            </div>
          </Link>
          <div className="mt-5 flex items-center justify-end gap-3">
            <button onClick={prev} aria-label="Previous project" className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/10 transition hover:bg-white/10"><ArrowLeft className="h-5 w-5" /></button>
            <span className="text-xs font-bold text-white/40">{String(active + 1).padStart(2, '0')} / {String(featuredProjects.length).padStart(2, '0')}</span>
            <button onClick={next} aria-label="Next project" className="grid h-12 w-12 place-items-center rounded-full bg-white text-ink transition hover:-translate-y-1"><ArrowRight className="h-5 w-5" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
