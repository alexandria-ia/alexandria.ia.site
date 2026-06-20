import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { 
  MEMBER_COOKIE_NAME, 
  signMemberSession, 
  getMemberEmailFromRequest 
} from '@/lib/session';

export const dynamic = 'force-dynamic';

const membersPath = path.join(process.cwd(), 'src', 'data', 'members.json');

async function getMembers() {
  try {
    const fileData = await fs.readFile(membersPath, 'utf8');
    return JSON.parse(fileData);
  } catch {
    return [];
  }
}

// GET: Check authorization
export async function GET(req: Request) {
  const email = getMemberEmailFromRequest(req);
  if (!email) {
    return NextResponse.json({ authorized: false });
  }

  const members = await getMembers();
  const member = members.find((m: any) => m.email.toLowerCase() === email.toLowerCase());

  if (!member) {
    return NextResponse.json({ authorized: false });
  }

  const safeMember = {
    ...member,
    chatPassword: member.chatPassword || 'alexandria_chat_2026',
    passwordChanged: member.passwordChanged ?? false
  };

  return NextResponse.json({ authorized: true, member: safeMember });
}

// POST: Log in
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 });
    }

    const members = await getMembers();
    const member = members.find((m: any) => m.email.toLowerCase() === email.toLowerCase());

    if (!member) {
      return NextResponse.json({ 
        error: 'E-mail não cadastrado na plataforma. Por favor, assine um plano primeiro.' 
      }, { status: 404 });
    }

    const timestamp = Date.now().toString();
    const emailB64 = Buffer.from(member.email.toLowerCase()).toString('base64');
    const signature = signMemberSession(member.email.toLowerCase(), timestamp);
    const cookieValue = `${emailB64}.${timestamp}.${signature}`;

    const safeMember = {
      ...member,
      chatPassword: member.chatPassword || 'alexandria_chat_2026',
      passwordChanged: member.passwordChanged ?? false
    };

    const response = NextResponse.json({ success: true, member: safeMember });

    // Set secure cookie valid for 30 days
    response.headers.append(
      'Set-Cookie',
      `${MEMBER_COOKIE_NAME}=${cookieValue}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}; ${
        req.url.startsWith('https:') ? 'Secure;' : ''
      }`
    );

    return response;
  } catch (error) {
    console.error('Erro na autenticação de membro:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

// DELETE: Log out
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  
  response.headers.append(
    'Set-Cookie',
    `${MEMBER_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  );

  return response;
}
