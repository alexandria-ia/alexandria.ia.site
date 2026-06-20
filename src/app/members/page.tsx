'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Disc, Shield, Key, Compass, Copy, 
  ExternalLink, TrendingUp, Users, DollarSign, 
  HelpCircle, ChevronDown, ChevronUp, Terminal, 
  Code, LogOut, CheckCircle, Gift, Info, Lock
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ParticleCanvas from '@/components/canvas/ParticleCanvas';
import CursorGlow from '@/components/canvas/CursorGlow';

interface Member {
  email: string;
  name: string;
  active: boolean;
  plan: string;
  signupDate: string;
  affiliateCode: string;
  affiliateInvitesGenerated: number;
  affiliateInvitesValidated: number;
  affiliateCredits: number;
  chatPassword?: string;
  passwordChanged?: boolean;
}

export default function MembersPage() {
  const [hydrated, setHydrated] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [member, setMember] = useState<Member | null>(null);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);
  const [apiSnippetTab, setApiSnippetTab] = useState<'curl' | 'js' | 'python'>('curl');
  const [copied, setCopied] = useState(false);
  const [appOrigin, setAppOrigin] = useState('https://alexandria-tech.com.br');
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  // Alexandria Chat password change states
  const [newChatPassword, setNewChatPassword] = useState('');
  const [confirmChatPassword, setConfirmChatPassword] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Status toggle state
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [statusChangeError, setStatusChangeError] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/members/auth');
        if (response.ok) {
          const data = await response.json();
          if (data.authorized && data.member) {
            setMember(data.member);
            setIsLoggedIn(true);
          }
        }
      } catch (err) {
        console.error('Erro de sessão:', err);
      } finally {
        setHydrated(true);
      }
    };

    checkSession();

    if (typeof window !== 'undefined') {
      setAppOrigin(window.location.origin);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    try {
      const response = await fetch('/api/members/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim() })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMember(data.member);
        setIsLoggedIn(true);
      } else {
        setLoginError(data.error || 'Credenciais inválidas.');
      }
    } catch (err) {
      console.error(err);
      setLoginError('Falha de conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!member) return;
    setIsTogglingStatus(true);
    setStatusChangeError('');
    const newActiveState = !member.active;

    try {
      const response = await fetch('/api/members/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: newActiveState })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMember(data.member);
      } else {
        setStatusChangeError(data.error || 'Erro ao alterar o status do plano.');
      }
    } catch (err) {
      console.error(err);
      setStatusChangeError('Erro de conexão com o servidor.');
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleChangePassword = async (newPass: string) => {
    setIsChangingPassword(true);
    setPasswordChangeError('');
    setPasswordChangeSuccess(false);

    try {
      const response = await fetch('/api/members/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPass })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMember(data.member);
        setPasswordChangeSuccess(true);
        setNewChatPassword('');
        setConfirmChatPassword('');
        setTimeout(() => setPasswordChangeSuccess(false), 4000);
      } else {
        setPasswordChangeError(data.error || 'Erro ao alterar a senha.');
      }
    } catch (err) {
      console.error(err);
      setPasswordChangeError('Erro de conexão com o servidor.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/members/auth', { method: 'DELETE' });
      setIsLoggedIn(false);
      setMember(null);
      setEmailInput('');
      setNewChatPassword('');
      setConfirmChatPassword('');
      setPasswordChangeError('');
      setPasswordChangeSuccess(false);
    } catch (err) {
      console.error('Erro no logout:', err);
    }
  };

  const copyAffiliateLink = () => {
    if (!member) return;
    const link = `${appOrigin}/?ref=${member.affiliateCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeem = () => {
    setRedeemSuccess(true);
    setTimeout(() => setRedeemSuccess(false), 4000);
  };

  // Accordion data
  const faqs = [
    {
      question: 'Como faço para autenticar na API do Alexandria?',
      answer: 'Toda requisição deve conter o cabeçalho "Authorization" com o valor "Bearer SUA_CHAVE_API". Você pode gerenciar suas chaves de API diretamente nas configurações ou entrar em contato com o suporte para chaves de produção de alto volume. O endpoint padrão é: https://api.alexandria-tech.com.br/v1'
    },
    {
      question: 'Quais modelos estão inclusos na minha assinatura?',
      answer: 'O Alexandria unifica o acesso aos maiores modelos do mercado (GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, Llama 3.1) sob um modelo híbrido de cache e roteamento inteligente chamado alexandria-hybrid, economizando latência e custos computacionais.'
    },
    {
      question: 'Como funciona o sistema de créditos por indicação?',
      answer: 'Ao convidar novos membros usando seu link exclusivo de afiliado, você acumula R$ 20,00 em créditos para cada assinatura ativada (quando o convidado realiza o pagamento do primeiro mês). Esses créditos podem ser descontados na sua próxima mensalidade ou resgatados via Pix diretamente na sua conta.'
    },
    {
      question: 'Posso cancelar ou alterar minha assinatura a qualquer momento?',
      answer: 'Sim. Alexandria não possui fidelidade. Você pode solicitar o cancelamento diretamente no painel ou entrar em contato pelo Discord oficial do projeto. O plano permanecerá ativo até o final do período de faturamento atual.'
    }
  ];

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center font-sans">
        <span className="text-[12px] uppercase font-semibold tracking-widest text-text-secondary animate-pulse">
          Carregando Área de Membros...
        </span>
      </div>
    );
  }

  return (
    <>
      <ParticleCanvas />
      <CursorGlow />
      <Navbar />

      <main className="min-h-screen bg-bg-deep text-text-primary pt-24 pb-20 relative overflow-x-hidden font-sans z-10">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            {!isLoggedIn ? (
              /* LOGIN STATE */
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center py-20"
              >
                <div className="relative bg-bg-alt/90 border border-border-card p-8 md:p-10 rounded-[16px] max-w-[450px] w-full shadow-[0_24px_64px_rgba(0,0,0,0.55)] backdrop-blur-[16px]">
                  
                  {/* Decorative corner lines */}
                  <div className="absolute top-0 left-0 w-8 h-[1px] bg-accent" />
                  <div className="absolute top-0 left-0 w-[1px] h-8 bg-accent" />
                  <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-accent" />
                  <div className="absolute bottom-0 right-0 w-[1px] h-8 bg-accent" />

                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-12 h-12 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mb-4">
                      <Shield size={22} className="animate-pulse" />
                    </div>
                    <h2 className="font-rework text-[24px] font-extrabold text-white tracking-widest uppercase scale-y-[0.85]">
                      Membros Alexandria
                    </h2>
                    <p className="text-[12px] text-text-secondary mt-1 max-w-[280px]">
                      Acesse com o e-mail cadastrado na sua assinatura
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                        E-mail de Cadastro
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="Digite seu e-mail"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className={`w-full bg-black/40 border ${
                            loginError ? 'border-red-500' : 'border-border-card'
                          } focus:border-accent rounded-[10px] py-3.5 pl-11 pr-4 text-[13px] text-text-primary outline-none transition-colors placeholder:text-text-muted`}
                          required
                          disabled={isLoading}
                        />
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                      </div>
                      {loginError && (
                        <p className="text-[10px] text-red-500 font-semibold uppercase tracking-wider mt-1">
                          {loginError}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full text-[12px] font-bold tracking-[0.06em] uppercase bg-accent text-bg-deep py-4 rounded-full hover:opacity-90 active:opacity-85 transition-opacity border-none cursor-pointer flex items-center justify-center gap-1.5 mt-2"
                    >
                      {isLoading ? 'Autenticando...' : 'Acessar Área de Membros'}
                    </button>
                  </form>
                </div>
              </motion.div>
            ) : (
              /* LOGGED IN DASHBOARD STATE */
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-10"
              >
                {/* Header Welcome Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border-subtle pb-8">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      {member?.active ? (
                        <span className="text-[10px] font-extrabold bg-accent/15 border border-accent/30 text-accent px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Membro Ativo
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold bg-red-500/15 border border-red-500/30 text-red-500 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Membro Inativo
                        </span>
                      )}
                      <span className="text-text-muted font-mono text-[11px] uppercase">
                        Desde {member?.signupDate}
                      </span>
                    </div>
                    <h1 className="font-rework text-[28px] font-extrabold text-white tracking-wider uppercase scale-y-[0.9] origin-left">
                      Bem-vindo, {member?.name}
                    </h1>
                    <p className="text-[13px] text-text-secondary">
                      Painel centralizado do assinante & programa de indicações.
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="text-[11px] font-bold tracking-[0.06em] uppercase border border-border-card hover:bg-white/5 text-text-secondary px-5 py-2.5 rounded-full cursor-pointer transition-all flex items-center gap-2 max-w-fit self-start md:self-center"
                  >
                    <LogOut size={13} />
                    Sair da Conta
                  </button>
                </div>

                {/* Dashboard Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left Column - Subscription & Discord info */}
                  <div className="flex flex-col gap-8 lg:col-span-1">
                    
                    {/* Subscription Details Widget */}
                    <div className="bg-bg-alt border border-border-card rounded-[16px] p-6 relative overflow-hidden backdrop-blur-md">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
                      
                      <h3 className="text-[12px] font-bold tracking-wider text-text-secondary uppercase mb-5 flex items-center gap-2">
                        <Key size={14} className="text-accent" />
                        <span>Controle de Assinatura</span>
                      </h3>

                      <div className="flex flex-col gap-4">
                        <div className="bg-black/30 border border-border-subtle p-4 rounded-[12px]">
                          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                            Plano Atual
                          </span>
                          <span className="text-[15px] font-semibold text-white font-rework tracking-wide block uppercase">
                            {member?.plan === 'pro' ? 'Conselho dos Arcontes (Pro)' : 'Ordem dos Escribas (Starter)'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-black/30 border border-border-subtle p-3 rounded-[12px] flex flex-col justify-between">
                            <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                              Status
                            </span>
                            <div className="flex items-center justify-between gap-1.5 mt-0.5">
                              <span className={`text-[11px] font-semibold uppercase flex items-center gap-1.5 ${member?.active ? 'text-green-400' : 'text-red-400'}`}>
                                {member?.active ? (
                                  <>
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-[pulse-status_1.5s_infinite_linear]" />
                                    Ativo
                                  </>
                                ) : (
                                  <>
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                    Inativo
                                  </>
                                )}
                              </span>
                              
                              <button
                                onClick={handleToggleStatus}
                                disabled={isTogglingStatus}
                                className={`relative w-8 h-4.5 rounded-full transition-colors cursor-pointer border-none outline-none flex items-center flex-shrink-0 ${
                                  member?.active ? 'bg-green-500' : 'bg-white/10'
                                }`}
                                style={{ height: '18px', width: '32px' }}
                              >
                                <span 
                                  className="absolute w-3.5 h-3.5 rounded-full bg-bg-deep transition-transform duration-200"
                                  style={{
                                    left: '2px',
                                    transform: member?.active ? 'translateX(14px)' : 'none'
                                  }}
                                />
                              </button>
                            </div>
                          </div>

                          <div className="bg-black/30 border border-border-subtle p-3 rounded-[12px]">
                            <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block mb-0.5">
                              Faturamento
                            </span>
                            <span className="text-[11px] font-semibold text-white uppercase">
                              Pix Mensal
                            </span>
                          </div>
                        </div>

                        {statusChangeError && (
                          <span className="text-[9px] text-red-500 block text-center uppercase tracking-wider font-semibold">
                            {statusChangeError}
                          </span>
                        )}

                        <div className="text-[11px] text-text-secondary bg-white/2 border border-dashed border-border-card p-3.5 rounded-[12px] flex gap-2">
                          <Info size={14} className="text-accent flex-shrink-0 mt-0.5" />
                          <span>
                            Sua assinatura é renovada via Pix automaticamente. Acesse o chat de suporte para quaisquer alterações de dados.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Alexandria Chat Password Card */}
                    <div className="bg-bg-alt border border-border-card rounded-[16px] p-6 relative overflow-hidden backdrop-blur-md">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
                      
                      <h3 className="text-[12px] font-bold tracking-wider text-text-secondary uppercase mb-4 flex items-center gap-2">
                        <Lock size={14} className="text-accent" />
                        <span>Senha do Alexandria Chat</span>
                      </h3>

                      <p className="text-[12px] text-text-secondary mb-4 leading-relaxed">
                        Esta senha é utilizada para se conectar ao portal do Alexandria Chat. Altere-a a qualquer momento abaixo.
                      </p>

                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (newChatPassword.length < 4) {
                          setPasswordChangeError('A senha deve ter no mínimo 4 caracteres.');
                          return;
                        }
                        if (newChatPassword !== confirmChatPassword) {
                          setPasswordChangeError('Senhas não coincidem.');
                          return;
                        }
                        handleChangePassword(newChatPassword);
                      }} className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                            Nova Senha do Chat
                          </label>
                          <input
                            type="password"
                            placeholder="Mínimo 4 caracteres"
                            value={newChatPassword}
                            onChange={(e) => setNewChatPassword(e.target.value)}
                            className="w-full bg-black/40 border border-border-card focus:border-accent rounded-[8px] py-2 px-3 text-[12px] text-text-primary outline-none"
                            required
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                            Confirmar Nova Senha
                          </label>
                          <input
                            type="password"
                            placeholder="Confirme a nova senha"
                            value={confirmChatPassword}
                            onChange={(e) => setConfirmChatPassword(e.target.value)}
                            className="w-full bg-black/40 border border-border-card focus:border-accent rounded-[8px] py-2 px-3 text-[12px] text-text-primary outline-none"
                            required
                          />
                        </div>

                        {passwordChangeError && (
                          <p className="text-[10px] text-red-500 font-semibold uppercase tracking-wider">
                            {passwordChangeError}
                          </p>
                        )}

                        {passwordChangeSuccess && (
                          <p className="text-[10px] text-[#22c55e] font-semibold uppercase tracking-wider">
                            ✓ Senha alterada com sucesso!
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={isChangingPassword}
                          className="w-full text-[10px] font-bold tracking-[0.06em] uppercase bg-transparent border border-accent text-accent hover:bg-accent/5 py-2.5 rounded-full cursor-pointer transition-colors flex items-center justify-center gap-1"
                        >
                          {isChangingPassword ? 'Alterando...' : 'Alterar Senha'}
                        </button>
                      </form>
                    </div>

                    {/* Discord Widget */}
                    <div className="bg-bg-alt border border-border-card rounded-[16px] p-6 relative overflow-hidden backdrop-blur-md">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#5865F2]/10 rounded-full blur-2xl" />

                      <h3 className="text-[12px] font-bold tracking-wider text-text-secondary uppercase mb-4 flex items-center gap-2">
                        <Disc size={15} className="text-[#5865F2]" />
                        <span>Comunidade Discord</span>
                      </h3>

                      <p className="text-[12px] text-text-secondary mb-5 leading-relaxed">
                        Conecte-se com outros desenvolvedores, acesse canais exclusivos para assinantes e receba avisos e atualizações sobre a infraestrutura da API.
                      </p>

                      <a 
                        href="https://discord.gg/JhrhX2zEta" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full text-[11px] font-bold tracking-[0.06em] uppercase bg-[#5865F2] hover:bg-[#5865F2]/90 text-white py-3.5 rounded-full border-none cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Disc size={14} fill="currentColor" />
                        Acessar Servidor Discord
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>

                  {/* Right Columns - FAQ/API Integration & Affiliate metrics */}
                  <div className="lg:col-span-2 flex flex-col gap-8">
                    
                    {/* Affiliate Statistics Widget */}
                    <div className="bg-bg-alt border border-border-card rounded-[16px] p-6 relative backdrop-blur-md">
                      <h3 className="text-[12px] font-bold tracking-wider text-text-secondary uppercase mb-5 flex items-center gap-2">
                        <Gift size={14} className="text-accent" />
                        <span>Estatísticas de Afiliado</span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* Invites Clicked */}
                        <div className="bg-black/30 border border-border-subtle p-4 rounded-[12px] flex items-center justify-between">
                          <div>
                            <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                              Convites Gerados (Cliques)
                            </span>
                            <span className="text-[20px] font-mono font-bold text-white">
                              {member?.affiliateInvitesGenerated || 0}
                            </span>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-accent/5 flex items-center justify-center text-accent">
                            <Compass size={18} />
                          </div>
                        </div>

                        {/* Invites Validated */}
                        <div className="bg-black/30 border border-border-subtle p-4 rounded-[12px] flex items-center justify-between">
                          <div>
                            <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                              Convites Validados (Assinados)
                            </span>
                            <span className="text-[20px] font-mono font-bold text-white">
                              {member?.affiliateInvitesValidated || 0}
                            </span>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-[#22c55e]/5 flex items-center justify-center text-[#22c55e]">
                            <Users size={18} />
                          </div>
                        </div>

                        {/* Credits earned */}
                        <div className="bg-black/30 border border-border-subtle p-4 rounded-[12px] flex items-center justify-between">
                          <div>
                            <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                              Créditos Acumulados
                            </span>
                            <span className="text-[20px] font-mono font-bold text-accent">
                              R$ {(member?.affiliateCredits || 0).toFixed(2)}
                            </span>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-accent/5 flex items-center justify-center text-accent">
                            <DollarSign size={18} />
                          </div>
                        </div>
                      </div>

                      {/* Referral link configuration */}
                      <div className="bg-black/40 border border-border-subtle p-4 rounded-[12px] flex flex-col gap-3.5 mb-5">
                        <div>
                          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                            Link de Indicação Exclusivo
                          </span>
                          <p className="text-[11px] text-text-secondary">
                            Copie seu link e envie para novos interessados. Cada indicação válida gera R$ 20 de crédito.
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={`${appOrigin}/?ref=${member?.affiliateCode}`}
                            className="flex-1 bg-black/50 border border-border-card rounded-[8px] py-2.5 px-4 font-mono text-[11px] text-accent outline-none"
                          />
                          <button
                            onClick={copyAffiliateLink}
                            className="bg-accent hover:opacity-90 text-bg-deep border-none font-bold uppercase text-[10px] tracking-wider py-2.5 px-4 rounded-[8px] cursor-pointer flex items-center gap-1.5 transition-opacity"
                          >
                            {copied ? (
                              <>
                                <CheckCircle size={13} />
                                Copiado
                              </>
                            ) : (
                              <>
                                <Copy size={13} />
                                Copiar
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Redeem simulation */}
                      <div className="flex items-center justify-between gap-4 border-t border-border-subtle pt-5">
                        <div className="flex flex-col">
                          <span className="text-[12px] font-bold text-white uppercase tracking-wide">
                            Resgatar Saldo Acumulado
                          </span>
                          <span className="text-[11px] text-text-secondary">
                            Transfira seus créditos para sua conta Pix cadastrada
                          </span>
                        </div>
                        
                        <button
                          onClick={handleRedeem}
                          disabled={(member?.affiliateCredits || 0) <= 0}
                          className="bg-transparent border border-accent text-accent hover:bg-accent/5 disabled:opacity-40 disabled:hover:bg-transparent font-bold uppercase text-[11px] tracking-wide px-5 py-2.5 rounded-full cursor-pointer transition-colors"
                        >
                          Solicitar Resgate
                        </button>
                      </div>

                      {redeemSuccess && (
                        <motion.p
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[11px] text-[#22c55e] font-semibold uppercase tracking-wider text-right mt-3"
                        >
                          ✓ Solicitação recebida! Nossa equipe processará seu Pix em até 24h.
                        </motion.p>
                      )}
                    </div>

                    {/* Tutorial & API Integration Guide */}
                    <div className="bg-bg-alt border border-border-card rounded-[16px] p-6 relative backdrop-blur-md">
                      <h3 className="text-[12px] font-bold tracking-wider text-text-secondary uppercase mb-5 flex items-center gap-2">
                        <Terminal size={14} className="text-accent" />
                        <span>Guia de Uso & Integração da API</span>
                      </h3>

                      {/* Tabs selector */}
                      <div className="flex items-center gap-1 bg-black/40 border border-border-subtle p-1 rounded-[10px] mb-4">
                        <button
                          onClick={() => setApiSnippetTab('curl')}
                          className={`flex-1 py-2 px-3 rounded-[8px] text-[11px] font-bold uppercase tracking-wider cursor-pointer border-none transition-colors ${
                            apiSnippetTab === 'curl' ? 'bg-accent text-bg-deep' : 'text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          cURL
                        </button>
                        <button
                          onClick={() => setApiSnippetTab('js')}
                          className={`flex-1 py-2 px-3 rounded-[8px] text-[11px] font-bold uppercase tracking-wider cursor-pointer border-none transition-colors ${
                            apiSnippetTab === 'js' ? 'bg-accent text-bg-deep' : 'text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          Javascript
                        </button>
                        <button
                          onClick={() => setApiSnippetTab('python')}
                          className={`flex-1 py-2 px-3 rounded-[8px] text-[11px] font-bold uppercase tracking-wider cursor-pointer border-none transition-colors ${
                            apiSnippetTab === 'python' ? 'bg-accent text-bg-deep' : 'text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          Python
                        </button>
                      </div>

                      {/* Snippets Area */}
                      <div className="relative mb-6">
                        <pre className="bg-black/60 border border-border-subtle p-5 rounded-[12px] text-[11px] text-accent overflow-x-auto font-mono leading-relaxed select-all">
                          {apiSnippetTab === 'curl' && (
`curl -X POST https://api.alexandria-tech.com/v1/chat/completions \\
  -H "Authorization: Bearer ALX-API-${member?.affiliateCode || 'APIKEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "alexandria-hybrid",
    "messages": [{"role": "user", "content": "Olá, Alexandria!"}]
  }'`
                          )}
                          {apiSnippetTab === 'js' && (
`const response = await fetch('https://api.alexandria-tech.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ALX-API-${member?.affiliateCode || 'APIKEY'}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'alexandria-hybrid',
    messages: [{ role: 'user', content: 'Olá, Alexandria!' }]
  })
});
const data = await response.json();
console.log(data);`
                          )}
                          {apiSnippetTab === 'python' && (
`import requests

url = "https://api.alexandria-tech.com/v1/chat/completions"
headers = {
    "Authorization": "Bearer ALX-API-${member?.affiliateCode || 'APIKEY'}",
    "Content-Type": "application/json"
}
payload = {
    "model": "alexandria-hybrid",
    "messages": [{"role": "user", "content": "Olá, Alexandria!"}]
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`
                          )}
                        </pre>
                      </div>

                      {/* FAQ Accordion list */}
                      <div className="border-t border-border-subtle pt-6">
                        <h4 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-1.5">
                          <HelpCircle size={13} />
                          <span>Perguntas Frequentes (FAQ)</span>
                        </h4>

                        <div className="flex flex-col gap-3">
                          {faqs.map((faq, idx) => {
                            const isOpen = faqOpenIndex === idx;
                            return (
                              <div 
                                key={idx} 
                                className="border border-border-subtle rounded-[12px] bg-black/15 overflow-hidden transition-all duration-200"
                              >
                                <button
                                  onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                                  className="w-full text-left p-4 flex items-center justify-between gap-4 font-bold text-[12px] tracking-wide uppercase text-white hover:text-accent border-none bg-transparent cursor-pointer"
                                >
                                  <span>{faq.question}</span>
                                  {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                                
                                <AnimatePresence initial={false}>
                                  {isOpen && (
                                    <motion.div
                                      initial={{ height: 0 }}
                                      animate={{ height: 'auto' }}
                                      exit={{ height: 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <div className="p-4 pt-0 border-t border-border-subtle/50 text-[12px] text-text-secondary leading-relaxed bg-black/10">
                                        {faq.answer}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {member && member.passwordChanged === false && (
        <div className="fixed inset-0 bg-bg-deep/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="relative bg-bg-alt/95 border border-accent/20 p-8 md:p-10 rounded-[16px] max-w-[450px] w-full shadow-[0_24px_64px_rgba(0,0,0,0.7)]">
            {/* Design accents */}
            <div className="absolute top-0 left-0 w-8 h-[1px] bg-accent" />
            <div className="absolute top-0 left-0 w-[1px] h-8 bg-accent" />
            <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-accent" />
            <div className="absolute bottom-0 right-0 w-[1px] h-8 bg-accent" />

            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mb-4">
                <Lock size={22} className="animate-bounce" />
              </div>
              <h2 className="font-rework text-[20px] font-extrabold text-white tracking-widest uppercase scale-y-[0.85]">
                Primeiro Acesso Detectado
              </h2>
              <p className="text-[12px] text-text-secondary mt-2">
                Sua conta foi criada com uma senha padrão para o Alexandria Chat. É obrigatório alterar sua senha para ativar seu acesso ao painel.
              </p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (newChatPassword.length < 4) {
                setPasswordChangeError('A senha deve ter no mínimo 4 caracteres.');
                return;
              }
              if (newChatPassword !== confirmChatPassword) {
                setPasswordChangeError('As senhas não coincidem.');
                return;
              }
              await handleChangePassword(newChatPassword);
            }} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                  Senha Padrão Inicial
                </label>
                <div className="bg-black/30 border border-border-card p-3 rounded-[8px] font-mono text-[11px] text-center text-accent select-all">
                  alexandria_chat_2026
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                  Nova Senha do Alexandria Chat
                </label>
                <input
                  type="password"
                  placeholder="Defina sua nova senha"
                  value={newChatPassword}
                  onChange={(e) => setNewChatPassword(e.target.value)}
                  className="w-full bg-black/40 border border-border-card focus:border-accent rounded-[8px] py-3 px-4 text-[13px] text-text-primary outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  placeholder="Digite a nova senha novamente"
                  value={confirmChatPassword}
                  onChange={(e) => setConfirmChatPassword(e.target.value)}
                  className="w-full bg-black/40 border border-border-card focus:border-accent rounded-[8px] py-3 px-4 text-[13px] text-text-primary outline-none"
                  required
                />
              </div>

              {passwordChangeError && (
                <p className="text-[11px] text-red-500 font-semibold uppercase tracking-wider text-center">
                  {passwordChangeError}
                </p>
              )}

              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full text-[12px] font-bold tracking-[0.06em] uppercase bg-accent text-bg-deep py-3.5 rounded-full hover:opacity-90 transition-opacity border-none cursor-pointer flex items-center justify-center gap-1.5 mt-2"
              >
                {isChangingPassword ? 'Salvando Alteração...' : 'Alterar Senha & Acessar Painel'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
