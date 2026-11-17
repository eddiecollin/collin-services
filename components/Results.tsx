'use client';

import { useCallback, useRef, useState } from 'react';
import { beforeAfter, galleryExterior, galleryInterior } from '@/content/media';
import { useLang } from './LangProvider';
import Drops from './Drops';

function Photo({ src, alt, label, className = '', labelClass = '' }: { src: string; alt: string; label: string; className?: string; labelClass?: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading="lazy" decoding="async" className={`h-full w-full object-cover ${className}`} draggable={false} />;
  }
  return (
    <div className={`placeholder flex h-full w-full items-center justify-center ${className}`}>
      <span className={`text-[13px] text-graphite ${labelClass}`}>{label}</span>
    </div>
  );
}

function BeforeAfter() {
  const { t } = useLang();
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <div
      ref={box}
      className="relative aspect-[16/10] w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[28px] max-md:aspect-[4/5] max-md:rounded-[22px]"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        update(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <div className="absolute inset-0">
        <Photo src={beforeAfter.after} alt={t.results.after} label={`${t.results.after}: ${t.results.placeholder}`} className="!bg-[#eef0f3]" labelClass="absolute right-[25%] translate-x-1/2" />
      </div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Photo src={beforeAfter.before} alt={t.results.before} label={`${t.results.before}: ${t.results.placeholder}`} className="!bg-[#e2e0dc]" labelClass="absolute left-[25%] -translate-x-1/2" />
      </div>

      <span className="pointer-events-none absolute left-5 top-5 rounded-full bg-black/55 px-3 py-1 text-[13px] font-medium text-white backdrop-blur">{t.results.before}</span>
      <span className="pointer-events-none absolute right-5 top-5 rounded-full bg-black/55 px-3 py-1 text-[13px] font-medium text-white backdrop-blur">{t.results.after}</span>

      <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_12px_rgb(0_0_0/0.25)]" style={{ left: `${pos}%` }}>
        <div className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgb(0_0_0/0.2)]">
          <svg viewBox="0 0 24 24" className="size-5 text-ink" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M9 6 3 12l6 6M15 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={t.results.slider}
        className="sr-only"
      />
    </div>
  );
}

export default function Results() {
  const { t, lang } = useLang();
  return (
    <section id="tyonjalki" className="relative bg-paper px-6 py-[clamp(88px,14vh,160px)]">
      <Drops
        drops={[
          { x: '90%', y: '4%', s: 20, speed: 1 },
          { x: '93%', y: '6.5%', s: 7, speed: 1 },
        ]}
      />
      <div className="relative z-10 mx-auto max-w-[1120px]">
        <h2 className="display chrome-text pb-[0.06em] text-[clamp(40px,6vw,80px)]">{t.results.title}</h2>
        <p className="mt-4 text-[17px] text-graphite">{t.results.sub}</p>
        <div className="mt-12">
          <BeforeAfter />
        </div>

        <h3 className="headline chrome-text mt-24 text-[clamp(26px,2.8vw,36px)]">{t.results.gallery}</h3>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {galleryExterior.map((g, i) => (
            <div
              key={g.src}
              className={`overflow-hidden rounded-[20px] bg-mist ${i === 0 ? 'col-span-2 aspect-[4/5] md:col-span-1 md:aspect-[3/4]' : 'aspect-[3/4]'}`}
            >
              <Photo src={g.src} alt={g.alt[lang]} label={t.results.placeholder} />
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 md:mt-4 md:grid-cols-4 md:gap-4">
          {galleryInterior.map((g) => (
            <div key={g.src} className="aspect-[3/4] overflow-hidden rounded-[20px] bg-mist">
              <Photo src={g.src} alt={g.alt[lang]} label={t.results.placeholder} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
