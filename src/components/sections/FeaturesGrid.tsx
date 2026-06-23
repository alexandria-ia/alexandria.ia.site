'use client';

import React from 'react';

export default function FeaturesGrid() {
  return (
    <section id="features" className="relative py-20 px-6 md:px-12 bg-bg-deep border-b border-border-subtle overflow-hidden">
      {/* Blueprint corners */}
      <div className="bp-cross bp-cross-tl" />
      <div className="bp-cross bp-cross-tr" />
      <div className="bp-cross bp-cross-bl" />
      <div className="bp-cross bp-cross-br" />

      <div className="max-w-[1040px] mx-auto relative z-10">
        <div className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
          <span className="w-6 h-[1px] bg-accent-dark" />
          Recursos
        </div>
        
        <h2 className="font-rework text-[clamp(26px,3.8vw,44px)] font-normal leading-[1.1] tracking-[0.05em] uppercase text-white scale-y-[0.85] origin-left mb-3">
          Tudo que você precisa,<br />nada que você não precisa.
        </h2>
        
        <p className="text-[14px] text-text-secondary max-w-[500px] leading-relaxed mb-10">
          Chat inteligente, análise de documentos, agentes e memória. Tudo num único lugar, com preço fixo.
        </p>

        {/* Asymmetric layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Document card */}
          <div className="bg-bg-alt border border-border-card rounded-xl p-8 relative flex flex-col justify-between min-h-[360px]">
            {/* Blueprint marks */}
            <div className="absolute top-2.5 left-2.5 w-[10px] h-[10px] border-t border-l border-accent/20" />
            <div className="absolute bottom-2.5 right-2.5 w-[10px] h-[10px] border-b border-r border-accent/20" />

            <div>
              <div className="w-10 h-10 rounded-lg bg-accent-soft border border-accent-dark flex items-center justify-center text-[20px] mb-6">
                <i className="fa-solid fa-folder-open"></i>
              </div>
              <h3 className="text-[16px] font-bold text-white mb-2">Envie documentos e prints</h3>
              <p className="text-[13px] text-text-secondary leading-relaxed mb-6">
                Arraste um PDF, cole um print ou selecione um arquivo — o Alexandria lê e analisa o conteúdo na hora. Sem instalar nada, sem configurar nada.
              </p>
            </div>

            <div className="flex flex-col gap-2 mt-auto">
              <div className="flex items-center gap-3 p-3 bg-bg-deep border border-border-subtle rounded-lg">
                <span className="text-[16px]"><i className="fa-solid fa-file"></i></span>
                <div>
                  <div className="text-[12px] font-bold text-white">PDF</div>
                  <div className="text-[10px] text-text-secondary">Contratos, laudos, relatórios, manuais</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-bg-deep border border-border-subtle rounded-lg">
                <span className="text-[16px]"><i className="fa-solid fa-pen-to-square"></i></span>
                <div>
                  <div className="text-[12px] font-bold text-white">Word / TXT</div>
                  <div className="text-[10px] text-text-secondary">Documentos, rascunhos, transcrições</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Agents & Memory */}
          <div className="flex flex-col gap-4">
            {/* Agents card */}
            <div className="bg-bg-alt border border-border-card rounded-xl p-8 relative flex-1">
              {/* Blueprint marks */}
              <div className="absolute top-2.5 left-2.5 w-[10px] h-[10px] border-t border-l border-accent/20" />
              <div className="absolute bottom-2.5 right-2.5 w-[10px] h-[10px] border-b border-r border-accent/20" />

              <div className="w-10 h-10 rounded-lg bg-accent-soft border border-accent-dark flex items-center justify-center text-[20px] mb-6">
                <i className="fa-solid fa-robot"></i>
              </div>
              <h3 className="text-[16px] font-bold text-white mb-2">Agentes especializados</h3>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                Use agentes pré-configurados para dev, jurídico ou crie o seu próprio. Cada agente mantém seu próprio contexto, histórico de mensagens e diretrizes operacionais específicas.
              </p>
            </div>

            {/* Memory card */}
            <div className="bg-bg-alt border border-border-card rounded-xl p-8 relative flex-1">
              {/* Blueprint marks */}
              <div className="absolute top-2.5 left-2.5 w-[10px] h-[10px] border-t border-l border-accent/20" />
              <div className="absolute bottom-2.5 right-2.5 w-[10px] h-[10px] border-b border-r border-accent/20" />

              <div className="w-10 h-10 rounded-lg bg-accent-soft border border-accent-dark flex items-center justify-center text-[20px] mb-6">
                <i className="fa-solid fa-brain"></i>
              </div>
              <h3 className="text-[16px] font-bold text-white mb-2">Memória persistente</h3>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                O Alexandria aprende com o uso. Informações-chave, termos preferidos, preferências e regras de negócio são lembradas entre conversas de forma automática e inteligente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
