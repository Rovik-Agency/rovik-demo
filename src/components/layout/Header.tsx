import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { LinkButton } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const nav = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/insights', label: 'Insights' }
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const homeTop = location.pathname === '/' && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${scrolled ? 'border-b border-black/5 bg-white/80 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-ink/80' : 'bg-transparent'} ${homeTop ? 'text-white' : ''}`}>
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="focus-ring flex items-center gap-3 rounded-full" aria-label="ROVIK home">
          <span className="font-display text-2xl font-black tracking-[.18em]">ROVIK</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `focus-ring rounded-full px-4 py-2 text-xs font-black transition ${isActive ? (homeTop ? 'bg-white/10 text-white' : 'bg-black/5 text-current dark:bg-white/10') : (homeTop ? 'text-white/75 hover:text-white' : 'text-muted hover:text-current')}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <LinkButton to="/project-builder" variant="secondary" className={homeTop ? 'border-white/20 bg-white text-ink hover:bg-white/90' : ''}>Get Started <ArrowRight className="h-4 w-4" /></LinkButton>
        </div>
        <button className="focus-ring rounded-full p-3 lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}><Menu /></button>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-lg lg:hidden" role="dialog" aria-modal="true">
          <div className="ml-auto h-full w-[86%] max-w-sm bg-card p-6 text-current shadow-glass">
            <div className="flex items-center justify-between">
              <span className="font-display text-xl font-black tracking-[.18em]">ROVIK</span>
              <button className="focus-ring rounded-full p-2" aria-label="Close menu" onClick={() => setOpen(false)}><X /></button>
            </div>
            <div className="mt-8 grid gap-2">
              {nav.map((item) => <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 font-bold hover:bg-black/5 dark:hover:bg-white/10">{item.label}</NavLink>)}
              <NavLink to="/havali" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 font-bold hover:bg-black/5 dark:hover:bg-white/10">Havali AI</NavLink>
              <NavLink to="/contact" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 font-bold hover:bg-black/5 dark:hover:bg-white/10">Contact</NavLink>
            </div>
            <div className="mt-8 flex items-center justify-between"><ThemeToggle /><LinkButton to="/project-builder" onClick={() => setOpen(false)} variant="dark">Build project</LinkButton></div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
