import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'alexandria_admin_2026';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'alexandria_session_secret_default_2026';
export const COOKIE_NAME = 'alexandria_admin_session';

export function signSession(timestamp: string): string {
  return crypto.createHmac('sha256', SESSION_SECRET).update(timestamp).update(ADMIN_PASSWORD).digest('hex');
}

export function validateSession(cookieValue: string): boolean {
  try {
    const [timestampStr, signature] = cookieValue.split('.');
    if (!timestampStr || !signature) return false;

    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();
    if (isNaN(timestamp) || now - timestamp > 24 * 60 * 60 * 1000) {
      return false;
    }

    const expectedSignature = signSession(timestampStr);
    return signature === expectedSignature;
  } catch {
    return false;
  }
}

export function isAuthorizedRequest(req: Request): boolean {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => c.trim().split('='))
  );

  const sessionCookie = cookies[COOKIE_NAME];
  return sessionCookie ? validateSession(sessionCookie) : false;
}
