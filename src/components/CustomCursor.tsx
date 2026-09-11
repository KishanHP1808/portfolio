import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { CursorState } from '../types';

interface CustomCursorProps {
  cursorState: CursorState;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ cursorState }) => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const trailingPos = useRef({ x: -100, y: -100 });
  const [trailing, setTrailing] = useState({ x: -100, y: -100 });

  useEffect(() => {
    // Check if pointer device is fine (mouse/trackpad, not touch)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsTouchDevice(!mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsTouchDevice(!e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  // Smooth lerp for trailing ring
  useEffect(() => {
    if (isTouchDevice) return;

    let animFrameId: number;
    const lerpSpeed = 0.2;

    const animateTrailing = () => {
      trailingPos.current.x += (mousePosition.x - trailingPos.current.x) * lerpSpeed;
      trailingPos.current.y += (mousePosition.y - trailingPos.current.y) * lerpSpeed;
      setTrailing({ x: trailingPos.current.x, y: trailingPos.current.y });
      animFrameId = requestAnimationFrame(animateTrailing);
    };

    animFrameId = requestAnimationFrame(animateTrailing);
    return () => cancelAnimationFrame(animFrameId);
  }, [mousePosition, isTouchDevice]);

  if (isTouchDevice || !isVisible) return null;

  const isExpanded = cursorState.active || Boolean(cursorState.text);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Primary sharp aqua water dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-[#00f0ff] rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_14px_#00f0ff]"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          opacity: isExpanded ? 0 : 1,
          scale: isExpanded ? 0 : 1,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 450, mass: 0.1 }}
      />

      {/* Trailing interactive cursor container - Aqua Water Droplet Bubble */}
      <motion.div
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-colors duration-300 ${
          isExpanded
            ? 'bg-[#00f0ff] text-black shadow-[0_0_35px_rgba(0,240,255,0.65)] font-bold'
            : 'border border-[#00f0ff]/40 bg-[#00f0ff]/10 backdrop-blur-[2px] shadow-[0_0_15px_rgba(0,240,255,0.15)]'
        }`}
        animate={{
          x: trailing.x,
          y: trailing.y,
          width: isExpanded ? (cursorState.text.length > 5 ? 100 : 76) : 34,
          height: isExpanded ? (cursorState.text.length > 5 ? 44 : 76) : 34,
          borderRadius: isExpanded && cursorState.text.length > 5 ? 9999 : 9999,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 350, mass: 0.2 }}
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
      </motion.div>
    </div>
  );
};
