import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, Briefcase, MapPin, Zap } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface FoggyGlassNameProps {
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
}

export const FoggyGlassName: React.FC<FoggyGlassNameProps> = ({
  onHoverAction,
  onHoverEnd,
}) => {
  return (
    <div
      id="hero-name-card"
      onMouseEnter={() => onHoverAction?.('KISHAN H.P.')}
      onMouseLeave={onHoverEnd}
      className="relative w-full rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-10 lg:p-12 bg-neutral-950/75 border border-white/10 hover:border-[#00f0ff]/30 shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden select-none transition-colors duration-500 group"
    >
      {/* Ambient background lighting */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#00f0ff]/15 blur-[100px] pointer-events-none group-hover:bg-[#00f0ff]/20 transition-all duration-700" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      {/* Recruiter / Hiring Header Status Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 sm:gap-4 pb-3 sm:pb-6 border-b border-white/10 text-[10px] sm:text-xs font-mono">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-500" />
          </span>

          <span className="text-emerald-400 font-semibold tracking-wider uppercase flex items-center gap-1 sm:gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>
              <span className="hidden sm:inline">CANDIDATE IDENTITY VERIFIED • READY TO HIRE</span>
              <span className="sm:hidden">CANDIDATE VERIFIED</span>
            </span>
          </span>
        </div>

        {/* Global Location & Availability Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-[9px] sm:text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
            <span className="text-white font-medium">OPEN TO GLOBAL ROLES</span>
          </div>
        </div>
      </div>

      {/* Main Colossal Name: Crystal-clear "KISHAN H.P" with Luminous High-Tech Typography */}
      <div className="relative z-10 py-4 sm:py-6 md:py-10 flex items-baseline overflow-hidden leading-none tracking-tighter">
        <motion.div
          initial={{ y: '30%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="flex flex-wrap sm:flex-nowrap items-baseline gap-2 xs:gap-3 sm:gap-5 md:gap-8 select-none max-w-full"
        >
          {/* Name: KISHAN */}
          <h1 className="font-display text-[11.5vw] xs:text-[11vw] sm:text-[10vw] md:text-[8.5vw] lg:text-[7.5vw] xl:text-[7vw] uppercase font-extrabold text-white drop-shadow-[0_0_35px_rgba(0,240,255,0.4)] group-hover:drop-shadow-[0_0_45px_rgba(0,240,255,0.7)] transition-all duration-500">
            KISHAN
          </h1>

          {/* Suffix: H.P */}
          <h1 className="font-display text-[11.5vw] xs:text-[11vw] sm:text-[10vw] md:text-[8.5vw] lg:text-[7.5vw] xl:text-[7vw] uppercase font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00f0ff] to-cyan-300 drop-shadow-[0_0_40px_rgba(0,240,255,0.6)] group-hover:drop-shadow-[0_0_55px_rgba(0,240,255,0.9)] transition-all duration-500">
            H.P
          </h1>

          {/* Decorative accent cyan beam */}
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden md:inline-block h-3 md:h-5 w-16 md:w-28 bg-gradient-to-r from-[#00f0ff] to-transparent origin-left rounded-full shadow-[0_0_20px_#00f0ff] self-center"
          />
        </motion.div>
      </div>

      {/* Sub-Header Recruiter Badges & Core Competencies */}
      <div className="relative z-10 pt-3 sm:pt-4 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 border-t border-white/10 text-[10px] sm:text-xs font-mono">
        <div className="flex flex-wrap items-center gap-1.5 text-neutral-300">
          <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00f0ff] shrink-0" />
          <span className="font-bold text-white">RECRUITER MATCH:</span>
          <span className="text-neutral-300 break-words">
            Frontend Specialist &bull; UI/UX Architect &bull; React 19 &bull; TypeScript &bull; Next.js
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center gap-1.5 text-[9px] sm:text-[11px]"
        >
          <Sparkles className="w-3 h-3 text-emerald-300" />
          <span>AVAILABLE FOR IMMEDIATE INTERVIEWS</span>
        </motion.div>
      </div>
    </div>
  );
};
