'use client';

import { waLink } from '@/content/site';
import { LangSwitch, useLang } from './LangProvider';
import Logo from './Logo';
import { WhatsAppIcon } from './icons';

export default function Nav() {
  const { t } = useLang();
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/[0.06] bg-white/72 backdrop-blur-xl backdrop-saturate-150">
      <nav className="mx-auto flex h-14 max-w-[1120px] items-center justify-between gap-4 px-5">
        <Logo />
        <div className="flex items-center gap-1 sm:gap-6">
          <ul className="hidden items-center gap-6 text-[13px] text-ink/80 md:flex">
            <li><a href="#hinnat" className="transition-colors hover:text-ink">{t.nav.services}</a></li>
            <li><a href="#tyonjalki" className="transition-colors hover:text-ink">{t.nav.results}</a></li>
            <li><a href="#meista" className="transition-colors hover:text-ink">{t.nav.about}</a></li>
          </ul>
          <LangSwitch />
          <a
            href={waLink(t.booking.wa)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-chrome ml-2 hidden items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-[13px] font-medium text-white transition-transform hover:scale-[1.03] active:scale-[0.98] sm:inline-flex"
          >
            <WhatsAppIcon className="size-3.5" />
            {t.nav.book}
          </a>
        </div>
      </nav>
    </header>
  );
}
