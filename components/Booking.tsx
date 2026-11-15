'use client';

import { site, waLink } from '@/content/site';
import { LangSwitch, useLang } from './LangProvider';
import Logo from './Logo';
import { PhoneIcon, WhatsAppIcon } from './icons';

export default function Booking() {
  const { t } = useLang();
  return (
    <>
      <section id="varaa" className="bg-lacquer px-6 pb-[clamp(88px,14vh,160px)] pt-[clamp(100px,16vh,180px)] text-white">
        <div className="mx-auto max-w-[1120px] text-center">
          <h2 className="display mx-auto max-w-[14ch] text-balance text-[clamp(44px,7.4vw,104px)]">{t.booking.title}</h2>
          <p className="mx-auto mt-6 max-w-[44ch] text-[clamp(17px,1.5vw,20px)] leading-relaxed text-white/70">{t.booking.text}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <a
              href={waLink(t.booking.wa)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-[17px] font-semibold text-ink transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <WhatsAppIcon className="size-5" />
              {t.booking.cta}
            </a>
            <a href={`tel:${site.phoneIntl}`} className="inline-flex items-center gap-2 text-[17px] text-white/80 transition-colors hover:text-white">
              <PhoneIcon />
              {t.booking.call} <span className="tabular font-medium text-white">{site.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-lacquer px-6 pb-10 text-white">
        <div className="mx-auto flex max-w-[1120px] flex-col items-start gap-6 border-t border-white/10 pt-8 text-[13px] text-white/55 md:flex-row md:items-center md:justify-between">
          <Logo dark />
          <p>
            {site.city}, <a href={`tel:${site.phoneIntl}`} className="hover:text-white">{site.phoneDisplay}</a>
          </p>
          <p>© {site.year} {site.name}. {t.footer.rights}</p>
          <LangSwitch dark />
        </div>
      </footer>
    </>
  );
}
