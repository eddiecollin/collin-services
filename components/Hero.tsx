'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { site, waLink } from '@/content/site';
import { useLang } from './LangProvider';
import { MARK_ARC, MARK_DROP } from './LogoMark';
import { WhatsAppIcon } from './icons';

gsap.registerPlugin(ScrollTrigger);

/**
 * Logo reveal: the C draws itself, the drop falls into the opening,
 * the name rises in, then a light sweeps across the mark.
 */
export default function Hero() {
  const { t } = useLang();
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const arc = el.querySelector<SVGPathElement>('.mark-arc')!;
    const grad = el.querySelector<SVGLinearGradientElement>('#markSheen')!;
    const len = arc.getTotalLength();

    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.set(arc, { strokeDasharray: len, strokeDashoffset: len });
        const tl = gsap.timeline({ delay: 0.25 });
        tl.to(arc, { strokeDashoffset: 0, duration: 1.6, ease: 'expo.inOut' })
          .from('.mark-drop', { y: -46, scaleY: 1.25, opacity: 0, duration: 0.7, ease: 'power3.in', transformOrigin: '50% 100%' }, 1.0)
          .to('.mark-drop', { scaleY: 0.86, scaleX: 1.08, duration: 0.12, ease: 'power1.out', transformOrigin: '50% 100%' })
          .to('.mark-drop', { scaleY: 1, scaleX: 1, duration: 0.5, ease: 'elastic.out(1, 0.45)' })
          .from('.hero-char', { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.028 }, 1.35)
          .from('.hero-fade', { opacity: 0, y: 14, duration: 0.9, ease: 'power3.out', stagger: 0.1 }, 1.9)
          .fromTo(grad, { attr: { x1: -1.2, x2: -0.2 } }, { attr: { x1: 1.2, x2: 2.2 }, duration: 1.6, ease: 'power2.inOut' }, 2.0);
      }

      // Leaving the hero: the logo eases back and fades as the page scrolls on.
      gsap.to('.hero-stage', {
        scale: 0.9,
        opacity: 0,
        y: -40,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.5 },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const name = site.name;

  return (
    <section
      ref={section}
      id="top"
      className="relative flex h-svh min-h-[600px] w-full items-center justify-center overflow-hidden bg-[radial-gradient(120%_70%_at_50%_100%,#f2f2f4_0%,#ffffff_60%)] px-6"
    >
      <div className="hero-stage flex flex-col items-center text-center">
        <svg viewBox="0 0 100 100" className="size-[clamp(96px,13vw,148px)] overflow-visible text-ink" aria-hidden="true">
          <defs>
            <linearGradient id="markSheen" x1="-1.2" y1="0" x2="-0.2" y2="0.6" gradientUnits="objectBoundingBox">
              <stop offset="0" stopColor="#1d1d1f" />
              <stop offset="0.42" stopColor="#1d1d1f" />
              <stop offset="0.5" stopColor="#8a8a90" />
              <stop offset="0.58" stopColor="#1d1d1f" />
              <stop offset="1" stopColor="#1d1d1f" />
            </linearGradient>
          </defs>
          <path className="mark-arc" d={MARK_ARC} fill="none" stroke="url(#markSheen)" strokeWidth="13" strokeLinecap="round" />
          <path className="mark-drop" d={MARK_DROP} fill="url(#markSheen)" />
        </svg>

        <h1
          className="display mt-7 pb-[0.06em] text-[clamp(48px,9vw,128px)] text-ink"
          aria-label={name}
        >
          {name.split('').map((c, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom" aria-hidden="true">
              <span className="hero-char inline-block">{c === ' ' ? ' ' : c}</span>
            </span>
          ))}
        </h1>

        <p className="hero-fade mt-4 text-[clamp(19px,2vw,26px)] font-medium tracking-[-0.015em] text-ink/80">{t.hero.title}</p>
        <p className="hero-fade mt-1.5 text-[clamp(16px,1.4vw,19px)] text-graphite">{t.hero.sub}</p>

        <div className="hero-fade mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={waLink(t.booking.wa)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[15px] font-medium text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            <WhatsAppIcon />
            {t.hero.cta}
          </a>
          <a href="#hinnat" className="rounded-full px-4 py-2.5 text-[15px] font-medium text-ink underline-offset-4 hover:underline">
            {t.hero.prices}
          </a>
        </div>
      </div>
    </section>
  );
}
