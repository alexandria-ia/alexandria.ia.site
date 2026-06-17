import { NextResponse } from 'next/server';
import crypto from 'crypto';

// In a real application, the webhook client secret is configured via env variables.
const WEBHOOK_SECRET = process.env.ABACATEPAY_WEBHOOK_SECRET || 'alexandria_webhook_secret_key';

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
    if (event === 'billing.status.changed') {
      const billingId = data.id;
      const status = data.status; // PAID, PENDING, EXPIRED, REFUNDED

      return NextResponse.json({
        success: true,
        message: 'Status de cobrança atualizado com sucesso.',
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
