'use client';

import { useEffect, useState } from 'react';
import { waLink } from '@/content/site';
import { useLang } from './LangProvider';
import { WhatsAppIcon } from './icons';

/** Floating booking button on phones, appears after the hero. */
export default function WhatsAppFab() {
  const { t } = useLang();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nearEnd = window.innerHeight + window.scrollY > document.body.scrollHeight - 600;
      const prices = document.getElementById('hinnat');
      const pastStory = prices ? prices.getBoundingClientRect().top < window.innerHeight * 0.6 : false;
      setShow(pastStory && !nearEnd);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      href={waLink(t.booking.wa)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.fab}
      tabIndex={show ? 0 : -1}
      className={`fixed bottom-5 left-1/2 z-40 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-ink px-5 py-3 text-[15px] font-medium text-white shadow-[0_8px_30px_rgb(0_0_0/0.25)] transition-all duration-500 sm:hidden ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <WhatsAppIcon />
      {t.fab}
    </a>
  );
}
