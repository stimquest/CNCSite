import { NextResponse } from 'next/server';
import { client, queries } from '@/lib/sanity';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
        return NextResponse.json({ error: 'sessionId manquant' }, { status: 400 });
    }

    try {
        const bookings = await client.fetch(
            queries.charBookingsBySession,
            { sessionId },
            { useCdn: false }
        );
        return NextResponse.json({ bookings: bookings ?? [] });
    } catch (error: any) {
        console.error('CharBookings API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
