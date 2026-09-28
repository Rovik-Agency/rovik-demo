import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CookieConsent } from '@/components/ui/CookieConsent';
import { RouteProgress } from '@/components/ui/RouteProgress';
import { IntroLoader } from '@/components/ui/IntroLoader';
import { HavaliFloating } from '@/components/havali/HavaliFloating';

export function Shell() {
  return (
    <div className="noise min-h-screen bg-premium-radial">
      <IntroLoader />
      <RouteProgress />
      <Header />
      <main id="main"><Outlet /></main>
      <Footer />
      <HavaliFloating />
      <CookieConsent />
    </div>
  );
}
