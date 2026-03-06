import { NextResponse } from 'next/server';

import { ADMIN_SESSION_COOKIE_NAME, getAdminPassword, getAdminSessionSecret } from '@/lib/admin-auth';

const LOGIN_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_RATE_LIMIT_MAX_ATTEMPTS = 5;

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function getClientIdentifier(req: Request) {
    const forwardedFor = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const realIp = req.headers.get('x-real-ip')?.trim();

    return forwardedFor || realIp || 'unknown';
}

function getLoginRateLimit(identifier: string) {
    const now = Date.now();
    const current = loginAttempts.get(identifier);

    if (!current || current.resetAt <= now) {
        const fresh = { count: 0, resetAt: now + LOGIN_RATE_LIMIT_WINDOW_MS };
        loginAttempts.set(identifier, fresh);
        return fresh;
    }

    return current;
}

function registerFailedAttempt(identifier: string) {
    const current = getLoginRateLimit(identifier);
    current.count += 1;
    loginAttempts.set(identifier, current);
    return current;
}

function clearFailedAttempts(identifier: string) {
    loginAttempts.delete(identifier);
}

export async function POST(req: Request) {
    const { password } = await req.json();
    const clientIdentifier = getClientIdentifier(req);
    const rateLimit = getLoginRateLimit(clientIdentifier);

    const adminPassword = getAdminPassword();
    const adminSessionSecret = getAdminSessionSecret();

    if (!adminPassword || !adminSessionSecret) {
        return NextResponse.json({ error: 'Authentification admin non configurée' }, { status: 500 });
    }

    if (rateLimit.count >= LOGIN_RATE_LIMIT_MAX_ATTEMPTS) {
        const retryAfterSeconds = Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000));

        return NextResponse.json({ error: 'Trop de tentatives. Réessaie plus tard.' }, {
            status: 429,
            headers: {
                'Retry-After': retryAfterSeconds.toString(),
            },
        });
    }

    if (password !== adminPassword) {
        registerFailedAttempt(clientIdentifier);
        return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
    }

    clearFailedAttempts(clientIdentifier);

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE_NAME, adminSessionSecret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 12, // 12 hours
        path: '/',
    });

    return response;
}
