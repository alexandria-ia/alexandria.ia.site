'use client';

import React, { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let astrolabeAngle = 0;
    let nebulaPulse = 0;
    
    const mouse: { x: number | null; y: number | null; radius: number } = {
      x: null,
      y: null,
      radius: 180,
    };

    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * (canvas?.width || 800);
        this.y = Math.random() * (canvas?.height || 600);
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.5 + 1;
        // Warm gold vs white stars
        this.color = Math.random() > 0.4 ? 'rgba(212, 175, 90, 0.35)' : 'rgba(255, 255, 255, 0.25)';
      }

      update() {
        if (!canvas) return;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    function init() {
      if (!canvas) return;
      particles = [];
      const particleCount = Math.min(70, Math.floor((canvas.width * canvas.height) / 25000));
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function drawAstrolabe() {
      if (!canvas || !ctx) return;
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const baseSize = Math.min(canvas.width, canvas.height) * 0.6;
      
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(astrolabeAngle);
      
      // Outer Astrolabe Ring
      ctx.beginPath();
      ctx.arc(0, 0, baseSize * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(212, 175, 90, 0.015)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Coordinate Lines
      ctx.beginPath();
      ctx.moveTo(-baseSize * 0.82, 0);
      ctx.lineTo(baseSize * 0.82, 0);
      ctx.moveTo(0, -baseSize * 0.82);
      ctx.lineTo(0, baseSize * 0.82);
      ctx.strokeStyle = 'rgba(212, 175, 90, 0.008)';
      ctx.stroke();

      // Middle Dashed Orbit Ring
      ctx.beginPath();
      ctx.arc(0, 0, baseSize * 0.55, 0, Math.PI * 2);
      ctx.setLineDash([6, 12]);
      ctx.strokeStyle = 'rgba(212, 175, 90, 0.012)';
      ctx.stroke();
      ctx.setLineDash([]); // Reset

      // Inner Star Geometry
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const x1 = Math.cos(angle) * (baseSize * 0.15);
        const y1 = Math.sin(angle) * (baseSize * 0.15);
        const x2 = Math.cos(angle + Math.PI / 8) * (baseSize * 0.4);
        const y2 = Math.sin(angle + Math.PI / 8) * (baseSize * 0.4);
        
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(212, 175, 90, 0.005)';
      ctx.stroke();

      ctx.restore();
    }

    function drawBackgroundNebula() {
      if (!canvas || !ctx) return;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.max(canvas.width, canvas.height) * 0.5;
      
      // Pulsing opacity
      const pulseIntensity = 0.02 + Math.sin(nebulaPulse) * 0.008;

      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
      grad.addColorStop(0, `rgba(212, 175, 90, ${pulseIntensity})`);
      grad.addColorStop(0.3, 'rgba(9, 26, 46, 0.03)');
      grad.addColorStop(1, 'rgba(5, 7, 11, 0)');
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawConnections() {
      if (!ctx) return;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Connect to mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(212, 175, 90, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Connect to other particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(212, 175, 90, ${alpha * 0.5})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update variables
      astrolabeAngle += 0.00015;
      nebulaPulse += 0.003;

      // Draw layers
      drawBackgroundNebula();
      drawAstrolabe();
      
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      drawConnections();
      
      animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    init();
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="canvas-particles"
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
    />
  );
}
