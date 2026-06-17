import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  plan: string;
  amount: number;
  status: 'pending' | 'approved' | 'failed';
  timestamp: string;
  pixCode?: string;
}

export interface ConfigState {
  priceStarter: number;
  pricePro: number;
  counterTokens: number;
  counterSaved: number;
  counterSubs: number;
  counterLive: number;
  descStarter: string;
  descPro: string;
  abacatePayToken: string;
  abacatePaySandbox: boolean;
  transactions: Transaction[];
  setConfig: (partial: Partial<Omit<ConfigState, 'setConfig' | 'fetchConfig'>>) => void;
  fetchConfig: () => Promise<void>;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      priceStarter: 49,
      pricePro: 149,
      counterTokens: 847396816,
      counterSaved: 1355834905,
      counterSubs: 24847,
      counterLive: 1242,
      descStarter: "Ideal para desenvolvedores e pesquisadores com uso focado em texto.",
      descPro: "Para uso intensivo com texto, imagem, vídeo e multiagentes.",
      abacatePayToken: "",
      abacatePaySandbox: true,
      transactions: [],
      setConfig: (partial) => set((state) => ({ ...state, ...partial })),
      fetchConfig: async () => {
        try {
          const response = await fetch('/api/admin/config');
          if (response.ok) {
            const data = await response.json();
            set({
              priceStarter: data.priceStarter ?? get().priceStarter,
              pricePro: data.pricePro ?? get().pricePro,
              counterTokens: data.counterTokens ?? get().counterTokens,
              counterSaved: data.counterSaved ?? get().counterSaved,
              counterSubs: data.counterSubs ?? get().counterSubs,
              counterLive: data.counterLive ?? get().counterLive,
              descStarter: data.descStarter ?? get().descStarter,
              descPro: data.descPro ?? get().descPro,
              abacatePaySandbox: data.abacatePaySandbox ?? get().abacatePaySandbox,
              // If the admin is logged in, we also fetch the token representation (masked)
              abacatePayToken: data.abacatePayToken ?? get().abacatePayToken
            });
          }
        } catch (error) {
          console.error('Erro ao sincronizar configurações do servidor:', error);
        }
      }
    }),
    {
      name: 'alexandria-config',
    }
  )
);
