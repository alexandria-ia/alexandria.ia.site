'use client';

import React, { useRef } from 'react';

interface BadgeProps {
  icon: string;
  title: string;
  meta: string;
  animationClass: string;
  delay: string;
  positionClass: string;
}

const badges: BadgeProps[] = [
  {
    icon: 'codex-color.png',
    title: 'OpenAI GPT',
    meta: 'LATENCY 14ms',
    animationClass: 'animate-float-slow',
    delay: '0s',
    positionClass: 'badge-openai absolute top-[18%] left-[8%] md:top-[18%] md:left-[8%]',
  },
  {
    icon: 'icons8-3d-claude-ai-logo-100.png',
    title: 'Claude Sonnet 4.6',
    meta: 'THINKING ACTIVE',
    animationClass: 'animate-float-medium',
    delay: '1s',
    positionClass: 'badge-claude absolute top-[26%] right-[10%] md:top-[26%] md:right-[10%]',
  },
  {
    icon: 'icons8-blue-sparkling-ai-stars-100.png',
    title: 'Gemini 1.5',
    meta: 'RELIABLE',
    animationClass: 'animate-float-fast',
    delay: '0.5s',
    positionClass: 'badge-gemini absolute hidden md:inline-flex top-[60%] left-[5%]',
  },
  {
    icon: 'icons8-deepseek-100.png',
    title: 'DeepSeek V3',
    meta: 'ACTIVE',
    animationClass: 'animate-float-slow',
    delay: '2s',
    positionClass: 'badge-deepseek absolute hidden md:inline-flex top-[66%] right-[12%]',
  },
  {
    icon: 'icons8-3d-perplexity-ai-logo-100.png',
    title: 'Perplexity',
    meta: 'ONLINE',
    animationClass: 'animate-float-medium',
    delay: '1.5s',
    positionClass: 'badge-gravity absolute top-[14%] right-[28%]',
  },
  {
    icon: 'icons8-3d-grey-grok-ai-logo-100.png',
    title: 'Grok AI',
    meta: 'SYSTEM OK',
    animationClass: 'animate-float-fast',
    delay: '3s',
    positionClass: 'badge-antigravity absolute hidden md:inline-flex top-[78%] left-[32%]',
  },
];

export default function FloatingBadges() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden hidden lg:block">
      {badges.map((badge, idx) => (
        <BadgeCard key={idx} {...badge} />
      ))}
    </div>
  );
}

function BadgeCard({ icon, title, meta, animationClass, delay, positionClass }: BadgeProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const tiltX = ((yc - y) / yc) * 12;
    const tiltY = ((x - xc) / xc) * 12;

    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.04) translateY(-1px)`;
    card.style.borderColor = 'var(--color-accent)';
    card.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.12), 0 0 20px var(--color-accent-soft), 0 10px 30px rgba(0,0,0,0.35)';
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateY(0px)';
    card.style.borderColor = '';
    card.style.boxShadow = '';
  };

  return (
    <div
      className={`${positionClass} pointer-events-auto select-none`}
      style={{
        animationDelay: delay,
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`flex items-center gap-2.5 px-4 py-2 bg-[rgba(14,14,16,0.4)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)] rounded-[6px] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),_0_8px_32px_rgba(0,0,0,0.3)] text-text-primary text-[11px] font-semibold cursor-default relative transition-all duration-300 before:content-[''] before:absolute before:-top-[1px] before:-left-[1px] before:w-[6px] before:h-[6px] before:border-t-2 before:border-l-2 before:border-accent after:content-[''] after:absolute after:-bottom-[1px] after:-right-[1px] after:w-[6px] after:h-[6px] after:border-b-2 after:border-r-2 after:border-accent ${animationClass}`}
        style={{
          animationDelay: delay,
        }}
      >
        <img
          className="flex-shrink-0 object-contain w-[18px] h-[18px]"
          src={`/icons/${icon}`}
          width={18}
          height={18}
          alt={title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23c9a55a" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';
          }}
        />
        <div className="flex flex-col items-start leading-tight">
          <span>{title}</span>
          <span className="font-mono text-[8px] text-text-muted mt-0.5 tracking-wider">{meta}</span>
        </div>
        <span className="w-1.25 h-1.25 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e] flex-shrink-0 animate-[pulse-status_2s_infinite] ml-1.5" />
      </div>
    </div>
  );
}
