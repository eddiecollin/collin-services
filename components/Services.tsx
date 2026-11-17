'use client';

import { useState } from 'react';
import { hasSizePricing, services, waLink, type SizeKey } from '@/content/site';
import { useLang } from './LangProvider';
import Drops from './Drops';

export default function Services() {
  const { t, lang } = useLang();
  const [size, setSize] = useState<SizeKey>('small');
  const sizes: SizeKey[] = ['small', 'medium', 'large'];

  return (
    <section id="hinnat" className="relative bg-mist px-6 py-[clamp(88px,14vh,160px)]">
      <Drops
        drops={[
          { x: '88%', y: '6%', s: 26, speed: 1 },
          { x: '91.5%', y: '9.5%', s: 9, speed: 1 },
          { x: '4%', y: '58%', s: 13, speed: 0.7, desktopOnly: true },
        ]}
      />
      <div className="relative z-10 mx-auto max-w-[1120px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="display chrome-text pb-[0.06em] text-[clamp(40px,6vw,80px)]">{t.services.title}</h2>
            <p className="mt-4 max-w-[46ch] text-[17px] leading-relaxed text-graphite">{t.services.sub}</p>
          </div>

          {hasSizePricing && (
            <div role="radiogroup" aria-label={t.services.sizeLabel} className="flex self-start rounded-full bg-black/[0.06] p-1 text-[14px] md:self-auto">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={size === s}
                  onClick={() => setSize(s)}
                  className={`rounded-full px-4 py-1.5 transition-all ${
                    size === s ? 'bg-white text-ink shadow-[0_1px_3px_rgb(0_0_0/0.12)]' : 'text-graphite hover:text-ink'
                  }`}
                >
                  {t.services.sizes[s]}
                </button>
              ))}
            </div>
          )}
        </div>

        <ul className="chrome-rule mt-14 border-t border-hairline">
          {services.map((s) => {
            const price = s.prices[size] ?? s.prices.small;
            const name = s.name[lang];
            return (
              <li
                key={s.id}
                className="chrome-rule group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_120px_96px] md:py-8"
              >
                <h3 className="text-[clamp(22px,2.3vw,30px)] font-semibold tracking-[-0.025em]">{name}</h3>
                <p className="col-span-1 row-start-2 text-[15px] text-graphite md:col-auto md:row-auto">{s.desc[lang]}</p>
                <p className="tabular col-start-2 row-span-2 row-start-1 text-right md:col-auto md:row-auto">
                  {price != null ? (
                    <>
                      <span className="block text-[13px] text-graphite">{t.services.from}</span>
                      <span className="text-[clamp(26px,2.6vw,34px)] font-semibold tracking-[-0.03em]">{price} €</span>
                    </>
                  ) : (
                    <span className="text-[15px] text-graphite">{t.services.ask}</span>
                  )}
                </p>
                <a
                  href={waLink(t.services.wa(name))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-2 mt-3 justify-self-start rounded-full border border-ink/15 px-4 py-1.5 text-[14px] font-medium transition-colors hover:border-ink hover:bg-ink hover:text-white md:col-auto md:mt-0 md:justify-self-end"
                >
                  {t.services.book}
                  <span className="sr-only">: {name}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
