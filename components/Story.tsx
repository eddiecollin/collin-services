'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from './LangProvider';
import CarWash from './CarWash';

gsap.registerPlugin(ScrollTrigger);

/** Pinned scroll section: the car turns from dirty to clean as you scroll. No text. */
export default function Story() {
  const { t } = useLang();
  const section = useRef<HTMLElement>(null);
  const progress = useRef({ current: 0 }).current;

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: '+=100%',
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        progress.current = Math.min(1, Math.max(0, (self.progress - 0.05) / 0.9));
      },
    });
    return () => st.kill();
  }, [progress]);

  return (
    <section ref={section} className="relative h-svh w-full overflow-hidden bg-[#ececec]" aria-label={t.story.title}>
      <CarWash progress={progress} className="absolute inset-0 block h-full w-full" />
    </section>
  );
}
