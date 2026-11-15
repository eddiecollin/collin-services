'use client';

import { site } from '@/content/site';
import { useLang } from './LangProvider';

/** Logo space. Shows an empty frame until `site.logo` is set. */
export default function Logo({ dark = false }: { dark?: boolean }) {
  const { t } = useLang();
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label={site.name}>
      {site.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={site.logo} alt="" className="h-7 w-auto" />
      ) : (
        <span
          title={t.nav.logo}
          className={`block h-7 w-7 rounded-[8px] border border-dashed ${dark ? 'border-white/30' : 'border-black/20'}`}
        />
      )}
      <span className={`text-[15px] font-semibold tracking-[-0.02em] ${dark ? 'text-white' : 'text-ink'}`}>
        {site.name}
      </span>
    </a>
  );
}
