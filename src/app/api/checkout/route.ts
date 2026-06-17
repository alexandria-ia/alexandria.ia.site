import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'src', 'data', 'config.json');

// Helper to read config from disk safely
async function readServerConfig() {
  try {
    const data = await fs.readFile(configPath, 'utf8');
    return JSON.parse(data);
  } catch {
    return {
      priceStarter: 49,
      pricePro: 149,
      abacatePayToken: "",
      abacatePaySandbox: true
    };
  }
}

export async function POST(req: Request) {
  try {
    const { planId } = await req.json();

    if (!planId || (planId !== 'starter' && planId !== 'pro')) {
      return NextResponse.json({ error: 'Parâmetro planId inválido ou ausente.' }, { status: 400 });
    }

    // Load actual configurations from server storage (prevents price tampering)
    const serverConfig = await readServerConfig();

    let planName = '';
    let price = 0;

    if (planId === 'starter') {
      planName = 'Ordem dos Escribas';
      price = serverConfig.priceStarter;
    } else {
      planName = 'Conselho dos Arcontes';
      price = serverConfig.pricePro;
    }

    const token = process.env.ABACATEPAY_API_TOKEN || serverConfig.abacatePayToken;
    const sandbox = serverConfig.abacatePaySandbox;

    // Extract origin dynamically from request to support any hosting url automatically
    const origin = new URL(req.url).origin;

    // Real integration with Abacate Pay API (Production or Test Sandbox if token provided and not default sandbox)
    if (token && !sandbox) {
      try {
        const abacateResponse = await fetch('https://api.abacatepay.com/v1/billing/create', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            frequency: 'ONE_TIME',
            methods: ['PIX'],
            products: [
              {
                externalId: planId,
                name: planName,
                quantity: 1,
                price: price * 100, // cents
              },
            ],
            returnUrl: `${origin}/`,
            completionUrl: `${origin}/`,
          }),
        });

        if (!abacateResponse.ok) {
          const errData = await abacateResponse.json().catch(() => ({}));
          throw new Error(errData.message || `Erro HTTP ${abacateResponse.status}`);
        }

        const data = await abacateResponse.json();
        // Return standard checkout information
        return NextResponse.json({
          success: true,
          isMock: false,
          billingId: data.data?.id || 'AP-' + Math.random().toString(36).substr(2, 9),
          pixCode: data.data?.pix?.copyAndPaste || '00020126360014BR.GOV.BCB.PIX0114alexandria@pix...',
          qrCodeUrl: data.data?.pix?.qrCode || '',
          url: data.data?.url || '',
        });
      } catch (err: any) {
        console.error('Erro na chamada da Abacate Pay API:', err);
        return NextResponse.json({ 
          error: `Falha na Abacate Pay API: ${err.message}. caindo de volta em modo simulado.`,
          isFallback: true 
        }, { status: 502 });
      }
    }

    // Sandbox / Mock simulation
    const billingId = 'AP-MOCK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Standard mock Pix QR Code payload (copy-paste)
    const mockPixCode = `00020101021226830014br.gov.bcb.pix2561api.abacatepay.com/v1/pix/${billingId}5204000053039865405${price.toFixed(2)}5802BR5913Alexandria.ia6009Sao Paulo62070503***6304D1B2`;

    return NextResponse.json({
      success: true,
      isMock: true,
      billingId,
      pixCode: mockPixCode,
      qrCodeUrl: '',
      url: '',
    });

  } catch (error: any) {
    console.error('Erro interno na rota de checkout:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
