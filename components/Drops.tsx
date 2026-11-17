'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type Drop = { x: string; y: string; s: number; speed?: number; desktopOnly?: boolean };

/** A few water drops resting on a section, drifting slightly with scroll. */
export default function Drops({ drops }: { drops: Drop[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>('.drop').forEach((d) => {
        const sp = Number(d.dataset.speed || 1);
        gsap.fromTo(
          d,
          { y: 24 * sp },
          { y: -24 * sp, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {drops.map((d, i) => (
        <span
          key={i}
          data-speed={d.speed ?? 1}
          className={`drop ${d.desktopOnly ? 'max-md:hidden' : ''}`}
          style={{ left: d.x, top: d.y, width: d.s, height: Math.round(d.s * 0.94) }}
        />
      ))}
    </div>
  );
}
