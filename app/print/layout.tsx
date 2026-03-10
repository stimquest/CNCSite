import type { Metadata } from 'next';
import { Outfit, Syncopate, Shrikhand } from 'next/font/google';
import '../globals.css';
import { ContentProvider } from '@/contexts/ContentContext';

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
    title: 'Impression Planning - CNC Coutainville',
};

export default function PrintLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${outfit.variable} ${syncopate.variable} ${shrikhand.variable} font-sans text-abysse antialiased min-h-screen bg-white`}>
            <ContentProvider>
                {children}
            </ContentProvider>
        </div>
    );
}
