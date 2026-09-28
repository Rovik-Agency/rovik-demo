import { RefObject, useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion';

export function useReveal(ref: RefObject<HTMLElement>, deps: unknown[] = []) {
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.querySelectorAll('.reveal').forEach((node) => node.classList.add('revealed'));
      return;
    }
    let ctx: { revert: () => void } | undefined;
    import('gsap').then(({ gsap }) => import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('.reveal').forEach((node) => {
          gsap.to(node, { opacity: 1, y: 0, duration: .75, ease: 'power3.out', scrollTrigger: { trigger: node, start: 'top 84%' } });
        });
      }, el);
    }));
    return () => ctx?.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);
}
