// ─────────────────────────────────────────────────────────────
//  PHOTOS. Put image files in /public/images/ and fill in the paths.
//  Empty strings show a placeholder box until you add the photo.
// ─────────────────────────────────────────────────────────────

export const beforeAfter = {
  before: '', // e.g. '/images/before-1.jpg'
  after: '', //  e.g. '/images/after-1.jpg'
};

type Shot = { src: string; alt: { fi: string; en: string } };

// "Työnjälkeä": exterior shots first (row of three), then interiors (row of four).
export const galleryExterior: Shot[] = [
  { src: '/images/exterior-gclass.jpg', alt: { fi: 'Pesty Mercedes G-sarja', en: 'Washed Mercedes G-Class' } },
  { src: '/images/exterior-porsche-944.jpg', alt: { fi: 'Kiillotettu hopeinen Porsche 944', en: 'Polished silver Porsche 944' } },
  { src: '/images/exterior-mini.jpg', alt: { fi: 'Pesty Mini, takalokasuoja ja vanne', en: 'Washed Mini, rear wing and wheel' } },
];

export const galleryInterior: Shot[] = [
  { src: '/images/interior-gclass-day.jpg', alt: { fi: 'Mercedes G-sarjan puhdistettu sisätila', en: 'Cleaned interior of a Mercedes G-Class' } },
  { src: '/images/interior-porsche-green.jpg', alt: { fi: 'Porschen vihreä verhoilu puhdistuksen jälkeen', en: 'Porsche green upholstery after cleaning' } },
  { src: '/images/interior-porsche-tan.jpg', alt: { fi: 'Porschen ruskea nahkasisustus puhdistuksen jälkeen', en: 'Porsche tan leather interior after cleaning' } },
  { src: '/images/interior-gclass-night.jpg', alt: { fi: 'Mercedes G-sarjan sisätila tunnelmavalaistuksessa', en: 'Mercedes G-Class interior with ambient lighting' } },
];

export const aboutPhoto = ''; // e.g. '/images/eddie.jpg'
