'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from './LangProvider';
import PaintCanvas from './PaintCanvas';

gsap.registerPlugin(ScrollTrigger);

/** Pinned scroll section: the same paint goes dirty → washed → polished → coated. */
export default function Story() {
  const { t } = useLang();
  const section = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const progress = useRef({ current: 0 }).current;
  const [step, setStep] = useState(0);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: '+=280%',
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        const p = Math.min(1, Math.max(0, (self.progress - 0.04) / 0.9));
        progress.current = p;
        setStep(p < 0.35 ? 0 : p < 0.66 ? 1 : 2);
        if (bar.current) bar.current.style.transform = `scaleY(${self.progress})`;
      },
    });
    return () => st.kill();
  }, [progress]);

  return (
    <section ref={section} className="relative h-svh w-full overflow-hidden bg-lacquer text-white" aria-label={t.story.title}>
      <PaintCanvas progress={progress} className="paint-fallback absolute inset-0 block h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(5_10_18/0.72)_0%,rgb(5_10_18/0.25)_45%,transparent_70%)] max-md:bg-[linear-gradient(0deg,rgb(5_10_18/0.85)_0%,rgb(5_10_18/0.3)_45%,transparent_70%)]" />

      <div className="relative mx-auto flex h-full max-w-[1120px] items-center px-6 max-md:items-end max-md:pb-[10vh]">
        <div className="flex gap-6 md:gap-8">
          <div className="relative w-px shrink-0 bg-white/20" aria-hidden="true">
            <div ref={bar} className="absolute inset-0 origin-top scale-y-0 bg-white" />
          </div>
          <div className="max-w-[440px]">
            <h2 className="headline mb-8 text-balance text-[clamp(28px,3.4vw,44px)] max-md:mb-5">{t.story.title}</h2>
            <ol className="space-y-6 max-md:space-y-0">
              {t.story.steps.map((s, i) => (
                <li
                  key={s.name}
                  aria-current={step === i ? 'step' : undefined}
                  className={`transition-all duration-500 ${
                    step === i ? 'opacity-100' : 'opacity-35 max-md:hidden'
                  }`}
                >
                  <p className="text-[clamp(20px,1.9vw,26px)] font-semibold tracking-[-0.02em]">
                    <span className="tabular mr-3 text-flake">{i + 1}</span>
                    {s.name}
                  </p>
                  <p className="mt-1.5 max-w-[36ch] pl-[1.65em] text-[16px] leading-relaxed text-white/75">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
