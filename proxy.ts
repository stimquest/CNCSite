import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { ADMIN_SESSION_COOKIE_NAME, getAdminSessionSecret } from '@/lib/admin-auth';

export function proxy(req: NextRequest) {
    const session = req.cookies.get(ADMIN_SESSION_COOKIE_NAME);
    const validSecret = getAdminSessionSecret();

    if (validSecret && session?.value === validSecret) {
        return NextResponse.next();
    }

    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/cockpit/:path*',
        '/studio/:path*',
        '/api/cockpit/:path*',
    ]
};