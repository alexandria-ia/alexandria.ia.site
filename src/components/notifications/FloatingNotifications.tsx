'use client';

import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { systemNotifications, SystemNotification } from '@/data/notifications';

interface ActiveNotification extends SystemNotification {
  id: string;
  x: number;
  y: number;
  animationName: string;
  animationDuration: number;
}

export default function FloatingNotifications() {
  const [activeNotifs, setActiveNotifs] = useState<ActiveNotification[]>([]);
  const nextId = useRef(0);

  const spawnNotification = () => {
    setActiveNotifs((prev) => {
      const template = systemNotifications[Math.floor(Math.random() * systemNotifications.length)];

      let x = 0;
      let y = 0;
      let attempts = 0;
      let positionOk = false;

      while (!positionOk && attempts < 15) {
        attempts++;
        const isLeft = Math.random() > 0.5;
        x = isLeft ? (1 + Math.random() * 5) : (86 + Math.random() * 8);
        y = 12 + Math.random() * 70;

        let tooClose = false;
        for (const wrap of prev) {
          const dx = Math.abs(x - wrap.x);
          const dy = Math.abs(y - wrap.y);

          if (dx < 25 && dy < 20) {
            tooClose = true;
            break;
          }
        }

        if (!tooClose) {
          positionOk = true;
        }
      }

      const anims = ['float-slow', 'float-medium', 'float-fast'];
      const randomAnim = anims[Math.floor(Math.random() * anims.length)];
      const animDuration = 10 + Math.random() * 8;

      const newNotif: ActiveNotification = {
        ...template,
        id: `notif-${nextId.current++}`,
        x,
        y,
        animationName: randomAnim,
        animationDuration: animDuration,
      };

      const base = prev.length >= 5 ? prev.slice(1) : prev;
      return [...base, newNotif];
    });
  };

  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      spawnNotification();
      
      const interval = setInterval(() => {
        spawnNotification();
      }, 2300);

      return () => clearInterval(interval);
    }, 1500);

    return () => clearTimeout(initialTimeout);
  }, []);

  useEffect(() => {
    if (activeNotifs.length === 0) return;

    const latest = activeNotifs[activeNotifs.length - 1];
    const timer = setTimeout(() => {
      setActiveNotifs((prev) => prev.filter((n) => n.id !== latest.id));
    }, 4500);

    return () => clearTimeout(timer);
  }, [activeNotifs]);

  return (
    <div id="floating-notif-container" className="fixed inset-0 pointer-events-none z-20 select-none overflow-hidden hidden xl:block">
      <AnimatePresence>
        {activeNotifs.map((notif) => (
          <NotificationCard key={notif.id} notif={notif} onDismiss={() => {
            setActiveNotifs((prev) => prev.filter((n) => n.id !== notif.id));
          }} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function NotificationCard({ notif, onDismiss }: { notif: ActiveNotification; onDismiss: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const rect = card.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const tiltX = ((yc - mouseY) / yc) * 12;
    const tiltY = ((mouseX - xc) / xc) * 12;

    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05) translateY(-2px)`;
    card.style.borderColor = 'var(--color-accent)';
    card.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.12), 0 0 25px var(--color-accent-soft), 0 15px 40px rgba(0,0,0,0.35)';
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateY(0px)`;
    card.style.borderColor = '';
    card.style.boxShadow = '';
  };

  const animClass = (() => {
    switch (notif.animationName) {
      case 'float-slow':
        return 'animate-float-slow';
      case 'float-medium':
        return 'animate-float-medium';
      case 'float-fast':
        return 'animate-float-fast';
      default:
        return 'animate-float-slow';
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, y: -20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`absolute pointer-events-auto ${animClass}`}
      style={{
        left: `${notif.x}vw`,
        top: `${notif.y}vh`,
        animationDuration: `${notif.animationDuration}s`,
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onDismiss}
        className="flex items-center gap-3 px-4 py-3 bg-[rgba(14,14,16,0.6)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)] rounded-[6px] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),_0_8px_32px_rgba(0,0,0,0.3)] text-text-primary text-[11px] font-semibold cursor-pointer relative transition-all duration-300 before:content-[''] before:absolute before:-top-[1px] before:-left-[1px] before:w-[6px] before:h-[6px] before:border-t-2 before:border-l-2 before:border-accent after:content-[''] after:absolute after:-bottom-[1px] after:-right-[1px] after:w-[6px] after:h-[6px] after:border-b-2 after:border-r-2 after:border-accent hover:border-accent"
      >
        <img
          className="flex-shrink-0 object-contain w-[18px] h-[18px]"
          src={`/icons/${notif.icon}`}
          width={18}
          height={18}
          alt={notif.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23c9a55a" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';
          }}
        />
        <div className="flex flex-col items-start leading-tight">
          <span className="text-[11px] font-semibold tracking-wide text-text-primary">{notif.title}</span>
          <span className="font-mono text-[8px] text-text-muted mt-0.5 tracking-wider">{notif.msg}</span>
        </div>
        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e] flex-shrink-0 animate-[pulse-status_2s_infinite] ml-2" />
      </div>
    </motion.div>
  );
}
