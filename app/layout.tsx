import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';

export const metadata: Metadata = {
  title: 'Collin Services – Autonpesu ja detailing Porvoossa',
  description:
    'Ulkopesu, sisäpuhdistus, kiillotus, vahaus ja keraaminen pinnoite Porvoossa. Varaa aika helposti WhatsAppissa.',
  openGraph: {
    title: 'Collin Services – Autonpesu ja detailing Porvoossa',
    description: 'Ulkopesu, sisäpuhdistus, kiillotus, vahaus ja keraaminen pinnoite. Varaa WhatsAppissa.',
    locale: 'fi_FI',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi" className={GeistSans.variable}>
      <body>{children}</body>
    </html>
  );
}
