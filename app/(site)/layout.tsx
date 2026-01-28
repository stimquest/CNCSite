import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '../globals.css';
import { ContentProvider } from '@/contexts/ContentContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import BackgroundParallax from '@/components/BackgroundParallax';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CVC - Club de Voile de Coutainville',
  description: 'Club de Voile de Coutainville, l\'école de référence sur la côte Ouest du Cotentin depuis 1965.',
};

import { ConvexClientProvider } from '@/components/ConvexClientProvider';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossOrigin="" />
      </head>
      <body className={`${jakarta.className} font-sans text-abysse antialiased selection:bg-turquoise selection:text-white`}>
        <BackgroundParallax />
        <ConvexClientProvider>
          <ContentProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="grow pt-20">
                {children}
              </main>
              <Footer />
            </div>
          </ContentProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
