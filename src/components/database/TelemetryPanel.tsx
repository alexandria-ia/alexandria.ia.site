'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function TelemetryPanel() {
  const [latency, setLatency] = useState(18);
  const [requests, setRequests] = useState(1450);
  const [cacheEfficiency, setCacheEfficiency] = useState('98.4%');

  const chartAreaRef = useRef<SVGPathElement>(null);
  const chartLineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const statsInterval = setInterval(() => {
      const ping = 15 + Math.floor(Math.random() * 8);
      const reqs = 1400 + Math.floor(Math.random() * 100);
      const cache = (98.2 + Math.random() * 0.5).toFixed(1);

      setLatency(ping);
      setRequests(reqs);
      setCacheEfficiency(`${cache}%`);
    }, 1500);

    const width = 400;
    const height = 60;
    const pointsCount = 40;
    const dataPoints = Array.from({ length: pointsCount }, () => 30 + Math.random() * 10);
    let time = 0;
    let animationFrameId: number;

    const drawChart = () => {
      time += 0.05;
      dataPoints.shift();
      const newVal = 30 + Math.sin(time) * 15 + Math.cos(time * 2.3) * 5 + (Math.random() - 0.5) * 4;
      const clampedVal = Math.max(5, Math.min(55, newVal));
      dataPoints.push(clampedVal);

      let linePath = '';
      let areaPath = 'M 0 60';

      const step = width / (pointsCount - 1);
      dataPoints.forEach((val, idx) => {
        const x = idx * step;
        const y = height - val;
        if (idx === 0) {
          linePath += `M ${x} ${y}`;
        } else {
          linePath += ` L ${x} ${y}`;
        }
        areaPath += ` L ${x} ${y}`;
      });

      areaPath += ` L ${width} 60 Z`;

      if (chartLineRef.current) chartLineRef.current.setAttribute('d', linePath);
      if (chartAreaRef.current) chartAreaRef.current.setAttribute('d', areaPath);

      animationFrameId = requestAnimationFrame(drawChart);
    };

    drawChart();

    return () => {
      clearInterval(statsInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="panel-card border border-border-card bg-[rgba(14,14,16,0.3)] backdrop-blur-[20px] rounded-[16px] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 relative before:content-[''] before:absolute before:-top-[1px] before:-left-[1px] before:w-[10px] before:h-[10px] before:border-t-2 before:border-l-2 before:border-accent/40 hover:before:border-accent before:transition-all after:content-[''] after:absolute after:-bottom-[1px] after:-right-[1px] after:w-[10px] after:h-[10px] after:border-b-2 after:border-r-2 after:border-accent/40 hover:after:border-accent after:transition-all hover:border-[rgba(201,165,90,0.3)]">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-border-subtle text-[10px] font-semibold tracking-[0.18em] uppercase">
        <span className="text-accent">// TELEMETRIA EM TEMPO REAL</span>
        <span className="text-text-muted">STATUS: ACTIVE // PING: {latency}ms</span>
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <span className="text-[18px] md:text-[22px] font-extrabold text-white tracking-tight leading-none">
              {latency}ms
            </span>
            <span className="text-[9px] font-semibold tracking-wider text-text-muted mt-1 uppercase">
              LATÊNCIA DA API
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[18px] md:text-[22px] font-extrabold text-white tracking-tight leading-none">
              {requests.toLocaleString('pt-BR')} /s
            </span>
            <span className="text-[9px] font-semibold tracking-wider text-text-muted mt-1 uppercase">
              REQUISIÇÕES / SEC
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[18px] md:text-[22px] font-extrabold text-accent tracking-tight leading-none">
              {cacheEfficiency}
            </span>
            <span className="text-[9px] font-semibold tracking-wider text-text-muted mt-1 uppercase">
              EFICIÊNCIA CACHE
            </span>
          </div>
        </div>

        {/* SVG Oscilloscope Wave */}
        <div className="relative w-full h-[60px] bg-black/40 border border-border-subtle rounded-[6px] overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 400 60" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c9a55a" stopOpacity="0.3"></stop>
                <stop offset="100%" stopColor="#c9a55a" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            <path ref={chartAreaRef} fill="url(#chart-grad)" d="M 0 60 L 0 60 Z"></path>
            <path ref={chartLineRef} fill="none" stroke="#c9a55a" strokeWidth="2" d="M 0 60 Z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
