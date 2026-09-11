import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Sparkles, Code2, Compass, Layers, ShieldCheck, Camera, Palette, Film, Heart, ArrowUpRight } from 'lucide-react';
import { PERSONAL_INFO, FOCUS_AREAS, HOBBIES } from '../data/portfolioData';

interface AboutSectionProps {
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onHoverAction,
  onHoverEnd,
}) => {
  return (
    <section id="about" className="relative w-full py-28 md:py-36 px-6 md:px-12 lg:px-16 border-t border-white/10 select-none">
      <div className="max-w-[1700px] mx-auto">
        {/* Editorial Subheader */}
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#00f0ff] uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>EDITORIAL MONOGRAPH</span>
        </div>

        {/* Section Heading */}
        <div className="mb-16 md:mb-24">
          <h2 className="font-display text-5xl md:text-8xl lg:text-9xl text-white uppercase tracking-tighter">
            ABOUT ME
          </h2>
        </div>

        {/* Large Statement and Asymmetrical Bio Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start mb-24 md:mb-32">
          {/* Left: Giant Manifesto Quote */}
          <div className="lg:col-span-7">
            <h3 className="font-serif-editorial text-3xl md:text-5xl lg:text-6xl text-white font-light italic leading-tight mb-8">
              &ldquo;{PERSONAL_INFO.aboutHeadline}&rdquo;
            </h3>

            <p className="text-neutral-300 text-lg md:text-xl leading-relaxed font-light mb-6">
              {PERSONAL_INFO.aboutDescription}
            </p>

            <p className="text-neutral-400 text-base leading-relaxed">
              Based in the heritage tech hub of Mysuru, Karnataka, Kishan approaches every interface as both a gallery installation and a precision tool. He rejects the compromise between visual grandeur and runtime velocity, ensuring every layout responds with sub-frame fluidness.
            </p>

            {/* Geographical & Availability Pill */}
            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02]">
                <MapPin className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span className="text-neutral-300">{PERSONAL_INFO.location}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-[#00f0ff]">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
                <span>OPEN FOR SELECT OPPORTUNITIES</span>
              </div>
            </div>
          </div>

          {/* Right: Studio Discipline & Architectural Manifesto Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-950 p-8 shadow-2xl flex flex-col justify-between min-h-[460px]">
              {/* Background geometric accents */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f0ff]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between pb-6 border-b border-white/10 text-[11px] font-mono tracking-widest text-neutral-400">
                  <span className="flex items-center gap-2 text-[#00f0ff]">
                    <span className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]" />
                    PRACTICE DISCIPLINE
                  </span>
                  <span>MYSURU // 2026</span>
                </div>

                <div className="mt-8 space-y-6">
                  <div>
                    <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-1">
                      01 / DESIGN PHILOSOPHY
                    </div>
                    <p className="text-sm font-sans text-neutral-300 leading-relaxed">
                      "Interfaces should feel weightless. Every gesture, micro-interaction, and layout shift must serve a cognitive purpose, eliminating friction between the human mind and digital software."
                    </p>
                  </div>

                  <div>
                    <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-1">
                      02 / ENGINEERING RIGOR
                    </div>
                    <p className="text-sm font-sans text-neutral-300 leading-relaxed">
                      "Writing declarative, strictly typed, production-ready code with sub-50ms target responses, accessible semantics, and fluid frame rates."
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-condensed text-lg text-white font-bold tracking-wide">
                    {PERSONAL_INFO.name}
                  </div>
                  <div className="font-mono text-xs text-neutral-400 mt-0.5">
                    {PERSONAL_INFO.locationShort} • {PERSONAL_INFO.coordinates}
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-full border border-white/15 bg-white/[0.04] text-[10px] font-mono text-neutral-300 uppercase tracking-wider">
                  STUDIO PRACTICE
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Focus Areas: Not generic resume bullet points! Editorial 6-segment grid */}
        <div className="pt-12 border-t border-white/10">
          <div className="flex items-center justify-between mb-12">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#00f0ff]">
              CORE FOCUS AREAS
            </h3>
            <span className="font-mono text-xs text-neutral-500">
              SIX PILLARS OF PRACTICE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FOCUS_AREAS.map((area) => (
              <div
                key={area.number}
                onMouseEnter={() => onHoverAction?.(area.title.split(' ')[0])}
                onMouseLeave={onHoverEnd}
                className="group relative p-8 rounded-2xl border border-white/10 bg-white/[0.015] hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/[0.03] transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6 font-mono text-xs">
                    <span className="text-neutral-500 group-hover:text-[#00f0ff] transition-colors">
                      {area.number}
                    </span>
                    <span className="text-neutral-600">PRACTICE</span>
                  </div>

                  <h4 className="font-display text-2xl md:text-3xl text-white uppercase tracking-tight mb-3 group-hover:text-[#00f0ff] transition-colors">
                    {area.title}
                  </h4>

                  <p className="text-neutral-400 text-sm leading-relaxed font-light">
                    {area.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span>DISCIPLINE VERIFIED</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]/60 group-hover:scale-150 transition-transform shadow-[0_0_6px_#00f0ff]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dedicated Hobbies Column: Capturing Pictures, Drawing Portraits, Movies, Exploring Places & Much More */}
        <div id="hobbies-column" className="mt-20 pt-16 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#00f0ff] uppercase mb-2">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>BEYOND ENGINEERING // PASSIONS & PURSUITS</span>
              </div>
              <h3 className="font-display text-4xl md:text-6xl text-white uppercase tracking-tighter">
                HOBBIES & CREATIVE INSTINCTS
              </h3>
            </div>
            <p className="max-w-md text-neutral-400 text-sm font-light leading-relaxed">
              Tactile, visual, and organic disciplines that cultivate Kishan's aesthetic eye, patience, and meticulous craft outside the terminal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOBBIES.map((hobby, index) => {
              const getIcon = () => {
                switch (hobby.iconName) {
                  case 'Camera':
                    return <Camera className="w-5 h-5 text-[#00f0ff]" />;
                  case 'Palette':
                    return <Palette className="w-5 h-5 text-[#a855f7]" />;
                  case 'Film':
                    return <Film className="w-5 h-5 text-[#f59e0b]" />;
                  case 'Compass':
                    return <Compass className="w-5 h-5 text-[#10b981]" />;
                  default:
                    return <Sparkles className="w-5 h-5 text-[#ec4899]" />;
                }
              };

              const isPortraitOrPhoto = hobby.id === 'drawing-portrait' || hobby.id === 'capturing-pictures';

              return (
                <div
                  key={hobby.id}
                  id={`hobby-card-${hobby.id}`}
                  onMouseEnter={() => onHoverAction?.(hobby.title.toUpperCase())}
                  onMouseLeave={onHoverEnd}
                  className={`group relative p-8 rounded-2xl border transition-all duration-500 flex flex-col justify-between overflow-hidden ${
                    index === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                  } ${
                    isPortraitOrPhoto
                      ? 'border-white/15 bg-gradient-to-b from-white/[0.04] to-white/[0.01] hover:border-[#00f0ff]/60'
                      : 'border-white/10 bg-white/[0.015] hover:border-white/30'
                  }`}
                  style={{
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  {/* Subtle top corner gradient glow */}
                  <div
                    className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                    style={{ backgroundColor: hobby.accentColor }}
                  />

                  <div>
                    {/* Card Header: Icon & Category */}
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${hobby.accentColor}15` }}
                      >
                        {getIcon()}
                      </div>
                      <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.02]">
                        {hobby.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-display text-2xl md:text-3xl text-white uppercase tracking-tight mb-2 group-hover:text-white transition-colors flex items-center gap-2">
                      <span>{hobby.title}</span>
                    </h4>

                    {/* Tagline */}
                    <p className="text-neutral-300 text-sm leading-relaxed mb-6 font-light">
                      {hobby.tagline}
                    </p>

                    {/* Bullet details */}
                    <div className="space-y-2 pt-4 border-t border-white/10">
                      {hobby.details.map((item, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2.5 text-xs text-neutral-400 font-mono">
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                            style={{ backgroundColor: hobby.accentColor }}
                          />
                          <span className="leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span className="uppercase text-[10px] tracking-widest text-neutral-400">
                      CREATIVE ESSENCE
                    </span>
                    <span
                      className="w-2 h-2 rounded-full group-hover:scale-150 transition-transform shadow-[0_0_8px_currentColor]"
                      style={{ color: hobby.accentColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
