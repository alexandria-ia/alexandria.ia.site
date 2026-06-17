'use client';

import React from 'react';

export default function GlowOrbs() {
  return (
    <>
      <style>{`
        @keyframes spin-slow {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .orb-spinning-container {
          animation: spin-slow 75s linear infinite;
        }
      `}</style>
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Spinning Wrapper centered behind the headline */}
        <div className="absolute top-1/2 left-1/2 w-[min(650px,_90vw)] h-[min(650px,_90vw)] orb-spinning-container">
          
          {/* Orb 1: Warm Gold (positioned top-left inside wrapper) */}
          <div className="absolute w-[clamp(220px,_25vw,_350px)] h-[clamp(220px,_25vw,_350px)] rounded-full bg-accent blur-[100px] opacity-[0.18] top-0 left-0" />
          
          {/* Orb 2: Space Blue (positioned bottom-right inside wrapper) */}
          <div className="absolute w-[clamp(220px,_25vw,_350px)] h-[clamp(220px,_25vw,_350px)] rounded-full bg-blue-500/80 blur-[100px] opacity-[0.16] bottom-0 right-0" />
          
        </div>
      </div>
    </>
  );
}
