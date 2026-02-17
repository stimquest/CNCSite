import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

// We create a server-side client with the write token
const serverClient = createClient({
    projectId: '9v7nk22c',
    dataset: 'production',
    apiVersion: '2024-03-15',
    token: process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN || '',
    useCdn: false,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, patch, _id = 'singleton-spot-settings' } = body;

        if (type === 'PATCH') {
            await serverClient.patch(_id).set(patch).commit();
            return NextResponse.json({ success: true });
        }

        if (type === 'CREATE_INFO') {
            const result = await serverClient.create({
                _type: 'infoMessage',
                ...patch
            });

            // Trigger OneSignal if requested
            if (patch.sendPush) {
                const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
                const ONESIGNAL_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

                console.log("OneSignal: Attempting push with AppID:", ONESIGNAL_APP_ID);

                if (ONESIGNAL_APP_ID && ONESIGNAL_API_KEY) {
                    try {
                        let filters: any[] = [];
                        const targetGroups = patch.targetGroups || ['all'];

                        if (!targetGroups.includes('all')) {
                            filters = targetGroups.map((groupId: string, index: number) => {
                                const filter = { field: "tag", key: `group_${groupId}`, relation: "=", value: "true" };
                                return index === 0 ? filter : { operator: "OR", ...filter };
                            });
                        }

                        const osRes = await fetch('https://onesignal.com/api/v1/notifications', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json; charset=utf-8',
                                'Authorization': `Basic ${ONESIGNAL_API_KEY}`,
                            },
                            body: JSON.stringify({
                                app_id: ONESIGNAL_APP_ID,
                                headings: { fr: patch.title },
                                contents: { fr: patch.content },
                                url: `https://cnccoutainville.vercel.app/fil-info?id=${result._id}`,
                                filters: filters.length > 0 ? filters : undefined,
                                // Note: On tente "All" si "Subscribed Users" échoue, ou vice versa.
                                included_segments: filters.length === 0 ? ['Total Subscriptions', 'Subscribed Users'] : undefined,
                            }),
                        });

                        const osData = await osRes.json();
                        console.log("OneSignal: API Response:", { status: osRes.status, data: osData });
                    } catch (pushError) {
                        console.error("OneSignal Push Network Error:", pushError);
                    }
                } else {
                    console.error("OneSignal: Missing Config", { hasAppId: !!ONESIGNAL_APP_ID, hasApiKey: !!ONESIGNAL_API_KEY });
                }
            }

            return NextResponse.json({ success: true, id: result._id });
        }

        if (type === 'TEST_PUSH') {
            const { targetId, title, content } = patch;
            const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
            const ONESIGNAL_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

            if (ONESIGNAL_APP_ID && ONESIGNAL_API_KEY) {
                const osRes = await fetch('https://onesignal.com/api/v1/notifications', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Authorization': `Basic ${ONESIGNAL_API_KEY}`,
                    },
                    body: JSON.stringify({
                        app_id: ONESIGNAL_APP_ID,
                        headings: { fr: title || "Test Direct" },
                        contents: { fr: content || "Ceci est un test de connexion directe." },
                        // En v16, c'est mieux d'utiliser include_subscription_ids
                        include_subscription_ids: [targetId],
                    }),
                });
                const osData = await osRes.json();
                console.log("OneSignal: Test Push Response:", { status: osRes.status, data: osData });
                return NextResponse.json({ success: true, response: osData });
            }
            return NextResponse.json({ error: 'Config missing' }, { status: 500 });
        }

        return NextResponse.json({ error: 'Invalid operation type' }, { status: 400 });
    } catch (error: any) {
        console.error('Cockpit API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
