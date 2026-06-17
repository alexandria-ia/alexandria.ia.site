import { NextResponse } from 'next/server';
import { signSession, COOKIE_NAME, isAuthorizedRequest } from '@/lib/session';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'alexandria_admin_2026';

// Check auth status
export async function GET(req: Request) {
  const isAuthorized = isAuthorizedRequest(req);
  return NextResponse.json({ authorized: isAuthorized });
}

// Log in
export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (password === ADMIN_PASSWORD) {
      const timestamp = Date.now().toString();
      const signature = signSession(timestamp);
      const cookieValue = `${timestamp}.${signature}`;

      const response = NextResponse.json({ success: true });
      
      // Set secure HttpOnly cookie
      response.headers.append(
        'Set-Cookie',
        `${COOKIE_NAME}=${cookieValue}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${24 * 60 * 60}; ${
          process.env.NODE_ENV === 'production' ? 'Secure;' : ''
        }`
      );

      return response;
    }

    return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro no servidor.' }, { status: 500 });
  }
}

// Log out
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  
  // Clear cookie
  response.headers.append(
    'Set-Cookie',
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  );

  return response;
}
