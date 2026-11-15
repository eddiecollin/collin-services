'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { waLink } from '@/content/site';
import { useLang } from './LangProvider';
import PaintCanvas from './PaintCanvas';
import { WhatsAppIcon } from './icons';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const { t } = useLang();
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Page-load moment: headline rises out of a mask, panel lifts in.
      if (!reduce) {
        gsap.from('.hero-word', { yPercent: 115, duration: 1.25, ease: 'expo.out', stagger: 0.07, delay: 0.15 });
        gsap.from('.hero-fade', { opacity: 0, y: 16, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.55 });
        gsap.from('.hero-panel', { yPercent: 8, opacity: 0, duration: 1.6, ease: 'expo.out', delay: 0.3 });
      }

      const mm = gsap.matchMedia();
      mm.add({ mobile: '(max-width: 767px)', desktop: '(min-width: 768px)' }, (c) => {
        const top = c.conditions?.mobile ? '52%' : '47%';
        const side = c.conditions?.mobile ? '4%' : '3%';
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top top', end: '+=110%', scrub: 0.6, pin: true },
        });
        tl.fromTo(
          '.hero-panel',
          { clipPath: `inset(${top} ${side} 3% ${side} round 28px)` },
          { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', duration: 1 },
          0,
        )
          .to('.hero-copy', { yPercent: -40, opacity: 0, ease: 'none', duration: 0.55 }, 0)
          .fromTo('.hero-caption', { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: 'none', duration: 0.3 }, 0.7);
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const words = t.hero.title.split(' ');

  return (
    <section ref={section} id="top" className="relative h-svh min-h-[620px] w-full overflow-hidden bg-paper">
      <div className="hero-panel paint-fallback absolute inset-0">
        <PaintCanvas className="block h-full w-full" />
        <p className="hero-caption pointer-events-none absolute bottom-[8vh] left-0 right-0 mx-auto max-w-[1120px] px-6 text-[clamp(22px,3vw,36px)] font-semibold tracking-[-0.025em] text-white opacity-0">
          <span className="block max-w-[22ch] text-balance">{t.hero.caption}</span>
        </p>
      </div>

      <div className="hero-copy relative z-10 mx-auto flex h-[47%] max-w-[1120px] flex-col items-center justify-end px-6 pb-[3.5vh] text-center max-md:h-[52%]">
        <h1 className="display text-balance text-[clamp(44px,8.2vw,112px)]" aria-label={t.hero.title} key={t.hero.title}>
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden="true">
              <span className="hero-word inline-block">{w}{i < words.length - 1 ? ' ' : ''}</span>
            </span>
          ))}
        </h1>
        <p className="hero-fade mt-3 text-[clamp(17px,1.7vw,22px)] text-graphite">{t.hero.sub}</p>
        <div className="hero-fade mt-6 flex flex-wrap items-center justify-center gap-3">
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
