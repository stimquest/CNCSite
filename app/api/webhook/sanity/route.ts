import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Document types that should trigger a /llms.txt refresh
const LLM_REVALIDATE_TYPES = new Set([
    'weeklyPlanning',
    'planningCharAVoile',
    'planningMarche',
    'activity',
    'spotSettings',
]);

export async function POST(req: Request) {
    const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    const ONESIGNAL_API_KEY = process.env.ONESIGNAL_REST_API_KEY;
    const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

    try {
        // 1. Vérification du secret
        const authHeader = req.headers.get('authorization')?.trim();
        const fallbackSecret = req.headers.get('x-webhook-secret')?.trim();
        const trimmedSecret = WEBHOOK_SECRET?.trim();

        const isAuthorized = (trimmedSecret && authHeader === `Bearer ${trimmedSecret}`) ||
            (trimmedSecret && fallbackSecret === trimmedSecret);

        if (trimmedSecret && !isAuthorized) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { title, content, targetGroups, sendPush, category, _id, _type } = body;

        // 2. Revalidation /llms.txt si le document est lié aux plannings ou activités
        if (_type && LLM_REVALIDATE_TYPES.has(_type)) {
            revalidatePath('/llms.txt');
            console.log(`[Webhook] Revalidated /llms.txt for _type="${_type}" (_id=${_id})`);

            // Si c'est uniquement un update de planning (pas de push demandé), on s'arrête là
            if (!sendPush) {
                return NextResponse.json({ message: 'llms.txt revalidated, no push requested' });
            }
        }

        // 3. Vérifier si on doit envoyer un push
        if (!sendPush) {
            return NextResponse.json({ message: 'Push not requested for this update' });
        }

        if (!ONESIGNAL_APP_ID || !ONESIGNAL_API_KEY) {
            console.error('Missing OneSignal configuration');
            return NextResponse.json({ error: 'OneSignal not configured' }, { status: 500 });
        }

        // 4. Préparer le ciblage OneSignal
        let filters: any[] = [];

        if (targetGroups.includes('all')) {
            // Ciblage global
        } else {
            filters = targetGroups.map((groupId: string, index: number) => {
                const filter = { field: "tag", key: `group_${groupId}`, relation: "=", value: "true" };
                return index === 0 ? filter : { operator: "OR", ...filter };
            });
        }

        // 5. Envoyer à OneSignal
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
                url: `https://cnccoutainville.vercel.app/fil-info?id=${_id}`,
                filters: filters.length > 0 ? filters : undefined,
                included_segments: filters.length === 0 ? ['Total Subscriptions', 'Subscribed Users'] : undefined,
            }),
        });

        const result = await response.json();
        console.log("OneSignal: Webhook Push Result:", { status: response.status, data: result });

        if (!response.ok) {
            throw new Error(`OneSignal error: ${JSON.stringify(result)}`);
        }

        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
