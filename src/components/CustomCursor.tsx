import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { CursorState } from '../types';

interface CustomCursorProps {
  cursorState: CursorState;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ cursorState }) => {
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Direct element references for 180 FPS GPU compositing
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  // High precision target and current positions
  const mousePos = useRef({ x: -200, y: -200 });
  const ringPos = useRef({ x: -200, y: -200 });
  const isExpandedRef = useRef(false);

  const isExpanded = cursorState.active || Boolean(cursorState.text);
  isExpandedRef.current = isExpanded;

  useEffect(() => {
    // Check if pointer device is fine (mouse/trackpad, not touch)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsTouchDevice(!mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsTouchDevice(!e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      // Immediately place dot directly on GPU transform layer with 0 latency
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  // Ultra-fluid 180 FPS hardware-synchronized animation loop
  useEffect(() => {
    if (isTouchDevice) return;

    let animFrameId: number;
    let lastTime = 0;

    const animateLoop = (time: number) => {
      const rawDt = lastTime > 0 ? (time - lastTime) / 1000 : 0.016;
      const dt = Math.max(0.001, Math.min(Number.isFinite(rawDt) ? rawDt : 0.016, 0.1));
      lastTime = time;

      // Adaptive lerp factor calibrated for 180 FPS responsiveness
      // (approx 20% smoothing at 60Hz, scaled continuously across 120-240Hz)
      const lerpSpeed = 1 - Math.exp(-22 * dt);

      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerpSpeed;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerpSpeed;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animFrameId = requestAnimationFrame(animateLoop);
    };

    animFrameId = requestAnimationFrame(animateLoop);
    return () => cancelAnimationFrame(animFrameId);
  }, [isTouchDevice]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Primary sharp aqua water dot - Hardware GPU accelerated translate3d */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-[#00f0ff] rounded-full shadow-[0_0_14px_#00f0ff] will-change-transform"
        style={{
          opacity: isExpanded ? 0 : 1,
          transition: 'opacity 0.15s ease-out',
          transform: `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`,
        }}
      />

      {/* Trailing interactive cursor container - Aqua Water Droplet Bubble */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full flex items-center justify-center transition-[width,height,background-color,border-color,box-shadow] duration-200 ease-out will-change-transform ${
          isExpanded
            ? 'bg-[#00f0ff] text-black shadow-[0_0_35px_rgba(0,240,255,0.65)] font-bold'
            : 'border border-[#00f0ff]/40 bg-[#00f0ff]/10 backdrop-blur-[2px] shadow-[0_0_15px_rgba(0,240,255,0.15)]'
        }`}
        style={{
          width: isExpanded ? (cursorState.text.length > 5 ? 100 : 76) : 34,
          height: isExpanded ? (cursorState.text.length > 5 ? 44 : 76) : 34,
          transform: `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`,
        }}
      >
        {isExpanded && cursorState.text && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="text-[11px] font-condensed tracking-widest uppercase text-black font-extrabold select-none whitespace-nowrap px-2"
          >
            {cursorState.text}
          </motion.span>
        )}
      </div>
    </div>
  );
};
