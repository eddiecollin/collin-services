'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { site, waLink } from '@/content/site';
import { useLang } from './LangProvider';
import { CHROME_STOPS, MARK_ARC, MARK_DROP } from './LogoMark';
import Drops from './Drops';
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
    const arcs = el.querySelectorAll<SVGPathElement>('.mark-arc');
    const arc = arcs[0];
    const grad = el.querySelector<SVGLinearGradientElement>('#markSheen')!;
    const len = arc.getTotalLength();

    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.set(arcs, { strokeDasharray: len, strokeDashoffset: len });
        const tl = gsap.timeline({ delay: 0.25 });
        tl.to(arcs, { strokeDashoffset: 0, duration: 1.6, ease: 'expo.inOut' })
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
      <Drops
        drops={[
          { x: '13%', y: '24%', s: 24, speed: 1.2 },
          { x: '16.5%', y: '29%', s: 8, speed: 1.2 },
          { x: '83%', y: '30%', s: 32, speed: 0.8 },
          { x: '87%', y: '63%', s: 14, speed: 1.4, desktopOnly: true },
          { x: '79%', y: '71%', s: 7, speed: 1.4, desktopOnly: true },
          { x: '20%', y: '72%', s: 17, speed: 1, desktopOnly: true },
          { x: '8%', y: '86%', s: 10, speed: 0.6 },
          { x: '91%', y: '88%', s: 12, speed: 0.6 },
        ]}
      />
      <div className="hero-stage relative z-10 flex flex-col items-center text-center">
        <svg viewBox="0 0 100 100" className="size-[clamp(96px,13vw,148px)] overflow-visible text-ink" aria-hidden="true">
          <defs>
            <linearGradient id="markChrome" x1="0" y1="0" x2="0" y2="1">
              {CHROME_STOPS.map(([o, c]) => (
                <stop key={o} offset={o} stopColor={c} />
              ))}
            </linearGradient>
            <linearGradient id="markSheen" x1="-1.2" y1="0" x2="-0.2" y2="0.6" gradientUnits="objectBoundingBox">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.43" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
              <stop offset="0.57" stopColor="#fff" stopOpacity="0" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className="mark-arc" d={MARK_ARC} fill="none" stroke="url(#markChrome)" strokeWidth="13" strokeLinecap="round" />
          <path className="mark-arc" d={MARK_ARC} fill="none" stroke="url(#markSheen)" strokeWidth="13" strokeLinecap="round" />
          <g className="mark-drop">
            <path d={MARK_DROP} fill="url(#markChrome)" />
            <path d={MARK_DROP} fill="url(#markSheen)" />
          </g>
        </svg>

        <h1
          className="display mt-7 pb-[0.06em] text-[clamp(48px,9vw,128px)] text-ink"
          aria-label={name}
        >
          {name.split('').map((c, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom" aria-hidden="true">
              <span className="hero-char chrome-text inline-block">{c === ' ' ? ' ' : c}</span>
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
            className="btn-chrome inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[15px] font-medium text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
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
