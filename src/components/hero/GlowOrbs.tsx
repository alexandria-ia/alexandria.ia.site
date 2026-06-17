'use client';

import React from 'react';

export default function GlowOrbs() {
  return (
    <>
      <style>{`
        @keyframes drift-orb {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(50px, 30px) scale(1.2); }
        }
        @keyframes drift-orb-reverse {
          0% { transform: translate(0, 0) scale(1.2); }
          100% { transform: translate(-40px, -20px) scale(0.9); }
        }
        .orb-drift-1 {
          animation: drift-orb 22s infinite alternate ease-in-out;
        }
        .orb-drift-2 {
          animation: drift-orb-reverse 26s infinite alternate ease-in-out;
        }
      `}</style>
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Orb 1 */}
        <div className="absolute w-[clamp(250px,_30vw,_450px)] h-[clamp(250px,_30vw,_450px)] rounded-full bg-accent blur-[120px] opacity-[0.14] top-[8%] left-[5%] orb-drift-1" />
        {/* Orb 2 */}
        <div className="absolute w-[clamp(250px,_30vw,_450px)] h-[clamp(250px,_30vw,_450px)] rounded-full bg-blue-500 blur-[120px] opacity-[0.14] bottom-[12%] right-[5%] orb-drift-2" />
      </div>
    </>
  );
}
