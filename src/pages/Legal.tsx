import { useParams } from 'react-router-dom';
import { SEO } from '@/components/ui/SEO';
const content: Record<string, { title: string; body: string[] }> = {
  privacy: { title: 'Privacy Policy', body: ['ROVIK collects contact, project and account information only to respond to enquiries, manage projects and operate the platform.', 'Production deployments should connect a real privacy policy reviewed for your jurisdiction, analytics provider and data processors.', 'Users can request updates or deletion of personal data by contacting ROVIK.'] },
  terms: { title: 'Terms of Service', body: ['ROVIK website content is provided for information and project discovery.', 'Project work should be governed by a written proposal, statement of work and payment terms.', 'Do not misuse the site, attempt unauthorized access or submit harmful content.'] },
  cookies: { title: 'Cookie Policy', body: ['Essential cookies may be used for theme preferences, sessions and security.', 'Analytics or marketing cookies should only be enabled with appropriate consent and provider configuration.'] }
};
export function Legal() { const { page='privacy' } = useParams(); const doc = content[page] || content.privacy; return <><SEO title={`${doc.title} — ROVIK`} description={doc.body[0]} path={`/legal/${page}`} /><section className="section-pad"><div className="container max-w-3xl"><p className="kicker">Legal</p><h1 className="h1 mt-4">{doc.title}</h1><div className="mt-10 space-y-5 text-lg leading-8 text-muted">{doc.body.map((p)=><p key={p}>{p}</p>)}</div></div></section></>; }
