import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { services } from '@/data/services';

export function Footer() {
  return (
    <footer className="border-t border-soft bg-card">
      <div className="container section-pad">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink font-display font-black text-white dark:bg-white dark:text-ink">R</span><span className="font-display text-2xl font-black">ROVIK</span></div>
            <p className="mt-5 max-w-md text-muted">A premium technology agency helping businesses build, improve and grow through software, design, AI and automation.</p>
            <Link to="/project-builder" className="mt-6 inline-flex items-center gap-2 font-bold text-electric">Start a project <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div><h3 className="font-bold">Services</h3><div className="mt-4 grid gap-3 text-sm text-muted">{services.slice(0,6).map((service) => <Link key={service.slug} to={`/services/${service.slug}`} className="hover:text-current">{service.title}</Link>)}</div></div>
          <div><h3 className="font-bold">Company</h3><div className="mt-4 grid gap-3 text-sm text-muted"><Link to="/work">Work</Link><Link to="/solutions">Solutions</Link><Link to="/about">About</Link><Link to="/insights">Insights</Link><Link to="/contact">Contact</Link></div></div>
          <div><h3 className="font-bold">Platform</h3><div className="mt-4 grid gap-3 text-sm text-muted"><Link to="/havali">Havali AI</Link><Link to="/project-builder">Project Builder</Link><Link to="/portal">Client Portal</Link><Link to="/legal/privacy">Privacy</Link><Link to="/legal/terms">Terms</Link></div></div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-soft pt-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} ROVIK. Built for production, scale and trust.</p>
          <p>No fake metrics. Real projects. Clear engineering.</p>
        </div>
      </div>
    </footer>
  );
}
