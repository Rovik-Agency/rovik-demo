import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertCircle,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Database,
  Download,
  Edit3,
  Eye,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Lock,
  MessageSquare,
  Plus,
  RefreshCcw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users
} from 'lucide-react';
import { SEO } from '@/components/ui/SEO';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { deleteRecord, fetchRecords, getCurrentProfile, insertRecord, seedLocalTable, supabase, updateRecord } from '@/lib/supabase';
import { exportRowsToXlsx } from '@/lib/download';
import { projects as projectSeed } from '@/data/projects';
import { services as serviceSeed } from '@/data/services';
import { pricingPlans } from '@/data/pricing';

type Row = Record<string, any>;
type FieldType = 'text' | 'email' | 'textarea' | 'select' | 'number' | 'date' | 'url' | 'array' | 'json' | 'boolean';
type Field = { name: string; label: string; type?: FieldType; required?: boolean; options?: string[]; placeholder?: string; help?: string };
type Module = {
  key: string;
  title: string;
  table: string;
  group: 'Dashboard' | 'CRM' | 'Portal' | 'CMS' | 'System';
  icon: LucideIcon;
  description: string;
  fields: Field[];
  idColumn?: string;
  statusField?: string;
  statusOptions?: string[];
  seed?: Row[];
  readOnlyCreate?: boolean;
  note?: string;
};

const leadStatus = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];
const projectStatus = ['planning', 'active', 'review', 'paused', 'complete'];
const taskStatus = ['todo', 'in_progress', 'blocked', 'done'];
const invoiceStatus = ['draft', 'sent', 'paid', 'overdue', 'void'];
const ticketStatus = ['open', 'waiting', 'resolved', 'closed'];
const roles = ['owner', 'admin', 'editor', 'client'];

const baseSeeds = {
  leads: [
    { name: 'Demo Lead', email: 'client@example.com', company: 'Example Co', source: 'website', service: 'Web & Web Apps', budget: '£2k–£5k', message: 'I need a premium business website.', status: 'New' }
  ],
  contact_submissions: [
    { name: 'Website Enquiry', email: 'hello@example.com', company: 'Demo Brand', service: 'SaaS Platforms', message: 'Can ROVIK build an MVP?', status: 'New' }
  ],
  project_builder_submissions: [
    { name: 'Project Builder Demo', email: 'founder@example.com', service: 'SaaS Platforms', business_type: 'Startup', features: ['Dashboard', 'Auth', 'Payments'], design_level: 'Premium', timeline: '6–10 weeks', budget: '£5k+', brief: { scope: 'MVP SaaS platform' }, status: 'New' }
  ],
  havali_conversations: [
    { session_id: 'demo-session', last_intent: 'service_recommendation', last_message: 'Which ROVIK service fits my idea?', extracted_context: ['SaaS', 'automation'], qualified: false }
  ],
  profiles: [
    { id: '00000000-0000-0000-0000-000000000001', email: 'client@example.com', full_name: 'Demo Client', role: 'client' }
  ],
  client_projects: [
    { client_id: '00000000-0000-0000-0000-000000000001', title: 'Demo Client Portal Project', description: 'A client portal assignment preview.', status: 'active', progress: 35 }
  ],
  milestones: [{ project_id: 'local-project', title: 'Discovery & Scope', status: 'pending', sort_order: 1 }],
  tasks: [{ project_id: 'local-project', title: 'Confirm homepage direction', status: 'todo' }],
  deliverables: [{ project_id: 'local-project', title: 'Brand direction board', status: 'draft' }],
  invoices: [{ project_id: 'local-project', invoice_number: 'ROVIK-0001', amount: 500, currency: 'GBP', status: 'draft' }],
  support_tickets: [{ subject: 'Need project update', message: 'Can you share progress?', priority: 'normal', status: 'open' }]
};

const modules: Module[] = [
  {
    key: 'leads', title: 'Leads', table: 'leads', group: 'CRM', icon: BriefcaseBusiness,
    description: 'Manage enquiries, pipeline status, notes, follow-up dates and service interest.', statusField: 'status', statusOptions: leadStatus, seed: baseSeeds.leads,
    fields: [
      { name: 'name', label: 'Name', required: true }, { name: 'email', label: 'Email', type: 'email', required: true }, { name: 'company', label: 'Company' }, { name: 'phone', label: 'Phone' },
      { name: 'source', label: 'Source', required: true, placeholder: 'website / Havali / referral' }, { name: 'service', label: 'Service' }, { name: 'budget', label: 'Budget' },
      { name: 'status', label: 'Status', type: 'select', options: leadStatus }, { name: 'follow_up_at', label: 'Follow-up date', type: 'date' }, { name: 'message', label: 'Message', type: 'textarea' }, { name: 'notes', label: 'Internal notes', type: 'textarea' }
    ]
  },
  {
    key: 'havali', title: 'Havali Leads', table: 'havali_conversations', group: 'CRM', icon: Sparkles,
    description: 'Review AI sessions, qualified leads, last intent and captured discovery context.', statusField: 'qualified', statusOptions: ['true', 'false'], seed: baseSeeds.havali_conversations,
    fields: [
      { name: 'session_id', label: 'Session ID', required: true }, { name: 'lead_id', label: 'Lead ID' }, { name: 'last_intent', label: 'Last intent' },
      { name: 'last_message', label: 'Last message', type: 'textarea' }, { name: 'extracted_context', label: 'Context tags', type: 'array' }, { name: 'qualified', label: 'Qualified', type: 'boolean' }
    ]
  },
  {
    key: 'project-builder', title: 'Project Builder', table: 'project_builder_submissions', group: 'CRM', icon: LayoutDashboard,
    description: 'Project briefs generated by the interactive builder.', statusField: 'status', statusOptions: leadStatus, seed: baseSeeds.project_builder_submissions,
    fields: [
      { name: 'name', label: 'Name', required: true }, { name: 'email', label: 'Email', type: 'email', required: true }, { name: 'company', label: 'Company' },
      { name: 'service', label: 'Service', required: true }, { name: 'business_type', label: 'Business type' }, { name: 'features', label: 'Features', type: 'array' },
      { name: 'design_level', label: 'Design level' }, { name: 'timeline', label: 'Timeline' }, { name: 'budget', label: 'Budget' }, { name: 'message', label: 'Message', type: 'textarea' },
      { name: 'brief', label: 'Brief JSON', type: 'json', required: true }, { name: 'status', label: 'Status', type: 'select', options: leadStatus }
    ]
  },
  {
    key: 'contact', title: 'Contact Forms', table: 'contact_submissions', group: 'CRM', icon: MessageSquare,
    description: 'Messages from smart contact forms.', statusField: 'status', statusOptions: leadStatus, seed: baseSeeds.contact_submissions,
    fields: [
      { name: 'name', label: 'Name', required: true }, { name: 'email', label: 'Email', type: 'email', required: true }, { name: 'company', label: 'Company' },
      { name: 'service', label: 'Service' }, { name: 'message', label: 'Message', type: 'textarea', required: true }, { name: 'status', label: 'Status', type: 'select', options: leadStatus }
    ]
  },
  {
    key: 'newsletter', title: 'Newsletter', table: 'newsletter_subscribers', group: 'CRM', icon: Users,
    description: 'Newsletter subscribers and consent status.', statusField: 'confirmed', statusOptions: ['true', 'false'],
    fields: [{ name: 'email', label: 'Email', type: 'email', required: true }, { name: 'source', label: 'Source' }, { name: 'confirmed', label: 'Confirmed', type: 'boolean' }]
  },
  {
    key: 'clients', title: 'Clients', table: 'profiles', group: 'Portal', icon: Users,
    description: 'Client and admin profiles. In production, create Auth users first, then assign profile role.', statusField: 'role', statusOptions: roles, seed: baseSeeds.profiles,
    note: 'Production security note: Supabase Auth users must exist before profile rows can be linked. Create/invite the user in Supabase Auth, then set role = client/admin here.',
    fields: [{ name: 'id', label: 'Auth user ID', required: true }, { name: 'email', label: 'Email', type: 'email' }, { name: 'full_name', label: 'Full name' }, { name: 'role', label: 'Role', type: 'select', options: roles }, { name: 'avatar_url', label: 'Avatar URL', type: 'url' }]
  },
  {
    key: 'client-projects', title: 'Client Projects', table: 'client_projects', group: 'Portal', icon: FolderKanban,
    description: 'Assign projects to clients and control portal progress.', statusField: 'status', statusOptions: projectStatus, seed: baseSeeds.client_projects,
    fields: [{ name: 'client_id', label: 'Client profile ID' }, { name: 'lead_id', label: 'Lead ID' }, { name: 'title', label: 'Title', required: true }, { name: 'description', label: 'Description', type: 'textarea' }, { name: 'status', label: 'Status', type: 'select', options: projectStatus }, { name: 'progress', label: 'Progress %', type: 'number' }, { name: 'start_date', label: 'Start date', type: 'date' }, { name: 'due_date', label: 'Due date', type: 'date' }]
  },
  {
    key: 'milestones', title: 'Milestones', table: 'milestones', group: 'Portal', icon: CheckCircle2,
    description: 'Project phases and approvals shown in the client portal.', statusField: 'status', statusOptions: ['pending', 'in_progress', 'approved', 'complete'], seed: baseSeeds.milestones,
    fields: [{ name: 'project_id', label: 'Project ID', required: true }, { name: 'title', label: 'Title', required: true }, { name: 'status', label: 'Status', type: 'select', options: ['pending', 'in_progress', 'approved', 'complete'] }, { name: 'due_date', label: 'Due date', type: 'date' }, { name: 'sort_order', label: 'Sort order', type: 'number' }]
  },
  {
    key: 'tasks', title: 'Tasks', table: 'tasks', group: 'Portal', icon: CheckCircle2,
    description: 'Internal or client-visible project tasks.', statusField: 'status', statusOptions: taskStatus, seed: baseSeeds.tasks,
    fields: [{ name: 'project_id', label: 'Project ID', required: true }, { name: 'milestone_id', label: 'Milestone ID' }, { name: 'title', label: 'Title', required: true }, { name: 'status', label: 'Status', type: 'select', options: taskStatus }, { name: 'assignee_id', label: 'Assignee ID' }, { name: 'due_date', label: 'Due date', type: 'date' }]
  },
  {
    key: 'deliverables', title: 'Deliverables', table: 'deliverables', group: 'Portal', icon: FileText,
    description: 'Files, handoffs and deliverable links.', statusField: 'status', statusOptions: ['draft', 'sent', 'approved'], seed: baseSeeds.deliverables,
    fields: [{ name: 'project_id', label: 'Project ID', required: true }, { name: 'title', label: 'Title', required: true }, { name: 'file_url', label: 'File URL', type: 'url' }, { name: 'status', label: 'Status', type: 'select', options: ['draft', 'sent', 'approved'] }]
  },
  {
    key: 'invoices', title: 'Invoices', table: 'invoices', group: 'Portal', icon: FileText,
    description: 'Client invoices and payment states.', statusField: 'status', statusOptions: invoiceStatus, seed: baseSeeds.invoices,
    fields: [{ name: 'project_id', label: 'Project ID', required: true }, { name: 'invoice_number', label: 'Invoice number', required: true }, { name: 'amount', label: 'Amount', type: 'number', required: true }, { name: 'currency', label: 'Currency' }, { name: 'status', label: 'Status', type: 'select', options: invoiceStatus }, { name: 'due_date', label: 'Due date', type: 'date' }, { name: 'file_url', label: 'File URL', type: 'url' }]
  },
  {
    key: 'support', title: 'Support', table: 'support_tickets', group: 'Portal', icon: AlertCircle,
    description: 'Client support tickets and priorities.', statusField: 'status', statusOptions: ticketStatus, seed: baseSeeds.support_tickets,
    fields: [{ name: 'client_id', label: 'Client ID' }, { name: 'project_id', label: 'Project ID' }, { name: 'subject', label: 'Subject', required: true }, { name: 'message', label: 'Message', type: 'textarea', required: true }, { name: 'status', label: 'Status', type: 'select', options: ticketStatus }, { name: 'priority', label: 'Priority', type: 'select', options: ['low', 'normal', 'high', 'urgent'] }]
  },
  {
    key: 'projects', title: 'Projects / Case Studies', table: 'projects', group: 'CMS', icon: BriefcaseBusiness,
    description: 'Portfolio projects and detailed case-study content.', statusField: 'published', statusOptions: ['true', 'false'],
    seed: projectSeed.map((p, index) => ({ slug: p.slug, title: p.title, url: p.url, category: p.category, summary: p.summary, services: p.services, stack: p.stack, tags: p.tags, featured: p.featured, sort_order: index, case_study: { problem: p.problem, objective: p.objective, solution: p.solution, features: p.features, design: p.design, engineering: p.engineering, challenges: p.challenges, results: p.results }, published: true })),
    fields: [{ name: 'slug', label: 'Slug', required: true }, { name: 'title', label: 'Title', required: true }, { name: 'url', label: 'URL', type: 'url' }, { name: 'category', label: 'Category' }, { name: 'summary', label: 'Summary', type: 'textarea', required: true }, { name: 'services', label: 'Services', type: 'array' }, { name: 'stack', label: 'Tech stack', type: 'array' }, { name: 'tags', label: 'Tags', type: 'array' }, { name: 'featured', label: 'Featured', type: 'boolean' }, { name: 'published', label: 'Published', type: 'boolean' }, { name: 'case_study', label: 'Case study JSON', type: 'json' }]
  },
  {
    key: 'services', title: 'Services', table: 'services', group: 'CMS', icon: Settings,
    description: 'Service pages, capabilities, process and FAQs.', statusField: 'published', statusOptions: ['true', 'false'],
    seed: serviceSeed.map((s) => ({ slug: s.slug, title: s.title, summary: s.summary, content: { capabilities: s.capabilities, process: s.process, technologies: s.technologies }, published: true })),
    fields: [{ name: 'slug', label: 'Slug', required: true }, { name: 'title', label: 'Title', required: true }, { name: 'summary', label: 'Summary', type: 'textarea', required: true }, { name: 'content', label: 'Content JSON', type: 'json' }, { name: 'seo', label: 'SEO JSON', type: 'json' }, { name: 'published', label: 'Published', type: 'boolean' }]
  },
  {
    key: 'pricing', title: 'Pricing', table: 'pricing_plans', group: 'CMS', icon: FileText,
    description: 'Pricing plans and package features.', statusField: 'published', statusOptions: ['true', 'false'],
    seed: pricingPlans.map((p, index) => ({ name: p.name, price: p.price, cadence: p.cadence, summary: p.summary, features: p.features, sort_order: index, published: true })),
    fields: [{ name: 'name', label: 'Name', required: true }, { name: 'price', label: 'Price', required: true }, { name: 'cadence', label: 'Cadence' }, { name: 'summary', label: 'Summary', type: 'textarea' }, { name: 'features', label: 'Features', type: 'array' }, { name: 'sort_order', label: 'Sort order', type: 'number' }, { name: 'published', label: 'Published', type: 'boolean' }]
  },
  {
    key: 'testimonials', title: 'Testimonials', table: 'testimonials', group: 'CMS', icon: MessageSquare,
    description: 'Only publish verified testimonials; do not invent client claims.', statusField: 'published', statusOptions: ['true', 'false'],
    fields: [{ name: 'quote', label: 'Quote', type: 'textarea', required: true }, { name: 'person_name', label: 'Person name' }, { name: 'company', label: 'Company' }, { name: 'role', label: 'Role' }, { name: 'verified', label: 'Verified', type: 'boolean' }, { name: 'published', label: 'Published', type: 'boolean' }]
  },
  {
    key: 'insights', title: 'Insights', table: 'insights', group: 'CMS', icon: FileText,
    description: 'Blog articles, categories and SEO.', statusField: 'published', statusOptions: ['true', 'false'],
    fields: [{ name: 'slug', label: 'Slug', required: true }, { name: 'title', label: 'Title', required: true }, { name: 'excerpt', label: 'Excerpt', type: 'textarea', required: true }, { name: 'body', label: 'Body', type: 'textarea', required: true }, { name: 'category', label: 'Category' }, { name: 'seo', label: 'SEO JSON', type: 'json' }, { name: 'published', label: 'Published', type: 'boolean' }, { name: 'published_at', label: 'Published date', type: 'date' }]
  },
  {
    key: 'faqs', title: 'FAQs', table: 'faqs', group: 'CMS', icon: MessageSquare,
    description: 'FAQ content used across service pages and Havali knowledge.', statusField: 'published', statusOptions: ['true', 'false'],
    fields: [{ name: 'question', label: 'Question', required: true }, { name: 'answer', label: 'Answer', type: 'textarea', required: true }, { name: 'category', label: 'Category' }, { name: 'sort_order', label: 'Sort order', type: 'number' }, { name: 'published', label: 'Published', type: 'boolean' }]
  },
  {
    key: 'team', title: 'Team', table: 'team_members', group: 'CMS', icon: Users,
    description: 'Team profiles for About page.', statusField: 'published', statusOptions: ['true', 'false'],
    fields: [{ name: 'name', label: 'Name', required: true }, { name: 'role', label: 'Role' }, { name: 'bio', label: 'Bio', type: 'textarea' }, { name: 'avatar_url', label: 'Avatar URL', type: 'url' }, { name: 'sort_order', label: 'Sort order', type: 'number' }, { name: 'published', label: 'Published', type: 'boolean' }]
  },
  {
    key: 'homepage', title: 'Homepage', table: 'homepage_content', group: 'CMS', icon: LayoutDashboard,
    description: 'Editable homepage sections and content JSON.',
    fields: [{ name: 'section', label: 'Section key', required: true }, { name: 'content', label: 'Content JSON', type: 'json', required: true }]
  },
  {
    key: 'media', title: 'Media', table: 'media_assets', group: 'CMS', icon: FileText,
    description: 'Media asset metadata. Upload files to Supabase Storage, then register them here.',
    fields: [{ name: 'title', label: 'Title' }, { name: 'alt', label: 'Alt text' }, { name: 'storage_path', label: 'Storage path', required: true }, { name: 'mime_type', label: 'MIME type' }, { name: 'size_bytes', label: 'Size bytes', type: 'number' }]
  },
  {
    key: 'seo', title: 'SEO Metadata', table: 'seo_metadata', group: 'System', icon: Search,
    description: 'Canonical metadata, Open Graph and JSON-LD schema.',
    fields: [{ name: 'path', label: 'Path', required: true }, { name: 'title', label: 'Title', required: true }, { name: 'description', label: 'Description', type: 'textarea', required: true }, { name: 'canonical', label: 'Canonical URL', type: 'url' }, { name: 'og_image', label: 'OG image', type: 'url' }, { name: 'schema', label: 'Schema JSON', type: 'json' }]
  },
  {
    key: 'settings', title: 'Site Settings', table: 'site_settings', group: 'System', icon: Settings,
    description: 'Global key/value settings for integrations, copy and business details.', idColumn: 'key',
    fields: [{ name: 'key', label: 'Setting key', required: true }, { name: 'value', label: 'Value JSON', type: 'json', required: true }]
  }
];

const groups = ['CRM', 'Portal', 'CMS', 'System'] as const;
const adminRoles = ['owner', 'admin', 'editor'];

export function Admin() {
  const [signedIn, setSignedIn] = useState(!supabase);
  const [profile, setProfile] = useState<Row | null>(supabase ? null : { email: 'demo@rovik.local', role: 'owner', full_name: 'Local Owner' });
  const [activeKey, setActiveKey] = useState('leads');
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [allCounts, setAllCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [viewing, setViewing] = useState<Row | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  const activeModule = useMemo(() => modules.find((module) => module.key === activeKey) || modules[0], [activeKey]);

  const loadRows = useCallback(async (module = activeModule) => {
    setLoading(true);
    setError(null);
    try {
      if (!supabase && module.seed?.length) seedLocalTable(module.table, module.seed);
      const data = await fetchRecords<Row>(module.table);
      setRows(data);
      setAllCounts((prev) => ({ ...prev, [module.key]: data.length }));
    } catch (err) {
      setRows([]);
      setError(err instanceof Error ? err.message : 'Unable to load records. Check Supabase migration/RLS and table name.');
    } finally {
      setLoading(false);
    }
  }, [activeModule]);

  const loadCounts = useCallback(async () => {
    const next: Record<string, number> = {};
    for (const module of modules) {
      try {
        if (!supabase && module.seed?.length) seedLocalTable(module.table, module.seed);
        const data = await fetchRecords<Row>(module.table, 500);
        next[module.key] = data.length;
      } catch {
        next[module.key] = 0;
      }
    }
    setAllCounts(next);
  }, []);

  useEffect(() => {
    async function checkSession() {
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      if (!data.session) return setSignedIn(false);
      try {
        const current = await getCurrentProfile();
        if (current && adminRoles.includes(String(current.role))) {
          setProfile(current);
          setSignedIn(true);
        } else {
          await supabase.auth.signOut();
          setSignedIn(false);
          setError('This account is not an admin. Set profile role to owner, admin or editor.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not verify admin role.');
      }
    }
    void checkSession();
  }, []);

  useEffect(() => {
    if (!signedIn) return;
    void loadRows(activeModule);
  }, [activeKey, signedIn, activeModule, loadRows]);

  useEffect(() => {
    if (!signedIn) return;
    void loadCounts();
  }, [signedIn, loadCounts]);

  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    if (!lower) return rows;
    return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(lower));
  }, [rows, query]);

  const pipeline = useMemo(() => leadStatus.map((status) => ({ status, count: rows.filter((row) => String(row.status) === status).length })), [rows]);

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!supabase) {
      setSignedIn(true);
      setProfile({ email: 'demo@rovik.local', role: 'owner', full_name: 'Local Owner' });
      return;
    }
    const formData = new FormData(e.currentTarget);
    const { error: loginError } = await supabase.auth.signInWithPassword({ email: String(formData.get('email')), password: String(formData.get('password')) });
    if (loginError) return setError(loginError.message);
    try {
      const current = await getCurrentProfile();
      if (!current || !adminRoles.includes(String(current.role))) {
        await supabase.auth.signOut();
        setSignedIn(false);
        setError('Signed in, but this account is not allowed to access admin. Set role to owner/admin/editor in public.profiles.');
        return;
      }
      setProfile(current);
      setSignedIn(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Admin role check failed.');
    }
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    setSignedIn(false);
    setProfile(null);
  }

  function startCreate() {
    setEditing(null);
    setViewing(null);
    setForm(buildInitialForm(activeModule));
    setFormOpen(true);
  }

  function startEdit(row: Row) {
    setEditing(row);
    setViewing(null);
    setForm(buildInitialForm(activeModule, row));
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submitRecord(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = parsePayload(activeModule, form);
      const idColumn = activeModule.idColumn || 'id';
      const id = editing ? String(editing[idColumn]) : '';
      const result = editing
        ? await updateRecord(activeModule.table, id, payload, idColumn)
        : await insertRecord(activeModule.table, payload);
      if (result.error) throw result.error;
      setFormOpen(false);
      setEditing(null);
      setForm({});
      await loadRows(activeModule);
      await loadCounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save record. Check required fields and Supabase RLS.');
    } finally {
      setSaving(false);
    }
  }

  async function removeRow(row: Row) {
    const idColumn = activeModule.idColumn || 'id';
    const id = row[idColumn];
    if (!id) return setError(`Cannot delete this row because ${idColumn} is missing.`);
    if (!window.confirm('Delete this record? This cannot be undone.')) return;
    setSaving(true);
    setError(null);
    try {
      const result = await deleteRecord(activeModule.table, String(id), idColumn);
      if (result.error) throw result.error;
      await loadRows(activeModule);
      await loadCounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete record.');
    } finally {
      setSaving(false);
    }
  }

  async function quickStatus(row: Row, value: string) {
    if (!activeModule.statusField) return;
    const idColumn = activeModule.idColumn || 'id';
    const id = row[idColumn];
    if (!id) return;
    const field = activeModule.statusField;
    const type = activeModule.fields.find((item) => item.name === field)?.type;
    const parsed = type === 'boolean' ? value === 'true' : value;
    try {
      await updateRecord(activeModule.table, String(id), { [field]: parsed }, idColumn);
      await loadRows(activeModule);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update status.');
    }
  }

  if (!signedIn) return (
    <>
      <SEO title="ROVIK Admin Login" description="Secure ROVIK admin login." path="/admin" noindex />
      <section className="section-pad min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(91,108,255,.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(138,92,255,.14),transparent_30%)]">
        <div className="container grid min-h-[70vh] place-items-center">
          <form onSubmit={login} className="w-full max-w-md rounded-[2rem] border border-soft bg-card p-7 shadow-glass sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-white dark:bg-white dark:text-ink"><Lock className="h-5 w-5" /></span>
              <div><p className="kicker">Secure workspace</p><h1 className="font-display text-3xl font-black">Admin login</h1></div>
            </div>
            <p className="text-sm leading-6 text-muted">Use a Supabase Auth account whose profile role is owner, admin or editor. Local demo mode opens when Supabase env keys are empty.</p>
            {error ? <ErrorBanner message={error} /> : null}
            <label className="mt-6 grid gap-2 text-sm font-bold">Email<input required name="email" type="email" className="rounded-2xl border border-soft bg-transparent p-3 outline-none focus:border-electric" /></label>
            <label className="mt-4 grid gap-2 text-sm font-bold">Password<input required name="password" type="password" className="rounded-2xl border border-soft bg-transparent p-3 outline-none focus:border-electric" /></label>
            <Button className="mt-6 w-full">Sign in</Button>
            <div className="mt-5 rounded-2xl border border-soft bg-black/[0.03] p-4 text-xs leading-5 text-muted dark:bg-white/[0.04]">
              Production setup: run the Supabase migration, create your Auth user, then set <code className="rounded bg-black/5 px-1 dark:bg-white/10">public.profiles.role = owner</code>.
            </div>
          </form>
        </div>
      </section>
    </>
  );

  return (
    <>
      <SEO title="ROVIK Admin Dashboard" description="ROVIK admin CMS and CRM dashboard." path="/admin" noindex />
      <section className="min-h-screen bg-[#f6f7fb] pb-12 pt-24 dark:bg-[#070811]" data-no-scroll-animation>
        <div className="container">
          <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
            <aside className="xl:sticky xl:top-24 xl:self-start">
              <div className="overflow-hidden rounded-[2rem] border border-soft bg-card shadow-glass">
                <div className="border-b border-soft p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink font-display font-black text-white dark:bg-white dark:text-ink">R</span>
                    <div>
                      <p className="font-display text-xl font-black tracking-[.18em]">ROVIK</p>
                      <p className="text-xs text-muted">Control Center</p>
                    </div>
                  </div>
                  <div className="mt-5 rounded-2xl bg-black/[0.03] p-4 text-xs leading-5 text-muted dark:bg-white/[0.05]">
                    Signed in as <strong className="text-current">{profile?.email || 'Local demo'}</strong><br />Role: <strong className="text-current">{profile?.role || 'owner'}</strong>
                  </div>
                </div>
                <nav className="max-h-[66vh] space-y-5 overflow-y-auto p-4" aria-label="Admin modules">
                  {groups.map((group) => (
                    <div key={group}>
                      <p className="mb-2 px-3 text-[11px] font-black uppercase tracking-[0.18em] text-muted">{group}</p>
                      <div className="grid gap-1">
                        {modules.filter((module) => module.group === group).map((module) => {
                          const Icon = module.icon;
                          const active = module.key === activeKey;
                          return (
                            <button
                              key={module.key}
                              onClick={() => { setActiveKey(module.key); setFormOpen(false); setViewing(null); setQuery(''); }}
                              className={`flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold transition ${active ? 'bg-ink text-white shadow-glow dark:bg-white dark:text-ink' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
                            >
                              <span className="flex min-w-0 items-center gap-3"><Icon className="h-4 w-4 shrink-0" /><span className="truncate">{module.title}</span></span>
                              <span className={`rounded-full px-2 py-0.5 text-[11px] ${active ? 'bg-white/15 dark:bg-black/10' : 'bg-black/5 text-muted dark:bg-white/10'}`}>{allCounts[module.key] ?? 0}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
                <div className="border-t border-soft p-4">
                  <Button variant="secondary" className="w-full" onClick={signOut}>Sign out</Button>
                </div>
              </div>
            </aside>

            <main className="space-y-6">
              <AdminHero rows={rows} counts={allCounts} module={activeModule} onRefresh={() => { void loadRows(activeModule); void loadCounts(); }} onExport={() => exportRowsToXlsx(`rovik-${activeModule.key}.xlsx`, filtered)} />

              {activeModule.note ? <InfoBanner message={activeModule.note} /> : null}
              {error ? <ErrorBanner message={error} /> : null}

              {['leads', 'project-builder'].includes(activeModule.key) ? <PipelineBar pipeline={pipeline} /> : null}
              {['clients', 'client-projects'].includes(activeModule.key) ? <PortalAssignmentHelp /> : null}

              <div className="rounded-[2rem] border border-soft bg-card shadow-glass">
                <div className="flex flex-col gap-4 border-b border-soft p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-display text-2xl font-black">{activeModule.title}</h2>
                      <span className="rounded-full bg-electric/10 px-3 py-1 text-xs font-black text-electric">{activeModule.table}</span>
                    </div>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{activeModule.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => { void loadRows(activeModule); }}><RefreshCcw className="h-4 w-4" /> Refresh</Button>
                    <Button variant="dark" onClick={startCreate}><Plus className="h-4 w-4" /> New record</Button>
                  </div>
                </div>

                {formOpen ? (
                  <RecordForm
                    module={activeModule}
                    form={form}
                    setForm={setForm}
                    editing={Boolean(editing)}
                    saving={saving}
                    onSubmit={submitRecord}
                    onCancel={() => { setFormOpen(false); setEditing(null); setForm({}); }}
                  />
                ) : null}

                <div className="border-b border-soft p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <label className="flex min-h-12 w-full items-center gap-2 rounded-2xl border border-soft bg-black/[0.03] px-4 dark:bg-white/[0.04] md:max-w-md">
                      <Search className="h-4 w-4 text-muted" />
                      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${activeModule.title.toLowerCase()}…`} className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
                    </label>
                    <p className="text-sm text-muted">Showing <strong className="text-current">{filtered.length}</strong> of <strong className="text-current">{rows.length}</strong> records</p>
                  </div>
                </div>

                {loading ? <div className="m-5 h-56 rounded-3xl skeleton" /> : filtered.length ? (
                  <DataTable rows={filtered} module={activeModule} onEdit={startEdit} onDelete={removeRow} onView={setViewing} onStatusChange={quickStatus} />
                ) : (
                  <div className="p-6"><EmptyState title="No records yet" description="Create a record here, or connect Supabase and records from forms, Havali and Project Builder will appear automatically." /></div>
                )}
              </div>
            </main>
          </div>
        </div>
      </section>

      {viewing ? <RecordDrawer row={viewing} onClose={() => setViewing(null)} onEdit={() => startEdit(viewing)} /> : null}
    </>
  );
}

function AdminHero({ rows, counts, module, onRefresh, onExport }: { rows: Row[]; counts: Record<string, number>; module: Module; onRefresh: () => void; onExport: () => void }) {
  const totalRecords = Object.values(counts).reduce((sum, item) => sum + item, 0);
  const currentCount = rows.length;
  const activePipeline = rows.filter((row) => ['New', 'Contacted', 'Qualified', 'Proposal'].includes(String(row.status))).length;
  return (
    <div className="overflow-hidden rounded-[2rem] border border-soft bg-ink p-6 text-white shadow-glass sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan">Admin / CMS / CRM</p>
          <h1 className="mt-3 font-display text-4xl font-black tracking-tight sm:text-5xl">ROVIK production control center</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">Manage live leads, Havali sessions, Project Builder submissions, client portal assignments, CMS content, SEO and business settings from one professional dashboard.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" className="border-white/15 bg-white/10 text-white hover:bg-white/15" onClick={onRefresh}><RefreshCcw className="h-4 w-4" /> Sync</Button>
          <Button variant="secondary" className="border-white/15 bg-white text-ink hover:bg-white/90" onClick={onExport}><Download className="h-4 w-4" /> Export</Button>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Metric title="Current module" value={currentCount} hint={module.title} icon={Database} />
        <Metric title="Total records" value={totalRecords} hint="loaded locally" icon={Activity} />
        <Metric title="Open pipeline" value={activePipeline} hint="active CRM items" icon={BriefcaseBusiness} />
        <Metric title="Security" value="RLS" hint="role-based admin" icon={ShieldCheck} />
      </div>
    </div>
  );
}

function Metric({ title, value, hint, icon: Icon }: { title: string; value: number | string; hint: string; icon: LucideIcon }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
      <div className="flex items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">{title}</p><Icon className="h-4 w-4 text-cyan" /></div>
      <p className="mt-4 font-display text-3xl font-black">{value}</p>
      <p className="mt-1 text-xs text-white/55">{hint}</p>
    </div>
  );
}

function PipelineBar({ pipeline }: { pipeline: { status: string; count: number }[] }) {
  const total = pipeline.reduce((sum, item) => sum + item.count, 0) || 1;
  return (
    <div className="rounded-[2rem] border border-soft bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3"><h2 className="font-display text-xl font-black">Lead pipeline</h2><span className="text-sm text-muted">New → Contacted → Qualified → Proposal → Won/Lost</span></div>
      <div className="grid gap-3 md:grid-cols-6">
        {pipeline.map((item) => <div key={item.status} className="rounded-2xl border border-soft p-4"><p className="text-xs font-black uppercase tracking-[0.14em] text-muted">{item.status}</p><p className="mt-2 font-display text-3xl font-black">{item.count}</p><div className="mt-3 h-1.5 rounded-full bg-black/10 dark:bg-white/10"><div className="h-full rounded-full bg-electric" style={{ width: `${(item.count / total) * 100}%` }} /></div></div>)}
      </div>
    </div>
  );
}

function RecordForm({ module, form, setForm, editing, saving, onSubmit, onCancel }: { module: Module; form: Record<string, string>; setForm: (updater: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void; editing: boolean; saving: boolean; onSubmit: (e: FormEvent<HTMLFormElement>) => void; onCancel: () => void }) {
  return (
    <form onSubmit={onSubmit} className="border-b border-soft bg-black/[0.02] p-5 dark:bg-white/[0.02]">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div><h3 className="font-display text-xl font-black">{editing ? 'Edit record' : 'Create record'}</h3><p className="text-sm text-muted">Fields are mapped directly to the Supabase table schema.</p></div>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {module.fields.map((field) => <FieldInput key={field.name} field={field} value={form[field.name] || ''} onChange={(value) => setForm((prev) => ({ ...prev, [field.name]: value }))} />)}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button variant="dark" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Create record'}</Button>
        <p className="text-xs text-muted">Arrays use comma-separated values. JSON fields accept valid JSON only.</p>
      </div>
    </form>
  );
}

function FieldInput({ field, value, onChange }: { field: Field; value: string; onChange: (value: string) => void }) {
  const common = 'rounded-2xl border border-soft bg-card px-4 py-3 text-sm outline-none transition focus:border-electric';
  return (
    <label className={`grid gap-2 text-sm font-bold ${field.type === 'textarea' || field.type === 'json' ? 'md:col-span-2 xl:col-span-3' : ''}`}>
      <span>{field.label}{field.required ? <span className="text-electric"> *</span> : null}</span>
      {field.type === 'select' ? (
        <select value={value} required={field.required} onChange={(e) => onChange(e.target.value)} className={common}>
          <option value="">Select…</option>
          {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : field.type === 'textarea' || field.type === 'json' ? (
        <textarea value={value} required={field.required} rows={field.type === 'json' ? 8 : 4} onChange={(e) => onChange(e.target.value)} className={common} placeholder={field.placeholder || (field.type === 'json' ? '{ }' : '')} />
      ) : field.type === 'boolean' ? (
        <select value={value || 'false'} onChange={(e) => onChange(e.target.value)} className={common}><option value="true">true</option><option value="false">false</option></select>
      ) : (
        <input value={value} required={field.required} type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'} onChange={(e) => onChange(e.target.value)} className={common} placeholder={field.placeholder} />
      )}
      {field.help ? <span className="text-xs font-normal text-muted">{field.help}</span> : null}
    </label>
  );
}

function DataTable({ rows, module, onEdit, onDelete, onView, onStatusChange }: { rows: Row[]; module: Module; onEdit: (row: Row) => void; onDelete: (row: Row) => void; onView: (row: Row) => void; onStatusChange: (row: Row, value: string) => void }) {
  const columns = chooseColumns(rows, module).slice(0, 8);
  return (
    <div className="overflow-auto">
      <table className="w-full min-w-[980px] text-left text-sm">
        <thead className="sticky top-0 bg-card text-xs uppercase tracking-[0.12em] text-muted">
          <tr>
            {columns.map((key) => <th key={key} className="border-b border-soft px-5 py-4 font-black">{key}</th>)}
            <th className="border-b border-soft px-5 py-4 font-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={String(row[module.idColumn || 'id'] || `${module.key}-${index}`)} className="transition hover:bg-black/[0.025] dark:hover:bg-white/[0.035]">
              {columns.map((key) => (
                <td className="border-b border-soft px-5 py-4 align-top" key={key}>
                  {module.statusField === key && module.statusOptions ? (
                    <select className="rounded-full border border-soft bg-transparent px-3 py-1 text-xs font-bold" value={String(row[key] ?? '')} onChange={(e) => onStatusChange(row, e.target.value)}>
                      {module.statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  ) : <CellValue value={row[key]} />}
                </td>
              ))}
              <td className="border-b border-soft px-5 py-4 align-top">
                <div className="flex gap-2">
                  <IconButton label="View" onClick={() => onView(row)} icon={Eye} />
                  <IconButton label="Edit" onClick={() => onEdit(row)} icon={Edit3} />
                  <IconButton label="Delete" onClick={() => onDelete(row)} icon={Trash2} danger />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CellValue({ value }: { value: unknown }) {
  if (value === null || value === undefined || value === '') return <span className="text-muted">—</span>;
  if (typeof value === 'boolean') return <span className={`rounded-full px-2 py-1 text-xs font-bold ${value ? 'bg-emerald-500/10 text-emerald-600' : 'bg-black/5 text-muted dark:bg-white/10'}`}>{String(value)}</span>;
  if (Array.isArray(value)) return <span>{value.join(', ')}</span>;
  if (typeof value === 'object') return <code className="line-clamp-2 rounded bg-black/5 px-2 py-1 text-xs dark:bg-white/10">{JSON.stringify(value).slice(0, 140)}</code>;
  return <span className="line-clamp-2">{String(value)}</span>;
}

function IconButton({ label, icon: Icon, onClick, danger = false }: { label: string; icon: LucideIcon; onClick: () => void; danger?: boolean }) {
  return <button type="button" title={label} onClick={onClick} className={`focus-ring grid h-9 w-9 place-items-center rounded-xl border border-soft transition ${danger ? 'hover:border-red-400 hover:text-red-500' : 'hover:border-electric/40 hover:text-electric'}`}><Icon className="h-4 w-4" /></button>;
}

function RecordDrawer({ row, onClose, onEdit }: { row: Row; onClose: () => void; onEdit: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] bg-ink/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="ml-auto flex h-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-soft bg-card shadow-glass">
        <div className="flex items-center justify-between gap-3 border-b border-soft p-5"><div><p className="kicker">Record details</p><h2 className="font-display text-2xl font-black">Full row data</h2></div><button onClick={onClose} className="focus-ring rounded-full p-3 hover:bg-black/5 dark:hover:bg-white/10"><ChevronDown className="h-5 w-5 rotate-90" /></button></div>
        <div className="flex-1 overflow-auto p-5"><pre className="whitespace-pre-wrap rounded-3xl bg-black/[0.04] p-5 text-xs leading-6 dark:bg-white/[0.05]">{JSON.stringify(row, null, 2)}</pre></div>
        <div className="flex justify-end gap-3 border-t border-soft p-5"><Button variant="secondary" onClick={onClose}>Close</Button><Button variant="dark" onClick={onEdit}>Edit record</Button></div>
      </div>
    </div>
  );
}

function PortalAssignmentHelp() {
  return (
    <div className="grid gap-4 rounded-[2rem] border border-soft bg-card p-5 shadow-sm md:grid-cols-[.8fr_1.2fr]">
      <div>
        <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-electric/10 text-electric"><Users className="h-5 w-5" /></div>
        <h2 className="font-display text-2xl font-black">Client portal assignment</h2>
        <p className="mt-2 text-sm leading-6 text-muted">Create a client Auth user, set their role to client, then connect client_projects.client_id to their profile id.</p>
      </div>
      <ol className="grid gap-3 text-sm leading-6 text-muted">
        <li><strong className="text-current">1.</strong> Supabase Dashboard → Authentication → Users → Invite/Create user.</li>
        <li><strong className="text-current">2.</strong> Admin → Clients → confirm/update <code className="rounded bg-black/5 px-1 py-0.5 dark:bg-white/10">role = client</code>.</li>
        <li><strong className="text-current">3.</strong> Admin → Client Projects → create project with <code className="rounded bg-black/5 px-1 py-0.5 dark:bg-white/10">client_id = profiles.id</code>.</li>
        <li><strong className="text-current">4.</strong> Add milestones, tasks, deliverables, invoices and support tickets against the project id.</li>
      </ol>
    </div>
  );
}

function InfoBanner({ message }: { message: string }) {
  return <div className="rounded-3xl border border-electric/20 bg-electric/10 p-4 text-sm leading-6 text-electric"><strong>Note:</strong> {message}</div>;
}

function ErrorBanner({ message }: { message: string }) {
  return <div className="mt-4 rounded-3xl border border-red-400/20 bg-red-500/10 p-4 text-sm leading-6 text-red-600 dark:text-red-300"><strong>Error:</strong> {message}</div>;
}

function buildInitialForm(module: Module, row?: Row) {
  const initial: Record<string, string> = {};
  for (const field of module.fields) {
    const value = row?.[field.name];
    if (value === undefined || value === null) {
      if (field.type === 'boolean') initial[field.name] = 'false';
      else if (field.type === 'json') initial[field.name] = field.required ? '{}' : '';
      else if (field.type === 'select' && field.options?.length) initial[field.name] = field.options[0];
      else initial[field.name] = '';
      continue;
    }
    if (field.type === 'array') initial[field.name] = Array.isArray(value) ? value.join(', ') : String(value);
    else if (field.type === 'json') initial[field.name] = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
    else if (field.type === 'boolean') initial[field.name] = String(Boolean(value));
    else initial[field.name] = String(value).slice(0, field.type === 'date' ? 10 : undefined);
  }
  return initial;
}

function parsePayload(module: Module, form: Record<string, string>) {
  const payload: Record<string, unknown> = {};
  for (const field of module.fields) {
    const raw = form[field.name];
    if (raw === undefined) continue;
    if (raw === '' && !field.required) {
      if (field.type === 'boolean') payload[field.name] = false;
      else if (field.type === 'array') payload[field.name] = [];
      else if (field.type === 'json') payload[field.name] = {};
      else continue;
      continue;
    }
    switch (field.type) {
      case 'number': payload[field.name] = raw === '' ? null : Number(raw); break;
      case 'array': payload[field.name] = raw.split(',').map((item) => item.trim()).filter(Boolean); break;
      case 'json': payload[field.name] = raw.trim() ? JSON.parse(raw) : {}; break;
      case 'boolean': payload[field.name] = raw === 'true'; break;
      default: payload[field.name] = raw;
    }
  }
  return payload;
}

function chooseColumns(rows: Row[], module: Module) {
  const priority = ['status', 'published', 'role', 'name', 'title', 'email', 'company', 'service', 'subject', 'progress', 'created_at', 'updated_at'];
  const keys = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const status = module.statusField ? [module.statusField] : [];
  const chosen = [...status, ...priority.filter((key) => keys.includes(key) && !status.includes(key)), ...keys.filter((key) => !priority.includes(key) && !status.includes(key))];
  return chosen.length ? chosen : keys;
}
