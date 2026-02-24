"use client";

import React, { useEffect, useState } from 'react';
import { useOneSignal } from '@/components/OneSignalProvider';

export default function OneSignalDebugPage() {
    const { isInitialized, isSubscribed, activeTags, subscribeToGroup, unsubscribeFromGroup, refreshTags } = useOneSignal();
    const [osState, setOsState] = useState<any>({});
    const [groupIdInput, setGroupIdInput] = useState('test_group');

    useEffect(() => {
        const fetchState = async () => {
            if (typeof window === 'undefined') return;

            // Wait for OneSignal to be available globally if needed, though useOneSignal handles init
            // We can access the global object for debug purposes
            const os = (window as any).OneSignal;
            if (!os) return;

            try {
                const state = {
                    initialized: os.initialized,
                    uid: os.User?.onesignalId,
                    pushSubscriptionId: os.User?.PushSubscription?.id,
                    optedIn: os.User?.PushSubscription?.optedIn,
                    permission: Notification.permission,
                };
                setOsState(state);
            } catch (e) {
                console.error("Error fetching OS state", e);
            }
        };

        const interval = setInterval(fetchState, 1000);
        fetchState();
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 text-white">
            <h1 className="text-3xl font-bold">OneSignal Debugger</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* State Card */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 text-blue-400">Current State</h2>
                    <div className="space-y-2 font-mono text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Initialized:</span>
                            <span className={isInitialized ? "text-green-400" : "text-red-400"}>
                                {String(isInitialized)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Is Subscribed (Context):</span>
                            <span className={isSubscribed ? "text-green-400" : "text-yellow-400"}>
                                {String(isSubscribed)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Opted In (SDK):</span>
                            <span>{String(osState.optedIn)}</span>
                        </div>
                        <div className="flex flex-col mt-2">
                            <span className="text-gray-400">OneSignal ID (UID):</span>
                            <span className="break-all text-xs text-gray-300">{osState.uid || 'null'}</span>
                        </div>
                        <div className="flex flex-col mt-1">
                            <span className="text-gray-400">Push Subscription ID:</span>
                            <span className="break-all text-xs text-gray-300">{osState.pushSubscriptionId || 'null'}</span>
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-gray-400">Native Permission:</span>
                            <span className={osState.permission === 'granted' ? "text-green-400" : "text-red-400"}>
                                {osState.permission}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={refreshTags}
                        className="mt-4 w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                    >
                        Force Refresh State
                    </button>
                </div>

                {/* Tags Card */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 text-purple-400">Active Tags</h2>
                    <div className="bg-gray-900 p-4 rounded overflow-auto max-h-60 font-mono text-xs">
                        <pre>{JSON.stringify(activeTags, null, 2)}</pre>
                    </div>
                </div>
            </div>

            {/* Actions Card */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-green-400">Actions</h2>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="grow">
                        <label className="block text-sm text-gray-400 mb-1">Group ID</label>
                        <input
                            type="text"
                            value={groupIdInput}
                            onChange={(e) => setGroupIdInput(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-green-500"
                        />
                    </div>
                    <button
                        onClick={() => subscribeToGroup(groupIdInput)}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded font-medium transition-colors"
                    >
                        Subscribe
                    </button>
                    <button
                        onClick={() => unsubscribeFromGroup(groupIdInput)}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded font-medium transition-colors"
                    >
                        Unsubscribe
                    </button>
                </div>
            </div>
        </div>
    );
}
