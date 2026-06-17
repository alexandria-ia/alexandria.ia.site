'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useConfigStore, Transaction } from '@/stores/config-store';
import { 
  Lock, Settings, Key, Globe, 
  Database, RefreshCw, Layers, CheckCircle, 
  Play, Cpu, Trash2, Eye, EyeOff 
} from 'lucide-react';

export default function AdminPage() {
  const store = useConfigStore();
  const [hydrated, setHydrated] = useState(false);

  // Security Gate
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loginError, setLoginError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'metrics' | 'plans' | 'abacate' | 'logs'>('metrics');

  // Form states
  const [priceStarter, setPriceStarter] = useState(49);
  const [pricePro, setPricePro] = useState(149);
  const [counterTokens, setCounterTokens] = useState(847392041);
  const [counterSubs, setCounterSubs] = useState(24847);
  const [counterLive, setCounterLive] = useState(1243);
  const [descStarter, setDescStarter] = useState('');
  const [descPro, setDescPro] = useState('');
  
  // Abacate Pay state
  const [abacatePayToken, setAbacatePayToken] = useState('');
  const [abacatePaySandbox, setAbacatePaySandbox] = useState(true);
  const [showToken, setShowToken] = useState(false);
  const [appOrigin, setAppOrigin] = useState('http://localhost:3003');

  // Simulation Console log
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const authRes = await fetch('/api/admin/auth');
        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.authorized) {
            setIsAuthorized(true);
            await store.fetchConfig();
          }
        }
      } catch (err) {
        console.error('Erro de autorização:', err);
      } finally {
        setHydrated(true);
      }
    };

    checkAuthAndLoad();

    if (typeof window !== 'undefined') {
      setAppOrigin(window.location.origin);
    }
    
    // Add default log
    addConsoleLog('Painel de Telemetria inicializado.');
  }, []);

  // Sync state values when store changes
  useEffect(() => {
    setPriceStarter(store.priceStarter);
    setPricePro(store.pricePro);
    setCounterTokens(store.counterTokens);
    setCounterSubs(store.counterSubs);
    setCounterLive(store.counterLive);
    setDescStarter(store.descStarter);
    setDescPro(store.descPro);
    setAbacatePayToken(store.abacatePayToken);
    setAbacatePaySandbox(store.abacatePaySandbox);
  }, [
    store.priceStarter, 
    store.pricePro, 
    store.counterTokens, 
    store.counterSubs, 
    store.counterLive, 
    store.descStarter, 
    store.descPro, 
    store.abacatePayToken, 
    store.abacatePaySandbox
  ]);

  const addConsoleLog = (msg: string) => {
    const time = new Date().toLocaleTimeString('pt-BR');
    setSimLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 15)]);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        setIsAuthorized(true);
        setLoginError(false);
        addConsoleLog('Sessão autorizada pelo servidor (Cookie de sessão gerado).');
        await store.fetchConfig();
      } else {
        setLoginError(true);
        setPassword('');
      }
    } catch (err) {
      console.error(err);
      setLoginError(true);
      setPassword('');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      setIsAuthorized(false);
      setPassword('');
      addConsoleLog('Sessão encerrada no servidor e cookie de sessão limpo.');
    } catch (err) {
      console.error(err);
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSaveConfig = async () => {
    try {
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceStarter,
          pricePro,
          counterTokens,
          counterSubs,
          counterLive,
          descStarter,
          descPro,
          abacatePayToken,
          abacatePaySandbox,
        })
      });

      if (response.ok) {
        await store.fetchConfig();
        addConsoleLog('Parâmetros gerais do site salvos e persistidos no servidor.');
        triggerToast('Configurações salvas com sucesso!');
      } else {
        triggerToast('Erro ao salvar no servidor.');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Falha na comunicação com o servidor.');
    }
  };

  const handleClearTransactions = () => {
    store.setConfig({ transactions: [] });
    addConsoleLog('Histórico de transações limpo.');
    triggerToast('Histórico limpo!');
  };

  // Webhook Pix simulation
  const handleSimulateWebhook = async (tx: Transaction) => {
    addConsoleLog(`Disparando simulador de webhook Pix para transação: ${tx.id}`);
    
    const payload = {
      event: 'billing.status.changed',
      data: {
        id: tx.id,
        status: 'PAID',
        amount: tx.amount * 100,
        metadata: { plan: tx.plan }
      }
    };

    try {
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-abacatepay-signature': 'mock-signature-hash-2026-alexandria'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Erro na resposta do Webhook API: ${response.status}`);
      }

      const resData = await response.json();
      addConsoleLog(`Servidor processou webhook. Status: ${resData.status}. Assinatura simulada válida.`);

      // Update state
      const updatedTxList = store.transactions.map(t => 
        t.id === tx.id ? { ...t, status: 'approved' as const } : t
      );

      // Increment values (active account and processed tokens)
      store.setConfig({ 
        transactions: updatedTxList,
        counterSubs: store.counterSubs + 1,
        counterTokens: store.counterTokens + Math.floor(Math.random() * 200000 + 50000)
      });

      addConsoleLog(`Transação ${tx.id} marcada como APROVADA. Assinatura ativa incrementada.`);
      triggerToast('Pix Webhook Simulador: Aprovado!');
    } catch (err: any) {
      console.error(err);
      addConsoleLog(`Falha no simulador de Webhook: ${err.message}`);
    }
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center font-sans">
        <span className="text-[12px] uppercase font-semibold tracking-widest text-text-secondary animate-pulse">
          Carregando Telemetria...
        </span>
      </div>
    );
  }

  // Security Login Screen
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        
        {/* Back navigation */}
        <Link href="/" className="absolute top-8 left-8 text-[12px] text-text-muted hover:text-text-secondary transition-colors tracking-wide flex items-center gap-1.5 uppercase font-semibold">
          ← Voltar para o site
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-bg-alt/90 border border-border-card p-8 rounded-[16px] max-w-[400px] w-full shadow-[0_24px_64px_rgba(0,0,0,0.55)] z-10 backdrop-blur-[16px]"
        >
          {/* Header Icon */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mb-4">
              <Lock size={20} className="animate-pulse" />
            </div>
            <h2 className="font-rework text-[20px] font-extrabold text-white tracking-widest uppercase scale-y-[0.85]">
              ALEXANDRIA GATE
            </h2>
            <p className="text-[12px] text-text-secondary mt-1">
              Chave de Acesso Admin Necessária
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="relative flex items-center">
                <input
                  type="password"
                  placeholder="DIGITE A CHAVE ADMINISTRATIVA"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-black/40 border ${loginError ? 'border-red-500' : 'border-border-card'} focus:border-accent rounded-[8px] py-3 px-4 text-center font-mono text-[12px] text-text-primary tracking-[0.25em] outline-none placeholder:tracking-normal placeholder:text-[11px] placeholder:text-text-muted transition-colors`}
                />
              </div>
              {loginError && (
                <span className="text-[10px] text-red-500 font-semibold tracking-wider text-center mt-1 uppercase">
                  Chave inválida. Tente novamente.
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full text-[12px] font-bold tracking-[0.06em] uppercase bg-accent text-bg-deep py-3.5 rounded-full hover:opacity-90 transition-opacity border-none cursor-pointer flex items-center justify-center gap-1.5 mt-2"
            >
              Autenticar
            </button>
          </form>


        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-deep font-sans relative overflow-x-hidden text-text-primary pb-20">
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Navbar/Header Dashboard */}
      <div className="border-b border-border-subtle bg-bg-alt/75 backdrop-blur-[16px] sticky top-0 z-40 px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-accent hover:opacity-85 font-rework font-extrabold tracking-widest text-[14px] uppercase scale-y-[0.85] origin-left">
              [ ALEXANDRIA.IA ]
            </Link>
            <span className="text-text-muted">/</span>
            <span className="text-[11px] font-semibold tracking-widest text-text-secondary uppercase">ADMIN TELEMETRIA</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="text-[11px] font-bold tracking-[0.06em] uppercase border border-border-card hover:bg-white/5 text-text-secondary px-4 py-2 rounded-full cursor-pointer transition-all"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
        
        {/* Navigation Sidebar */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`flex items-center gap-3 w-full text-left px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.06em] rounded-[10px] border transition-all cursor-pointer ${
              activeTab === 'metrics'
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-transparent bg-white/2 hover:bg-white/4 text-text-secondary hover:text-text-primary'
            }`}
          >
            <Cpu size={15} />
            <span>Métricas do Painel</span>
          </button>

          <button
            onClick={() => setActiveTab('plans')}
            className={`flex items-center gap-3 w-full text-left px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.06em] rounded-[10px] border transition-all cursor-pointer ${
              activeTab === 'plans'
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-transparent bg-white/2 hover:bg-white/4 text-text-secondary hover:text-text-primary'
            }`}
          >
            <Layers size={15} />
            <span>Configurar Planos</span>
          </button>

          <button
            onClick={() => setActiveTab('abacate')}
            className={`flex items-center gap-3 w-full text-left px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.06em] rounded-[10px] border transition-all cursor-pointer ${
              activeTab === 'abacate'
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-transparent bg-white/2 hover:bg-white/4 text-text-secondary hover:text-text-primary'
            }`}
          >
            <Key size={15} />
            <span>Integração Abacate Pay</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-3 w-full text-left px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.06em] rounded-[10px] border transition-all cursor-pointer relative ${
              activeTab === 'logs'
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-transparent bg-white/2 hover:bg-white/4 text-text-secondary hover:text-text-primary'
            }`}
          >
            <Database size={15} />
            <span>Transações & Webhooks</span>
            {store.transactions.filter(t => t.status === 'pending').length > 0 && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-accent text-bg-deep text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {store.transactions.filter(t => t.status === 'pending').length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content area */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* TAB 1: METRICS */}
          {activeTab === 'metrics' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-border-subtle pb-4 mb-2">
                <h2 className="font-rework text-[18px] font-extrabold text-white tracking-widest uppercase scale-y-[0.85] origin-left">
                  Métricas de Telemetria
                </h2>
                <span className="text-[10px] text-accent font-mono uppercase tracking-wider">// Lousa de Dados</span>
              </div>

              <div className="bg-bg-alt border border-border-card rounded-[16px] p-6 flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-text-secondary tracking-wide uppercase">
                    Tokens processados (Inicial)
                  </label>
                  <input
                    type="number"
                    value={counterTokens}
                    onChange={(e) => setCounterTokens(Number(e.target.value))}
                    className="w-full bg-black/40 border border-border-card rounded-[10px] py-3 px-4 text-[14px] text-text-primary outline-none focus:border-accent transition-colors font-mono"
                  />
                  <div className="text-[11px] text-text-muted mt-0.5 uppercase tracking-wide">
                    Número estático base. O frontend simula fluxos contínuos.
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-text-secondary tracking-wide uppercase">
                      Assinaturas Ativas
                    </label>
                    <input
                      type="number"
                      value={counterSubs}
                      onChange={(e) => setCounterSubs(Number(e.target.value))}
                      className="w-full bg-black/40 border border-border-card rounded-[10px] py-3 px-4 text-[14px] text-text-primary outline-none focus:border-accent transition-colors font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-text-secondary tracking-wide uppercase">
                      Conexões Simultâneas
                    </label>
                    <input
                      type="number"
                      value={counterLive}
                      onChange={(e) => setCounterLive(Number(e.target.value))}
                      className="w-full bg-black/40 border border-border-card rounded-[10px] py-3 px-4 text-[14px] text-text-primary outline-none focus:border-accent transition-colors font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PLANS CONFIGURATION */}
          {activeTab === 'plans' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-border-subtle pb-4 mb-2">
                <h2 className="font-rework text-[18px] font-extrabold text-white tracking-widest uppercase scale-y-[0.85] origin-left">
                  Gerenciamento de Planos
                </h2>
                <span className="text-[10px] text-accent font-mono uppercase tracking-wider">// Custos & Descrições</span>
              </div>

              {/* Starter */}
              <div className="bg-bg-alt border border-border-card rounded-[16px] p-6 flex flex-col gap-4">
                <h3 className="text-[13px] font-bold uppercase tracking-wider text-accent border-b border-border-subtle pb-2">
                  1. Ordem dos Escribas (Starter)
                </h3>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="flex flex-col gap-1.5 col-span-1">
                    <label className="text-[11px] font-semibold text-text-secondary uppercase">
                      Preço (R$)
                    </label>
                    <input
                      type="number"
                      value={priceStarter}
                      onChange={(e) => setPriceStarter(Number(e.target.value))}
                      className="w-full bg-black/40 border border-border-card rounded-[10px] py-2.5 px-4 text-[14px] text-text-primary outline-none focus:border-accent transition-colors font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-[11px] font-semibold text-text-secondary uppercase">
                      Chamada Curta / Descrição
                    </label>
                    <input
                      type="text"
                      value={descStarter}
                      onChange={(e) => setDescStarter(e.target.value)}
                      className="w-full bg-black/40 border border-border-card rounded-[10px] py-2.5 px-4 text-[13px] text-text-primary outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Pro */}
              <div className="bg-bg-alt border border-border-card rounded-[16px] p-6 flex flex-col gap-4">
                <h3 className="text-[13px] font-bold uppercase tracking-wider text-accent border-b border-border-subtle pb-2">
                  2. Conselho dos Arcontes (Pro)
                </h3>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="flex flex-col gap-1.5 col-span-1">
                    <label className="text-[11px] font-semibold text-text-secondary uppercase">
                      Preço (R$)
                    </label>
                    <input
                      type="number"
                      value={pricePro}
                      onChange={(e) => setPricePro(Number(e.target.value))}
                      className="w-full bg-black/40 border border-border-card rounded-[10px] py-2.5 px-4 text-[14px] text-text-primary outline-none focus:border-accent transition-colors font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-[11px] font-semibold text-text-secondary uppercase">
                      Chamada Curta / Descrição
                    </label>
                    <input
                      type="text"
                      value={descPro}
                      onChange={(e) => setDescPro(e.target.value)}
                      className="w-full bg-black/40 border border-border-card rounded-[10px] py-2.5 px-4 text-[13px] text-text-primary outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ABACATE PAY INTEGRATION */}
          {activeTab === 'abacate' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-border-subtle pb-4 mb-2">
                <h2 className="font-rework text-[18px] font-extrabold text-white tracking-widest uppercase scale-y-[0.85] origin-left">
                  Abacate Pay Integration
                </h2>
                <span className="text-[10px] text-accent font-mono uppercase tracking-wider">// Credenciais & Sandbox</span>
              </div>

              <div className="bg-bg-alt border border-border-card rounded-[16px] p-6 flex flex-col gap-5">
                {/* Api Token Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-text-secondary tracking-wide uppercase">
                    Abacate Pay API Token
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showToken ? 'text' : 'password'}
                      placeholder="abc_token_xxxxxxxxxxxxxxx"
                      value={abacatePayToken}
                      onChange={(e) => setAbacatePayToken(e.target.value)}
                      className="w-full bg-black/40 border border-border-card rounded-[10px] py-3 px-4 pr-12 text-[13px] text-text-primary font-mono outline-none focus:border-accent transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-4 text-text-muted hover:text-text-primary cursor-pointer border-none bg-transparent"
                    >
                      {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5">
                    Utilizado para chamadas à rota `/api/checkout`. Deixe em branco para simulação mock.
                  </div>
                </div>

                {/* Sandbox Toggle */}
                <div className="flex items-center justify-between border-t border-border-subtle pt-4">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-white uppercase tracking-wide">
                      Modo Sandbox / Simulação
                    </span>
                    <span className="text-[11px] text-text-secondary">
                      Impede chamadas de API reais. Gera Pix fictícios no checkout de testes.
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setAbacatePaySandbox(!abacatePaySandbox)}
                    className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer border-none outline-none ${
                      abacatePaySandbox ? 'bg-accent' : 'bg-white/10'
                    }`}
                  >
                    <span 
                      className={`absolute top-1.5 w-3 h-3 rounded-full bg-bg-deep transition-transform duration-200 ${
                        abacatePaySandbox ? 'right-2' : 'left-2'
                      }`}
                    />
                  </button>
                </div>

                {/* Webhook details */}
                <div className="flex flex-col gap-2 border-t border-border-subtle pt-4">
                  <span className="text-[12px] font-bold text-white uppercase tracking-wide">
                    URL de Webhook da Aplicação
                  </span>
                  <div className="bg-black/40 border border-border-subtle p-3 rounded-[8px] font-mono text-[11px] text-accent select-all">
                    {appOrigin}/api/webhook
                  </div>
                  <p className="text-[11px] text-text-muted">
                    Configure esta URL no dashboard da Abacate Pay para receber confirmações de Pix reais.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WEBHOOKS AND LOGS SIMULATION */}
          {activeTab === 'logs' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-border-subtle pb-4 mb-2">
                <h2 className="font-rework text-[18px] font-extrabold text-white tracking-widest uppercase scale-y-[0.85] origin-left">
                  Transações & Webhooks
                </h2>
                <button
                  onClick={handleClearTransactions}
                  className="text-[10px] font-bold tracking-[0.05em] uppercase bg-transparent text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 px-3.5 py-1.5 rounded-full cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Trash2 size={12} />
                  Limpar Logs
                </button>
              </div>

              {/* Transactions list */}
              <div className="bg-bg-alt border border-border-card rounded-[16px] p-6 flex flex-col gap-4">
                <h3 className="text-[12px] font-bold uppercase tracking-wider text-accent border-b border-border-subtle pb-2 flex items-center justify-between">
                  <span>HISTÓRICO DE ASSINATURAS PIX</span>
                  <span className="font-mono text-[10px] text-text-muted">COUNT: {store.transactions.length}</span>
                </h3>

                {store.transactions.length === 0 ? (
                  <p className="text-[12px] text-text-muted text-center py-6">
                    Nenhuma transação registrada. Vá na landing page e simule uma compra.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3.5 max-h-[300px] overflow-y-auto pr-1">
                    {store.transactions.map((tx) => (
                      <div 
                        key={tx.id} 
                        className="bg-black/30 border border-border-subtle p-4 rounded-[10px] flex items-center justify-between gap-4 transition-all hover:border-accent/20"
                      >
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-bold text-white uppercase">{tx.plan}</span>
                            <span className="font-mono text-[9px] text-text-muted select-all">ID: {tx.id}</span>
                          </div>
                          <div className="text-[11px] text-text-secondary">
                            Preço: <span className="text-white font-mono">R$ {tx.amount}</span> · {tx.timestamp}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {tx.status === 'pending' ? (
                            <>
                              <span className="text-[9px] font-bold tracking-wider uppercase bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 px-2 py-0.5 rounded">
                                PENDENTE
                              </span>
                              <button
                                onClick={() => handleSimulateWebhook(tx)}
                                className="text-[10px] font-bold tracking-wider uppercase bg-accent text-bg-deep px-3 py-1.5 rounded-full cursor-pointer hover:opacity-85 transition-opacity flex items-center gap-1.5 border-none"
                              >
                                <Play size={10} fill="currentColor" />
                                Pagar
                              </button>
                            </>
                          ) : tx.status === 'approved' ? (
                            <span className="text-[9px] font-bold tracking-wider uppercase bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 px-2.5 py-0.5 rounded flex items-center gap-1">
                              <CheckCircle size={10} />
                              APROVADO
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold tracking-wider uppercase bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded">
                              FALHOU
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Console / Simulator logs for debugging */}
          <div className="bg-black border border-border-card rounded-[16px] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <h3 className="text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-3 flex items-center gap-2 border-b border-border-subtle pb-2">
              <Cpu size={12} className="text-accent" />
              <span>TERMINAL DE SIMULAÇÃO DE WEBHOOKS & SISTEMA</span>
            </h3>
            
            <div className="h-[140px] overflow-y-auto font-mono text-[11px] text-accent/80 flex flex-col gap-1 pr-1 bg-black/40 p-4 rounded-[8px] border border-border-subtle scrollbar-thin">
              {simLogs.map((log, idx) => (
                <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Save Button for general configurations */}
          {activeTab !== 'logs' && (
            <button
              onClick={handleSaveConfig}
              className="inline-flex items-center justify-center gap-2 text-[12px] font-semibold tracking-[0.06em] uppercase bg-accent text-[#05070B] border-none py-4 px-8 rounded-full cursor-pointer hover:opacity-85 hover:-translate-y-0.5 transition-all w-full mt-4"
            >
              Salvar Alterações
            </button>
          )}

        </div>
      </div>

      {/* Save Toast Notification */}
      <div 
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#22c55e] text-[#05070B] text-[12px] font-semibold tracking-wider uppercase py-3 px-8 rounded-full shadow-lg z-50 pointer-events-none transition-opacity duration-300 ${
          showToast ? 'opacity-100' : 'opacity-0'
        }`}
      >
        ✓ {toastMessage}
      </div>
    </div>
  );
}
