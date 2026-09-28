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

const mobileLinks = [
  ...nav,
  { to: '/havali', label: 'Havali AI' },
  { to: '/project-builder', label: 'Project Builder' },
  { to: '/contact', label: 'Contact' }
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

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

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
        <div className="fixed inset-0 z-[120] overflow-y-auto bg-[rgb(var(--bg))] text-[rgb(var(--fg))] lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet/20 blur-3xl" />
            <div className="absolute right-0 top-20 h-64 w-64 rounded-full bg-electric/15 blur-3xl" />
          </div>
          <div className="relative flex min-h-dvh flex-col px-5 py-5">
            <div className="flex h-14 items-center justify-between border-b border-soft/80 pb-4">
              <Link to="/" onClick={() => setOpen(false)} className="focus-ring rounded-full font-display text-2xl font-black tracking-[.18em]" aria-label="ROVIK home">ROVIK</Link>
              <button className="focus-ring rounded-full border border-soft bg-card p-3 shadow-sm" aria-label="Close menu" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>

            <nav className="mt-8 grid gap-2" aria-label="Mobile primary">
              {mobileLinks.map((item, index) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `focus-ring flex items-center justify-between rounded-[1.35rem] border px-4 py-4 text-base font-black transition ${isActive ? 'border-electric/25 bg-electric/10 text-electric' : 'border-soft bg-card/90 hover:border-electric/25 hover:bg-electric/5'}`}
                >
                  <span>{item.label}</span>
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-black/5 text-[11px] font-black text-muted dark:bg-white/10">{String(index + 1).padStart(2, '0')}</span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto pt-8">
              <div className="rounded-[1.5rem] border border-soft bg-card/90 p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-electric">Start with ROVIK</p>
                <p className="mt-2 text-sm leading-6 text-muted">Build a project brief, talk with Havali AI, or send a direct enquiry.</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <ThemeToggle />
                  <LinkButton to="/project-builder" onClick={() => setOpen(false)} variant="dark" className="flex-1">Build project <ArrowRight className="h-4 w-4" /></LinkButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
