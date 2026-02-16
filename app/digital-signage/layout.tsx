import { Plus_Jakarta_Sans } from 'next/font/google';
import '../globals.css';
import { ContentProvider } from '@/contexts/ContentContext';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });

export default function SignageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${jakarta.className} antialiased selection:bg-turquoise selection:text-white min-h-screen bg-black overflow-hidden`}>
            <ContentProvider>
                {children}
            </ContentProvider>
        </div>
    );
}
