import { ArrowRight, BrainCircuit, Database, Route, ShieldCheck } from 'lucide-react';
import { SEO } from '@/components/ui/SEO';
import { HavaliChat } from '@/components/havali/HavaliChat';
import { LinkButton } from '@/components/ui/Button';
import { HavaliMark } from '@/components/havali/HavaliMark';

const pillars = [
  {
    icon: Database,
    title: 'Controlled knowledge base',
    description: 'ROVIK services, projects, pricing, FAQs and platform content become Havali’s owned source of truth.'
  },
  {
    icon: Route,
    title: 'Intent + workflow routing',
    description: 'Havali routes requests into discovery, service guidance, pricing, portfolio and lead capture workflows.'
  },
  {
    icon: BrainCircuit,
    title: 'Retrieval + provider abstraction',
    description: 'Semantic retrieval works today, while local or self-hosted models can be plugged in later without a rebuild.'
  },
  {
    icon: ShieldCheck,
    title: 'Safe, practical handoff',
    description: 'When a conversation becomes an opportunity, Havali turns it into structured CRM data and next steps.'
  }
];

export function HavaliPage() {
  return (
    <>
      <SEO title="Havali AI — ROVIK Hybrid Assistant" description="Talk with Havali AI about ROVIK services, projects, pricing and project discovery using a hybrid AI architecture." path="/havali" />
      <section className="section-pad pb-14">
        <div className="container grid gap-8 xl:grid-cols-[0.92fr_1.08fr] xl:items-start">
          <div className="space-y-6 xl:sticky xl:top-28">
            <div className="overflow-hidden rounded-[2rem] border border-soft bg-card p-6 shadow-glass sm:p-8">
              <div className="mb-6 flex items-start gap-4">
                <HavaliMark className="mt-1 h-14 w-14 sm:h-16 sm:w-16" size={64} />
                <div className="min-w-0">
                  <span className="kicker">Havali AI</span>
                  <h1 className="mt-2 font-display text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl">
                    A hybrid assistant for <span className="gradient-text">real project discovery.</span>
                  </h1>
                </div>
              </div>
              <p className="max-w-2xl text-base leading-8 text-muted">
                Havali helps visitors understand ROVIK, explore services, review portfolio work, discuss requirements and shape ideas into structured leads — without being permanently dependent on one external AI API.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <LinkButton to="/project-builder" variant="dark">Build your project <ArrowRight className="h-4 w-4" /></LinkButton>
                <LinkButton to="/contact" variant="secondary">Talk to ROVIK</LinkButton>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {pillars.map(({ icon: Icon, title, description }) => (
                <article key={title} className="min-h-[210px] rounded-[1.75rem] border border-soft bg-card p-5 shadow-sm">
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-electric/10 text-electric">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="font-display text-lg font-black leading-tight tracking-tight">{title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
                </article>
              ))}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-ink p-6 text-white shadow-glass sm:p-7">
              <p className="kicker !text-cyan mb-3">How Havali works</p>
              <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">Designed for guidance, not gimmicks.</h2>
              <p className="mt-4 text-sm leading-7 text-white/75">Havali combines controlled site knowledge, deterministic workflows, retrieval, session context and lead qualification.</p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-white/75">
                <li>• Recommends the right service path based on your business goals.</li>
                <li>• Explains ROVIK projects and capabilities without inventing fake results.</li>
                <li>• Converts conversations into structured discovery notes and leads.</li>
                <li>• Supports future local or self-hosted model integrations.</li>
              </ul>
            </div>
          </div>
          <div className="h-[760px] max-h-[calc(100dvh-8rem)] min-h-[620px] xl:sticky xl:top-28">
            <HavaliChat />
          </div>
        </div>
      </section>
    </>
  );
}
