import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getMemberEmailFromRequest } from '@/lib/session';

const membersPath = path.join(process.cwd(), 'src', 'data', 'members.json');

export async function GET(req: Request) {
  try {
    const email = getMemberEmailFromRequest(req);
    if (!email) {
      return NextResponse.json({ error: 'Sessão inválida ou expirada.' }, { status: 401 });
    }

    let members: any[] = [];
    try {
      const fileData = await fs.readFile(membersPath, 'utf8');
      members = JSON.parse(fileData);
    } catch {
      return NextResponse.json({ error: 'Erro ao acessar banco de dados.' }, { status: 500 });
    }

    const member = members.find((m: any) => m.email.toLowerCase() === email.toLowerCase());

    if (!member) {
      return NextResponse.json({ error: 'Membro não encontrado.' }, { status: 404 });
    }

    if (!member.active) {
      return NextResponse.json({ error: 'Assinatura inativa.' }, { status: 403 });
    }

    return NextResponse.json({ success: true, member });

  } catch (error) {
    console.error('Erro ao buscar dados do membro:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}
