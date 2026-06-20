'use client';

import React, { useState } from 'react';

export default function AffiliateSection() {
  const [nickname, setNickname] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const trimmed = nickname.trim();
    if (!trimmed) return;
    const slug = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://alexandria-tech.com.br';
    setGeneratedLink(`${origin}/?ref=${slug}`);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="affiliates" className="relative py-24 px-6 md:px-12 bg-bg-deep border-b border-border-subtle overflow-hidden">
      {/* Laurel leaves with torch (left) */}
      <div 
        className="absolute left-[-2%] top-[5%] w-[25%] h-[90%] max-w-[350px] z-0 pointer-events-none opacity-[0.04] mix-blend-screen select-none bg-[url('/laurel_torch.png')] bg-no-repeat bg-contain bg-left hidden md:block"
      />
      {/* Athena Owl (right) */}
      <div 
        className="absolute right-[-2%] top-[5%] w-[25%] h-[90%] max-w-[350px] z-0 pointer-events-none opacity-[0.04] mix-blend-screen select-none bg-[url('/athena_owl.png')] bg-no-repeat bg-contain bg-right hidden md:block"
      />

      {/* Blueprint corners */}
      <div className="bp-cross bp-cross-tl" />
      <div className="bp-cross bp-cross-tr" />
      <div className="bp-cross bp-cross-bl" />
      <div className="bp-cross bp-cross-br" />

      <div className="max-w-7xl mx-auto relative z-10 text-center flex flex-col items-center">
        <div className="text-accent text-[10px] font-semibold tracking-[0.22em] uppercase mb-4">
          // Afiliados
        </div>
        
        <h2 className="font-rework text-[clamp(26px,3.8vw,44px)] font-extrabold leading-[1.1] tracking-[0.05em] uppercase text-white scale-y-[0.82] origin-center mb-4">
          Indique e ganhe desconto.
        </h2>
        
        <p className="text-[15px] text-text-secondary max-w-[560px] leading-relaxed mb-10">
          Gere seu link de indicação. Cada assinatura vinda dele abate R$ 15 da sua mensalidade.
        </p>

        <div className="max-w-[480px] w-full mt-4 flex flex-col gap-4">
          {/* Input Group */}
          <div className="flex bg-white/4 border border-border-card rounded-full overflow-hidden focus-within:border-accent/50 transition-colors">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Digite seu apelido"
              className="flex-1 bg-transparent border-none py-3 px-5 text-text-primary text-[13px] outline-none placeholder:text-text-muted"
            />
            <button
              onClick={handleGenerate}
              className="text-[11px] font-bold tracking-[0.06em] uppercase bg-accent text-[#0e0e10] border-none px-6 py-3 cursor-pointer hover:opacity-85 transition-opacity"
            >
              Gerar
            </button>
          </div>

          {/* Result Link Box */}
          {generatedLink && (
            <div className="mt-2 animate-fade-in">
              <div className="flex bg-white/4 border border-border-card rounded-full overflow-hidden">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className="flex-1 bg-transparent border-none py-3 px-5 text-accent text-[12px] outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="text-[11px] font-bold tracking-[0.06em] uppercase bg-transparent text-text-secondary border-none border-l border-border-card px-5 py-3 cursor-pointer hover:text-text-primary transition-colors"
                >
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
