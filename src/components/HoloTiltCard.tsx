import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';

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
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ rx: 0, ry: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const px = Math.min(Math.max((x / rect.width) * 100, 0), 100);
      const py = Math.min(Math.max((y / rect.height) * 100, 0), 100);

      const rx = ((py - 50) / 50) * -tiltIntensity;
      const ry = ((px - 50) / 50) * tiltIntensity;

      setCoords({ x: px, y: py });
      setRotation({ rx, ry });
    },
    [tiltIntensity]
  );

  const handleEnter = () => {
    setIsHovered(true);
    onMouseEnter?.();
  };

  const handleLeave = () => {
    setIsHovered(false);
    setRotation({ rx: 0, ry: 0 });
    onMouseLeave?.();
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      animate={{
        rotateX: rotation.rx,
        rotateY: rotation.ry,
        scale: isHovered ? 1.018 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 24,
        mass: 0.5,
      }}
      className={`relative overflow-hidden group cursor-pointer ${className}`}
    >
      {/* Dynamic Specular Holographic Sheen Layer */}
      <div
        className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300 mix-blend-screen"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle 350px at ${coords.x}% ${coords.y}%, ${glowColor} 0%, rgba(112,0,255,0.12) 35%, transparent 75%)`,
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
          transition: 'transform 0.3s ease-out',
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};
