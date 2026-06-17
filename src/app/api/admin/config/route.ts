import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { isAuthorizedRequest } from '@/lib/session';

const configPath = path.join(process.cwd(), 'src', 'data', 'config.json');

// Helper to read config from disk safely
async function readConfig() {
  try {
    const data = await fs.readFile(configPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If not found, return default configs
    return {
      priceStarter: 49,
      pricePro: 149,
      counterTokens: 847396816,
      counterSaved: 1355834905,
      counterSubs: 24847,
      counterLive: 1242,
      descStarter: "Ideal para desenvolvedores e pesquisadores com uso focado em texto.",
      descPro: "Para uso intensivo com texto, imagem, vídeo e multiagentes.",
      abacatePayToken: "",
      abacatePaySandbox: true
    };
  }
}

// Helper to write config to disk safely
async function writeConfig(config: any) {
  const dir = path.dirname(configPath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');
}

// Mask API key for display
function maskToken(token: string): string {
  if (!token) return '';
  if (token.length <= 8) return '••••••••';
  return `${token.substring(0, 7)}••••••••••••${token.substring(token.length - 4)}`;
}

// GET: returns configuration
// Public access: returns only public fields (prices, stats, descriptions)
// Authorized admin: returns all fields (with masked token)
export async function GET(req: Request) {
  const isAuthorized = isAuthorizedRequest(req);
  const config = await readConfig();

  if (isAuthorized) {
    return NextResponse.json({
      ...config,
      abacatePayToken: maskToken(config.abacatePayToken || '')
    });
  }

  // Public representation (prevent leaking token)
  const { abacatePayToken, ...publicConfig } = config;
  return NextResponse.json(publicConfig);
}

// POST: updates configurations (Admin only)
export async function POST(req: Request) {
  const isAuthorized = isAuthorizedRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const newConfig = await req.json();
    const currentConfig = await readConfig();

    // Selectively merge configurations
    const updatedConfig = {
      priceStarter: typeof newConfig.priceStarter === 'number' ? newConfig.priceStarter : currentConfig.priceStarter,
      pricePro: typeof newConfig.pricePro === 'number' ? newConfig.pricePro : currentConfig.pricePro,
      counterTokens: typeof newConfig.counterTokens === 'number' ? newConfig.counterTokens : currentConfig.counterTokens,
      counterSaved: typeof newConfig.counterSaved === 'number' ? newConfig.counterSaved : currentConfig.counterSaved,
      counterSubs: typeof newConfig.counterSubs === 'number' ? newConfig.counterSubs : currentConfig.counterSubs,
      counterLive: typeof newConfig.counterLive === 'number' ? newConfig.counterLive : currentConfig.counterLive,
      descStarter: typeof newConfig.descStarter === 'string' ? newConfig.descStarter : currentConfig.descStarter,
      descPro: typeof newConfig.descPro === 'string' ? newConfig.descPro : currentConfig.descPro,
      abacatePaySandbox: typeof newConfig.abacatePaySandbox === 'boolean' ? newConfig.abacatePaySandbox : currentConfig.abacatePaySandbox,
      // If the admin sent a masked token, do not overwrite the real one saved in config
      abacatePayToken: currentConfig.abacatePayToken // Default to current
    };

    // Only update token if a new non-masked token was provided
    const submittedToken = newConfig.abacatePayToken;
    if (submittedToken && !submittedToken.includes('••••')) {
      updatedConfig.abacatePayToken = submittedToken;
    }

    await writeConfig(updatedConfig);
    return NextResponse.json({ success: true, message: 'Configurações salvas no servidor.' });

  } catch (error) {
    console.error('Erro ao salvar configuração administrativa:', error);
    return NextResponse.json({ error: 'Erro interno ao salvar configurações.' }, { status: 500 });
  }
}
