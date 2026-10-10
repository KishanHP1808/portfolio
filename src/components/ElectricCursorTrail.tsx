import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

export const ElectricCursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    let lastX = 0;
    let lastY = 0;
    let isMoving = false;
    let idleTimer: NodeJS.Timeout;

    const colors = ['#00f0ff', '#38bdf8', '#7000ff', '#ffffff', '#00f0ff'];

    let animId: number = 0;
    let animRunning = false;
    let lastRenderTime = 0;

    const startAnimation = () => {
      if (!animRunning) {
        animRunning = true;
        lastRenderTime = performance.now();
        animId = requestAnimationFrame(render);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX;
      const currentY = e.clientY;

      const dx = currentX - lastX;
      const dy = currentY - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > 1.5) {
        // Limit max active particles to avoid GPU congestion
        if (particles.length < 35) {
          const count = Math.min(Math.floor(speed / 14) + 1, 3);
          for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const pSpeed = Math.random() * 1.5;
            particles.push({
              x: currentX + (Math.random() - 0.5) * 6,
              y: currentY + (Math.random() - 0.5) * 6,
              vx: Math.cos(angle) * pSpeed - dx * 0.05,
              vy: Math.sin(angle) * pSpeed - dy * 0.05,
              size: Math.random() * 2 + 0.8,
              alpha: 0.8,
              decay: Math.random() * 0.05 + 0.04,
              color: colors[Math.floor(Math.random() * colors.length)],
            });
          }
          startAnimation();
        }
      }

      lastX = currentX;
      lastY = currentY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const render = (currentTime: number) => {
      if (particles.length === 0) {
        ctx.clearRect(0, 0, width, height);
        animRunning = false;
        return;
      }

      const rawElapsed = lastRenderTime > 0 ? (currentTime - lastRenderTime) / 1000 : 0.016;
      const elapsed = Math.max(0.001, Math.min(Number.isFinite(rawElapsed) ? rawElapsed : 0.016, 0.05));
      lastRenderTime = currentTime;
      const dt = elapsed * 60;

      ctx.clearRect(0, 0, width, height);

      const friction = Math.pow(0.95, dt);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= friction;
        p.vy *= friction;
        p.alpha -= p.decay * dt;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * Math.max(0.2, p.alpha), 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-45 select-none overflow-hidden will-change-transform"
      style={{ transform: 'translateZ(0)' }}
    />
  );
};
