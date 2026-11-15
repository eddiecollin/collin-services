import { LangProvider } from '@/components/LangProvider';
import SmoothScroll from '@/components/SmoothScroll';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Story from '@/components/Story';
import Statement from '@/components/Statement';
import Services from '@/components/Services';
import Results from '@/components/Results';
import About from '@/components/About';
import Booking from '@/components/Booking';
import WhatsAppFab from '@/components/WhatsAppFab';

export default function Home() {
  return (
    <LangProvider>
      <SmoothScroll />
      <Nav />
      <main>
        <Hero />
        <Statement />
        <Story />
        <Services />
        <Results />
        <About />
        <Booking />
      </main>
      <WhatsAppFab />
    </LangProvider>
  );
}
