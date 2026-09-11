import React, { useEffect, useState } from 'react';
import { WaterSplashCanvas } from './WaterSplashCanvas';

export const AtmosphericBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to percentage of screen
      const x = Math.round((e.clientX / window.innerWidth) * 100);
      const y = Math.round((e.clientY / window.innerHeight) * 100);
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Deep Marine Oceanic Base Background */}
      <div className="absolute inset-0 bg-[#020813]" />

      {/* Interactive Water Splash and Fluid Ripple Canvas */}
      <WaterSplashCanvas />

      {/* Subtle Radial Aqua Glow reacting smoothly to cursor */}
      <div
        className="absolute w-[850px] h-[850px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] opacity-[0.16] transition-transform duration-1000 ease-out will-change-transform"
        style={{
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          background: 'radial-gradient(circle, #00f0ff 0%, #0891b2 35%, transparent 70%)',
        }}
      />

      {/* Atmospheric secondary marine ambient spot in bottom-right */}
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[900px] h-[900px] rounded-full blur-[160px] opacity-[0.12]"
        style={{
          background: 'radial-gradient(circle, #0284c7 0%, #003554 45%, transparent 70%)',
        }}
      />

      {/* Subtle top-left bioluminescent azure counter-light for oceanic depth */}
      <div
        className="absolute top-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full blur-[180px] opacity-[0.08]"
        style={{
          background: 'radial-gradient(circle, #38bdf8 0%, #022b42 50%, transparent 75%)',
        }}
      />

      {/* Cinematic Deep Abyss Vignette Framing */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, transparent 35%, rgba(2, 8, 19, 0.6) 80%, rgba(2, 8, 19, 0.96) 100%)',
        }}
      />

      {/* Film Grain / Liquid Surface Texture Overlay */}
      <div className="absolute inset-0 bg-noise opacity-35 mix-blend-overlay" />
    </div>
  );
};

