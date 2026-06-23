'use client';

import React, { useEffect, useState } from 'react';
import { useConfigStore } from '@/stores/config-store';

export default function StatsBar() {
  const store = useConfigStore();
  
  const [tokens, setTokens] = useState(0);
  const [subs, setSubs] = useState(0);
  const [live, setLive] = useState(0);
  
  const [pulseTokens, setPulseTokens] = useState(false);
  const [pulseSubs, setPulseSubs] = useState(false);
  const [pulseLive, setPulseLive] = useState(false);

  const fmt = (n: number) => n.toLocaleString('pt-BR');

  useEffect(() => {
    const duration = 2000;
    const startTime = performance.now();
    
    const startTokens = store.counterTokens;
    const startSubs = store.counterSubs;
    const startLive = store.counterLive;

    let frameId: number;

    const runCountUp = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      
      setTokens(Math.floor(ease * startTokens));
      setSubs(Math.floor(ease * startSubs));
      setLive(Math.floor(ease * startLive));

      if (progress < 1) {
        frameId = requestAnimationFrame(runCountUp);
      } else {
        setTokens(startTokens);
        setSubs(startSubs);
        setLive(startLive);
      }
    };

    frameId = requestAnimationFrame(runCountUp);

    return () => cancelAnimationFrame(frameId);
  }, [store.counterTokens, store.counterSubs, store.counterLive]);

  useEffect(() => {
    const tokenInterval = setInterval(() => {
      const inc = Math.floor(Math.random() * 400 + 100);
      setTokens((prev) => prev + inc);
      setPulseTokens(true);
      setTimeout(() => setPulseTokens(false), 500);
    }, 1500);

    const subsInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        setSubs((prev) => prev + 1);
        setPulseSubs(true);
        setTimeout(() => setPulseSubs(false), 500);
      }
    }, 8000);

    const liveInterval = setInterval(() => {
      const change = Math.floor((Math.random() - 0.5) * 6);
      setLive((prev) => Math.max(10, prev + change));
      setPulseLive(true);
      setTimeout(() => setPulseLive(false), 500);
    }, 4000);

    return () => {
      clearInterval(tokenInterval);
      clearInterval(subsInterval);
      clearInterval(liveInterval);
    };
  }, []);

  return (
    <div className="stats border-t border-b border-border-subtle bg-bg-deep/50 py-12 px-6 md:px-12 relative z-10">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Swarm */}
        <div className="text-center">
          <div className="text-[clamp(24px,4vw,32px)] font-rework font-normal text-accent tracking-widest uppercase transform scale-y-[0.85] origin-center">
            Swarm
          </div>
          <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-text-secondary mt-2 max-w-[150px] mx-auto leading-normal">
            Roteamento automático entre modelos
          </div>
        </div>

        {/* Agentes */}
        <div className="text-center">
          <div className="text-[clamp(24px,4vw,32px)] font-rework font-normal text-accent tracking-widest uppercase transform scale-y-[0.85] origin-center">
            12
          </div>
          <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-text-secondary mt-2 max-w-[150px] mx-auto leading-normal">
            Agentes especializados
          </div>
        </div>

        {/* Latência */}
        <div className="text-center">
          <div className="text-[clamp(24px,4vw,32px)] font-rework font-normal text-accent tracking-widest uppercase transform scale-y-[0.85] origin-center">
            &lt;1s
          </div>
          <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-text-secondary mt-2 max-w-[150px] mx-auto leading-normal">
            Latência média de resposta
          </div>
        </div>

        {/* Dados */}
        <div className="text-center">
          <div className="text-[clamp(24px,4vw,32px)] font-rework font-normal text-accent tracking-widest uppercase transform scale-y-[0.85] origin-center">
            100%
          </div>
          <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-text-secondary mt-2 max-w-[150px] mx-auto leading-normal">
            Dados no nosso servidor
          </div>
        </div>
      </div>
    </div>
  );
}
