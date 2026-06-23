'use client';

import React from 'react';
import Link from 'next/link';

export default function AgentsSection() {
  return (
    <section className="py-20 px-6 md:px-12 bg-bg-deep border-b border-border-subtle overflow-hidden relative z-10">
      {/* Blueprint corners */}
      <div className="bp-cross bp-cross-tl" />
      <div className="bp-cross bp-cross-tr" />
      <div className="bp-cross bp-cross-bl" />
      <div className="bp-cross bp-cross-br" />

      <div className="max-w-[1040px] mx-auto">
        <div className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
          <span className="w-6 h-[1px] bg-accent-dark" />
          Agentes
        </div>

        <h2 className="font-rework text-[clamp(26px,3.8vw,44px)] font-normal leading-[1.1] tracking-[0.05em] uppercase text-white scale-y-[0.85] origin-left mb-3">
          Crie o seu próprio<br />
          <span className="text-accent">especialista.</span>
        </h2>

        <p className="text-[14px] text-text-secondary max-w-[620px] leading-relaxed mb-8">
          Você monta o agente do zero — define o nome, a área, as instruções e alimenta com os documentos que quiser. Os exemplos abaixo são apenas para ilustrar o conceito.
        </p>

        {/* Warning Alert Box */}
        <div className="flex items-start gap-4 p-4.5 bg-amber-500/5 border border-amber-500/20 rounded-lg mb-8 relative">
          <div className="absolute top-2.5 left-2.5 w-[8px] h-[8px] border-t border-l border-amber-500/30" />
          
          <div className="text-[20px] flex-shrink-0"><i className="fa-solid fa-lightbulb"></i></div>
          <div className="text-[12px] text-text-secondary leading-relaxed">
            <strong className="text-amber-400">Estes são apenas exemplos ilustrativos.</strong> Na prática, você cria cada agente do jeito que precisar — define o nome, as instruções, a personalidade e pode enviar quantos documentos quiser para alimentá-lo. O agente aprende com o que você manda.
          </div>
        </div>

        {/* 2 Exemplo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Card 1 */}
          <div className="bg-bg-alt border border-border-card rounded-xl p-6 relative group overflow-hidden opacity-90 hover:opacity-100 hover:border-accent/40 transition-all duration-200">
            {/* Blueprint marks */}
            <div className="absolute top-2.5 left-2.5 w-[10px] h-[10px] border-t border-l border-accent/20" />
            <div className="absolute bottom-2.5 right-2.5 w-[10px] h-[10px] border-b border-r border-accent/20" />

            {/* Label top right */}
            <span className="absolute top-4 right-4 text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
              Exemplo
            </span>

            <div className="w-11 h-11 rounded-lg bg-accent-soft border border-accent-dark flex items-center justify-center text-[22px] mb-4">
              <i className="fa-solid fa-scale-balanced" />
            </div>
            <h3 className="text-[15px] font-bold text-white mb-2">Assistente Jurídico</h3>
            <p className="text-[12px] text-text-secondary leading-relaxed mb-4">
              Você alimenta com contratos, leis ou modelos de petição. O agente passa a responder com base nesses documentos.
            </p>
            <div className="text-[10px] text-text-muted italic mt-2">
              Criado e personalizado por você
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-bg-alt border border-border-card rounded-xl p-6 relative group overflow-hidden opacity-90 hover:opacity-100 hover:border-accent/40 transition-all duration-200">
            {/* Blueprint marks */}
            <div className="absolute top-2.5 left-2.5 w-[10px] h-[10px] border-t border-l border-accent/20" />
            <div className="absolute bottom-2.5 right-2.5 w-[10px] h-[10px] border-b border-r border-accent/20" />

            {/* Label top right */}
            <span className="absolute top-4 right-4 text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
              Exemplo
            </span>

            <div className="w-11 h-11 rounded-lg bg-accent-soft border border-accent-dark flex items-center justify-center text-[22px] mb-4">
              <i className="fa-solid fa-clipboard-list" />
            </div>
            <h3 className="text-[15px] font-bold text-white mb-2">Analista de Relatórios</h3>
            <p className="text-[12px] text-text-secondary leading-relaxed mb-4">
              Envie planilhas, PDFs financeiros ou relatórios da empresa. O agente responde perguntas com base nesses dados.
            </p>
            <div className="text-[10px] text-text-muted italic mt-2">
              Criado e personalizado por você
            </div>
          </div>
        </div>

        {/* CTA criar agente */}
        <div className="text-center p-8 bg-bg-alt border border-border-card rounded-xl relative shadow-2xl">
          <div className="absolute top-2.5 left-2.5 w-[10px] h-[10px] border-t border-l border-accent/20" />
          <div className="absolute bottom-2.5 right-2.5 w-[10px] h-[10px] border-b border-r border-accent/20" />

          <div className="text-[28px] mb-4"><i className="fa-solid fa-robot" /></div>
          <h3 className="font-rework text-[18px] font-normal uppercase text-white tracking-wider scale-y-[0.85] origin-center mb-1.5">
            Crie o seu agente
          </h3>
          <p className="text-[13px] text-text-secondary max-w-[440px] mx-auto leading-relaxed mb-6">
            Dê um nome, escreva as instruções e envie os documentos que quiser. O agente aprende com o que você manda — sem limite de arquivos.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.05em] uppercase bg-accent hover:opacity-90 text-bg-deep px-8 py-3.5 rounded-full shadow-[0_8px_24px_rgba(212,175,90,0.15)] transition-all duration-200"
          >
            Acessar o chat <i className="fa-solid fa-arrow-right text-[11px]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
