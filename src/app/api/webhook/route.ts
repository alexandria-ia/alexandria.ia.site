import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

// In a real application, the webhook client secret is configured via env variables.
const WEBHOOK_SECRET = process.env.ABACATEPAY_WEBHOOK_SECRET || 'alexandria_webhook_secret_key';
const membersPath = path.join(process.cwd(), 'src', 'data', 'members.json');

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    const signature = req.headers.get('x-abacatepay-signature') || '';

    // Signature verification logic
    let isSignatureValid = false;
    if (signature) {
      const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
      hmac.update(rawBody);
      const expectedSignature = hmac.digest('hex');
      isSignatureValid = (signature === expectedSignature);
    }

    const { event, data } = body;

    if (!event || !data) {
      return NextResponse.json({ error: 'Formato de payload inválido.' }, { status: 400 });
    }

    // Process payment event
    if (event === 'billing.status.changed' || event === 'checkout.completed') {
      const billingId = data.id;
      const status = data.status; // PAID, PENDING, EXPIRED, REFUNDED

      // If payment is approved (PAID), register or activate the member on disk
      if (status === 'PAID') {
        const metadata = data.metadata || {};
        const email = metadata.email;
        const planId = metadata.planId || 'starter';
        const referrer = metadata.referrer;

        if (email) {
          let members: any[] = [];
          try {
            const fileData = await fs.readFile(membersPath, 'utf8');
            members = JSON.parse(fileData);
          } catch {
            members = [];
          }

          if (!Array.isArray(members)) {
            members = [];
          }

          const existingIndex = members.findIndex((m: any) => m.email.toLowerCase() === email.toLowerCase());

          if (existingIndex > -1) {
            // Reactivate/update existing member
            members[existingIndex].active = true;
            members[existingIndex].plan = planId;
            members[existingIndex].signupDate = new Date().toISOString().split('T')[0];
          } else {
            // Register new member
            const newMember = {
              email: email.toLowerCase(),
              name: data.customer?.name || metadata.name || 'Assinante Alexandria',
              active: true,
              plan: planId,
              signupDate: new Date().toISOString().split('T')[0],
              affiliateCode: 'ALX-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
              affiliateInvitesGenerated: 0,
              affiliateInvitesValidated: 0,
              affiliateCredits: 0
            };
            members.push(newMember);

            // Handle affiliate reward if referred
            if (referrer) {
              members = members.map((member: any) => {
                if (member.affiliateCode === referrer) {
                  return {
                    ...member,
                    affiliateInvitesValidated: (member.affiliateInvitesValidated || 0) + 1,
                    affiliateCredits: (member.affiliateCredits || 0) + 20.00
                  };
                }
                return member;
              });
            }
          }

          await fs.writeFile(membersPath, JSON.stringify(members, null, 2), 'utf8');
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Status de cobrança processado com sucesso.',
        event,
        billingId,
        status,
        signatureVerified: isSignatureValid,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Evento '${event}' recebido e ignorado.`,
      signatureVerified: isSignatureValid,
    });

  } catch (error: any) {
    console.error('Erro na rota de Webhook:', error);
    return NextResponse.json({ error: 'Erro interno no processamento do webhook.' }, { status: 500 });
  }
}
