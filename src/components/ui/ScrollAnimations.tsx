import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function ScrollAnimations() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const revealTargets = gsap.utils.toArray<HTMLElement>([
        '[data-reveal]',
        '.section-pad .container > :not([data-no-reveal])',
        '.section-pad .container-tight > :not([data-no-reveal])'
      ].join(','));

      revealTargets.forEach((element) => {
        if (element.closest('[data-no-scroll-animation]')) return;
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 34, filter: 'blur(10px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.82,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true }
          }
        );
      });

      const cards = gsap.utils.toArray<HTMLElement>('[data-stagger], .grid > article, .grid > div, .grid > a');
      cards.forEach((element) => {
        if (element.closest('[data-no-scroll-animation]')) return;
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 20, scale: 0.985 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 90%', once: true }
          }
        );
      });

      const parallaxItems = gsap.utils.toArray<HTMLElement>('[data-parallax]');
      parallaxItems.forEach((element) => {
        if (element.closest('[data-no-scroll-animation]')) return;
        const distance = Number(element.dataset.parallax || 42);
        gsap.to(element, {
          y: distance,
          ease: 'none',
          scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });
    });

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 160);
    return () => {
      window.clearTimeout(refresh);
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [location.pathname]);

  return null;
}
