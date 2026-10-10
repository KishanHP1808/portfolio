import React, { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
  lineWidth: number;
  color: string;
}

interface Droplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
  gravity: number;
  color: string;
  hasSplashed?: boolean;
}

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wiggleSpeed: number;
  wiggleDist: number;
  wiggleOffset: number;
  alpha: number;
}

export const WaterSplashCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const ripples: Ripple[] = [];
    const droplets: Droplet[] = [];
    const bubbles: Bubble[] = [];

    // Initialize gentle background rising bubbles (optimized count)
    const bubbleCount = Math.min(8, Math.max(4, Math.floor(width / 180)));
    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1.5 + Math.random() * 2.5,
        speed: 0.25 + Math.random() * 0.45,
        wiggleSpeed: 0.015 + Math.random() * 0.02,
        wiggleDist: 10 + Math.random() * 15,
        wiggleOffset: Math.random() * Math.PI * 2,
        alpha: 0.12 + Math.random() * 0.2,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Function to trigger a water splash
    const triggerSplash = (clientX: number, clientY: number, intensity: 'click' | 'move' = 'click') => {
      const isClick = intensity === 'click';

      // 1. Concentric Water Rings (Ripples)
      const ringCount = isClick ? 3 : 1;
      for (let r = 0; r < ringCount; r++) {
        ripples.push({
          x: clientX,
          y: clientY,
          radius: 2 + r * 6,
          maxRadius: isClick ? 90 + Math.random() * 70 : 35 + Math.random() * 25,
          opacity: isClick ? 0.75 - r * 0.18 : 0.28,
          speed: isClick ? 2.5 + r * 0.8 : 1.2,
          lineWidth: isClick ? 2.2 : 1.2,
          color: r === 0 ? '#00f0ff' : r === 1 ? '#38bdf8' : '#00e5ff',
        });
      }

      // 2. Water Droplets spraying outward on click
      if (isClick) {
        const dropletCount = 14 + Math.floor(Math.random() * 8);
        for (let i = 0; i < dropletCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2.2 + Math.random() * 5.2;
          const vx = Math.cos(angle) * speed;
          const vy = Math.sin(angle) * speed - (1.5 + Math.random() * 2.5); // upward burst
          droplets.push({
            x: clientX + Math.cos(angle) * 3,
            y: clientY + Math.sin(angle) * 3,
            vx,
            vy,
            radius: 1.5 + Math.random() * 2.8,
            alpha: 0.9,
            decay: 0.018 + Math.random() * 0.02,
            gravity: 0.16,
            color: Math.random() > 0.4 ? '#00f0ff' : '#a5f3fc',
          });
        }
      }
    };

    // Global Click Listener for Water Splash
    const handlePointerDown = (e: MouseEvent) => {
      triggerSplash(e.clientX, e.clientY, 'click');
    };

    // Gliding Wake on Mouse Move (Throttled for high performance)
    let lastMoveTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMoveTime > 140) {
        triggerSplash(e.clientX, e.clientY, 'move');
        lastMoveTime = now;
      }
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Initial ambient splash for immediate visual feedback
    setTimeout(() => {
      triggerSplash(width * 0.5, height * 0.35, 'click');
    }, 400);

    // Animation Loop
    let lastRenderTime = 0;
    const render = (currentTime: number) => {
      const rawElapsed = lastRenderTime > 0 ? (currentTime - lastRenderTime) / 1000 : 0.016;
      const elapsed = Math.max(0.001, Math.min(Number.isFinite(rawElapsed) ? rawElapsed : 0.016, 0.05));
      lastRenderTime = currentTime;
      const dt = elapsed * 60;

      ctx.clearRect(0, 0, width, height);

      // --- 1. Draw Rising Floating Ambient Bubbles ---
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        b.y -= b.speed * dt;
        b.wiggleOffset += b.wiggleSpeed * dt;

        const currentX = b.x + Math.sin(b.wiggleOffset) * (b.wiggleDist * 0.2);

        // Reset if reached top
        if (b.y < -20) {
          b.y = height + 20;
          b.x = Math.random() * width;
        }

        ctx.fillStyle = `rgba(0, 240, 255, ${b.alpha * 0.35})`;
        ctx.beginPath();
        ctx.arc(currentX, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(56, 189, 248, ${b.alpha * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // --- 2. Draw Expanding Water Ripples ---
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed * dt;
        r.opacity -= 0.012 * dt;

        if (r.opacity <= 0 || r.radius <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        const ringRadius = Math.max(0.1, r.radius);
        ctx.beginPath();
        ctx.arc(r.x, r.y, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = r.color;
        ctx.globalAlpha = Math.max(0, r.opacity);
        ctx.lineWidth = r.lineWidth;
        ctx.stroke();

        // Inner secondary refraction ring for fluid depth
        if (ringRadius > 14) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, Math.max(0.1, ringRadius * 0.72), 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.globalAlpha = Math.max(0, r.opacity * 0.45);
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // --- 3. Draw Water Droplets (Splash Particles) ---
      const dropletDrag = Math.pow(0.98, dt);
      for (let i = droplets.length - 1; i >= 0; i--) {
        const d = droplets[i];
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.vy += d.gravity * dt;
        d.vx *= dropletDrag; // atmospheric drag
        d.alpha -= d.decay * dt;

        if (d.alpha <= 0) {
          // Trigger micro-ripple when droplet dies
          if (!d.hasSplashed && Math.random() > 0.4 && ripples.length < 40) {
            ripples.push({
              x: d.x,
              y: d.y,
              radius: 1,
              maxRadius: 18 + Math.random() * 12,
              opacity: 0.35,
              speed: 1.1,
              lineWidth: 0.8,
              color: '#00f0ff',
            });
          }
          droplets.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, d.alpha);

        // Droplet body
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.fill();

        // Glistening highlight on droplet
        ctx.beginPath();
        ctx.arc(d.x - d.radius * 0.3, d.y - d.radius * 0.3, d.radius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.restore();
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] w-full h-full will-change-transform"
      style={{ mixBlendMode: 'screen', transform: 'translateZ(0)' }}
    />
  );
};
