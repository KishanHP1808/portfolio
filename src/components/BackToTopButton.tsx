import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface BackToTopButtonProps {
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
}

export const BackToTopButton: React.FC<BackToTopButtonProps> = ({
  onHoverAction,
  onHoverEnd,
}) => {
  const { language, t } = useLanguage();
  const { isLight } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroEl = document.getElementById('hero');

          // Check if scrolled past the HeroSection
          if (heroEl) {
            const rect = heroEl.getBoundingClientRect();
            // Appears only after user scrolls past the HeroSection
            setIsVisible(rect.bottom <= 40);
          } else {
            setIsVisible(scrollY > 600);
          }

          // Compute scroll progress percentage
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight > 0) {
            const progress = Math.min(100, Math.max(0, Math.round((scrollY / docHeight) * 100)));
            setScrollProgress(progress);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    // Gentle audio feedback if available
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.16);
    } catch {
      // AudioContext unavailable or blocked
    }
  };

  // SVG circular ring geometry
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="persistent-back-to-top"
          initial={{ opacity: 0, y: 15, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.85 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-20 right-6 sm:bottom-22 sm:right-6 z-40 select-none flex items-center gap-2"
        >
          <motion.button
            onClick={scrollToTop}
            onMouseEnter={() => onHoverAction?.(language === 'kn' ? 'ಮೇಲಕ್ಕೆ' : 'TOP')}
            onMouseLeave={onHoverEnd}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className={`group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border backdrop-blur-xl transition-all duration-300 cursor-pointer ${
              isLight
                ? 'bg-white/95 text-slate-900 border-[#0284c7]/40 hover:border-[#0284c7] shadow-[0_8px_25px_rgba(0,0,0,0.12)] hover:shadow-[0_0_20px_rgba(2,132,199,0.35)]'
                : 'bg-[#070e1c]/90 text-white border-[#00f0ff]/40 hover:border-[#00f0ff] hover:bg-[#00f0ff]/15 shadow-[0_8px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.45)]'
            }`}
            title={t.backToTop.tooltip}
            aria-label={language === 'kn' ? 'ಪುಟದ ಆರಂಭಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'Back to Top'}
          >
            {/* SVG Circular Scroll Progress Ring */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              viewBox="0 0 48 48"
            >
              {/* Background Track Ring */}
              <circle
                cx="24"
                cy="24"
                r={radius}
                className={isLight ? 'stroke-slate-200' : 'stroke-white/10'}
                strokeWidth="2.5"
                fill="none"
              />
              {/* Animated Progress Stroke */}
              <circle
                cx="24"
                cy="24"
                r={radius}
                className={`transition-all duration-150 ${isLight ? 'stroke-[#0284c7]' : 'stroke-[#00f0ff]'}`}
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Inner Arrow Up Icon */}
            <ArrowUp className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover:-translate-y-1 ${
              isLight ? 'text-[#0284c7] group-hover:text-slate-950' : 'text-[#00f0ff] group-hover:text-white'
            }`} />

            {/* Hover Tooltip Pill */}
            <span className={`pointer-events-none absolute right-full mr-3 px-2.5 py-1 rounded-full font-mono text-[10px] sm:text-[11px] font-bold tracking-wider uppercase opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap shadow-xl border ${
              isLight
                ? 'bg-white text-slate-900 border-slate-300'
                : 'bg-black/90 text-[#00f0ff] border-[#00f0ff]/40'
            }`}>
              {t.backToTop.label} • {scrollProgress}%
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
