import { ArrowRight, CalendarDays } from 'lucide-react';
import { LinkButton } from '@/components/ui/Button';

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-ink py-16 text-white sm:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_10%,rgba(255,255,255,.45),transparent_5%),radial-gradient(ellipse_at_80%_100%,rgba(80,120,220,.45),transparent_33%)]" />
      <div className="absolute -bottom-44 right-[-8%] h-[410px] w-[820px] rounded-[50%] border border-white/10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,.36),rgba(70,110,210,.22)_20%,rgba(5,6,10,.3)_52%,transparent_70%)] shadow-[0_-30px_120px_rgba(91,108,255,.2)]" />
      <div className="container relative z-10 grid gap-10 lg:grid-cols-[1fr_.45fr] lg:items-center">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-black uppercase tracking-[.18em] text-white/60">Let's build what's next</p>
          <h2 className="max-w-3xl font-display text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl">Ready to Grow Your Business with <span className="gradient-text">Technology?</span></h2>
          <p className="mt-5 max-w-2xl text-white/60">Turn your idea into a clear brief, technical scope and launch plan. Start with the interactive Project Builder or book a call.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><LinkButton to="/project-builder" variant="secondary" className="bg-white text-ink">Start Your Project <ArrowRight className="h-4 w-4" /></LinkButton><LinkButton to="/contact" variant="secondary" className="border-white/20 bg-white/5 text-white hover:bg-white/10"><CalendarDays className="h-4 w-4" /> Book a Free Call</LinkButton></div>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
          {['Build', 'Improve', 'Grow'].map((item, i) => <div key={item} className="flex items-center gap-3 border-b border-white/10 py-4 last:border-b-0"><span className={`h-4 w-4 rounded-full ${i === 0 ? 'bg-electric' : i === 1 ? 'bg-violet' : 'bg-emerald-400'}`} /><span className="font-bold">{item}</span></div>)}
        </div>
      </div>
    </section>
  );
}
