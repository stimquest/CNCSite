import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const session = req.cookies.get('cnc_admin_session');
    const validSecret = process.env.ADMIN_SESSION_SECRET || 'cnc_secret_2026';

    // Already authenticated
    if (session?.value === validSecret) {
        return NextResponse.next();
    }

    // Not authenticated → redirect to login page
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
}

// Config: Only run this middleware on protected paths
export const config = {
    matcher: [
        '/admin/:path*',
        '/cockpit/:path*',
        '/api/cockpit/:path*',
    ]
};
