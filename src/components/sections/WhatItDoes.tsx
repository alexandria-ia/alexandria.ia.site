'use client';

import React from 'react';

export default function WhatItDoes() {
  return (
    <section className="py-14 px-6 border-y border-border-subtle bg-bg-alt relative z-10">
      <div className="max-w-[900px] mx-auto">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase mb-3 flex items-center justify-center gap-2">
            <span className="w-6 h-[1px] bg-accent-dark" />
            Transparência primeiro
          </div>
          <h2 className="font-rework text-[clamp(20px,2.8vw,30px)] font-normal text-white uppercase tracking-[0.05em] transform scale-y-[0.85] origin-center leading-tight">
            O Alexandria é uma ferramenta de <span className="text-accent">chat e análise.</span><br />
            Nem mais, nem menos.
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* O QUE FAZ */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-7 relative">
            {/* Blueprint corner marks */}
            <div className="absolute top-2.5 left-2.5 w-[10px] h-[10px] border-t border-l border-emerald-500/30" />
            <div className="absolute bottom-2.5 right-2.5 w-[10px] h-[10px] border-b border-r border-emerald-500/30" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                <i className="fa-solid fa-check text-[14px] font-bold"></i>
              </div>
              <span className="text-[12px] font-bold text-emerald-400 tracking-[0.05em] uppercase">
                O que o Alexandria faz
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                <div className="w-5.5 h-5.5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                  <i className="fa-solid fa-check text-[12px] font-bold"></i>
                </div>
                <div>
                  <strong className="text-[13px] text-white">Chat com IA</strong>
                  <p className="text-[12px] text-text-secondary mt-0.5">Conversas ilimitadas com modelos locais de alta qualidade.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                <div className="w-5.5 h-5.5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                  <i className="fa-solid fa-check text-[12px] font-bold"></i>
                </div>
                <div>
                  <strong className="text-[13px] text-white">Leitura e análise de documentos</strong>
                  <p className="text-[12px] text-text-secondary mt-0.5">PDF, Word, TXT, planilhas — o modelo lê e responde sobre o conteúdo.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                <div className="w-5.5 h-5.5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                  <i className="fa-solid fa-check text-[12px] font-bold"></i>
                </div>
                <div>
                  <strong className="text-[13px] text-white">Análise de imagens e prints</strong>
                  <p className="text-[12px] text-text-secondary mt-0.5">Envie fotos, prints de tela ou gráficos — o modelo interpreta e explica.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                <div className="w-5.5 h-5.5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                  <i className="fa-solid fa-check text-[12px] font-bold"></i>
                </div>
                <div>
                  <strong className="text-[13px] text-white">Agentes especializados</strong>
                  <p className="text-[12px] text-text-secondary mt-0.5">Jurídico, dev, marketing, engenharia — cada agente no seu contexto.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                <div className="w-5.5 h-5.5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                  <i className="fa-solid fa-check text-[12px] font-bold"></i>
                </div>
                <div>
                  <strong className="text-[13px] text-white">Memória persistente</strong>
                  <p className="text-[12px] text-text-secondary mt-0.5">Quanto mais usa, mais o sistema aprende sobre você.</p>
                </div>
              </div>
            </div>
          </div>

          {/* O QUE NÃO FAZ */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-7 relative flex flex-col justify-between">
            {/* Blueprint corner marks */}
            <div className="absolute top-2.5 left-2.5 w-[10px] h-[10px] border-t border-l border-red-500/30" />
            <div className="absolute bottom-2.5 right-2.5 w-[10px] h-[10px] border-b border-r border-red-500/30" />

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 rounded-lg bg-red-500/15 flex items-center justify-center text-red-400">
                  <i className="fa-solid fa-xmark text-[14px] font-bold"></i>
                </div>
                <span className="text-[12px] font-bold text-red-400 tracking-[0.05em] uppercase">
                  O que o Alexandria não faz
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                  <div className="w-5.5 h-5.5 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0 mt-0.5">
                    <i className="fa-solid fa-xmark text-[12px] font-bold"></i>
                  </div>
                  <div>
                    <strong className="text-[13px] text-white">Não gera imagens</strong>
                    <p className="text-[12px] text-text-secondary mt-0.5">Não há geração de arte, fotos ou ilustrações por IA (DALL-E, Midjourney, etc.).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                  <div className="w-5.5 h-5.5 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0 mt-0.5">
                    <i className="fa-solid fa-xmark text-[12px] font-bold"></i>
                  </div>
                  <div>
                    <strong className="text-[13px] text-white">Não cria vídeos</strong>
                    <p className="text-[12px] text-text-secondary mt-0.5">Nenhuma funcionalidade de geração ou edição automática de vídeos.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                  <div className="w-5.5 h-5.5 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0 mt-0.5">
                    <i className="fa-solid fa-xmark text-[12px] font-bold"></i>
                  </div>
                  <div>
                    <strong className="text-[13px] text-white">Não exporta documentos prontos</strong>
                    <p className="text-[12px] text-text-secondary mt-0.5">O conteúdo gerado fica no chat — sem exportação direta para arquivos diagramados.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                  <div className="w-5.5 h-5.5 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0 mt-0.5">
                    <i className="fa-solid fa-xmark text-[12px] font-bold"></i>
                  </div>
                  <div>
                    <strong className="text-[13px] text-white">Não faz automações externas</strong>
                    <p className="text-[12px] text-text-secondary mt-0.5">É uma ferramenta analítica de chat e raciocínio, não um orquestrador de tarefas externas.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3.5 bg-red-500/5 border border-red-500/10 rounded-lg flex items-center gap-3 text-[11px] text-text-secondary leading-normal">
              <i className="fa-solid fa-circle-info text-[15px] text-red-400 flex-shrink-0" />
              <span>
                Transparência é parte do produto. Você sabe exatamente o que está contratando.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
