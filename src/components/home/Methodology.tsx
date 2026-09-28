import { Box, HeartHandshake, Layers, LifeBuoy } from 'lucide-react';

const reasons = [
  { title: 'Business-Focused', body: 'Every build starts with the goal, user journey and operational outcome.', icon: HeartHandshake },
  { title: 'Modern Technology', body: 'Reliable React, Supabase, APIs, automation and deployment foundations.', icon: Layers },
  { title: 'Transparent Process', body: 'Clear stages, scope, milestones and honest technical trade-offs.', icon: Box },
  { title: 'Long-Term Support', body: 'ROVIK is structured for maintenance, improvements and growth after launch.', icon: LifeBuoy }
];

export function Methodology() {
  return (
    <section className="section-pad bg-white dark:bg-ink">
      <div className="container grid gap-12 lg:grid-cols-[.76fr_.54fr_.7fr] lg:items-center">
        <div>
          <p className="kicker">Why businesses choose ROVIK</p>
          <h2 className="mt-4 font-display text-4xl font-black leading-[1.03] tracking-tight sm:text-6xl">More Than a Service Provider. A Growth <span className="gradient-text">Partner.</span></h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted">We combine technology, creativity and strategy to deliver solutions that create real business value.</p>
        </div>
        <div className="relative mx-auto h-72 w-72">
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_90deg,rgba(91,108,255,.06),rgba(138,92,255,.55),rgba(103,232,249,.14),rgba(91,108,255,.06))] blur-[1px]" />
          <div className="absolute inset-8 animate-[pulseGlow_3.5s_ease-in-out_infinite] rounded-full border-[18px] border-violet/30 shadow-[0_0_80px_rgba(91,108,255,.25)]" />
          <div className="absolute inset-20 rounded-full bg-white blur-2xl dark:bg-white/10" />
        </div>
        <div className="grid gap-5">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <div key={reason.title} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-electric/10 text-electric"><Icon className="h-5 w-5" /></span>
                <div>
                  <h3 className="font-display text-xl font-black">{reason.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{reason.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
