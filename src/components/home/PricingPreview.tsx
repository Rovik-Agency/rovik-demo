import { Check } from 'lucide-react';
import { pricingPlans } from '@/data/pricing';
import { LinkButton } from '@/components/ui/Button';

export function PricingPreview() {
  return (
    <section className="section-pad bg-white dark:bg-ink">
      <div className="container">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="kicker">Clear pricing</p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-black leading-[1.03] tracking-tight sm:text-6xl">Flexible Plans for Every Stage</h2>
            <p className="mt-4 max-w-md text-muted">Transparent starting points. No hidden fees. Final scope is confirmed after discovery.</p>
          </div>
          <div className="inline-flex w-max rounded-full border border-soft bg-card p-1 text-xs font-black"><span className="rounded-full bg-ink px-5 py-3 text-white dark:bg-white dark:text-ink">Project Based</span><LinkButton to="/pricing" variant="ghost" className="px-5 py-3">Monthly</LinkButton></div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {pricingPlans.map((plan) => (
            <div key={plan.name} className="flex rounded-[1.6rem] border border-soft bg-card p-6 shadow-[0_18px_60px_rgba(17,24,39,.04)]">
              <div className="flex w-full flex-col">
                <h3 className="font-display text-xl font-black">{plan.name}</h3>
                <div className="mt-5 flex items-end gap-1"><span className="font-display text-4xl font-black tracking-tight">{plan.price}</span><span className="pb-1 text-sm text-muted">{plan.cadence}</span></div>
                <p className="mt-4 min-h-[54px] text-sm leading-6 text-muted">{plan.summary}</p>
                <ul className="mt-6 space-y-3 text-sm">
                  {plan.features.slice(0,4).map((f) => <li className="flex gap-2" key={f}><Check className="mt-0.5 h-4 w-4 shrink-0" /> {f}</li>)}
                </ul>
                <LinkButton to="/project-builder" variant="primary" className="mt-7 w-full">{plan.cta}</LinkButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
