'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { dict, type Dict, type Lang } from '@/content/i18n';

type Ctx = { lang: Lang; t: Dict; setLang: (l: Lang) => void };
const LangContext = createContext<Ctx>({ lang: 'fi', t: dict.fi, setLang: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fi');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lang');
      if (saved === 'fi' || saved === 'en') setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('lang', l);
    } catch {}
  };

  return <LangContext.Provider value={{ lang, t: dict[lang], setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

export function LangSwitch({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div
      role="group"
      aria-label="Kieli / Language"
      className={`flex rounded-full p-0.5 text-[12px] font-medium ${dark ? 'bg-white/10' : 'bg-black/[0.06]'}`}
    >
      {(['fi', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            lang === l
              ? dark
                ? 'bg-white text-ink'
                : 'bg-white text-ink shadow-[0_1px_2px_rgb(0_0_0/0.12)]'
              : dark
                ? 'text-white/60 hover:text-white'
                : 'text-graphite hover:text-ink'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
