import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { EXPERIENCES } from '../data/portfolioData';

interface ExperienceTimelineProps {
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({
  onHoverAction,
  onHoverEnd,
}) => {
  return (
    <section id="experience" className="relative w-full py-28 md:py-36 px-6 md:px-12 lg:px-16 border-t border-white/10 select-none">
      <div className="max-w-[1700px] mx-auto">
        {/* Section Header */}
        <div className="mb-20 md:mb-28 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#00f0ff] uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CHRONOLOGICAL TRAJECTORY</span>
            </div>
            <h2 className="font-display text-5xl md:text-8xl lg:text-9xl text-white uppercase tracking-tighter">
              EXPERIENCE
            </h2>
          </div>

          <div className="font-mono text-xs text-neutral-400">
            <span>CAREER MILESTONES [2024 — 2026]</span>
          </div>
        </div>

        {/* Minimal Editorial Timeline with Colossal Year Numbers */}
        <div className="space-y-16 md:space-y-24">
          {EXPERIENCES.map((exp, idx) => (
            <div
              key={exp.year}
              onMouseEnter={() => onHoverAction?.(exp.year)}
              onMouseLeave={onHoverEnd}
              className="group relative pt-8 border-t border-white/10 hover:border-[#00f0ff]/60 transition-colors duration-500"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                {/* Huge Year Number */}
                <div className="lg:col-span-4 flex items-baseline justify-between lg:block">
                  <div className="font-display text-6xl md:text-8xl lg:text-9xl text-neutral-600 group-hover:text-white transition-colors duration-500 tracking-tighter leading-none">
                    {exp.year}
                  </div>
                  <div className="font-mono text-xs text-[#00f0ff] tracking-widest uppercase mt-3">
                    {exp.period} • {exp.type}
                  </div>
                </div>

                {/* Role Details and Achievements */}
                <div className="lg:col-span-8 space-y-6">
                  <div>
                    <h3 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-white mb-2 group-hover:text-[#00f0ff] transition-colors">
                      {exp.role}
                    </h3>
                    <div className="font-mono text-xs tracking-wider text-neutral-400">
                      {exp.company}
                    </div>
                  </div>

                  <p className="text-neutral-300 text-base md:text-lg leading-relaxed font-light">
                    {exp.description}
                  </p>

                  {/* Bullet Highlights */}
                  <div className="space-y-2.5 pt-2">
                    {exp.achievements.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-neutral-400">
                        <CheckCircle2 className="w-4 h-4 text-[#00f0ff] mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-2 pt-4">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-xs font-mono text-neutral-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
