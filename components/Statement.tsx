'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from './LangProvider';

gsap.registerPlugin(ScrollTrigger);

/** Big sentence whose words light up as you scroll past. */
export default function Statement() {
  const { t, lang } = useLang();
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('span'),
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [lang]);

  return (
    <section className="bg-paper px-6 py-[clamp(100px,18vh,200px)]">
      <p
        ref={ref}
        aria-label={t.statement}
        className="headline mx-auto max-w-[980px] text-balance text-[clamp(30px,4.6vw,60px)]"
      >
        {t.statement.split(' ').map((w, i) => (
          <span key={`${lang}-${i}`} aria-hidden="true">
            {w}{' '}
          </span>
        ))}
      </p>
    </section>
  );
}
