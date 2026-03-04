"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Page de debug OneSignal supprimée — redirection vers l'accueil.
export default function LegacyDebugPage() {
    const router = useRouter();
    useEffect(() => { router.replace('/'); }, [router]);
    return null;
}
