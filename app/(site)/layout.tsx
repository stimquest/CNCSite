import type { Metadata } from 'next';
import { Outfit, Syncopate, Shrikhand } from 'next/font/google';
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
const shrikhand = Shrikhand({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-logo',
});

export const metadata: Metadata = {
  title: 'CNC - Club de Voile de Coutainville',
  description: 'Club de Voile de Coutainville, l\'école de référence sur la côte Ouest du Cotentin depuis 1978.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SportsClub',
      '@id': 'https://cnccoutainville.fr/#organization',
      name: 'CNC — Club Nautique de Coutainville',
      alternateName: 'Club Nautique de Coutainville',
      url: 'https://cnccoutainville.fr',
      description:
        "Club nautique associatif à Agon-Coutainville proposant des stages et activités de voile, char à voile, marche aquatique, wingfoil, kitesurf et kayak sur la côte normande.",
      sport: ['Voile', 'Char à voile', 'Marche aquatique', 'Wingfoil', 'Kitesurf', 'Kayak', 'Paddle'],
      foundingDate: '1978',
      memberOf: [
        { '@type': 'Organization', name: 'Fédération Française de Voile', url: 'https://www.ffvoile.fr' },
        { '@type': 'Organization', name: 'Fédération Française de Char à Voile', url: 'https://www.ffcv.org' },
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Plage de Coutainville',
        addressLocality: 'Agon-Coutainville',
        postalCode: '50230',
        addressRegion: 'Normandie',
        addressCountry: 'FR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 49.0458,
        longitude: -1.5878,
      },
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://cnccoutainville.fr/#localbusiness',
      name: 'CNC — Club Nautique de Coutainville',
      url: 'https://cnccoutainville.fr',
      image: 'https://cnccoutainville.fr/og-image.jpg',
      priceRange: '€€',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Plage de Coutainville',
        addressLocality: 'Agon-Coutainville',
        postalCode: '50230',
        addressRegion: 'Normandie',
        addressCountry: 'FR',
      },
    },
  ],
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={`${outfit.variable} ${syncopate.variable} ${shrikhand.variable} font-sans text-abysse antialiased selection:bg-turquoise selection:text-white`}>
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
