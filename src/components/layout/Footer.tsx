'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes('#')) {
      const parts = href.split('#');
      const targetId = parts[parts.length - 1];
      if (pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <footer className="border-t border-border-subtle bg-bg-deep pt-20 pb-12 px-6 md:px-12 relative z-10 overflow-hidden">
      {/* Subtle bottom grid borders */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-6 mb-16 text-left">
        {/* Brand Column */}
        <div className="md:col-span-2 flex flex-col items-start gap-4">
          <Link
            href="/"
            className="font-rework font-extrabold text-[15px] tracking-[0.1em] text-accent hover:opacity-80 transition-opacity uppercase scale-y-[0.85] origin-left before:content-['['] before:mr-1 before:text-text-muted after:content-[']'] after:ml-1 after:text-text-muted"
          >
            alexandria-tech
          </Link>
          <p className="text-[13px] text-text-secondary leading-relaxed max-w-[320px]">
            Knowledge. Intelligence. Eternity. A API de inteligência artificial de consumo infinito para a eternidade da Web.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]" />
            <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">TODOS OS SISTEMAS ONLINE</span>
          </div>
        </div>

        {/* Column 1: Plataforma */}
        <div className="flex flex-col gap-3">
          <div className="text-[11px] font-semibold tracking-[0.15em] text-white uppercase mb-1">
            Plataforma
          </div>
          <Link 
            href="/#features" 
            onClick={(e) => handleScroll(e, '/#features')}
            className="text-[12px] text-text-secondary hover:text-accent transition-colors"
          >
            Recursos
          </Link>
          <Link 
            href="/#pricing" 
            onClick={(e) => handleScroll(e, '/#pricing')}
            className="text-[12px] text-text-secondary hover:text-accent transition-colors"
          >
            Planos
          </Link>
          <Link href="/database" className="text-[12px] text-text-secondary hover:text-accent transition-colors">
            Base de dados
          </Link>
        </div>

        {/* Column 2: Membros & Comunidade */}
        <div className="flex flex-col gap-3">
          <div className="text-[11px] font-semibold tracking-[0.15em] text-white uppercase mb-1">
            Portal
          </div>
          <Link href="/members" className="text-[12px] text-text-secondary hover:text-accent transition-colors">
            Área de Membros
          </Link>
          <a href="https://discord.gg/JhrhX2zEta" target="_blank" rel="noopener noreferrer" className="text-[12px] text-text-secondary hover:text-accent transition-colors">
            Servidor Discord
          </a>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-[10px] text-text-muted tracking-[0.15em] uppercase font-mono">
          SYS_ACTIVE · ALEXANDRIA INC · MMXXVI
        </div>

        {/* Minimalist Torch and Owl Icons */}
        <div className="flex items-center gap-6 text-text-muted">
          {/* Torch Icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="hover:text-accent transition-colors cursor-help">
            <title>Tocha da Biblioteca de Alexandria</title>
            <path d="M12 2c1.5 3 2.5 4 2.5 6.5s-1.5 3.5-2.5 3.5-2.5-1-2.5-3.5S10.5 5 12 2z" fill="currentColor" fillOpacity="0.1" />
            <path d="M9 12h6M10 12l-1 9h4l-1-9M12 12v9" />
          </svg>
          {/* Owl Icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="hover:text-accent transition-colors cursor-help">
            <title>Coruja de Atena</title>
            <circle cx="9" cy="9" r="3" />
            <circle cx="15" cy="9" r="3" />
            <path d="M12 11l-1 2h2l-1-2z" />
            <path d="M12 4c-4 0-6 3-6 7 0 5 2 9 6 9s6-4 6-9c0-4-2-7-6-7z" />
            <path d="M6 14c2-1 3.5-1 6-1s4 0 6 1" />
          </svg>
        </div>
      </div>
    </footer>
  );
}
