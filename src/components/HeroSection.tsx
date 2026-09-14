import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDownRight, Compass, Sparkles, MapPin, Terminal, Cpu, Code2, Download, Zap, MessageSquare, GraduationCap, ExternalLink } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { FoggyGlassName } from './FoggyGlassName';
import { JarvisConsole } from './JarvisConsole';

interface HeroSectionProps {
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
  onOpenContact?: () => void;
  onOpenTalkToHim?: () => void;
  onOpenResume?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onHoverAction,
  onHoverEnd,
  onOpenContact,
  onOpenTalkToHim,
  onOpenResume,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Scroll parallax mapping
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroTranslateY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const visualParallaxY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  // Gentle cursor tilt for the cinematic visual
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 14, y: y * -14 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const scrollToWork = () => {
    const el = document.getElementById('work');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.section
      id="hero"
      ref={containerRef}
      style={{ scale: heroScale, opacity: heroOpacity, y: heroTranslateY }}
      className="relative min-h-screen w-full flex flex-col justify-between pt-20 sm:pt-28 pb-8 sm:pb-12 px-3 sm:px-6 md:px-12 lg:px-16 overflow-hidden select-none"
    >
      {/* Top Meta Bar */}
      <div className="relative z-10 w-full max-w-[1700px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 border-b border-white/[0.08] pb-3 sm:pb-6 text-[10px] sm:text-xs font-mono tracking-widest text-neutral-400">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-neutral-400 max-w-full">
          <div className="flex items-center gap-1.5 text-neutral-400 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>MYSURU, KARNATAKA, INDIA</span>
          </div>
          <span className="hidden sm:inline text-neutral-600">•</span>
          <a
            href="https://mitt.edu.in/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => onHoverAction?.('COLLEGE')}
            onMouseLeave={onHoverEnd}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-[#00f0ff] transition-colors truncate max-w-[240px] xs:max-w-xs sm:max-w-none"
            title="Maharaja Institute of Technology Tandavapura (https://mitt.edu.in/)"
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#00f0ff] shrink-0" />
            <span className="truncate">Maharaja Institute of Technology Tandavapura</span>
            <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
          </a>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <span className="hidden sm:inline-block text-neutral-400">PORTFOLIO VOL. XXIV</span>
        </div>
      </div>

      {/* Main Massive Editorial Hero Composition */}
      <div className="relative z-10 w-full max-w-[1700px] mx-auto my-auto py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
        {/* Left / Center Column: Colossal Split Headline */}
        <div className="lg:col-span-8 flex flex-col">
          {/* Roles Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 mb-3 sm:mb-4 md:mb-6"
          >
            {PERSONAL_INFO.roles.map((role) => (
              <span
                key={role}
                className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[10px] sm:text-[11px] md:text-xs font-mono uppercase tracking-wider text-neutral-300 backdrop-blur-sm"
              >
                {role}
              </span>
            ))}
          </motion.div>

          {/* Colossal Name Protected by Interactive Foggy Glass: KISHAN H.P. */}
          <FoggyGlassName onHoverAction={onHoverAction} onHoverEnd={onHoverEnd} />

          {/* Statement & Bio Lead */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-5 sm:mt-6 md:mt-8 max-w-2xl"
          >
            <p className="font-serif-editorial text-xl sm:text-2xl md:text-3xl lg:text-4xl italic text-neutral-200 leading-snug font-light">
              &ldquo;{PERSONAL_INFO.heroTagline}&rdquo;
            </p>

            <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 w-full">
              <button
                id="hero-explore-btn"
                onClick={scrollToWork}
                onMouseEnter={() => onHoverAction?.('WORK')}
                onMouseLeave={onHoverEnd}
                className="group flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 xs:px-4 sm:px-6 py-2 sm:py-3.5 rounded-full bg-white text-black font-condensed tracking-wider uppercase text-xs sm:text-sm font-bold hover:bg-[#00f0ff] hover:text-black transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] cursor-pointer"
              >
                <span>EXPLORE WORK</span>
                <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1" />
              </button>

              <button
                id="hero-contact-btn"
                onClick={onOpenContact}
                onMouseEnter={() => onHoverAction?.('EMAIL')}
                onMouseLeave={onHoverEnd}
                className="flex items-center justify-center px-3.5 xs:px-4 sm:px-6 py-2 sm:py-3.5 rounded-full border border-white/20 bg-black/40 hover:border-[#00f0ff] hover:text-[#00f0ff] text-white font-condensed tracking-wider uppercase text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer"
              >
                INITIATE CONTACT
              </button>

              <button
                id="hero-talk-to-him-btn"
                onClick={() => {
                  if (onOpenTalkToHim) onOpenTalkToHim();
                  window.dispatchEvent(new CustomEvent('open-talk-to-him'));
                  window.dispatchEvent(new CustomEvent('open-talk-together'));
                }}
                onMouseEnter={() => onHoverAction?.('TALK')}
                onMouseLeave={onHoverEnd}
                className="group flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 xs:px-4 sm:px-6 py-2 sm:py-3.5 rounded-full border border-emerald-500/50 bg-emerald-500/15 hover:bg-emerald-500 hover:text-black text-emerald-400 font-condensed tracking-wider uppercase text-xs sm:text-sm font-bold transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.25)] cursor-pointer"
                title="Talk directly to Kishan H.P"
              >
                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:scale-125" />
                <span>TALK TO HIM</span>
              </button>

              <button
                id="hero-resume-btn"
                onClick={() => {
                  if (onOpenResume) onOpenResume();
                  window.dispatchEvent(new CustomEvent('open-resume'));
                }}
                onMouseEnter={() => onHoverAction?.('RESUME')}
                onMouseLeave={onHoverEnd}
                className="group flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 xs:px-4 sm:px-6 py-2 sm:py-3.5 rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/10 hover:bg-[#00f0ff] hover:text-black text-[#00f0ff] font-condensed tracking-wider uppercase text-xs sm:text-sm font-bold transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.25)] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                <span>RESUME [PDF]</span>
              </button>

              <button
                id="hero-thunder-btn"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('unleash-thunder', {
                      detail: {
                        x: window.innerWidth * 0.5,
                        y: 120,
                        tx: window.innerWidth * 0.65,
                        ty: window.innerHeight * 0.75,
                      },
                    })
                  );
                }}
                onMouseEnter={() => onHoverAction?.('THUNDER')}
                onMouseLeave={onHoverEnd}
                className="group flex items-center justify-center gap-1.5 sm:gap-2 px-3 xs:px-3.5 sm:px-5 py-2 sm:py-3.5 rounded-full border border-[#7000ff]/50 bg-[#7000ff]/15 hover:bg-[#00f0ff] hover:text-black text-[#00f0ff] font-condensed tracking-wider uppercase text-xs sm:text-sm font-bold transition-all duration-300 shadow-[0_0_25px_rgba(112,0,255,0.3)] cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00f0ff] group-hover:text-black transition-transform duration-300 group-hover:scale-125" />
                <span>UNLEASH THUNDER</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Interactive Cinematic Artwork Visual */}
        <div
          className="lg:col-span-4 relative flex justify-center lg:justify-end"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            style={{
              y: visualParallaxY,
              transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="relative w-full max-w-[420px] min-h-[460px] sm:min-h-0 sm:aspect-[4/5] rounded-2xl overflow-hidden border border-white/15 bg-neutral-950 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.8)] glow-aqua-subtle transition-transform duration-200"
            onMouseEnter={() => onHoverAction?.('EXPLORE')}
            onMouseLeave={onHoverEnd}
          >
            {/* Interactive Cybernetic Telemetry Console - J.A.R.V.I.S. Architecture */}
            <JarvisConsole
              onOpenContact={onOpenContact}
              onOpenTalkToHim={onOpenTalkToHim}
              onOpenResume={onOpenResume}
              onHoverAction={onHoverAction}
              onHoverEnd={onHoverEnd}
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom Scroll Prompt Bar */}
      <div className="relative z-10 w-full max-w-[1700px] mx-auto flex items-center justify-between pt-4 border-t border-white/[0.06] text-xs font-mono text-neutral-500">
        <div className="flex items-center gap-3">
          <span className="text-[#00f0ff]">[01]</span>
          <span className="tracking-wider uppercase">SCROLL TO DISCOVER PROJECTS</span>
        </div>

        <button
          onClick={scrollToWork}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors uppercase tracking-widest cursor-pointer"
        >
          <span>PROCEED DOWN</span>
          <span className="inline-block w-8 h-[1px] bg-neutral-600 hover:bg-[#00f0ff] transition-colors" />
        </button>
      </div>
    </motion.section>
  );
};
