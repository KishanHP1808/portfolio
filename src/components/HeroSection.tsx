import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDownRight, Compass, Sparkles, MapPin, Terminal, Cpu, Code2, Download, Zap } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { FoggyGlassName } from './FoggyGlassName';

interface HeroSectionProps {
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
  onOpenContact?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onHoverAction,
  onHoverEnd,
  onOpenContact,
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
      className="relative min-h-screen w-full flex flex-col justify-between pt-28 pb-12 px-6 md:px-12 lg:px-16 overflow-hidden select-none"
    >
      {/* Top Meta Bar */}
      <div className="relative z-10 w-full max-w-[1700px] mx-auto flex items-center justify-between gap-4 border-b border-white/[0.08] pb-6 text-xs font-mono tracking-widest text-neutral-400">
        <div className="flex items-center gap-1 text-neutral-400">
          <MapPin className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>MYSURU, KARNATAKA, INDIA</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="hidden sm:inline-block text-neutral-400">PORTFOLIO VOL. XXIV</span>
        </div>
      </div>

      {/* Main Massive Editorial Hero Composition */}
      <div className="relative z-10 w-full max-w-[1700px] mx-auto my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
        {/* Left / Center Column: Colossal Split Headline */}
        <div className="lg:col-span-8 flex flex-col">
          {/* Roles Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6"
          >
            {PERSONAL_INFO.roles.map((role, idx) => (
              <span
                key={role}
                className="px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[11px] md:text-xs font-mono uppercase tracking-wider text-neutral-300 backdrop-blur-sm"
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
            className="mt-6 md:mt-8 max-w-2xl"
          >
            <p className="font-serif-editorial text-2xl md:text-3xl lg:text-4xl italic text-neutral-200 leading-snug font-light">
              &ldquo;{PERSONAL_INFO.heroTagline}&rdquo;
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                id="hero-explore-btn"
                onClick={scrollToWork}
                onMouseEnter={() => onHoverAction?.('WORK')}
                onMouseLeave={onHoverEnd}
                className="group flex items-center gap-3 px-6 py-3.5 rounded-full bg-white text-black font-condensed tracking-wider uppercase text-sm font-bold hover:bg-[#00f0ff] hover:text-black transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] cursor-pointer"
              >
                <span>EXPLORE WORK</span>
                <ArrowDownRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1" />
              </button>

              <button
                id="hero-contact-btn"
                onClick={onOpenContact}
                onMouseEnter={() => onHoverAction?.('EMAIL')}
                onMouseLeave={onHoverEnd}
                className="px-6 py-3.5 rounded-full border border-white/20 bg-black/40 hover:border-[#00f0ff] hover:text-[#00f0ff] text-white font-condensed tracking-wider uppercase text-sm font-semibold transition-all duration-300 cursor-pointer"
              >
                INITIATE CONTACT
              </button>

              <button
                id="hero-resume-btn"
                onClick={() => window.dispatchEvent(new CustomEvent('open-resume'))}
                onMouseEnter={() => onHoverAction?.('RESUME')}
                onMouseLeave={onHoverEnd}
                className="group flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/10 hover:bg-[#00f0ff] hover:text-black text-[#00f0ff] font-condensed tracking-wider uppercase text-sm font-bold transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.25)] cursor-pointer"
              >
                <Download className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
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
                className="group flex items-center gap-2 px-5 py-3.5 rounded-full border border-[#7000ff]/50 bg-[#7000ff]/15 hover:bg-[#00f0ff] hover:text-black text-[#00f0ff] font-condensed tracking-wider uppercase text-sm font-bold transition-all duration-300 shadow-[0_0_25px_rgba(112,0,255,0.3)] cursor-pointer"
              >
                <Zap className="w-4 h-4 text-[#00f0ff] group-hover:text-black transition-transform duration-300 group-hover:scale-125" />
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
            className="relative w-full max-w-[420px] aspect-[4/5] rounded-2xl overflow-hidden border border-white/15 bg-neutral-950 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.8)] glow-aqua-subtle transition-transform duration-200"
            onMouseEnter={() => onHoverAction?.('EXPLORE')}
            onMouseLeave={onHoverEnd}
          >
            {/* Interactive Cybernetic Telemetry Console */}
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#040e1e] border border-white/10 p-5 flex flex-col justify-between">
              {/* Subtle ambient gradient & grid background */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              <div
                className="absolute inset-0 mix-blend-screen opacity-35 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 75% 25%, #00f0ff 0%, #0284c7 30%, transparent 70%)',
                }}
              />

              {/* Top HUD bar */}
              <div className="relative z-10 flex items-center justify-between text-[10px] font-mono tracking-widest text-white/70">
                <span className="flex items-center gap-1.5 bg-white/[0.04] backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-neutral-300">
                  <Terminal className="w-3 h-3 text-[#00f0ff]" />
                  SYS.DEV // CONSOLE
                </span>
                <span className="bg-cyan-500/10 text-[#00f0ff] px-2 py-1 rounded border border-cyan-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
                  120 FPS THUNDER
                </span>
              </div>

              {/* Center Procedural SVG Gyroscope & Radar Reticle */}
              <div className="relative z-10 my-auto py-3 flex flex-col items-center justify-center">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                    {/* Outer dashed ring */}
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                      strokeDasharray="6 6"
                      className="animate-[spin_30s_linear_infinite]"
                      style={{ transformOrigin: 'center' }}
                    />
                    {/* Intermediate aqua arc ring */}
                    <circle
                      cx="100"
                      cy="100"
                      r="70"
                      stroke="#00f0ff"
                      strokeWidth="1.5"
                      strokeDasharray="20 40 60 20"
                      strokeOpacity="0.55"
                      className="animate-[spin_20s_linear_infinite_reverse]"
                      style={{ transformOrigin: 'center' }}
                    />
                    {/* Inner subtle circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="50"
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="1"
                    />
                    {/* High-speed inner reticle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="32"
                      stroke="#00f0ff"
                      strokeWidth="1.5"
                      strokeDasharray="4 8"
                      className="animate-[spin_10s_linear_infinite]"
                      style={{ transformOrigin: 'center' }}
                    />
                    {/* Core glowing dot */}
                    <circle cx="100" cy="100" r="4" fill="#00f0ff" className="animate-pulse" />
                    {/* Crosshairs */}
                    <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  </svg>
                  {/* Center Floating Icon */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Code2 className="w-5 h-5 text-white/40" />
                  </div>
                </div>

                {/* Minimal terminal code snippet */}
                <div className="w-full mt-2 p-3 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] leading-relaxed text-neutral-300">
                  <div className="flex items-center justify-between text-neutral-500 mb-1 border-b border-white/5 pb-1 text-[10px]">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-2.5 h-2.5 text-[#00f0ff]" /> stack.json
                    </span>
                    <span className="text-[#00f0ff]">ACTIVE</span>
                  </div>
                  <div><span className="text-purple-400">const</span> <span className="text-cyan-300">craft</span> = [<span className="text-emerald-400">"React"</span>, <span className="text-emerald-400">"Next.js"</span>, <span className="text-emerald-400">"TypeScript"</span>];</div>
                  <div className="text-neutral-500">// Sub-50ms interaction target</div>
                </div>
              </div>

              {/* Bottom Telemetry Card Details */}
              <div className="relative z-10 p-4 rounded-xl bg-black/80 backdrop-blur-md border border-white/10">
                <div className="flex items-center justify-between mb-1 text-[11px] font-mono text-[#00f0ff]">
                  <span>SYSTEM READY</span>
                  <Sparkles className="w-3 h-3" />
                </div>
                <div className="font-condensed text-lg text-white font-bold tracking-wide">
                  DESIGN × ENGINEERING
                </div>
                <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                  Frontend • UI/UX Design • Full Stack
                </div>
              </div>
            </div>
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
