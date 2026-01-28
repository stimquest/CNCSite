import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CNC Studio - Administration',
  description: 'Interface d\'administration du Club Nautique de Coutainville',
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
