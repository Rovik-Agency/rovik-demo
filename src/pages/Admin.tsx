import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Download, Lock, Search, ShieldCheck, Users } from 'lucide-react';
import { SEO } from '@/components/ui/SEO';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { fetchRecords, supabase } from '@/lib/supabase';
import { exportRowsToXlsx } from '@/lib/download';
import { projects } from '@/data/projects';
import { services } from '@/data/services';
import { pricingPlans } from '@/data/pricing';

type Row = Record<string, any>;
const tabs = [
  'Leads', 'Havali', 'Project Builder', 'Clients', 'Client Projects', 'Milestones', 'Tasks', 'Deliverables', 'Invoices', 'Support',
  'Projects', 'Services', 'Pricing', 'Testimonials', 'Insights', 'FAQs', 'Team', 'Homepage', 'Media', 'Newsletter', 'Contact', 'SEO', 'Settings'
];

const tableMap: Record<string, string> = {
  Leads: 'leads',
  Havali: 'havali_conversations',
  'Project Builder': 'project_builder_submissions',
  Clients: 'profiles',
  'Client Projects': 'client_projects',
  Milestones: 'milestones',
  Tasks: 'tasks',
  Deliverables: 'deliverables',
  Invoices: 'invoices',
  Support: 'support_tickets',
  Testimonials: 'testimonials',
  Insights: 'insights',
  FAQs: 'faqs',
  Team: 'team_members',
  Homepage: 'homepage_content',
  Media: 'media_assets',
  Newsletter: 'newsletter_subscribers',
  Contact: 'contact_submissions',
  SEO: 'seo_metadata',
  Settings: 'site_settings'
};

export function Admin() {
  const [signedIn, setSignedIn] = useState(!supabase);
  const [tab, setTab] = useState('Leads');
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return setSignedIn(true);
    const form = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({ email: String(form.get('email')), password: String(form.get('password')) });
    if (!error) setSignedIn(true); else alert(error.message);
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    setSignedIn(false);
  }

  useEffect(() => { if (!supabase) return; supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session))); }, []);
  useEffect(() => {
    if (!signedIn) return;
    const table = tableMap[tab];
    if (!table) { setRows([]); return; }
    setLoading(true);
    fetchRecords<Row>(table).then(setRows).catch(() => setRows([])).finally(() => setLoading(false));
  }, [tab, signedIn]);

  const filtered = useMemo(() => rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase())), [rows, query]);

  if (!signedIn) return (
    <>
      <SEO title="ROVIK Admin Login" description="Secure ROVIK admin login." path="/admin" noindex />
      <section className="section-pad">
        <div className="container max-w-md">
          <form onSubmit={login} className="rounded-[2rem] border border-soft bg-card p-7 shadow-glass">
            <Lock className="mb-4 h-8 w-8 text-electric" />
            <h1 className="font-display text-4xl font-black">Admin login</h1>
            <p className="mt-3 text-sm leading-6 text-muted">Use a Supabase Auth user whose profile role is owner, admin or editor.</p>
            <label className="mt-6 grid gap-2 text-sm font-bold">Email<input required name="email" type="email" className="rounded-2xl border border-soft bg-transparent p-3" /></label>
            <label className="mt-4 grid gap-2 text-sm font-bold">Password<input required name="password" type="password" className="rounded-2xl border border-soft bg-transparent p-3" /></label>
            <Button className="mt-6 w-full">Sign in</Button>
            <p className="mt-4 text-xs text-muted">Local demo mode opens automatically when Supabase env vars are empty. Production uses Supabase Auth + RLS.</p>
          </form>
        </div>
      </section>
    </>
  );

  return (
    <>
      <SEO title="ROVIK Admin Dashboard" description="ROVIK admin CMS and CRM dashboard." path="/admin" noindex />
      <section className="section-pad">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="kicker">Admin / CMS</p>
              <h1 className="h2 mt-3">ROVIK control center</h1>
              <p className="mt-4 max-w-3xl text-muted">Manage leads, Havali conversations, client portal assignments, CMS content, SEO, media and settings.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => exportRowsToXlsx(`rovik-${tab.toLowerCase().replaceAll(' ', '-')}.xlsx`, filtered)}><Download className="h-4 w-4" /> Export XLSX</Button>
              {supabase ? <Button variant="ghost" onClick={signOut}>Sign out</Button> : null}
            </div>
          </div>

          <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
            {tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold ${tab === t ? 'border-electric bg-electric text-white' : 'border-soft bg-card'}`}>{t}</button>)}
          </div>

          {tab === 'Clients' || tab === 'Client Projects' ? <PortalAssignmentHelp /> : null}

          <div className="mt-6 rounded-[2rem] border border-soft bg-card p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="font-display text-2xl font-black">{tab}</h2>
              <label className="flex items-center gap-2 rounded-full border border-soft px-4 py-2">
                <Search className="h-4 w-4 text-muted" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search records" className="bg-transparent outline-none" />
              </label>
            </div>
            {['Projects', 'Services', 'Pricing'].includes(tab) ? <StaticAdmin tab={tab} /> : loading ? <div className="mt-6 h-40 rounded-3xl skeleton" /> : filtered.length ? <DataTable rows={filtered} /> : <div className="mt-6"><EmptyState title="No records yet" description="Records will appear here after users interact with forms, Havali, the Project Builder, or after you add portal data in Supabase." /></div>}
          </div>
        </div>
      </section>
    </>
  );
}

function PortalAssignmentHelp() {
  return (
    <div className="mt-6 grid gap-4 rounded-[2rem] border border-soft bg-card p-5 shadow-sm md:grid-cols-[.8fr_1.2fr]">
      <div>
        <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-electric/10 text-electric"><Users className="h-5 w-5" /></div>
        <h2 className="font-display text-2xl font-black">Client portal assignment</h2>
        <p className="mt-2 text-sm leading-6 text-muted">Create a client auth user, keep their profile role as client, then connect a project row to their profile id.</p>
      </div>
      <ol className="grid gap-3 text-sm leading-6 text-muted">
        <li><strong className="text-current">1.</strong> Supabase Dashboard → Authentication → Users → Invite/Create user.</li>
        <li><strong className="text-current">2.</strong> Profiles table → confirm the user has <code className="rounded bg-black/5 px-1 py-0.5 dark:bg-white/10">role = client</code>.</li>
        <li><strong className="text-current">3.</strong> Client Projects table → insert project with <code className="rounded bg-black/5 px-1 py-0.5 dark:bg-white/10">client_id = profiles.id</code>.</li>
        <li><strong className="text-current">4.</strong> Add milestones, tasks, deliverables, invoices and messages against that project id.</li>
        <li><strong className="text-current">5.</strong> Client signs in at <code className="rounded bg-black/5 px-1 py-0.5 dark:bg-white/10">/portal</code> using their email/password.</li>
      </ol>
    </div>
  );
}

function DataTable({ rows }: { rows: Row[] }) {
  const columns = Object.keys(rows[0]).slice(0, 9);
  return (
    <div className="mt-6 overflow-auto">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="text-muted"><tr>{columns.map((key) => <th key={key} className="border-b border-soft p-3">{key}</th>)}</tr></thead>
        <tbody>{rows.map((row) => <tr key={row.id || JSON.stringify(row).slice(0, 20)}>{columns.map((key) => <td className="border-b border-soft p-3 align-top" key={key}>{typeof row[key] === 'object' ? JSON.stringify(row[key]).slice(0, 100) : String(row[key] ?? '').slice(0, 100)}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function StaticAdmin({ tab }: { tab: string }) {
  const data = tab === 'Projects' ? projects : tab === 'Services' ? services : pricingPlans;
  return <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.map((item: any) => <div key={item.slug || item.name} className="rounded-3xl border border-soft p-5"><ShieldCheck className="mb-3 h-5 w-5 text-electric" /><h3 className="font-bold">{item.title || item.name}</h3><p className="mt-2 text-sm text-muted">{item.summary}</p><p className="mt-4 text-xs font-bold text-electric">CMS table ready in Supabase migration</p></div>)}</div>;
}
