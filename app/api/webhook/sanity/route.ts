import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    const ONESIGNAL_API_KEY = process.env.ONESIGNAL_REST_API_KEY;
    const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

    try {
        // 1. Vérification du secret (sécurité minimale)
        const authHeader = req.headers.get('authorization')?.trim();
        const fallbackSecret = req.headers.get('x-webhook-secret')?.trim();
        const trimmedSecret = WEBHOOK_SECRET?.trim();

        const isAuthorized = (trimmedSecret && authHeader === `Bearer ${trimmedSecret}`) ||
            (trimmedSecret && fallbackSecret === trimmedSecret);

        if (trimmedSecret && !isAuthorized) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { title, content, targetGroups, sendPush, category, _id } = body;

        // 2. Vérifier si on doit envoyer un push
        if (!sendPush) {
            return NextResponse.json({ message: 'Push not requested for this update' });
        }

        if (!ONESIGNAL_APP_ID || !ONESIGNAL_API_KEY) {
            console.error('Missing OneSignal configuration');
            return NextResponse.json({ error: 'OneSignal not configured' }, { status: 500 });
        }

        // 3. Préparer le ciblage OneSignal
        // On cible soit "all" soit les segments/tags spécifiques
        let filters: any[] = [];

        if (targetGroups.includes('all')) {
            // Pas de filtre particulier, ou ciblage global
        } else {
            // Ciblage par tags OneSignal dynamiques
            filters = targetGroups.map((groupId: string, index: number) => {
                const filter = { field: "tag", key: `group_${groupId}`, relation: "=", value: "true" };
                return index === 0 ? filter : { operator: "OR", ...filter };
            });
        }

        // 4. Envoyer à OneSignal
        const response = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Basic ${ONESIGNAL_API_KEY}`,
            },
            body: JSON.stringify({
                app_id: ONESIGNAL_APP_ID,
                headings: { en: title, fr: title },
                contents: { en: content, fr: content },
                url: `https://cnc-site.vercel.app/fil-info?id=${_id}`, // URL vers le message précis
                filters: filters.length > 0 ? filters : undefined,
                included_segments: filters.length === 0 ? ['Subscribed Users'] : undefined,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(`OneSignal error: ${JSON.stringify(result)}`);
        }

        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
