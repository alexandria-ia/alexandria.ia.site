'use client';

import React from 'react';

const privacyCards = [
  {
    icon: 'fa-solid fa-lock',
    colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    title: 'Criptografia ponta a ponta',
    desc: 'Todas as conversas são encriptografadas em repouso (AES-256) e em trânsito (TLS 1.3). Nem nós conseguimos ler o conteúdo das suas mensagens sem a sua chave.',
  },
  {
    icon: 'fa-solid fa-shield-halved',
    colorClass: 'text-accent bg-accent-soft border-accent-dark/30',
    title: 'Zero venda de dados',
    desc: 'Não vendemos, compartilhamos nem usamos suas conversas para treinar modelos. Seus dados existem somente para você — ponto. Sem exceção.',
  },
  {
    icon: 'fa-solid fa-floppy-disk',
    colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    title: 'Backup diário automático',
    desc: 'Todo o histórico de conversas passa por backup diário com retenção de 30 dias. Nunca perca uma conversa por falha de hardware ou qualquer outro imprevisto.',
  },
  {
    icon: 'fa-solid fa-desktop',
    colorClass: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    title: 'Infraestrutura dedicada',
    desc: 'Cada cliente roda em ambiente isolado. Sem compartilhamento de contexto entre contas. GPU dedicada, memória dedicada, rede isolada via VPN por cliente.',
  },
  {
    icon: 'fa-solid fa-eye',
    colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    title: 'Sem telemetria externa',
    desc: 'Nenhuma conversa, prompt ou resposta é enviada para OpenAI, Google, Microsoft ou qualquer outro terceiro. Os modelos rodam 100% localmente no nosso hardware.',
  },
  {
    icon: 'fa-solid fa-satellite-dish',
    colorClass: 'text-accent bg-accent-soft border-accent-dark/30',
    title: 'Monitoramento 24/7',
    desc: 'Uptime monitorado em tempo real. Em caso de falha de qualquer componente, sistemas de alerta garantem resposta em minutos — não em horas.',
  },
];

export default function PrivacySection() {
  return (
    <section id="privacidade" className="py-20 px-6 md:px-12 bg-bg-deep border-b border-border-subtle overflow-hidden">
      {/* Blueprint corners */}
      <div className="bp-cross bp-cross-tl" />
      <div className="bp-cross bp-cross-tr" />
      <div className="bp-cross bp-cross-bl" />
      <div className="bp-cross bp-cross-br" />

      <div className="max-w-[1040px] mx-auto relative z-10">
        {/* Header */}
        <div className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
          <span className="w-6 h-[1px] bg-accent-dark" />
          Privacidade & infraestrutura
        </div>
        
        <h2 className="font-rework text-[clamp(26px,3.8vw,44px)] font-normal leading-[1.1] tracking-[0.05em] uppercase text-white scale-y-[0.85] origin-left mb-3">
          Sua conversa é sua.<br />
          <span className="text-accent">Só sua.</span>
        </h2>
        
        <p className="text-[14px] text-text-secondary max-w-[500px] leading-relaxed mb-10">
          Construímos tudo pensando em privacidade e continuidade. Seus dados nunca saem do nosso controle.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {privacyCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-bg-alt border border-border-card rounded-xl p-6 hover:border-border-subtle transition-all duration-200 relative group"
            >
              {/* Blueprint marks */}
              <div className="absolute top-2.5 left-2.5 w-[10px] h-[10px] border-t border-l border-accent/10 group-hover:border-accent/35 transition-all" />
              <div className="absolute bottom-2.5 right-2.5 w-[10px] h-[10px] border-b border-r border-accent/10 group-hover:border-accent/35 transition-all" />

              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-[18px] mb-4 border ${card.colorClass}`}>
                <i className={`${card.icon} text-[18px]`} />
              </div>
              <h3 className="text-[14px] font-bold text-white mb-2">{card.title}</h3>
              <p className="text-[12px] text-text-secondary leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer Summary Banner */}
        <div className="mt-8 bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-5 flex items-start sm:items-center gap-4 relative">
          <div className="absolute top-2.5 left-2.5 w-[8px] h-[8px] border-t border-l border-emerald-500/30" />
          
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <i className="fa-solid fa-check text-[16px]" />
          </div>
          <div className="text-[13px] text-text-secondary leading-relaxed">
            <strong className="text-white">Resumindo:</strong> seus chats ficam encriptografados no nosso servidor, com backup diário, sem log externo, sem venda de dados e sem nenhum terceiro com acesso ao conteúdo. Você conversa. A gente guarda. Mais ninguém lê.
          </div>
        </div>
      </div>
    </section>
  );
}
