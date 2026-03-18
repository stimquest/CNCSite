import type { Metadata } from 'next';

export const metadata: Metadata = {
    manifest: '/manifest-vigie.json',
};

export default function FilInfoLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
