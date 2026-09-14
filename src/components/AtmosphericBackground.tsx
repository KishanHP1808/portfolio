import React, { useEffect, useRef } from 'react';
import { WaterSplashCanvas } from './WaterSplashCanvas';

export const AtmosphericBackground: React.FC = () => {
  const glowRef = useRef<HTMLDivElement | null>(null);
  const targetPos = useRef({ x: window.innerWidth * 0.5, y: window.innerHeight * 0.3 });
  const currentPos = useRef({ x: window.innerWidth * 0.5, y: window.innerHeight * 0.3 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animId: number;
    let lastTime = performance.now();

    const animateGlow = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth buttery lerp at 180 FPS
      const factor = 1 - Math.exp(-6 * dt);
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * factor;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * factor;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animId = requestAnimationFrame(animateGlow);
    };

    animId = requestAnimationFrame(animateGlow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Deep Marine Oceanic Base Background */}
      <div className="absolute inset-0 bg-[#020813]" />

      {/* Interactive Water Splash and Fluid Ripple Canvas */}
      <WaterSplashCanvas />

      {/* Subtle Radial Aqua Glow reacting smoothly to cursor with 180 FPS hardware transform */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-[850px] h-[850px] rounded-full blur-[140px] opacity-[0.16] will-change-transform pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #00f0ff 0%, #0891b2 35%, transparent 70%)',
          transform: `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) translate(-50%, -50%)`,
        }}
      />

      {/* Atmospheric secondary marine ambient spot in bottom-right */}
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[900px] h-[900px] rounded-full blur-[160px] opacity-[0.12] will-change-transform"
        style={{
          background: 'radial-gradient(circle, #0284c7 0%, #003554 45%, transparent 70%)',
          transform: 'translateZ(0)',
        }}
      />

      {/* Subtle top-left bioluminescent azure counter-light for oceanic depth */}
      <div
        className="absolute top-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full blur-[180px] opacity-[0.08] will-change-transform"
        style={{
          background: 'radial-gradient(circle, #38bdf8 0%, #022b42 50%, transparent 75%)',
          transform: 'translateZ(0)',
        }}
      />

      {/* Cinematic Deep Abyss Vignette Framing */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, transparent 35%, rgba(2, 8, 19, 0.6) 80%, rgba(2, 8, 19, 0.96) 100%)',
        }}
      />

      {/* Film Grain / Liquid Surface Texture Overlay */}
      <div className="absolute inset-0 bg-noise opacity-35 mix-blend-overlay pointer-events-none" />
    </div>
  );
};

