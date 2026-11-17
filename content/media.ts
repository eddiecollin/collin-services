// ─────────────────────────────────────────────────────────────
//  PHOTOS. Put image files in /public/images/ and fill in the paths.
//  Empty strings show a placeholder box until you add the photo.
// ─────────────────────────────────────────────────────────────

export const beforeAfter = {
  before: '', // e.g. '/images/before-1.jpg'
  after: '', //  e.g. '/images/after-1.jpg'
};

// Shown in "Työnjälkeä" as tall tiles, in this order. Add exterior shots the same way.
export const gallery: { src: string; alt: { fi: string; en: string } }[] = [
  { src: '/images/interior-gclass-day.jpg', alt: { fi: 'Mercedes G-sarjan puhdistettu sisätila', en: 'Cleaned interior of a Mercedes G-Class' } },
  { src: '/images/interior-porsche-green.jpg', alt: { fi: 'Porschen vihreä verhoilu puhdistuksen jälkeen', en: 'Porsche green upholstery after cleaning' } },
  { src: '/images/interior-porsche-tan.jpg', alt: { fi: 'Porschen ruskea nahkasisustus puhdistuksen jälkeen', en: 'Porsche tan leather interior after cleaning' } },
  { src: '/images/interior-gclass-night.jpg', alt: { fi: 'Mercedes G-sarjan sisätila tunnelmavalaistuksessa', en: 'Mercedes G-Class interior with ambient lighting' } },
];

export const aboutPhoto = ''; // e.g. '/images/eddie.jpg'
