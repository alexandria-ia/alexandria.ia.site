import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getMemberEmailFromRequest } from '@/lib/session';

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

async function saveMembers(members: any[]) {
  await fs.writeFile(membersPath, JSON.stringify(members, null, 2), 'utf8');
}

export async function POST(req: Request) {
  try {
    const email = getMemberEmailFromRequest(req);
    if (!email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { password } = await req.json();
    if (!password || typeof password !== 'string' || password.trim().length < 4) {
      return NextResponse.json({ error: 'A senha deve ter no mínimo 4 caracteres.' }, { status: 400 });
    }

    const members = await getMembers();
    const memberIndex = members.findIndex((m: any) => m.email.toLowerCase() === email.toLowerCase());

    if (memberIndex === -1) {
      return NextResponse.json({ error: 'Membro não encontrado' }, { status: 404 });
    }

    members[memberIndex].chatPassword = password.trim();
    members[memberIndex].passwordChanged = true;
    await saveMembers(members);

    const safeMember = {
      ...members[memberIndex],
      chatPassword: members[memberIndex].chatPassword,
      passwordChanged: true
    };

    return NextResponse.json({ success: true, member: safeMember });
  } catch (error) {
    console.error('Erro ao atualizar senha do membro:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  return POST(req);
}
