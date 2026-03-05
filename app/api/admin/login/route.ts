import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { password } = await req.json();

    const adminPassword = process.env.ADMIN_PASSWORD || 'CNC2026';

    if (password !== adminPassword) {
        return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('cnc_admin_session', process.env.ADMIN_SESSION_SECRET || 'cnc_secret_2026', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 12, // 12 hours
        path: '/',
    });

    return response;
}
