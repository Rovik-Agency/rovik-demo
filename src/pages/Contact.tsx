import { FormEvent, useState } from 'react';
import { Mail, MapPin, Send } from 'lucide-react';
import { SEO } from '@/components/ui/SEO';
import { Button, AnchorButton } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { insertRecord } from '@/lib/supabase';
import { notifyAdmin } from '@/lib/notify';
import { env } from '@/lib/env';

export function Contact() {
  const [state, setState] = useState<'idle'|'loading'|'sent'|'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('loading');
    setError('');
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const website = String(form.get('website') || '');
    if (website) {
      setState('sent');
      return;
    }

    const payload = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      company: String(form.get('company') || '') || null,
      service: String(form.get('service') || ''),
      message: String(form.get('message') || ''),
      status: 'New'
    };

    try {
      const contactResult = await insertRecord('contact_submissions', payload);
      if (contactResult.error) throw contactResult.error;
      const leadResult = await insertRecord('leads', {
        name: payload.name,
        email: payload.email,
        company: payload.company,
        service: payload.service,
        message: payload.message,
        source: 'contact',
        status: 'New'
      });
      if (leadResult.error) throw leadResult.error;
      await notifyAdmin('New ROVIK contact enquiry', { type: 'contact', payload });
      setState('sent');
      formEl.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setState('error');
    }
  }

  return <><SEO title="Contact ROVIK" description="Contact ROVIK to start a web, SaaS, AI, automation, e-commerce, cloud or support project." path="/contact" /><section className="section-pad"><div className="container grid gap-10 lg:grid-cols-[.9fr_1.1fr]"><div><SectionHeader eyebrow="Contact" title="Tell ROVIK what you want to build">Use the form for serious enquiries. For a stronger start, generate a structured brief first.</SectionHeader><div className="grid gap-4"><div className="rounded-3xl border border-soft bg-card p-6"><Mail className="mb-3 h-5 w-5 text-electric"/><h3 className="font-bold">Email architecture ready</h3><p className="mt-2 text-sm text-muted">Connect Resend in Supabase Edge Functions to notify admin and users.</p></div><div className="rounded-3xl border border-soft bg-card p-6"><MapPin className="mb-3 h-5 w-5 text-electric"/><h3 className="font-bold">Remote-first delivery</h3><p className="mt-2 text-sm text-muted">Built to work with businesses globally.</p></div><AnchorButton href={env.bookingUrl} target={env.bookingUrl.startsWith('http') ? '_blank' : undefined} rel="noreferrer" variant="secondary">Book call architecture</AnchorButton></div></div><form onSubmit={onSubmit} className="rounded-[2rem] border border-soft bg-card p-6 shadow-glass"><input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off"/><div className="grid gap-4 md:grid-cols-2"><label className="grid gap-2 text-sm font-bold">Name<input required name="name" className="rounded-2xl border border-soft bg-transparent p-3 outline-none focus:border-electric"/></label><label className="grid gap-2 text-sm font-bold">Email<input required type="email" name="email" className="rounded-2xl border border-soft bg-transparent p-3 outline-none focus:border-electric"/></label><label className="grid gap-2 text-sm font-bold">Company<input name="company" className="rounded-2xl border border-soft bg-transparent p-3 outline-none focus:border-electric"/></label><label className="grid gap-2 text-sm font-bold">Service<select name="service" className="rounded-2xl border border-soft bg-card p-3 outline-none focus:border-electric"><option>Web & Web Apps</option><option>SaaS</option><option>AI & Automation</option><option>E-commerce</option><option>Support</option></select></label></div><label className="mt-4 grid gap-2 text-sm font-bold">Message<textarea required name="message" rows={7} className="rounded-2xl border border-soft bg-transparent p-3 outline-none focus:border-electric" placeholder="Tell us about the project, timeline, budget and must-have features."/></label><div className="mt-5 flex flex-wrap items-center gap-3"><Button disabled={state==='loading'}>{state==='loading' ? 'Sending…' : <><Send className="h-4 w-4"/> Send enquiry</>}</Button>{state==='sent' ? <p className="text-sm font-bold text-electric">Submitted. Check admin CRM.</p> : null}{state==='error' ? <p className="text-sm font-bold text-red-500">{error || 'Something went wrong.'}</p> : null}</div></form></div></section></>;
}
