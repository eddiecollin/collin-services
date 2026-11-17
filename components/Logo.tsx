'use client';

import { site } from '@/content/site';
import LogoMark from './LogoMark';

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a href="#top" className={`flex items-center gap-2 ${dark ? 'text-white' : 'text-ink'}`} aria-label={site.name}>
      <LogoMark className="size-[22px]" light={dark} />
      <span className="text-[15px] font-semibold tracking-[-0.02em]">{site.name}</span>
    </a>
  );
}
