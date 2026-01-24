import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ContentProvider } from '@/contexts/ContentContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CVC - Club de Voile de Coutainville',
  description: 'Club de Voile de Coutainville, l\'école de référence sur la côte Ouest du Cotentin depuis 1965.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossOrigin="" />
      </head>
      <body className={`${jakarta.className} bg-background-light font-sans text-abysse antialiased selection:bg-turquoise selection:text-white`}>
        <ContentProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow pt-20">
              {children}
            </main>
            <Footer />
          </div>
        </ContentProvider>
      </body>
    </html>
  );
}
