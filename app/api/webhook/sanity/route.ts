import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Document types that should trigger a revalidation of the homepage/site
const SITE_REVALIDATE_TYPES = new Set([
    'weeklyPlanning',
    'planningCharAVoile',
    'planningMarche',
    'activity',
    'spotSettings',
    'homePage',
    'news',
    'clubPage',
    'infoMessage',
    'signageSlide',
]);

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

    try {
        // 1. Vérification du secret
        const authHeader = req.headers.get('authorization')?.trim();
        const fallbackSecret = req.headers.get('x-webhook-secret')?.trim();
        const trimmedSecret = WEBHOOK_SECRET?.trim();

        if (!trimmedSecret) {
            return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
        }

        const isAuthorized = authHeader === `Bearer ${trimmedSecret}` ||
            fallbackSecret === trimmedSecret;

        if (!isAuthorized) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { _id, _type } = body;

        // 2. Revalidation
        if (_type && SITE_REVALIDATE_TYPES.has(_type)) {
            revalidatePath('/');
            revalidatePath('/llms.txt');
            revalidatePath('/fil-info');
            revalidatePath('/cockpit');
            
            // Revalidate some specific paths
            if (_type === 'activity') revalidatePath('/activites');
            if (_type === 'weeklyPlanning') revalidatePath('/plannings');
            if (_type === 'signageSlide') revalidatePath('/digital-signage');
            
            console.log(`[Webhook] Revalidated site for _type="${_type}" (_id=${_id})`);
        }

        return NextResponse.json({ message: 'Webhook processed', _type, _id });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
