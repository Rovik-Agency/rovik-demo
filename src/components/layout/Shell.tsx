import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CookieConsent } from '@/components/ui/CookieConsent';
import { RouteProgress } from '@/components/ui/RouteProgress';
import { IntroLoader } from '@/components/ui/IntroLoader';
import { HavaliFloating } from '@/components/havali/HavaliFloating';
import { ScrollAnimations } from '@/components/ui/ScrollAnimations';

export function Shell() {
  const location = useLocation();
  const workspaceRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/portal');
  return (
    <div className="noise min-h-screen bg-premium-radial">
      <IntroLoader />
      <RouteProgress />
      <ScrollAnimations />
      <Header />
      <main id="main"><Outlet /></main>
      {workspaceRoute ? null : <Footer />}
      {workspaceRoute ? null : <HavaliFloating />}
      <CookieConsent />
    </div>
  );
}
