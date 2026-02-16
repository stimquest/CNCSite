import type { Metadata } from 'next';
import { Outfit, Syncopate } from 'next/font/google';
import '../globals.css';
import { ContentProvider } from '@/contexts/ContentContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingActions } from '@/components/FloatingActions';
import { SmoothScroll } from '@/components/SmoothScroll';
import { CookieBanner } from '@/components/CookieBanner';
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '600', '800'],
  variable: '--font-sans',
});
const syncopate = Syncopate({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'CVC - Club de Voile de Coutainville',
  description: 'Club de Voile de Coutainville, l\'école de référence sur la côte Ouest du Cotentin depuis 1978.',
};


export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={`${outfit.variable} ${syncopate.variable} font-sans text-abysse antialiased selection:bg-turquoise selection:text-white`}>
        <ContentProvider>
          <SmoothScroll>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="grow pt-16">
                {children}
              </main>
              <Footer />
              <FloatingActions />
              <CookieBanner />
            </div>
          </SmoothScroll>
        </ContentProvider>
      </div>
    </>
  );
}
