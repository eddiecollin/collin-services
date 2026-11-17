// ─────────────────────────────────────────────────────────────
//  COLLIN SERVICES — business details, services and prices.
//  Edit this file to change phone number, prices or services.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: 'Collin Services',
  city: 'Porvoo',
  phoneDisplay: '040 675 6656',
  phoneIntl: '+358406756656',
  whatsappNumber: '358406756656', // international format, no + or spaces
  year: 2026,
};

export function waLink(message?: string) {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export type SizeKey = 'small' | 'medium' | 'large';

export type Service = {
  id: string;
  name: { fi: string; en: string };
  desc: { fi: string; en: string };
  // Price in euros per car size. `small` is the "starting from" price.
  // Fill in `medium` and `large` when you've decided them — once every
  // service has all three, a car-size switch appears above the price list.
  prices: Record<SizeKey, number | null>;
};

export const services: Service[] = [
  {
    id: 'exterior',
    name: { fi: 'Ulkopesu', en: 'Exterior wash' },
    desc: {
      fi: 'Huolellinen käsinpesu, vanteet ja kuivaus.',
      en: 'Careful hand wash, wheels and drying.',
    },
    prices: { small: 30, medium: null, large: null },
  },
  {
    id: 'interior',
    name: { fi: 'Sisäpuhdistus', en: 'Interior cleaning' },
    desc: {
      fi: 'Imurointi, pintojen puhdistus ja ikkunat sisältä.',
      en: 'Vacuuming, surface cleaning and inside windows.',
    },
    prices: { small: 80, medium: null, large: null },
  },
  {
    id: 'deep',
    name: { fi: 'Syväpuhdistus', en: 'Deep detail' },
    desc: {
      fi: 'Perusteellinen puhdistus sisältä ja ulkoa.',
      en: 'A thorough clean, inside and out.',
    },
    prices: { small: 150, medium: null, large: null },
  },
  {
    id: 'polish',
    name: { fi: 'Kiillotus', en: 'Polishing' },
    desc: {
      fi: 'Pesunaarmut ja himmeys pois, syvä kiilto takaisin.',
      en: 'Removes swirl marks and dullness, brings back deep gloss.',
    },
    prices: { small: 250, medium: null, large: null },
  },
  {
    id: 'ceramic',
    name: { fi: 'Keraaminen pinnoite', en: 'Ceramic coating' },
    desc: {
      fi: 'Kova suoja, joka hylkii vettä ja likaa.',
      en: 'Hard protection that repels water and dirt.',
    },
    prices: { small: 120, medium: null, large: null },
  },
  {
    id: 'wax',
    name: { fi: 'Vahaus', en: 'Waxing' },
    desc: {
      fi: 'Lämmin kiilto ja suoja maalipinnalle.',
      en: 'Warm gloss and protection for the paint.',
    },
    prices: { small: 120, medium: null, large: null },
  },
];

export const hasSizePricing = services.every(
  (s) => s.prices.medium != null && s.prices.large != null,
);
