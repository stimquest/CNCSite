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
        const { _id, _type } = body;

        // 2. Revalidation /llms.txt si le document est lié aux plannings ou activités
        if (_type && LLM_REVALIDATE_TYPES.has(_type)) {
            revalidatePath('/llms.txt');
            console.log(`[Webhook] Revalidated /llms.txt for _type="${_type}" (_id=${_id})`);
        }

        return NextResponse.json({ message: 'Webhook processed', _type, _id });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
