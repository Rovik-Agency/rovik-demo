import { FormEvent, useEffect, useState } from 'react';
import { Lock, MessageSquare, FileText, CheckCircle2, FolderKanban, LogOut } from 'lucide-react';
import { SEO } from '@/components/ui/SEO';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { fetchRecords, supabase } from '@/lib/supabase';

type PortalProject = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  progress: number;
  due_date?: string | null;
};

export function ClientPortal() {
  const [signedIn, setSignedIn] = useState(!supabase);
  const [projects, setProjects] = useState<PortalProject[]>([]);
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
    if (!signedIn || !supabase) return;
    setLoading(true);
    fetchRecords<PortalProject>('client_projects').then(setProjects).catch(() => setProjects([])).finally(() => setLoading(false));
  }, [signedIn]);

  if (!signedIn) return (
    <>
      <SEO title="ROVIK Client Portal" description="Secure client portal for ROVIK projects, milestones, tasks, files, invoices and messages." path="/portal" noindex />
      <section className="section-pad">
        <div className="container max-w-md">
          <form onSubmit={login} className="rounded-[2rem] border border-soft bg-card p-7 shadow-glass">
            <Lock className="mb-4 text-electric" />
            <h1 className="font-display text-4xl font-black">Client Portal</h1>
            <p className="mt-3 text-muted">Secure accounts connect clients to project progress, milestones, deliverables, invoices and messages.</p>
            <label className="mt-6 grid gap-2 text-sm font-bold">Email<input required type="email" name="email" className="rounded-2xl border border-soft bg-transparent p-3" /></label>
            <label className="mt-4 grid gap-2 text-sm font-bold">Password<input required type="password" name="password" className="rounded-2xl border border-soft bg-transparent p-3" /></label>
            <Button className="mt-6 w-full">Sign in</Button>
            <p className="mt-4 text-xs text-muted">Ask the ROVIK admin to assign your account to a project before login.</p>
          </form>
        </div>
      </section>
    </>
  );

  return (
    <>
      <SEO title="ROVIK Client Portal Dashboard" description="ROVIK client portal dashboard." path="/portal" noindex />
      <section className="section-pad">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="kicker">Client Portal</p>
              <h1 className="h2 mt-3">Project workspace</h1>
              <p className="mt-4 max-w-3xl text-muted">Track assigned projects, milestones, tasks, files, invoices and support in one private client account.</p>
            </div>
            {supabase ? <Button variant="secondary" onClick={signOut}><LogOut className="h-4 w-4" /> Sign out</Button> : null}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <PortalCard icon={<CheckCircle2 />} title="Milestones" body="Track project phases, progress and next approvals." />
            <PortalCard icon={<FileText />} title="Files & deliverables" body="Access uploaded assets, handoff files and invoices." />
            <PortalCard icon={<MessageSquare />} title="Messages & support" body="Keep project communication and support requests organized." />
          </div>

          <div className="mt-8 rounded-[2rem] border border-soft bg-card p-6">
            <div className="flex items-center gap-3"><FolderKanban className="h-6 w-6 text-electric" /><h2 className="font-display text-2xl font-black">Assigned projects</h2></div>
            {loading ? <div className="mt-6 h-36 rounded-3xl skeleton" /> : projects.length ? (
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {projects.map((project) => (
                  <article key={project.id} className="rounded-3xl border border-soft p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div><h3 className="font-display text-xl font-black">{project.title}</h3><p className="mt-2 text-sm leading-6 text-muted">{project.description || 'No project description added yet.'}</p></div>
                      <span className="rounded-full bg-electric/10 px-3 py-1 text-xs font-bold text-electric">{project.status}</span>
                    </div>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10"><div className="h-full rounded-full bg-electric" style={{ width: `${project.progress || 0}%` }} /></div>
                    <div className="mt-3 flex justify-between text-xs font-bold text-muted"><span>{project.progress || 0}% complete</span><span>{project.due_date ? `Due ${project.due_date}` : 'No due date'}</span></div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-6"><EmptyState title="No assigned projects yet" description="When the admin creates a client_projects row with your client_id, it will appear here automatically." /></div>
            )}
          </div>

          <div className="mt-8 rounded-[2rem] border border-soft bg-card p-6">
            <h2 className="font-display text-2xl font-black">Demo workflow</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-4">{['Discovery', 'Design', 'Build', 'Launch'].map((stage, i) => <div className="rounded-3xl border border-soft p-5" key={stage}><p className="text-sm font-black text-electric">0{i + 1}</p><h3 className="mt-3 font-bold">{stage}</h3><p className="mt-2 text-sm text-muted">Portal tables are ready in Supabase for live client projects.</p></div>)}</div>
          </div>
        </div>
      </section>
    </>
  );
}

function PortalCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) { return <div className="rounded-[2rem] border border-soft bg-card p-6"> <div className="mb-4 text-electric">{icon}</div><h2 className="font-display text-2xl font-black">{title}</h2><p className="mt-3 text-muted">{body}</p></div>; }
