import React, { useRef, useState, useCallback, useEffect } from 'react';

interface HoloTiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltIntensity?: number;
  glowColor?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const HoloTiltCard: React.FC<HoloTiltCardProps> = ({
  children,
  className = '',
  tiltIntensity = 12,
  glowColor = 'rgba(0, 240, 255, 0.25)',
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const sheenRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const rafId = useRef<number | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;

      const clientX = e.clientX;
      const clientY = e.clientY;

      if (rafId.current) cancelAnimationFrame(rafId.current);

      rafId.current = requestAnimationFrame(() => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const px = Math.min(Math.max((x / rect.width) * 100, 0), 100);
        const py = Math.min(Math.max((y / rect.height) * 100, 0), 100);

        const rx = ((py - 50) / 50) * -tiltIntensity;
        const ry = ((px - 50) / 50) * tiltIntensity;

        card.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
        card.style.setProperty('--ry', `${ry.toFixed(2)}deg`);

        if (sheenRef.current) {
          sheenRef.current.style.background = `radial-gradient(circle 350px at ${px}% ${py}%, ${glowColor} 0%, rgba(112,0,255,0.12) 35%, transparent 75%)`;
        }
      });
    },
    [tiltIntensity, glowColor]
  );

  const handleEnter = () => {
    setIsHovered(true);
    onMouseEnter?.();
  };

  const handleLeave = () => {
    setIsHovered(false);
    if (rafId.current) cancelAnimationFrame(rafId.current);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--rx', '0deg');
      cardRef.current.style.setProperty('--ry', '0deg');
    }
    onMouseLeave?.();
  };

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        transform: `perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) scale(${isHovered ? 1.018 : 1}) translateZ(0)`,
        transition: isHovered
          ? 'transform 0.08s cubic-bezier(0.2, 0, 0.2, 1)'
          : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`relative overflow-hidden group cursor-pointer will-change-transform ${className}`}
    >
      {/* Dynamic Specular Holographic Sheen Layer */}
      <div
        ref={sheenRef}
        className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300 mix-blend-screen will-change-transform"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle 350px at 50% 50%, ${glowColor} 0%, rgba(112,0,255,0.12) 35%, transparent 75%)`,
        }}
      />

      {/* Cybernetic Edge Refraction Highlight */}
      <div
        className="absolute inset-0 pointer-events-none z-20 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.9 : 0,
          boxShadow: `inset 0 0 25px rgba(0, 240, 255, 0.08), 0 0 35px rgba(0, 240, 255, 0.15)`,
        }}
      />

      {/* Card Content with 3D Depth Elevation */}
      <div
        className="relative z-10 w-full h-full"
        style={{
          transform: isHovered ? 'translateZ(25px)' : 'translateZ(0px)',
          transition: 'transform 0.25s cubic-bezier(0.2, 0, 0.2, 1)',
        }}
      >
        {children}
      </div>
    </div>
  );
};
