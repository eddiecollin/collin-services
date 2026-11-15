'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from './LangProvider';
import CarWash from './CarWash';

gsap.registerPlugin(ScrollTrigger);

/** Pinned scroll section: a real car goes dirty → foam → rinse → shine in a white garage. */
export default function Story() {
  const { t } = useLang();
  const section = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const progress = useRef({ current: 0 }).current;
  const [step, setStep] = useState(-1);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: '+=320%',
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        const p = Math.min(1, Math.max(0, (self.progress - 0.03) / 0.92));
        progress.current = p;
        setStep(p < 0.1 ? -1 : p < 0.42 ? 0 : p < 0.77 ? 1 : 2);
        if (bar.current) bar.current.style.transform = `scaleY(${self.progress})`;
      },
    });
    return () => st.kill();
  }, [progress]);

  return (
    <section ref={section} className="relative h-svh w-full overflow-hidden bg-[#ececec] text-ink" aria-label={t.story.title}>
      <CarWash progress={progress} className="absolute inset-0 block h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(245_245_245/0.85)_0%,rgb(245_245_245/0.35)_32%,transparent_50%)] max-md:bg-[linear-gradient(0deg,rgb(245_245_245/0.95)_0%,rgb(245_245_245/0.6)_28%,transparent_45%)]" />

      <div className="relative mx-auto flex h-full max-w-[1120px] items-center px-6 max-md:items-end max-md:pb-[9vh]">
        <div className="flex gap-6 md:gap-8">
          <div className="relative w-px shrink-0 bg-black/15" aria-hidden="true">
            <div ref={bar} className="absolute inset-0 origin-top scale-y-0 bg-ink" />
          </div>
          <div className="max-w-[400px]">
            <h2 className="headline mb-8 text-balance text-[clamp(28px,3.4vw,44px)] max-md:mb-4">{t.story.title}</h2>
            <ol className="space-y-6 max-md:min-h-[88px] max-md:space-y-0">
              {t.story.steps.map((s, i) => (
                <li
                  key={s.name}
                  aria-current={step === i ? 'step' : undefined}
                  className={`transition-all duration-500 ${
                    step === i ? 'opacity-100' : `opacity-30 ${i === Math.max(step, 0) ? '' : 'max-md:hidden'}`
                  }`}
                >
                  <p className="text-[clamp(20px,1.9vw,26px)] font-semibold tracking-[-0.02em]">
                    <span className="tabular mr-3 text-graphite">{i + 1}</span>
                    {s.name}
                  </p>
                  <p className="mt-1.5 max-w-[34ch] pl-[1.65em] text-[16px] leading-relaxed text-ink/70">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
