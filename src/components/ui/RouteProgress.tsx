import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function RouteProgress() {
  const location = useLocation();
  const [active, setActive] = useState(false);
  useEffect(() => {
    setActive(true);
    const t = window.setTimeout(() => setActive(false), 420);
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    return () => clearTimeout(t);
  }, [location.pathname]);
  return <div className={`fixed left-0 top-0 z-[90] h-1 bg-gradient-to-r from-electric to-violet transition-all duration-500 ${active ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />;
}
