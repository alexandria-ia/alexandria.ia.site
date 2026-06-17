'use client';

import React, { useEffect, useState } from 'react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('lgpd_accepted');
    if (accepted !== 'true') {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('lgpd_accepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 max-w-[420px] z-[200] bg-[#0e0e10]/95 backdrop-blur-[16px] border border-border-card rounded-[16px] p-6 flex flex-col gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <p className="text-[12px] text-text-secondary leading-relaxed">
        Utilizamos cookies técnicos locais para melhorar sua experiência. Nenhum dado sensível é coletado.
      </p>
      <button
        onClick={handleAccept}
        className="self-start text-[11px] font-bold tracking-[0.06em] uppercase bg-accent text-[#0e0e10] border-none py-2.5 px-5 rounded-full cursor-pointer hover:opacity-85 transition-opacity"
      >
        Aceitar
      </button>
    </div>
  );
}
