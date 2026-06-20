import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const membersPath = path.join(process.cwd(), 'src', 'data', 'members.json');

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Código de afiliado ausente.' }, { status: 400 });
    }

    let members: any[] = [];
    try {
      const fileData = await fs.readFile(membersPath, 'utf8');
      members = JSON.parse(fileData);
    } catch {
      // Default array if file doesn't exist
      members = [];
    }

    let updated = false;
    if (Array.isArray(members)) {
      members = members.map((member: any) => {
        if (member.affiliateCode === code) {
          updated = true;
          return {
            ...member,
            affiliateInvitesGenerated: (member.affiliateInvitesGenerated || 0) + 1
          };
        }
        return member;
      });
    }

    if (updated) {
      await fs.writeFile(membersPath, JSON.stringify(members, null, 2), 'utf8');
      return NextResponse.json({ success: true, message: 'Click de afiliado registrado.' });
    }

    return NextResponse.json({ success: false, message: 'Código não encontrado.' });

  } catch (error) {
    console.error('Erro ao processar click de afiliado:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
