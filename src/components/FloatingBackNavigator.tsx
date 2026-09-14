import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowUp, Compass, ChevronUp } from 'lucide-react';

interface PhaseInfo {
  id: string;
  number: string;
  name: string;
  shortName: string;
}

const PHASES: PhaseInfo[] = [
  { id: 'hero', number: '00', name: 'INITIATION', shortName: 'HERO' },
  { id: 'work', number: '01', name: 'FEATURED WORK', shortName: 'WORK' },
  { id: 'skills', number: '02', name: 'CAPABILITIES', shortName: 'SKILLS' },
  { id: 'experience', number: '03', name: 'EXPERIENCE', shortName: 'TIMELINE' },
  { id: 'certificates', number: '04', name: 'CERTIFICATES', shortName: 'CERTS' },
  { id: 'about', number: '05', name: 'ABOUT ME', shortName: 'ABOUT' },
  { id: 'contact', number: '06', name: 'CONTACT', shortName: 'CONTACT' },
];

interface FloatingBackNavigatorProps {
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
}

export const FloatingBackNavigator: React.FC<FloatingBackNavigatorProps> = ({
  onHoverAction,
  onHoverEnd,
}) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setVisible(scrollY > 380);

      // Determine which phase is currently in viewport
      const viewportMiddle = scrollY + window.innerHeight * 0.35;

      for (let i = PHASES.length - 1; i >= 0; i--) {
        const el = document.getElementById(PHASES[i].id);
        if (el) {
          const top = el.offsetTop;
          if (viewportMiddle >= top) {
            setCurrentPhaseIndex(i);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentPhase = PHASES[currentPhaseIndex] || PHASES[0];
  const previousPhase = currentPhaseIndex > 0 ? PHASES[currentPhaseIndex - 1] : null;

  const scrollToPhase = (phaseId: string) => {
    if (phaseId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(phaseId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (previousPhase) {
      scrollToPhase(previousPhase.id);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="floating-phase-back-navigator"
          initial={{ opacity: 0, y: 25, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 25, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-full bg-[#070e1c]/90 border border-[#00f0ff]/30 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl glow-aqua-subtle max-w-[94vw] sm:max-w-none select-none"
        >
          {/* Back to Previous Phase Button */}
          <button
            id="back-to-previous-phase-btn"
            onClick={handleBack}
            onMouseEnter={() => onHoverAction?.('BACK')}
            onMouseLeave={onHoverEnd}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#00f0ff] text-white hover:text-black transition-all duration-300 font-mono text-[11px] sm:text-xs uppercase font-bold tracking-wider cursor-pointer shrink-0"
            title={previousPhase ? `Back to ${previousPhase.name}` : 'Back to Top'}
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>
              {previousPhase ? (
                <>
                  <span className="hidden md:inline">BACK TO </span>
                  <span>{previousPhase.shortName}</span>
                </>
              ) : (
                'BACK TO TOP'
              )}
            </span>
          </button>

          {/* Current Phase Badge */}
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full border border-white/10 bg-black/40 text-neutral-300 font-mono text-[10px] sm:text-[11px] tracking-wider truncate shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
            <span className="text-[#00f0ff] font-bold">
              PHASE {currentPhase.number}
            </span>
            <span className="text-neutral-500 hidden sm:inline">//</span>
            <span className="hidden sm:inline uppercase text-neutral-300">
              {currentPhase.name}
            </span>
          </div>

          {/* Direct Back To Top Shortcut */}
          <button
            id="back-to-top-shortcut-btn"
            onClick={handleScrollToTop}
            onMouseEnter={() => onHoverAction?.('TOP')}
            onMouseLeave={onHoverEnd}
            className="group flex items-center gap-1 p-2 sm:px-3 sm:py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white hover:text-black text-neutral-300 transition-all duration-300 font-mono text-[11px] sm:text-xs font-semibold cursor-pointer shrink-0"
            title="Scroll to Top (Hero)"
          >
            <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
            <span className="hidden sm:inline">TOP</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
