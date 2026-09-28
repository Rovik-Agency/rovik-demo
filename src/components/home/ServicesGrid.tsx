import * as Icons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { services } from '@/data/services';

const homeServices = services.slice(0, 8);

export function ServicesGrid() {
  return (
    <section className="section-pad bg-white dark:bg-ink">
      <div className="container">
        <div className="mb-12 grid gap-8 lg:grid-cols-[.75fr_1fr] lg:items-end">
          <div>
            <p className="kicker">What we do</p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-black leading-[1.03] tracking-tight sm:text-6xl">Complete Tech Solutions to Grow Your Business</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted">From websites to AI, ROVIK provides end-to-end digital solutions that help you attract customers, run smarter and scale faster.</p>
          </div>
          <div className="flex items-center justify-start gap-5 lg:justify-end">
            <span className="text-sm font-bold text-muted">One partner. Every solution. Real products.</span>
            <Link to="/services" aria-label="View services" className="grid h-12 w-12 place-items-center rounded-full border border-soft bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-glass"><ArrowRight className="h-5 w-5" /></Link>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {homeServices.map((service, index) => {
            const Icon = (Icons as any)[service.icon] || Icons.Sparkles;
            return (
              <Link to={`/services/${service.slug}`} key={service.slug} className={`group relative overflow-hidden rounded-[1.45rem] border bg-card p-6 shadow-[0_14px_50px_rgba(17,24,39,.04)] transition duration-300 hover:-translate-y-1 hover:shadow-glass ${index === 0 ? 'border-electric/70 ring-4 ring-electric/10' : 'border-soft'}`}>
                <div className="mb-7 grid h-12 w-12 place-items-center rounded-2xl bg-electric/10 text-electric transition group-hover:scale-110"><Icon className="h-6 w-6" /></div>
                <h3 className="font-display text-xl font-black tracking-tight">{service.title}</h3>
                <p className="mt-3 min-h-[72px] text-sm leading-6 text-muted">{service.summary}</p>
                <span className="absolute bottom-5 right-5 grid h-8 w-8 place-items-center rounded-full border border-soft bg-white text-muted transition group-hover:bg-ink group-hover:text-white dark:bg-white/10"><ArrowRight className="h-4 w-4" /></span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
