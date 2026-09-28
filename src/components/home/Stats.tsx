import { useEffect, useRef } from 'react';
import { BriefcaseBusiness, Layers, LifeBuoy, Sparkles } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const stats = [
  { value: 7, suffix: '', label: 'Real projects showcased', icon: BriefcaseBusiness },
  { value: 10, suffix: '', label: 'Service areas covered', icon: Layers },
  { value: 1, suffix: '', label: 'Hybrid Havali AI agent', icon: Sparkles },
  { value: 24, suffix: '/7', label: 'Support architecture ready', icon: LifeBuoy }
];

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !ref.current) return;
    import('gsap').then(({ gsap }) => import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);
      ref.current?.querySelectorAll('[data-count]').forEach((node) => {
        const end = Number((node as HTMLElement).dataset.count);
        gsap.fromTo(node, { textContent: 0 }, { textContent: end, duration: 1.4, snap: { textContent: 1 }, scrollTrigger: { trigger: node, start: 'top 88%' } });
      });
    }));
  }, [reduced]);

  return (
    <section className="bg-ink py-9 text-white">
      <div ref={ref} className="container grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div className="flex items-center gap-5 border-white/10 sm:border-r sm:pr-6 last:border-r-0" key={stat.label}>
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/10 text-electric ring-1 ring-white/10"><Icon className="h-6 w-6" /></span>
              <div>
                <div className="font-display text-3xl font-black"><span data-count={stat.value}>{reduced ? stat.value : 0}</span>{stat.suffix}</div>
                <p className="text-sm text-white/60">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
