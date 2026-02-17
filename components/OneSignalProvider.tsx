"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import Script from 'next/script';

declare global {
    interface Window {
        OneSignal: any;
        OneSignalDeferred: any[];
    }
}

interface OneSignalContextType {
    isInitialized: boolean;
    isSubscribed: boolean;
    activeTags: Record<string, string>;
    subscribeToGroup: (groupId: string) => Promise<void>;
    unsubscribeFromGroup: (groupId: string) => Promise<void>;
    unsubscribeAll: () => Promise<void>;
    refreshTags: () => Promise<void>;
}

const OneSignalContext = createContext<OneSignalContextType | undefined>(undefined);

export const useOneSignal = () => {
    const context = useContext(OneSignalContext);
    if (!context) {
        throw new Error('useOneSignal must be used within a OneSignalProvider');
    }
    return context;
};

interface OneSignalProviderProps {
    children: React.ReactNode;
}

export const OneSignalProvider: React.FC<OneSignalProviderProps> = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [activeTags, setActiveTags] = useState<Record<string, string>>({});

    const refreshTags = async () => {
        const os = (window as any).OneSignal;
        if (!os) {
            // If OneSignal is not yet available, queue the operation
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            window.OneSignalDeferred.push(async (OneSignal: any) => {
                try {
                    const tags = await OneSignal.User.getTags();
                    console.log("OneSignal: Tags refreshed (deferred):", tags);
                    setActiveTags(tags || {});
                } catch (e) {
                    console.error("Error fetching OneSignal tags (deferred):", e);
                }
            });
            return;
        }

        try {
            const tags = await os.User.getTags();
            console.log("OneSignal: Tags refreshed:", tags);
            setActiveTags(tags || {});
        } catch (e) {
            console.error("Error fetching OneSignal tags:", e);
        }
    };

    useEffect(() => {
        let isJoining = false;

        const loadOneSignal = async () => {
            if (isJoining) return;
            isJoining = true;

            window.OneSignalDeferred = window.OneSignalDeferred || [];

            window.OneSignalDeferred.push(async (OneSignal: any) => {
                // Triple protection: global flag, OneSignal.initialized, and a local guard
                if (OneSignal.initialized || (window as any).__oneSignalInitialized) {
                    console.log("OneSignal: Already initialized, skipping init.");
                    setIsInitialized(true);
                    return;
                }

                (window as any).__oneSignalInitialized = true;

                try {
                    console.log("OneSignal: Starting minimal initialization...");

                    // On laisse OneSignal chercher OneSignalSDKWorker.js à la racine (dossier public/)
                    // On ne force le chemin que si nécessaire, OneSignal v16 est plus intelligent.
                    const initConfig: any = {
                        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
                        safari_web_id: process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_ID,
                        notifyButton: { enable: false }, // On utilise notre propre UI
                    };

                    // Si on est sur localhost, on ajoute le paramètre de sécurité
                    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
                        initConfig.allowLocalhostAsSecureOrigin = true;
                    }

                    console.log("OneSignal: Config using AppID:", initConfig.appId);
                    await OneSignal.init(initConfig);

                    // Sync initial state
                    if (OneSignal.User?.PushSubscription) {
                        const isOptedIn = OneSignal.User.PushSubscription.optedIn;
                        const subscriptionId = OneSignal.User.PushSubscription.id;
                        console.log("OneSignal: Subscription State:", { isOptedIn, subscriptionId });
                        setIsSubscribed(isOptedIn);
                    }

                    refreshTags();
                    setIsInitialized(true);
                    console.log("OneSignal: Initialized successfully.");
                    console.log("OneSignal: User ID (Registration):", OneSignal.User?.onesignalId || 'N/A');
                    console.log("OneSignal: Subscription ID (For Push):", OneSignal.User?.PushSubscription?.id || 'N/A');
                } catch (e: any) {
                    console.error("OneSignal: Critical Init Error:", e);
                    if (e.message?.includes('Can only be used on') || e.message?.includes('origin')) {
                        console.warn("OneSignal: Mismatch d'URL détecté. Vérifiez le 'Site URL' dans le Dashboard OneSignal.");
                        setIsInitialized(true);
                    } else if (e.name === 'AbortError' || e.message?.includes('push service error')) {
                        console.warn("OneSignal: Erreur de service push :", e.message);
                        setIsInitialized(true);
                    } else {
                        setIsInitialized(true); // Don't block UI even on error
                    }
                }
            });
        };

        loadOneSignal();
    }, []);

    const subscribeToGroup = async (groupId: string) => {
        if (typeof window === 'undefined') return;

        window.OneSignalDeferred = window.OneSignalDeferred || [];
        window.OneSignalDeferred.push(async (OneSignal: any) => {
            const tagKey = `group_${groupId}`;
            console.log(`OneSignal: Subscribing to group ${groupId}`);
            try {
                await OneSignal.User.addTag(tagKey, "true");
                refreshTags();

                if (!OneSignal.User.PushSubscription.optedIn) {
                    console.log("OneSignal: Prompting for push permission...");
                    await OneSignal.Slidedown.promptPush();
                } else {
                    console.log("OneSignal: Already opted in, tag added.");
                }
            } catch (e) {
                console.error("Error subscribing:", e);
                alert("Erreur lors de l'abonnement aux notifications.");
            }
        });
    };

    const unsubscribeFromGroup = async (groupId: string) => {
        if (typeof window === 'undefined') return;

        window.OneSignalDeferred = window.OneSignalDeferred || [];
        window.OneSignalDeferred.push(async (OneSignal: any) => {
            console.log(`OneSignal: Unsubscribing from group ${groupId}`);
            try {
                await OneSignal.User.removeTag(`group_${groupId}`);
                refreshTags();
            } catch (e) { console.error("Error unsubscribing:", e); }
        });
    };

    const unsubscribeAll = async () => {
        if (!window.OneSignalDeferred) return; // Changed from OneSignal to OneSignalDeferred
        if (!confirm("Voulez-vous vraiment désactiver toutes les notifications de La Vigie ?")) return;

        window.OneSignalDeferred.push(async (OneSignal: any) => { // Changed from OneSignal to OneSignalDeferred
            try {
                // Désactiver les notifications au niveau global
                await OneSignal.User.PushSubscription.optOut(); // Added await
                // Supprimer tous les tags de groupe
                const tagsToDelete = Object.keys(activeTags).filter(k => k.startsWith('group_'));
                await OneSignal.User.removeTags(tagsToDelete); // Added await
                refreshTags();
            } catch (e) { console.error("Error unsubscribing all:", e); }
        });
    };

    return (
        <OneSignalContext.Provider value={{
            isInitialized,
            isSubscribed,
            activeTags,
            subscribeToGroup,
            unsubscribeFromGroup,
            unsubscribeAll,
            refreshTags
        }}>
            <Script
                src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
                strategy="afterInteractive"
            />
            {children}
        </OneSignalContext.Provider>
    );
};
