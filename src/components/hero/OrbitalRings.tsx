'use client';

import React from 'react';

export default function OrbitalRings() {
  return (
    <div 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(650px,_90vw)] h-[min(650px,_90vw)] z-0 pointer-events-none opacity-20"
      style={{
        transform: 'translate(-50%, -50%) perspective(1000px) rotateX(60deg) rotateY(-10deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Ring 1 */}
      <div className="absolute inset-0 rounded-full border border-dashed border-accent animate-spin-clockwise m-[20px]" />
      {/* Ring 2 */}
      <div className="absolute inset-0 rounded-full border border-dotted border-white/35 animate-spin-counter m-[80px]" />
      {/* Ring 3 */}
      <div className="absolute inset-0 rounded-full border-[3px] border-double border-blue-500/50 animate-spin-clockwise m-[140px]" />
    </div>
  );
}
