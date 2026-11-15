// All text on the site, in Finnish and English.

export type Lang = 'fi' | 'en';

export const dict = {
  fi: {
    meta: { skip: 'Siirry sisältöön' },
    nav: {
      services: 'Hinnat',
      results: 'Työnjälki',
      about: 'Meistä',
      book: 'Varaa aika',
      logo: 'Logo tulee tähän',
    },
    hero: {
      title: 'Kiilto, jonka huomaa.',
      sub: 'Autonpesu ja detailing Porvoossa.',
      cta: 'Varaa WhatsAppissa',
      prices: 'Katso hinnat',
      caption: 'Keraaminen pinnoite. Vesi helmeilee pois, lika ei tartu.',
      hint: 'Liikuta hiirtä valon mukana',
    },
    story: {
      title: 'Pinnasta peiliksi kolmessa vaiheessa.',
      steps: [
        { name: 'Pesu', text: 'Lika ja tiesuola irti käsin, maalipintaa naarmuttamatta.' },
        { name: 'Kiillotus', text: 'Pesunaarmut ja himmeys pois. Heijastus terävöityy.' },
        { name: 'Suojaus', text: 'Vaha tai keraaminen pinnoite sulkee pinnan. Vesi helmeilee pois.' },
      ],
    },
    statement:
      'Pesemme, kiillotamme ja suojaamme autosi täällä Porvoossa. Sinä varaat ajan yhdellä viestillä.',
    services: {
      title: 'Palvelut ja hinnat',
      sub: 'Hinnat alkaen. Lopullinen hinta riippuu auton koosta ja kunnosta.',
      from: 'alkaen',
      book: 'Varaa',
      ask: 'Kysy hinta',
      sizeLabel: 'Auton koko',
      sizes: { small: 'Pieni', medium: 'Keskikokoinen', large: 'Iso / maasturi' },
      wa: (s: string) => `Hei! Haluaisin varata ajan: ${s}. Autoni on `,
    },
    results: {
      title: 'Ennen ja jälkeen',
      sub: 'Vedä liukusäädintä nähdäksesi eron.',
      before: 'Ennen',
      after: 'Jälkeen',
      placeholder: 'Kuva tulossa',
      slider: 'Ennen ja jälkeen -vertailu',
      gallery: 'Työnjälkeä',
    },
    about: {
      title: 'Collin Services',
      text: 'Collin Services on porvoolainen autonpesu- ja detailing-palvelu. Jokainen auto pestään käsin ja käsitellään huolella, oli kyseessä nopea ulkopesu tai täysi kiillotus ja pinnoitus.',
      facts: ['Palvelemme Porvoossa', 'Varaus WhatsAppissa', 'Hinta auton koon mukaan'],
      photo: 'Kuva tulossa',
    },
    booking: {
      title: 'Varaa aika yhdellä viestillä.',
      text: 'Kerro WhatsAppissa automallisi ja haluamasi palvelu, niin sovitaan aika.',
      cta: 'Avaa WhatsApp',
      call: 'Tai soita',
      wa: 'Hei! Haluaisin varata ajan autonpesuun.',
    },
    footer: { rights: 'Kaikki oikeudet pidätetään.' },
    fab: 'Varaa WhatsAppissa',
  },
  en: {
    meta: { skip: 'Skip to content' },
    nav: {
      services: 'Prices',
      results: 'Our work',
      about: 'About',
      book: 'Book now',
      logo: 'Logo goes here',
    },
    hero: {
      title: 'A shine people notice.',
      sub: 'Car washing and detailing in Porvoo.',
      cta: 'Book on WhatsApp',
      prices: 'See prices',
      caption: 'Ceramic coating. Water beads off, dirt doesn’t stick.',
      hint: 'Move your mouse to follow the light',
    },
    story: {
      title: 'From dull to mirror in three steps.',
      steps: [
        { name: 'Wash', text: 'Dirt and road salt off by hand, without scratching the paint.' },
        { name: 'Polish', text: 'Swirl marks and dullness out. Reflections sharpen.' },
        { name: 'Protect', text: 'Wax or ceramic coating seals the paint. Water beads off.' },
      ],
    },
    statement:
      'We wash, polish and protect your car right here in Porvoo. You book with a single message.',
    services: {
      title: 'Services and prices',
      sub: 'Starting prices. The final price depends on the size and condition of your car.',
      from: 'from',
      book: 'Book',
      ask: 'Ask for price',
      sizeLabel: 'Car size',
      sizes: { small: 'Small', medium: 'Mid-size', large: 'Large / SUV' },
      wa: (s: string) => `Hi! I'd like to book: ${s}. My car is a `,
    },
    results: {
      title: 'Before and after',
      sub: 'Drag the slider to see the difference.',
      before: 'Before',
      after: 'After',
      placeholder: 'Photo coming soon',
      slider: 'Before and after comparison',
      gallery: 'Our work',
    },
    about: {
      title: 'Collin Services',
      text: 'Collin Services is a car washing and detailing service based in Porvoo. Every car is washed by hand and treated with care, whether it’s a quick exterior wash or a full polish and coating.',
      facts: ['Serving Porvoo', 'Book on WhatsApp', 'Priced by car size'],
      photo: 'Photo coming soon',
    },
    booking: {
      title: 'Book with a single message.',
      text: 'Tell us your car model and the service you want on WhatsApp, and we’ll agree on a time.',
      cta: 'Open WhatsApp',
      call: 'Or call',
      wa: "Hi! I'd like to book a car wash.",
    },
    footer: { rights: 'All rights reserved.' },
    fab: 'Book on WhatsApp',
  },
} as const;

export type Dict = (typeof dict)[Lang];
