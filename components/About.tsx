'use client';

import { aboutPhoto } from '@/content/media';
import { useLang } from './LangProvider';

export default function About() {
  const { t } = useLang();
  return (
    <section id="meista" className="bg-mist px-6 py-[clamp(88px,14vh,160px)]">
      <div className="mx-auto grid max-w-[1120px] items-center gap-12 md:grid-cols-[5fr_6fr] md:gap-20">
        <div className="aspect-[4/5] overflow-hidden rounded-[28px]">
          {aboutPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={aboutPhoto} alt={t.about.title} className="h-full w-full object-cover" />
          ) : (
            <div className="placeholder flex h-full w-full items-center justify-center rounded-[28px]">
              <span className="text-[13px] text-graphite">{t.about.photo}</span>
            </div>
          )}
        </div>
        <div>
          <h2 className="display text-[clamp(40px,5.4vw,72px)]">{t.about.title}</h2>
          <p className="mt-6 max-w-[52ch] text-[clamp(17px,1.5vw,20px)] leading-[1.6] text-ink/80">{t.about.text}</p>
          <ul className="mt-10 space-y-3">
            {t.about.facts.map((f) => (
              <li key={f} className="flex items-center gap-3 text-[16px] font-medium">
                <svg viewBox="0 0 20 20" className="size-5 shrink-0 text-ink" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="m5 10.5 3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
