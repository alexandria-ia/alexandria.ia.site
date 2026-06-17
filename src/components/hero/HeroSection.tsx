'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import OrbitalRings from './OrbitalRings';
import FloatingBadges from './FloatingBadges';
import GlowOrbs from './GlowOrbs';

export default function HeroSection() {
  const sloganText = "CONHECIMENTO, INTELIGÊNCIA, ETERNITY.";
  const [displayedSlogan, setDisplayedSlogan] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedSlogan((prev) => prev + sloganText.charAt(index));
        index++;
        if (index >= sloganText.length) {
          clearInterval(interval);
          setTypingComplete(true);
        }
      }, 55); // 55ms per character
      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(startTimeout);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-28 md:py-36 overflow-hidden">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 bg-[url('/fundo.png')] bg-no-repeat bg-[position:right_center] bg-cover opacity-[0.22] z-0"
        style={{
          maskImage: 'linear-gradient(to right, black 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-bg-deep to-transparent z-0 pointer-events-none" />

      {/* Visual background decorations */}
      <GlowOrbs />
      <OrbitalRings />
      <FloatingBadges />



      {/* Hero Content */}
      <div className="relative max-w-[800px] w-full text-center mx-auto z-20 flex flex-col items-center justify-center">
        {/* Slogan */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center justify-center text-[10px] font-semibold tracking-[0.22em] text-accent uppercase mb-6 px-4 py-1.5 border border-accent-soft rounded-full bg-accent-soft/30 min-h-[30px]"
        >
          <span>{displayedSlogan}</span>
          {!typingComplete && (
            <span className="inline-block w-[1.5px] h-[9px] bg-accent ml-1.5 animate-pulse" />
          )}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-rework text-[clamp(34px,5.5vw,68px)] font-extrabold leading-[1.0] tracking-[0.04em] uppercase mb-6 bg-gradient-to-br from-white via-white to-accent bg-clip-text text-transparent scale-y-[0.82] origin-center text-center"
        >
          Tokens infinitos.<br />
          <span className="shimmer-gold-text">Sem limites.</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-[clamp(14px,1.8vw,18px)] text-text-secondary leading-relaxed max-w-[540px] mb-10 text-center mx-auto"
        >
          Conecte sua aplicação à nossa API e consuma modelos de IA sem se preocupar com custos por token. Plano fixo, uso ilimitado.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.03em] uppercase bg-accent hover:bg-accent-light text-bg-deep px-8 py-3.5 rounded-full shadow-[0_8px_24px_rgba(212,175,90,0.15)] hover:-translate-y-0.5 transition-all duration-200"
          >
            Ver planos
          </a>
          <a
            href="#features"
            className="inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.03em] uppercase bg-white/5 text-text-primary px-8 py-3.5 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200"
          >
            Como funciona
          </a>
        </motion.div>
      </div>
    </section>
  );
}
