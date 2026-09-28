import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { HavaliChat } from './HavaliChat';
import { HavaliMark } from './HavaliMark';

export function HavaliFloating() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  if (location.pathname === '/havali' || location.pathname.startsWith('/admin') || location.pathname.startsWith('/portal')) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[70] sm:bottom-5 sm:right-5">
      {open ? (
        <div className="havali-floating-panel pointer-events-auto fixed right-3 z-[70] overflow-hidden sm:right-5">
          <HavaliChat compact />
        </div>
      ) : null}
      <div className="pointer-events-auto ml-auto flex items-end justify-end">
        <button
          onClick={() => setOpen((v) => !v)}
          className={clsx(
            'focus-ring group relative grid h-16 w-16 place-items-center overflow-hidden rounded-[1.6rem] border border-white/15 bg-gradient-to-br from-electric via-[#6f6cff] to-violet text-white shadow-glow transition duration-300 hover:-translate-y-1',
            open && 'rotate-0'
          )}
          aria-label={open ? 'Close Havali AI' : 'Open Havali AI'}
        >
          <span className="absolute inset-[1px] rounded-[1.45rem] bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,.18),transparent_30%),linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,.04))]" />
          <span className="absolute -inset-10 animate-pulseGlow bg-[radial-gradient(circle,rgba(103,232,249,.16),transparent_40%)] opacity-70" />
          {open ? <X className="relative z-10 h-6 w-6" /> : <HavaliMark className="relative z-10 h-11 w-11 rounded-[1.2rem] border-0 shadow-none" size={44} />}
        </button>
      </div>
    </div>
  );
}
