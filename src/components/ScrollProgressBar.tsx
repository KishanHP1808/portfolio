import React, { useEffect, useRef } from 'react';

export const ScrollProgressBar: React.FC = () => {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (scrollHeight > 0 && barRef.current) {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const progress = Math.min(1, Math.max(0, scrollTop / scrollHeight));
            barRef.current.style.transform = `scaleX(${progress})`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[120] h-[3px] bg-white/[0.04] pointer-events-none select-none"
      role="progressbar"
      aria-label="Portfolio scroll progress"
    >
      <div
        ref={barRef}
        className="h-full w-full bg-gradient-to-r from-[#00f0ff] via-cyan-400 to-[#38bdf8] shadow-[0_0_12px_rgba(0,240,255,0.85),0_0_4px_#00f0ff] will-change-transform"
        style={{ transformOrigin: '0 50%', transform: 'scaleX(0)' }}
      />
    </div>
  );
};
