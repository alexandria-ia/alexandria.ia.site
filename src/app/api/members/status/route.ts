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

    const { active } = await req.json();
    if (typeof active !== 'boolean') {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
    }

    const members = await getMembers();
    const memberIndex = members.findIndex((m: any) => m.email.toLowerCase() === email.toLowerCase());

    if (memberIndex === -1) {
      return NextResponse.json({ error: 'Membro não encontrado' }, { status: 404 });
    }

    members[memberIndex].active = active;
    await saveMembers(members);

    // Return the updated member with default fallbacks if missing
    const safeMember = {
      ...members[memberIndex],
      chatPassword: members[memberIndex].chatPassword || 'alexandria_chat_2026',
      passwordChanged: members[memberIndex].passwordChanged ?? false
    };

    return NextResponse.json({ success: true, member: safeMember });
  } catch (error) {
    console.error('Erro ao atualizar status do membro:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  return POST(req);
}
