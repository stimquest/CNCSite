import { OneSignalProvider } from '@/components/OneSignalProvider';

export default function FilInfoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <OneSignalProvider>
            {children}
        </OneSignalProvider>
    );
}
