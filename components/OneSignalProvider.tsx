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
        if (!window.OneSignal) return;
        window.OneSignal.push(async (OneSignal: any) => {
            try {
                const tags = await OneSignal.User.getTags();
                setActiveTags(tags || {});
            } catch (e) {
                console.error("Error fetching OneSignal tags:", e);
            }
        });
    };

    useEffect(() => {
        const loadOneSignal = async () => {
            window.OneSignalDeferred = window.OneSignalDeferred || [];

            window.OneSignalDeferred.push(async (OneSignal: any) => {
                if (OneSignal.initialized) {
                    setIsInitialized(true);
                    return;
                }



                try {
                    await OneSignal.init({
                        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
                        safari_web_id: process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_ID,
                        allowLocalhostAsSecureOrigin: true,
                        serviceWorkerParam: { scope: '/' },
                        serviceWorkerPath: 'OneSignalSDKWorker.js',
                        notifyButton: { enable: false },
                    });


                    try {
                        if (OneSignal.Notifications) {
                            OneSignal.Notifications.addEventListener('permissionChange', (permission: any) => {
                            });
                        }

                        if (OneSignal.User?.PushSubscription) {
                            OneSignal.User.PushSubscription.addEventListener('change', (event: any) => {
                                setIsSubscribed(event.current.optedIn);
                                if (event.current.optedIn) refreshTags();
                            });
                            setIsSubscribed(OneSignal.User.PushSubscription.optedIn);
                        }
                    } catch (innerError: any) {
                        // Registration or Event attaching errors (like push service error)
                        if (innerError.name === 'AbortError') {
                            console.warn("OneSignal: Push service registration aborted (common in dev/localhost).", innerError);
                        } else {
                            console.error("OneSignal: Error attaching listeners or registering push:", innerError);
                        }
                    }

                    refreshTags();
                    setIsInitialized(true);
                } catch (e: any) {
                    if (e.name === 'AbortError' || e.message?.includes('push service error')) {
                        console.warn("OneSignal: Push service error during init (safely suppressed):", e.message);
                        setIsInitialized(true); // Still marks as initialized to avoid re-init loops if logic depends on it
                    } else {
                        console.error("OneSignal Init Error:", e);
                    }
                }
            });
        };

        loadOneSignal();
    }, []);

    const subscribeToGroup = async (groupId: string) => {
        if (!window.OneSignalDeferred) return; // Changed from OneSignal to OneSignalDeferred


        window.OneSignalDeferred.push(async (OneSignal: any) => { // Changed from OneSignal to OneSignalDeferred
            const tagKey = `group_${groupId}`;
            try {
                await OneSignal.User.addTag(tagKey, "true"); // Added await
                refreshTags();

                if (!OneSignal.User.PushSubscription.optedIn) {
                    await OneSignal.Slidedown.promptPush(); // Added await
                }
            } catch (e) { console.error("Error subscribing:", e); }
        });
    };

    const unsubscribeFromGroup = async (groupId: string) => {
        if (!window.OneSignalDeferred) return; // Changed from OneSignal to OneSignalDeferred

        window.OneSignalDeferred.push(async (OneSignal: any) => { // Changed from OneSignal to OneSignalDeferred
            try {
                await OneSignal.User.removeTag(`group_${groupId}`); // Added await
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
