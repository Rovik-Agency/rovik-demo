import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function IntroLoader() {
  const [visible, setVisible] = useState(() => sessionStorage.getItem('rovik-intro-played') !== 'yes');
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!visible) return;
    const delay = reduced ? 250 : 1400;
    const t = window.setTimeout(() => {
      sessionStorage.setItem('rovik-intro-played', 'yes');
      setVisible(false);
    }, delay);
    return () => clearTimeout(t);
  }, [visible, reduced]);
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-ink text-white">
      <div className="text-center">
        <div className="mx-auto mb-5 h-16 w-16 rounded-2xl border border-white/20 bg-white/5 p-3 shadow-glow">
          <div className="grid h-full place-items-center rounded-xl bg-gradient-to-br from-electric to-violet font-display text-2xl font-black">R</div>
        </div>
        <div className="overflow-hidden"><p className="animate-pulseGlow font-display text-4xl font-black tracking-[.22em]">ROVIK</p></div>
        <p className="mt-3 text-sm uppercase tracking-[.3em] text-white/50">Ideas to Impact</p>
      </div>
    </div>
  );
}
