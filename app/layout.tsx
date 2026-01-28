/**
 * Layout racine minimal - les layouts spécifiques sont dans :
 * - (site)/layout.tsx - Site public avec Header/Footer
 * - (studio)/layout.tsx - Sanity Studio sans décoration
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
