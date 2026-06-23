'use client';

import React, { useState, useEffect } from 'react';

export default function VagasStrip() {
  const [vagas, setVagas] = useState(7);

  useEffect(() => {
    const interval = setInterval(() => {
      setVagas((prev) => (prev > 3 && Math.random() > 0.85 ? prev - 1 : prev));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-[560px] mx-auto my-8 px-6 py-4 bg-bg-alt border border-border-card rounded-lg flex items-center justify-between gap-4 z-10 relative">
      <div className="flex items-center gap-3">
        {/* Pulsing indicator */}
        <div className="w-[10px] h-[10px] rounded-full bg-[#5dcaa5] animate-[pulse-status_1.5s_infinite_linear]" />
        <span className="text-[13px] text-text-secondary">
          <strong className="text-text-primary">{vagas}</strong> de 50 vagas restantes
        </span>
      </div>
      <div className="text-[22px] font-extrabold text-accent-light tracking-tight">
        R$ 29,90<span className="text-[13px] font-normal text-text-secondary">/mês</span>
      </div>
    </div>
  );
}
