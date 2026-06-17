'use client';

import React, { useRef } from 'react';
import { useConfigStore } from '@/stores/config-store';

interface PricingSectionProps {
  onSelectPlan: (planName: string, price: number) => void;
}

// Medallions and Astrolabe Bgs
const EscribasMedallion = () => (
  <svg width="48" height="48" viewBox="0 0 100 100" className="text-accent mb-6 opacity-85 z-10 relative" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="50" cy="50" r="42" strokeDasharray="3 3" className="animate-spin-[120s] linear infinite" />
    <circle cx="50" cy="50" r="36" />
    {/* Quill and inkpot representation */}
    <path d="M36 64 L64 36 M64 36 L59 31 M64 36 L69 41" strokeWidth="2" strokeLinecap="round" />
    <path d="M33 67 C30 70 30 74 33 77 C36 80 40 80 43 77 L33 67 Z" fill="currentColor" opacity="0.3" />
    <path d="M50 70 C58 70 65 62 65 52 C65 42 53 37 53 37" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const ArcontesMedallion = () => (
  <svg width="48" height="48" viewBox="0 0 100 100" className="text-accent mb-6 opacity-85 z-10 relative" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="50" cy="50" r="42" />
    <circle cx="50" cy="50" r="37" strokeDasharray="6 3" className="animate-spin-[90s] linear infinite" />
    {/* Athena Owl / Pillar representation */}
    <path d="M38 72 L62 72 M44 72 L44 32 M56 72 L56 32 M38 32 L62 32 M50 32 L50 72" strokeWidth="2" />
    <path d="M32 26 L68 26 M36 21 L64 21" strokeWidth="1.5" />
    <path d="M22 48 C22 64 32 74 50 74 C68 74 78 64 78 48" strokeWidth="0.8" strokeDasharray="2 2" />
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
    <path d="M100 10 A90 90 0 0 1 190 100" />
    <path d="M190 100 A90 90 0 0 1 100 190" />
    <path d="M100 190 A90 90 0 0 1 10 100" />
    <path d="M10 100 A90 90 0 0 1 100 10" />
  </svg>
);

export default function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const store = useConfigStore();

  const handleOpenCheckout = (plan: string, price: number) => {
    onSelectPlan(plan, price);
  };

  return (
    <section id="pricing" className="relative py-24 px-6 md:px-12 bg-bg-alt border-b border-border-subtle overflow-hidden">
      {/* Blueprint corners */}
      <div className="bp-cross bp-cross-tl" />
      <div className="bp-cross bp-cross-tr" />
      <div className="bp-cross bp-cross-bl" />
      <div className="bp-cross bp-cross-br" />

      {/* Greco-Roman statue tech sketch (Neptune/Atlas style) */}
      <div 
        className="absolute left-0 bottom-0 w-full md:w-[45%] h-[85%] max-w-[500px] z-0 pointer-events-none opacity-[0.05] md:opacity-[0.14] mix-blend-screen select-none bg-[url('/hero_statue.png')] bg-no-repeat bg-contain bg-left bg-bottom"
        style={{
          maskImage: 'linear-gradient(to right, black 25%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black 25%, transparent 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="text-accent text-[10px] font-semibold tracking-[0.22em] uppercase mb-4">
            // Preços
          </div>
          <h2 className="font-rework text-[clamp(26px,3.8vw,44px)] font-extrabold leading-[1.1] tracking-[0.05em] uppercase text-white scale-y-[0.82] origin-center mb-4 text-center">
            Escolha seu plano.
          </h2>
          <p className="text-[15px] text-text-secondary max-w-[560px] leading-relaxed mx-auto text-center">
            Dois planos. Tokens infinitos em ambos. Sem pegadinhas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[960px] mx-auto">
          {/* Starter Plan Card */}
          <PricingCard
            name="Ordem dos Escribas"
            price={store.priceStarter}
            description={store.descStarter}
            features={[
              'Tokens de texto infinitos',
              'Conexão com Segundo Cérebro',
              'Acesso ao Explorer de dados',
              'Suporte via Discord',
            ]}
            btnText="INICIAR JORNADA"
            isFeatured={false}
            medallion={<EscribasMedallion />}
            onSelect={() => handleOpenCheckout('Ordem dos Escribas', store.priceStarter)}
          />

          {/* Pro Plan Card */}
          <PricingCard
            name="Conselho dos Arcontes"
            price={store.pricePro}
            description={store.descPro}
            features={[
              'Tokens multimodais infinitos',
              'Múltiplos Segundos Cérebros',
              'Prioridade máxima de fila',
              'Suporte premium dedicado',
            ]}
            btnText="ACESSAR A ORDEM"
            isFeatured={true}
            medallion={<ArcontesMedallion />}
            onSelect={() => handleOpenCheckout('Conselho dos Arcontes', store.pricePro)}
          />
        </div>
      </div>
    </section>
  );
}

interface PricingCardProps {
  name: string;
  price: number;
  description: string;
  features: string[];
  btnText: string;
  isFeatured: boolean;
  medallion: React.ReactNode;
  onSelect: () => void;
}

function PricingCard({ name, price, description, features, btnText, isFeatured, medallion, onSelect }: PricingCardProps) {
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

  const featuredBg = "bg-[radial-gradient(800px_circle_at_var(--mouse-x,_0px)_var(--mouse-y,_0px),_rgba(212,175,90,0.08)_0%,_transparent_50%),_linear-gradient(135deg,_rgba(212,175,90,0.03)_0%,_rgba(255,255,255,0.01)_100%)]";
  const defaultBg = "bg-[radial-gradient(800px_circle_at_var(--mouse-x,_0px)_var(--mouse-y,_0px),_rgba(255,255,255,0.04)_0%,_transparent_50%),_rgba(255,255,255,0.005)]";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`plan-card flex flex-col justify-between p-9 rounded-[16px] border backdrop-blur-[20px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-300 relative before:content-[''] before:absolute before:-top-[1px] before:-left-[1px] before:w-[12px] before:h-[12px] before:border-t-2 before:border-l-2 hover:before:border-white after:content-[''] after:absolute after:-bottom-[1px] after:-right-[1px] after:w-[12px] after:h-[12px] after:border-b-2 after:border-r-2 hover:after:border-white before:transition-all after:transition-all hover:-translate-y-1 overflow-hidden ${
        isFeatured
          ? `border-accent ${featuredBg} shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_15px_45px_rgba(0,0,0,0.45),_0_0_30px_rgba(212,175,90,0.08)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),_0_20px_50px_rgba(0,0,0,0.5),_0_0_40px_rgba(212,175,90,0.15)] before:border-accent after:border-accent hover:border-accent`
          : `border-[rgba(255,255,255,0.08)] ${defaultBg} before:border-accent/40 after:border-accent/40 hover:border-[rgba(212,175,90,0.25)] hover:shadow-[0_0_25px_rgba(212,175,90,0.03),_inset_0_1px_0_rgba(255,255,255,0.1),_0_15px_40px_rgba(0,0,0,0.35)]`
      }`}
    >
      <AstrolabeBg />

      <div className="relative z-10 flex flex-col items-start w-full">
        {medallion}
        <div className={`text-[12px] font-semibold uppercase tracking-[0.15em] mb-2 ${isFeatured ? 'text-accent font-rework' : 'text-text-secondary'}`}>
          {name}
        </div>
        <div className="text-[40px] font-extrabold text-white tracking-tight mb-2">
          R$ {price} <span className="text-[14px] font-medium text-text-secondary">/mês</span>
        </div>
        <p className="text-[13px] text-text-secondary mb-6 leading-relaxed">
          {description}
        </p>
        <ul className="list-none mb-8 flex flex-col gap-3 w-full">
          {features.map((feat, idx) => (
            <li key={idx} className="text-[13px] text-text-secondary flex items-start gap-2.5 before:content-['✓'] before:text-accent before:font-bold before:flex-shrink-0">
              {feat}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onSelect}
        className={`w-full text-[12px] font-semibold tracking-[0.06em] uppercase py-3.5 rounded-full cursor-pointer hover:-translate-y-0.5 transition-all duration-200 border relative z-10 ${
          isFeatured
            ? 'bg-accent text-[#05070B] border-accent hover:opacity-90 shadow-[0_4px_16px_rgba(212,175,90,0.2)]'
            : 'bg-white/5 text-text-primary border-white/10 hover:border-white/20 hover:bg-white/10'
        }`}
      >
        {btnText}
      </button>
    </div>
  );
}
