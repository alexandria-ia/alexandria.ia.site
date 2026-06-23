'use client';

import React from 'react';

const exampleMemories = [
  {
    icon: 'fa-solid fa-briefcase',
    colorClass: 'text-accent bg-accent-soft border-accent-dark/30',
    label: 'Profissão',
    text: 'Engenheiro civil. Trabalha com cálculo estrutural, laudos e projetos públicos.',
    time: 'Aprendido há 3 dias · 12 menções',
  },
  {
    icon: 'fa-solid fa-code',
    colorClass: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    label: 'Projeto em andamento',
    text: 'Desenvolvendo SaaS de IA com Docker, agentes e gateway de modelos locais.',
    time: 'Aprendido há 1 semana · 47 menções',
  },
  {
    icon: 'fa-solid fa-chart-line',
    colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    label: 'Interesses',
    text: 'Tecnologia, produtividade e automação. Acompanha tendências de mercado.',
    time: 'Aprendido há 5 dias · 8 menções',
  },
  {
    icon: 'fa-solid fa-message',
    colorClass: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    label: 'Estilo de comunicação',
    text: 'Prefere respostas diretas e técnicas. Gosta de exemplos práticos e código.',
    time: 'Aprendido há 2 dias · 31 menções',
  },
];

export default function MemorySection() {
  return (
    <section id="memoria" className="py-20 px-6 md:px-12 bg-bg-alt border-b border-border-subtle overflow-hidden relative z-10">
      {/* Blueprint corners */}
      <div className="bp-cross bp-cross-tl" />
      <div className="bp-cross bp-cross-tr" />
      <div className="bp-cross bp-cross-bl" />
      <div className="bp-cross bp-cross-br" />

      <div className="max-w-[1040px] mx-auto">
        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-14">
          <div>
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-soft border border-accent-dark/30 rounded-full text-[10px] font-mono text-accent tracking-wider uppercase mb-5">
              <i className="fa-solid fa-brain text-[11px]" />
              Memória ativa · Hermes + Obsidian
            </div>

            <div className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
              <span className="w-6 h-[1px] bg-accent-dark" />
              Memória persistente
            </div>

            <h2 className="font-rework text-[clamp(26px,3.8vw,44px)] font-normal leading-[1.1] tracking-[0.05em] uppercase text-white scale-y-[0.85] origin-left mb-4">
              Quanto mais você usa,<br />
              <span className="text-accent">mais ele te conhece.</span>
            </h2>

            <p className="text-[14px] text-text-secondary leading-relaxed mb-4">
              A cada conversa, nosso sistema extrai silenciosamente o que importa — suas preferências, área de trabalho, estilo de comunicação, projetos em andamento — e constrói um perfil de contexto que torna cada resposta mais precisa.
            </p>

            <p className="text-[14px] text-text-secondary leading-relaxed mb-6">
              Não é só histórico. É <strong className="text-white">memória real</strong>. O assistente lembra quem você é e o que você faz — sem você precisar repetir a cada sessão.
            </p>

            <div className="flex items-center gap-2.5 p-3.5 bg-bg-deep border border-border-subtle rounded-lg max-w-sm">
              <span className="text-[10px] font-mono text-text-muted uppercase">Tecnologia:</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-accent-soft text-accent border border-accent/20">
                Hermes Agent
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-accent-light border border-border-subtle">
                Obsidian Vault
              </span>
            </div>
          </div>

          {/* Visual memory preview card */}
          <div className="bg-bg-deep border border-border-card rounded-xl p-6 relative shadow-2xl">
            <div className="absolute top-2.5 left-2.5 w-[10px] h-[10px] border-t border-l border-accent/20" />
            <div className="absolute bottom-2.5 right-2.5 w-[10px] h-[10px] border-b border-r border-accent/20" />

            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border-subtle">
              <div className="w-1.5 h-1.5 rounded-full bg-[#5dcaa5] animate-pulse" />
              <span className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">
                Memórias ativas — exemplo
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {exampleMemories.map((mem, idx) => (
                <div key={idx} className="flex gap-3.5 p-3 bg-bg-alt border border-border-subtle rounded-lg items-start">
                  <div className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center flex-shrink-0 border ${mem.colorClass}`}>
                    <i className={`${mem.icon} text-[13px]`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wide">
                      {mem.label}
                    </div>
                    <div className="text-[12px] text-text-primary mt-0.5 leading-normal">
                      {mem.text}
                    </div>
                    <div className="text-[9px] text-text-muted mt-1.5">
                      {mem.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Workflow steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="bg-bg-deep border border-border-card rounded-xl p-5 relative flex flex-col justify-between">
            <div className="absolute top-2.5 left-2.5 w-[10px] h-[10px] border-t border-l border-accent/25" />
            <div>
              <div className="text-[9px] font-mono text-accent font-bold tracking-widest uppercase mb-3">
                01 · Conversa
              </div>
              <div className="text-[20px] mb-3"><i className="fa-solid fa-comment-dots"></i></div>
              <h4 className="text-[13px] font-bold text-white mb-1.5">Você conversa normalmente</h4>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Não precisa fazer nada diferente. Use o chat como sempre — agentes, uploads, perguntas do dia a dia.
              </p>
            </div>
          </div>

          <div className="bg-bg-deep border border-border-card rounded-xl p-5 relative flex flex-col justify-between">
            <div className="absolute top-2.5 left-2.5 w-[10px] h-[10px] border-t border-l border-accent/25" />
            <div>
              <div className="text-[9px] font-mono text-accent font-bold tracking-widest uppercase mb-3">
                02 · Hermes analisa
              </div>
              <div className="text-[20px] mb-3"><i className="fa-solid fa-brain"></i></div>
              <h4 className="text-[13px] font-bold text-white mb-1.5">Hermes lê e extrai contexto</h4>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Em segundo plano, o agente Hermes lê cada conversa e extrai o que é relevante: profissão, projetos, preferências e estilo.
              </p>
            </div>
          </div>

          <div className="bg-bg-deep border border-border-card rounded-xl p-5 relative flex flex-col justify-between">
            <div className="absolute top-2.5 left-2.5 w-[10px] h-[10px] border-t border-l border-accent/25" />
            <div>
              <div className="text-[9px] font-mono text-accent font-bold tracking-widest uppercase mb-3">
                03 · Obsidian salva
              </div>
              <div className="text-[20px] mb-3"><i className="fa-solid fa-book"></i></div>
              <h4 className="text-[13px] font-bold text-white mb-1.5">Memórias salvas e injetadas</h4>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                As memórias são salvas no Obsidian Vault. A cada nova conversa, esse contexto é injetado automaticamente no modelo.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Summary Banner */}
        <div className="mt-6 bg-accent-soft border border-accent/15 rounded-xl p-5 flex items-start sm:items-center gap-4 relative">
          <div className="absolute top-2.5 left-2.5 w-[8px] h-[8px] border-t border-l border-accent/30" />
          
          <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center text-accent flex-shrink-0">
            <i className="fa-solid fa-lock text-[16px]" />
          </div>
          <div className="text-[13px] text-text-secondary leading-relaxed">
            <strong className="text-white">Suas memórias são suas.</strong> Todo o processo acontece localmente. Nenhuma memória é compartilhada entre contas ou enviada para terceiros. Em breve você poderá visualizar e apagar memórias individualmente no seu painel.
          </div>
        </div>
      </div>
    </section>
  );
}
