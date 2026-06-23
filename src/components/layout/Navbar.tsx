'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Início', href: '/' },
    { name: 'Agentes', href: '/agents' },
    { name: 'Base de Dados', href: '/database' },
    { name: 'Swarm', href: '/#swarm' },
    { name: 'Memória', href: '/#memoria' },
    { name: 'Privacidade', href: '/#privacidade' },
    { name: 'API', href: '/#api-sec' },
  ];

  const isActive = (href: string) => {
    if (href.includes('#')) return false;
    return pathname === href;
  };

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
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-bg-deep/85 backdrop-blur-[16px] border-b border-border-subtle h-16 flex items-center px-6 md:px-12">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="font-rework font-extrabold text-[15px] tracking-[0.1em] text-accent hover:opacity-80 transition-opacity uppercase scale-y-[0.85] origin-center before:content-['['] before:mr-1 before:text-text-muted after:content-[']'] after:ml-1 after:text-text-muted"
        >
          alexandria-tech
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className={`text-[12px] font-medium tracking-[0.04em] uppercase transition-colors relative py-1.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-accent after:scale-x-0 after:origin-right hover:after:scale-x-100 hover:after:origin-left after:transition-transform after:duration-300 ${
                  isActive(link.href) ? 'text-accent font-semibold after:scale-x-100' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/admin"
            className="text-[11px] font-bold tracking-[0.05em] uppercase border border-border-card bg-transparent hover:bg-white/5 text-text-secondary hover:text-text-primary px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <i className="fa-solid fa-gear text-[12px]" /> Admin
          </Link>
          <Link
            href="/chat"
            className="text-[11px] font-bold tracking-[0.05em] uppercase border border-border-card bg-transparent hover:bg-white/5 text-text-secondary hover:text-text-primary px-4 py-2 rounded-lg transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/#pricing"
            onClick={(e) => handleScroll(e, '/#pricing')}
            className="text-[11px] font-bold tracking-[0.05em] uppercase bg-accent hover:opacity-90 text-bg-deep px-5 py-2 rounded-lg transition-colors"
          >
            Assinar
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1 text-text-secondary hover:text-text-primary focus:outline-none"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Links Panel */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-bg-deep/95 backdrop-blur-[24px] border-b border-border-subtle py-6 px-8 flex flex-col gap-5 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className={`text-[13px] font-medium tracking-[0.04em] uppercase py-1 ${
                isActive(link.href) ? 'text-accent font-semibold' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-[1px] bg-border-subtle my-2" />
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[13px] font-semibold tracking-[0.04em] uppercase text-text-secondary hover:text-text-primary flex items-center gap-1.5"
          >
            <i className="fa-solid fa-gear text-[14px]" /> Admin
          </Link>
          <Link
            href="/chat"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[13px] font-semibold tracking-[0.04em] uppercase text-text-secondary hover:text-text-primary"
          >
            Entrar
          </Link>
          <Link
            href="/#pricing"
            onClick={(e) => handleScroll(e, '/#pricing')}
            className="text-[13px] font-semibold tracking-[0.04em] uppercase bg-accent text-bg-deep py-2.5 rounded-lg text-center hover:opacity-90 transition-colors"
          >
            Assinar
          </Link>
        </div>
      )}
    </nav>
  );
}
