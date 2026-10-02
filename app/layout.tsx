import type { Viewport } from 'next';
import DevDomBridge from '@/components/DevDomBridge';
/**
 * Layout racine minimal - les layouts spécifiques sont dans :
 * - (site)/layout.tsx - Site public avec Header/Footer
 * - (studio)/layout.tsx - Sanity Studio sans décoration
 */
// Barre d'état / chrome du navigateur assortis au header blanc
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Swanky+and+Moo+Moo&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossOrigin="" />
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === 'development' && <DevDomBridge />}
      </body>
    </html>
  );
}
