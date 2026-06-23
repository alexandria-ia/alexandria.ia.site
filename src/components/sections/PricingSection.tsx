'use client';

import React, { useRef } from 'react';
import { useConfigStore } from '@/stores/config-store';

interface PricingSectionProps {
  onSelectPlan: (planName: string, price: number) => void;
}

const EscribasMedallion = () => (
  <svg width="48" height="48" viewBox="0 0 100 100" className="text-accent mb-5 opacity-85 z-10 relative" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="50" cy="50" r="42" strokeDasharray="3 3" className="animate-[spin-clockwise_120s_linear_infinite]" />
    <circle cx="50" cy="50" r="36" />
    <path d="M36 64 L64 36 M64 36 L59 31 M64 36 L69 41" strokeWidth="2" strokeLinecap="round" />
    <path d="M33 67 C30 70 30 74 33 77 C36 80 40 80 43 77 L33 67 Z" fill="currentColor" opacity="0.3" />
    <path d="M50 70 C58 70 65 62 65 52 C65 42 53 37 53 37" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const AstrolabeBg = () => (
  <svg viewBox="0 0 200 200" className="absolute -right-20 -top-20 w-80 h-80 text-accent/5 pointer-events-none select-none z-0" fill="none" stroke="currentColor" strokeWidth="0.5">
    <circle cx="100" cy="100" r="90" />
    <circle cx="100" cy="100" r="76" strokeDasharray="4 2" />
    <circle cx="100" cy="100" r="62" />
    <circle cx="100" cy="100" r="48" strokeDasharray="2 2" />
    <circle cx="100" cy="100" r="34" />
    <circle cx="100" cy="100" r="20" />
    <line x1="8" y1="100" x2="192" y2="100" />
    <line x1="100" y1="8" x2="100" y2="192" />
    <line x1="35.36" y1="35.36" x2="164.64" y2="164.64" />
    <line x1="35.36" y1="164.64" x2="164.64" y2="35.36" />
  </svg>
);

export default function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const store = useConfigStore();

  const handleOpenCheckout = () => {
    onSelectPlan('Chat Pro', store.priceStarter);
  };

  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const tiltX = ((yc - y) / yc) * 6;
    const tiltY = ((x - xc) / xc) * 6;

    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  return (
    <section id="pricing" className="relative py-20 px-6 md:px-12 bg-bg-deep border-b border-border-subtle overflow-hidden z-10">
      {/* Blueprint corners */}
      <div className="bp-cross bp-cross-tl" />
      <div className="bp-cross bp-cross-tr" />
      <div className="bp-cross bp-cross-bl" />
      <div className="bp-cross bp-cross-br" />

      <div className="max-w-[1040px] mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase mb-3 flex items-center justify-center gap-2">
            <span className="w-6 h-[1px] bg-accent-dark" />
            Planos
          </div>
          <h2 className="font-rework text-[clamp(26px,3.8vw,44px)] font-normal leading-[1.1] tracking-[0.05em] uppercase text-white scale-y-[0.85] origin-center mb-3">
            Garante a sua vaga.
          </h2>
          <p className="text-[14px] text-text-secondary max-w-[500px] leading-relaxed mx-auto">
            Acesso ilimitado à plataforma sem cobrança de tokens. Vagas extremamente limitadas.
          </p>
        </div>

        {/* Single Centered Plan Card */}
        <div className="max-w-[420px] mx-auto">
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="bg-[radial-gradient(800px_circle_at_var(--mouse-x,_0px)_var(--mouse-y,_0px),_rgba(212,175,90,0.08)_0%,_transparent_50%),_linear-gradient(135deg,_rgba(212,175,90,0.03)_0%,_rgba(255,255,255,0.01)_100%)] border-accent border flex flex-col justify-between p-9 rounded-[16px] backdrop-blur-[20px] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_15px_45px_rgba(0,0,0,0.45),_0_0_30px_rgba(212,175,90,0.08)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),_0_20px_50px_rgba(0,0,0,0.5),_0_0_40px_rgba(212,175,90,0.15)] transition-all duration-300 relative before:content-[''] before:absolute before:-top-[1px] before:-left-[1px] before:w-[12px] before:h-[12px] before:border-t-2 before:border-l-2 before:border-accent after:content-[''] after:absolute after:-bottom-[1px] after:-right-[1px] after:w-[12px] after:h-[12px] after:border-b-2 after:border-r-2 after:border-accent hover:border-accent overflow-hidden"
          >
            <AstrolabeBg />

            <div className="relative z-10 flex flex-col items-start w-full">
              <EscribasMedallion />
              <div className="text-[12px] font-mono font-bold uppercase tracking-[0.15em] text-accent mb-2">
                Chat Pro
              </div>
              <div className="text-[40px] font-extrabold text-white tracking-tight mb-2">
                R$ 29,90 <span className="text-[14px] font-medium text-text-secondary">/mês</span>
              </div>
              <p className="text-[13px] text-text-secondary mb-6 leading-relaxed">
                Acesso completo ao console do Alexandria, sem limite de mensagens. Roteamento inteligente local.
              </p>
              
              <ul className="list-none mb-8 flex flex-col gap-3 w-full border-t border-border-subtle pt-6">
                <li className="text-[13px] text-text-secondary flex items-start gap-2.5 before:content-['✓'] before:text-accent before:font-bold before:flex-shrink-0">
                  Tokens de texto ilimitados
                </li>
                <li className="text-[13px] text-text-secondary flex items-start gap-2.5 before:content-['✓'] before:text-accent before:font-bold before:flex-shrink-0">
                  Conexão com Segundo Cérebro (Obsidian)
                </li>
                <li className="text-[13px] text-text-secondary flex items-start gap-2.5 before:content-['✓'] before:text-accent before:font-bold before:flex-shrink-0">
                  Análise de imagens e prints (OCR)
                </li>
                <li className="text-[13px] text-text-secondary flex items-start gap-2.5 before:content-['✓'] before:text-accent before:font-bold before:flex-shrink-0">
                  Agentes especializados personalizados
                </li>
                <li className="text-[13px] text-text-secondary flex items-start gap-2.5 before:content-['✓'] before:text-accent before:font-bold before:flex-shrink-0">
                  Memória ativa Hermes
                </li>
              </ul>
            </div>

            <button
              onClick={handleOpenCheckout}
              className="w-full text-[11px] font-bold tracking-[0.05em] uppercase py-3.5 rounded-full cursor-pointer bg-accent hover:opacity-90 text-bg-deep shadow-[0_4px_16px_rgba(212,175,90,0.2)] transition-all duration-200 border border-accent relative z-10"
            >
              Garantir minha vaga →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
