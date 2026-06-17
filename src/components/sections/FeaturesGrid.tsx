'use client';

import React, { useRef } from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const featuresList = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: 'Tokens ilimitados',
    desc: 'Consumo ilimitado de requisições sem surpresas no faturamento. Pague um valor fixo mensal.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7 7 0 0 0-7 7c0 3 2 5.5 4 7.5L12 22l3-5.5c2-2 4-4.5 4-7.5a7 7 0 0 0-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
    title: 'Segundo Cérebro',
    desc: 'Conecte bases de conhecimento para dar contexto ao modelo e reduzir alucinações drasticamente.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: 'Zero alucinação',
    desc: 'Respostas fundamentadas no seu contexto de dados. Modo estrito para máxima precisão.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: 'Multimodal',
    desc: 'Texto, imagem e áudio em uma API unificada. Troque de modelo sem alterar seu código.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8V4H8" />
        <rect x="4" y="8" width="16" height="12" rx="2" />
        <path d="M2 14h2M20 14h2M15 13v2M9 13v2" />
      </svg>
    ),
    title: 'Multiagentes',
    desc: 'Orquestre múltiplos agentes autônomos para tarefas complexas em paralelo.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: 'Onboarding via Hermes',
    desc: 'Chaves de API entregues automaticamente pelo bot Hermes no Discord. Setup em minutos.',
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="relative py-24 px-6 md:px-12 bg-bg-deep border-b border-border-subtle overflow-hidden">
      {/* Blueprint corners */}
      <div className="bp-cross bp-cross-tl" />
      <div className="bp-cross bp-cross-tr" />
      <div className="bp-cross bp-cross-bl" />
      <div className="bp-cross bp-cross-br" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-accent text-[10px] font-semibold tracking-[0.22em] uppercase mb-4">
          // Plataforma
        </div>
        
        <h2 className="font-rework text-[clamp(26px,3.8vw,44px)] font-extrabold leading-[1.1] tracking-[0.05em] uppercase text-white scale-y-[0.82] origin-left mb-4">
          Tudo o que você precisa<br />em uma única API.
        </h2>
        
        <p className="text-[15px] text-text-secondary max-w-[560px] leading-relaxed mb-12">
          Integre modelos de linguagem, visão e áudio ao seu produto com chamadas simples. Sem complexidade, sem limites.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map((feat, idx) => (
            <FeatureCard key={idx} {...feat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc }: FeatureCardProps) {
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
    const tiltX = ((yc - y) / yc) * 10;
    const tiltY = ((x - xc) / xc) * 10;

    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass-card flex flex-col items-start p-8 rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[radial-gradient(800px_circle_at_var(--mouse-x,_0px)_var(--mouse-y,_0px),_rgba(255,255,255,0.05)_0%,_transparent_50%),_rgba(255,255,255,0.01)] backdrop-blur-[20px] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),_0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-300 relative before:content-[''] before:absolute before:-top-[1px] before:-left-[1px] before:w-[10px] before:h-[10px] before:border-t-2 before:border-l-2 before:border-accent/40 hover:before:border-accent before:transition-all after:content-[''] after:absolute after:-bottom-[1px] after:-right-[1px] after:w-[10px] after:h-[10px] after:border-b-2 after:border-r-2 after:border-accent/40 hover:after:border-accent after:transition-all hover:border-[rgba(201,165,90,0.3)] hover:bg-[rgba(255,255,255,0.03)] hover:shadow-[0_0_25px_rgba(201,165,90,0.05),_inset_0_1px_0_rgba(255,255,255,0.12),_0_15px_40px_rgba(0,0,0,0.35)]"
    >
      <span className="text-accent mb-4 block">{icon}</span>
      <h3 className="text-[16px] font-bold text-white mb-2">{title}</h3>
      <p className="text-[13px] text-text-secondary leading-relaxed">{desc}</p>
    </div>
  );
}
