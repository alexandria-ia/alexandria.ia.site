import crypto from 'crypto';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin_alexandria';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'hZOzJCiP5DxeP1ok/0RlQ+r62bv30Zjx';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'alexandria_token_2026';

const ADMIN_TOKEN_HASH = crypto.createHash('sha256').update(ADMIN_TOKEN).digest('hex');
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'c2ea619c619e5eb9fa77222d1208314095fdc6963099f6a965d36027fdf1a9c3';

export const COOKIE_NAME = 'alexandria_admin_session';

export function signSession(timestamp: string): string {
  return crypto.createHmac('sha256', SESSION_SECRET)
    .update(timestamp)
    .update(ADMIN_USERNAME)
    .update(ADMIN_PASSWORD)
    .update(ADMIN_TOKEN_HASH)
    .digest('hex');
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

export function verifyAdminCredentials(usernameInput: string, passwordInput: string, tokenInput: string): boolean {
  const hashInput = crypto.createHash('sha256').update(tokenInput).digest('hex');

  const usernameBuf = Buffer.from(usernameInput);
  const passwordBuf = Buffer.from(passwordInput);
  const hashBuf = Buffer.from(hashInput);

  const adminUsernameBuf = Buffer.from(ADMIN_USERNAME);
  const adminPasswordBuf = Buffer.from(ADMIN_PASSWORD);
  const adminTokenHashBuf = Buffer.from(ADMIN_TOKEN_HASH);

  const usernameMatch = usernameBuf.length === adminUsernameBuf.length && crypto.timingSafeEqual(usernameBuf, adminUsernameBuf);
  const passwordMatch = passwordBuf.length === adminPasswordBuf.length && crypto.timingSafeEqual(passwordBuf, adminPasswordBuf);
  const tokenMatch = hashBuf.length === adminTokenHashBuf.length && crypto.timingSafeEqual(hashBuf, adminTokenHashBuf);

  return usernameMatch && passwordMatch && tokenMatch;
}

export function isAuthorizedRequest(req: Request): boolean {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const parts = c.trim().split('=');
      return [parts[0], parts.slice(1).join('=')];
    })
  );

  const sessionCookie = cookies[COOKIE_NAME];
  return sessionCookie ? validateSession(sessionCookie) : false;
}

const MEMBER_SESSION_SECRET = process.env.MEMBER_SESSION_SECRET || 'member_c2ea619c619e5eb9fa77222d1208314095fdc6963099f6a965d36027fdf1a9c3';
export const MEMBER_COOKIE_NAME = 'alexandria_member_session';

export function signMemberSession(email: string, timestamp: string): string {
  return crypto.createHmac('sha256', MEMBER_SESSION_SECRET)
    .update(timestamp)
    .update(email.toLowerCase())
    .digest('hex');
}

export function validateMemberSession(cookieValue: string): string | null {
  try {
    const parts = cookieValue.split('.');
    if (parts.length < 3) return null;
    const [emailB64, timestampStr, signature] = parts;
    if (!emailB64 || !timestampStr || !signature) return null;

    const email = Buffer.from(emailB64, 'base64').toString('utf8');
    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();
    if (isNaN(timestamp) || now - timestamp > 30 * 24 * 60 * 60 * 1000) {
      return null;
    }

    const expectedSignature = signMemberSession(email, timestampStr);
    if (signature === expectedSignature) {
      return email;
    }
    return null;
  } catch {
    return null;
  }
}

export function getMemberEmailFromRequest(req: Request): string | null {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const parts = c.trim().split('=');
      return [parts[0], parts.slice(1).join('=')];
    })
  );

  const sessionCookie = cookies[MEMBER_COOKIE_NAME];
  return sessionCookie ? validateMemberSession(sessionCookie) : null;
}

