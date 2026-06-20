import { promises as fs } from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'src', 'data', 'config.json');
const membersPath = path.join(process.cwd(), 'src', 'data', 'members.json');

// Reference date for token counts: 2026-06-01T00:00:00Z
const START_DATE = new Date('2026-06-01T00:00:00Z').getTime();
// Approximately 574,839 tokens generated per second across all users globally
const TOKENS_PER_MS = 574.839;

export interface RealStats {
  priceStarter: number;
  pricePro: number;
  counterTokens: number;
  counterSaved: number;
  counterSubs: number;
  counterLive: number;
  descStarter: string;
  descPro: string;
  abacatePaySandbox: boolean;
  abacatePayToken?: string;
}

export async function getRealStats(includeToken = false): Promise<RealStats> {
  let config = {
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

  try {
    const configData = await fs.readFile(configPath, 'utf8');
    config = { ...config, ...JSON.parse(configData) };
  } catch (err) {
    console.error('Erro ao ler config.json, usando padrão.');
  }

  let activeMembersCount = 0;
  try {
    const membersData = await fs.readFile(membersPath, 'utf8');
    const members = JSON.parse(membersData);
    if (Array.isArray(members)) {
      activeMembersCount = members.filter((m: any) => m.active).length;
    }
  } catch (err) {
    console.error('Erro ao ler members.json, considerando 0 membros extras.');
  }

  // Calculate dynamic token counter based on time elapsed since launch (real-time progress)
  const now = Date.now();
  const msElapsed = Math.max(0, now - START_DATE);
  const dynamicTokens = Math.floor(config.counterTokens + (msElapsed * TOKENS_PER_MS));

  // Economy generated is directly proportional to processed tokens (approx. R$ 1.60 saving per million tokens)
  const dynamicSaved = Math.floor(dynamicTokens * 1.6);

  // Active accounts: baseline accounts configured + real members in database
  const dynamicSubs = config.counterSubs + activeMembersCount;

  // Live connections: flutuates dynamically depending on the minute of the hour (peak/off-peak simulated)
  const minutes = new Date().getMinutes();
  const hours = new Date().getHours();
  // Generate a smooth sine wave fluctuation between -150 and +150 based on current time
  const timeFactor = Math.sin((hours * 60 + minutes) * Math.PI / 720); // 12-hour cycle
  const fluctuation = Math.floor(timeFactor * 180 + (Math.sin(minutes) * 15));
  const dynamicLive = Math.max(10, config.counterLive + fluctuation);

  const stats: RealStats = {
    priceStarter: config.priceStarter,
    pricePro: config.pricePro,
    counterTokens: dynamicTokens,
    counterSaved: dynamicSaved,
    counterSubs: dynamicSubs,
    counterLive: dynamicLive,
    descStarter: config.descStarter,
    descPro: config.descPro,
    abacatePaySandbox: config.abacatePaySandbox,
  };

  if (includeToken) {
    stats.abacatePayToken = config.abacatePayToken;
  }

  return stats;
}
