'use client';

import React, { useState, useEffect } from 'react';

const swarmDef = [
  { name: 'Llama 3.1 70B', color: '#D4AF5A', channels: 3 },
  { name: 'Qwen2.5 32B', color: '#E7C879', channels: 3 },
  { name: 'Mistral 7B', color: '#8C6A2A', channels: 4 },
  { name: 'Qwen2.5-Coder', color: '#ffffff', channels: 3 },
];

export default function SwarmMonitor() {
  const [states, setStates] = useState<boolean[][]>([
    [false, true, true],
    [false, false, true],
    [true, false, false, true],
    [false, true, false],
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStates((prev) =>
        prev.map((chs) =>
          chs.map((busy) => (Math.random() < 0.22 ? !busy : busy))
        )
      );
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const totalUse = states.reduce(
    (acc, chs) => acc + chs.filter((busy) => busy).length,
    0
  );

  const hexToRgb = (hex: string) => {
    if (hex.startsWith('rgba')) return '212,175,90';
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  };

  return (
    <section id="swarm" className="py-16 px-6 border-y border-border-subtle bg-bg-alt relative z-10">
      <div className="max-w-[1000px] mx-auto">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase mb-3 flex items-center justify-center gap-2">
            <span className="w-6 h-[1px] bg-accent-dark" />
            Como funciona
          </div>
          <h2 className="font-rework text-[clamp(20px,2.8vw,32px)] font-normal text-white uppercase tracking-[0.05em] transform scale-y-[0.85] origin-center leading-tight mb-3">
            Um produto único.<br />
            <span className="text-accent">Vários cérebros por baixo.</span>
          </h2>
          <p className="text-[14px] text-text-secondary max-w-[540px] mx-auto leading-relaxed">
            Cada modelo roda múltiplos canais paralelos. O roteador distribui automaticamente cada conversa para o canal mais livre — você nunca espera.
          </p>
        </div>

        {/* Live Monitor Panel */}
        <div className="bg-bg-deep border border-border-card rounded-xl overflow-hidden mb-8 shadow-2xl relative">
          <div className="absolute top-2.5 left-2.5 w-[10px] h-[10px] border-t border-l border-accent/20" />
          <div className="absolute bottom-2.5 right-2.5 w-[10px] h-[10px] border-b border-r border-accent/20" />

          {/* Header */}
          <div className="px-5 py-3 border-b border-border-subtle flex items-center justify-between bg-bg-alt">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#e24b4a]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ef9f27]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#1d9e75]" />
              </div>
              <span className="text-[10px] font-mono tracking-wider text-text-secondary uppercase">
                alexandria-swarm · monitor ao vivo
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#5dcaa5] animate-pulse" />
              <span className="text-[10px] text-[#5dcaa5] font-bold">
                {totalUse} canais em uso agora
              </span>
            </div>
          </div>

          {/* Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border-subtle bg-bg-deep">
            {swarmDef.map((model, mi) => {
              const chs = states[mi];
              const inUse = chs.filter((c) => c).length;
              return (
                <div key={mi} className="p-6">
                  {/* Model Header */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: model.color }}
                      />
                      <span className="text-[13px] font-bold text-white">
                        {model.name}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-border-subtle text-text-secondary">
                      {inUse}/{chs.length} em uso
                    </span>
                  </div>

                  {/* Channels List */}
                  <div className="flex flex-col gap-2">
                    {chs.map((busy, ci) => {
                      const rgb = hexToRgb(model.color);
                      return (
                        <div
                          key={ci}
                          className="flex items-center justify-between gap-4 px-3 py-2 border rounded-lg transition-all duration-300"
                          style={{
                            backgroundColor: busy ? `rgba(${rgb}, 0.08)` : 'transparent',
                            borderColor: busy ? `rgba(${rgb}, 0.25)` : 'rgba(255, 255, 255, 0.05)',
                          }}
                        >
                          <span className="text-[9px] font-mono text-text-muted">
                            Canal {ci + 1}
                          </span>
                          <div className="flex items-center gap-2 flex-1">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${busy ? 'animate-pulse' : ''}`}
                              style={{ backgroundColor: busy ? model.color : 'rgba(255,255,255,0.1)' }}
                            />
                            <span className={`text-[11px] ${busy ? 'text-text-primary' : 'text-text-secondary'}`}>
                              {busy ? 'Atendendo' : 'Aguardando'}
                            </span>
                          </div>
                          {busy ? (
                            <span
                              className="text-[9px] font-bold px-2 py-0.5 rounded-full border"
                              style={{
                                backgroundColor: `rgba(${rgb}, 0.15)`,
                                color: model.color,
                                borderColor: `rgba(${rgb}, 0.3)`,
                              }}
                            >
                              em uso
                            </span>
                          ) : (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-text-muted border border-border-subtle">
                              livre
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3 cards de benefícios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-bg-deep border border-border-card rounded-xl p-5 relative">
            <div className="absolute top-2.5 left-2.5 w-[8px] h-[8px] border-t border-l border-accent/20" />
            <div className="w-9 h-9 rounded-lg bg-accent-soft flex items-center justify-center text-[18px] mb-3">
              <i className="fa-solid fa-bolt"></i>
            </div>
            <h4 className="text-[13px] font-bold text-white mb-1.5">Sempre o mais rápido</h4>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              Canal ocupado? O roteador passa para outro canal livre em milissegundos. Sem fila, sem espera.
            </p>
          </div>

          <div className="bg-bg-deep border border-border-card rounded-xl p-5 relative">
            <div className="absolute top-2.5 left-2.5 w-[8px] h-[8px] border-t border-l border-accent/20" />
            <div className="w-9 h-9 rounded-lg bg-accent-soft flex items-center justify-center text-[18px] mb-3">
              <i className="fa-solid fa-house"></i>
            </div>
            <h4 className="text-[13px] font-bold text-white mb-1.5">100% local</h4>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              Todos os modelos rodam no nosso hardware. Nenhuma requisição vai para a OpenAI ou qualquer outra nuvem.
            </p>
          </div>

          <div className="bg-bg-deep border border-border-card rounded-xl p-5 relative">
            <div className="absolute top-2.5 left-2.5 w-[8px] h-[8px] border-t border-l border-accent/20" />
            <div className="w-9 h-9 rounded-lg bg-accent-soft flex items-center justify-center text-[18px] mb-3">
              <i className="fa-solid fa-bullseye"></i>
            </div>
            <h4 className="text-[13px] font-bold text-white mb-1.5">Transparente</h4>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              No chat você sempre vê qual modelo e canal está atendendo você. Sem caixas pretas misteriosas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
