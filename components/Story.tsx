'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from './LangProvider';
import CarWash from './CarWash';

gsap.registerPlugin(ScrollTrigger);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * The car turns from dirty to clean as you scroll, with one short line of text
 * fading in word by word. Desktop: the section holds briefly (pinned).
 * Phones: no pin — it glides past and cleans as it moves up the screen.
 */
export default function Story() {
  const { t, lang } = useLang();
  const section = useRef<HTMLElement>(null);
  const line = useRef<HTMLParagraphElement>(null);
  const progress = useRef({ current: 0 }).current;

  useEffect(() => {
    const el = section.current;
    if (!el) return;

    const paintText = (p: number) => {
      const words = line.current?.querySelectorAll<HTMLSpanElement>('span');
      words?.forEach((w, i) => {
        const k = clamp01((p - 0.2 - i * 0.07) / 0.3);
        const e = 1 - Math.pow(1 - k, 3); // ease-out
        w.style.opacity = String(e);
        w.style.transform = `translate3d(0, ${(1 - e) * 18}px, 0)`;
        w.style.filter = `blur(${(1 - e) * 8}px)`;
      });
    };

    const mm = gsap.matchMedia();
    mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, (c) => {
      const desktop = !!c.conditions?.desktop;
      ScrollTrigger.create({
        trigger: el,
        start: desktop ? 'top top' : 'top 85%',
        end: desktop ? '+=100%' : 'center 40%',
        pin: desktop,
        scrub: desktop ? true : 0.4,
        onUpdate: (self) => {
          const p = desktop ? clamp01((self.progress - 0.05) / 0.9) : self.progress;
          progress.current = p;
          paintText(p);
        },
        onRefresh: (self) => paintText(self.progress),
      });
    });
    return () => mm.revert();
  }, [progress, lang]);

  return (
    <section
      ref={section}
      className="relative h-svh w-full overflow-hidden bg-[#ececec] max-md:h-[88svh]"
      aria-label={t.story.title}
    >
      <CarWash progress={progress} className="absolute inset-0 block h-full w-full" />
      <p
        ref={line}
        key={lang}
        aria-hidden="true"
        className="headline pointer-events-none absolute inset-x-0 top-[13%] px-6 text-center text-[clamp(32px,4.6vw,64px)] text-ink max-md:top-[11%]"
      >
        {t.story.title.split(' ').map((w, i) => (
          <span key={i} className="inline-block opacity-0 will-change-[transform,opacity,filter]">
            {w}
            {' '}
          </span>
        ))}
      </p>
    </section>
  );
}
