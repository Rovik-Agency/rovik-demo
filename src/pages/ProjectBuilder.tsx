import { FormEvent, useMemo, useState } from 'react';
import { Download, Send } from 'lucide-react';
import { SEO } from '@/components/ui/SEO';
import { Button, AnchorButton } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { services } from '@/data/services';
import { generateBrief, briefToMarkdown } from '@/lib/brief';
import { downloadText } from '@/lib/download';
import { insertRecord } from '@/lib/supabase';
import { notifyAdmin } from '@/lib/notify';
import { env } from '@/lib/env';
import type { ProjectBuilderForm } from '@/types';

const featureOptions = ['Authentication', 'Admin dashboard', 'Payments', 'CMS', 'AI assistant', 'Booking', 'Analytics', 'E-commerce', 'Client portal', 'Automation'];
const initial: ProjectBuilderForm = { service: 'Web & Web Apps', businessType: '', features: [], designLevel: 'Advanced', timeline: 'Standard', budget: '', name: '', email: '', company: '', message: '' };

export function ProjectBuilder() {
  const [form, setForm] = useState<ProjectBuilderForm>(initial);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const brief = useMemo(() => generateBrief(form), [form]);

  function toggleFeature(feature: string) {
    setForm((prev) => ({ ...prev, features: prev.features.includes(feature) ? prev.features.filter((f) => f !== feature) : [...prev.features, feature] }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSent(false);

    const projectPayload = {
      name: form.name,
      email: form.email,
      company: form.company || null,
      service: form.service,
      business_type: form.businessType,
      features: form.features,
      design_level: form.designLevel,
      timeline: form.timeline,
      budget: form.budget,
      message: form.message || null,
      brief,
      status: 'New'
    };

    const leadPayload = {
      name: form.name,
      email: form.email,
      company: form.company || null,
      service: form.service,
      budget: form.budget,
      message: form.message || `Project Builder brief: ${brief.title}`,
      source: 'project-builder',
      status: 'New',
      brief
    };

    try {
      const projectResult = await insertRecord('project_builder_submissions', projectPayload);
      if (projectResult.error) throw projectResult.error;
      const leadResult = await insertRecord('leads', leadPayload);
      if (leadResult.error) throw leadResult.error;
      await notifyAdmin('New ROVIK project brief', { type: 'project-builder', form, brief });
      setSent(true);
      setForm(initial);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit the project brief. Check Supabase migration/RLS.');
    } finally {
      setLoading(false);
    }
  }

  return <><SEO title="Build Your Project — ROVIK Project Builder" description="Create a structured ROVIK project brief with recommended services, approximate scope, timeline and budget range." path="/project-builder" /><section className="section-pad"><div className="container"><SectionHeader eyebrow="Project Builder" title="Turn an idea into a clean project brief">Answer a few questions and generate a practical starting scope for ROVIK.</SectionHeader><div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]"><form onSubmit={submit} className="rounded-[2rem] border border-soft bg-card p-6"><div className="grid gap-5"><label className="grid gap-2 text-sm font-bold">Service<select value={form.service} onChange={(e)=>setForm({...form, service:e.target.value})} className="rounded-2xl border border-soft bg-card p-3">{services.map((s)=><option key={s.slug}>{s.title}</option>)}</select></label><label className="grid gap-2 text-sm font-bold">Business Type<input required value={form.businessType} onChange={(e)=>setForm({...form,businessType:e.target.value})} placeholder="Fashion brand, travel agency, SaaS startup…" className="rounded-2xl border border-soft bg-transparent p-3"/></label><div><p className="mb-3 text-sm font-bold">Required Features</p><div className="flex flex-wrap gap-2">{featureOptions.map((feature) => <button type="button" key={feature} onClick={()=>toggleFeature(feature)} className={`rounded-full border px-4 py-2 text-sm font-bold ${form.features.includes(feature) ? 'border-electric bg-electric text-white' : 'border-soft'}`}>{feature}</button>)}</div></div><div className="grid gap-4 md:grid-cols-3"><label className="grid gap-2 text-sm font-bold">Design Level<select value={form.designLevel} onChange={(e)=>setForm({...form,designLevel:e.target.value})} className="rounded-2xl border border-soft bg-card p-3"><option>Essential</option><option>Advanced</option><option>Premium custom</option></select></label><label className="grid gap-2 text-sm font-bold">Timeline<select value={form.timeline} onChange={(e)=>setForm({...form,timeline:e.target.value})} className="rounded-2xl border border-soft bg-card p-3"><option>Urgent</option><option>Standard</option><option>Flexible</option></select></label><label className="grid gap-2 text-sm font-bold">Budget<input required value={form.budget} onChange={(e)=>setForm({...form,budget:e.target.value})} placeholder="e.g. £999+" className="rounded-2xl border border-soft bg-transparent p-3"/></label></div><div className="grid gap-4 md:grid-cols-2"><label className="grid gap-2 text-sm font-bold">Name<input required value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="rounded-2xl border border-soft bg-transparent p-3"/></label><label className="grid gap-2 text-sm font-bold">Email<input required type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} className="rounded-2xl border border-soft bg-transparent p-3"/></label></div><label className="grid gap-2 text-sm font-bold">Company<input value={form.company} onChange={(e)=>setForm({...form,company:e.target.value})} className="rounded-2xl border border-soft bg-transparent p-3"/></label><label className="grid gap-2 text-sm font-bold">Extra notes<textarea value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})} rows={4} className="rounded-2xl border border-soft bg-transparent p-3"/></label><div className="flex flex-wrap gap-3"><Button type="submit" disabled={loading}><Send className="h-4 w-4"/> {loading ? 'Sending…' : 'Send Brief'}</Button><AnchorButton href={env.bookingUrl} target={env.bookingUrl.startsWith('http') ? '_blank' : undefined} rel="noreferrer" variant="secondary">Book Call</AnchorButton><Button type="button" variant="secondary" onClick={()=>downloadText('rovik-project-brief.md', briefToMarkdown(brief, form), 'text/markdown')}><Download className="h-4 w-4"/> Download Brief</Button></div>{sent ? <p className="text-sm font-bold text-electric">Brief saved to CRM submissions.</p> : null}{error ? <p className="text-sm font-bold text-red-500">{error}</p> : null}</div></form><aside className="rounded-[2rem] border border-soft bg-ink p-7 text-white shadow-glow"><p className="kicker">Generated brief</p><h2 className="mt-3 font-display text-3xl font-black">{brief.title}</h2><div className="mt-6 space-y-5 text-sm text-white/70"><div><h3 className="font-bold text-white">Recommended services</h3><p>{brief.recommendedServices.join(', ')}</p></div><div><h3 className="font-bold text-white">Approx. timeline</h3><p>{brief.timelineRange}</p></div><div><h3 className="font-bold text-white">Configurable range</h3><p>{brief.priceRange}</p></div><div><h3 className="font-bold text-white">Scope</h3><ul className="mt-2 list-disc pl-5">{brief.scope.map((s)=><li key={s}>{s}</li>)}</ul></div><div><h3 className="font-bold text-white">Next steps</h3><ul className="mt-2 list-disc pl-5">{brief.nextSteps.map((s)=><li key={s}>{s}</li>)}</ul></div></div></aside></div></div></section></>;
}
