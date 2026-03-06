export const ADMIN_SESSION_COOKIE_NAME = 'cnc_admin_session';

export function getAdminPassword() {
    return process.env.ADMIN_PASSWORD?.trim() || null;
}

export function getAdminSessionSecret() {
    return process.env.ADMIN_SESSION_SECRET?.trim() || null;
}