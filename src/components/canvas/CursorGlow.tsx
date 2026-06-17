'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const animateGlow = () => {
      const glow = glowRef.current;
      if (glow) {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        glow.style.left = `${glowX}px`;
        glow.style.top = `${glowY}px`;
      }
      animationFrameId = requestAnimationFrame(animateGlow);
    };

    animateGlow();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed w-[380px] h-[380px] rounded-full bg-[radial-gradient(circle,_rgba(201,165,90,0.05)_0%,_transparent_70%)] pointer-events-none z-10 -translate-x-1/2 -translate-y-1/2 will-change-[left,top] transition-opacity duration-500 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        left: '-999px',
        top: '-999px',
      }}
    />
  );
}
