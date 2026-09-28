import { Navigate, Route, Routes } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { Home } from '@/pages/Home';
import { Services } from '@/pages/Services';
import { ServiceDetail } from '@/pages/ServiceDetail';
import { Work } from '@/pages/Work';
import { CaseStudy } from '@/pages/CaseStudy';
import { Solutions } from '@/pages/Solutions';
import { About } from '@/pages/About';
import { Pricing } from '@/pages/Pricing';
import { Insights } from '@/pages/Insights';
import { Article } from '@/pages/Article';
import { Contact } from '@/pages/Contact';
import { ProjectBuilder } from '@/pages/ProjectBuilder';
import { HavaliPage } from '@/pages/HavaliPage';
import { Admin } from '@/pages/Admin';
import { ClientPortal } from '@/pages/ClientPortal';
import { Legal } from '@/pages/Legal';
import { NotFound } from '@/pages/NotFound';

export function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:slug" element={<ServiceDetail />} />
        <Route path="work" element={<Work />} />
        <Route path="work/:slug" element={<CaseStudy />} />
        <Route path="solutions" element={<Solutions />} />
        <Route path="about" element={<About />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="insights" element={<Insights />} />
        <Route path="insights/:slug" element={<Article />} />
        <Route path="contact" element={<Contact />} />
        <Route path="project-builder" element={<ProjectBuilder />} />
        <Route path="havali" element={<HavaliPage />} />
        <Route path="admin" element={<Admin />} />
        <Route path="portal" element={<ClientPortal />} />
        <Route path="legal/:page" element={<Legal />} />
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
