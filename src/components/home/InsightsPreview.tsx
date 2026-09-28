import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { insights } from '@/data/insights';

export function InsightsPreview() {
  return (
    <section className="section-pad bg-card">
      <div className="container">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="kicker">Insights</p>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl">Thinking Behind the Platform</h2>
            <p className="mt-4 max-w-xl text-muted">Practical notes on product design, AI architecture and growth systems.</p>
          </div>
          <Link to="/insights" className="inline-flex items-center gap-2 text-sm font-black text-electric">All insights <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {insights.map((insight) => <Link to={`/insights/${insight.slug}`} key={insight.slug} className="rounded-[1.5rem] border border-soft bg-white/50 p-6 transition hover:-translate-y-1 hover:shadow-glass dark:bg-white/5"><p className="kicker">{insight.category}</p><h3 className="mt-4 font-display text-2xl font-black">{insight.title}</h3><p className="mt-3 text-sm leading-6 text-muted">{insight.excerpt}</p><p className="mt-5 text-xs font-bold text-muted">{insight.date} · {insight.readTime}</p></Link>)}
        </div>
      </div>
    </section>
  );
}
