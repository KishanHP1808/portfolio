import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { EXPERIENCES } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';

interface ExperienceTimelineProps {
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({
  onHoverAction,
  onHoverEnd,
}) => {
  const { t, isKannada } = useLanguage();

  return (
    <section id="experience" className="relative w-full py-28 md:py-36 px-6 md:px-12 lg:px-16 border-t border-white/10 select-none">
      <div className="max-w-[1700px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 md:mb-28 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#00f0ff] uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.experience.badge}</span>
            </div>
            <h2 className="font-display text-5xl md:text-8xl lg:text-9xl text-white uppercase tracking-tighter">
              {t.experience.title}
            </h2>
          </div>

          <div className="font-mono text-xs text-neutral-400">
            <span>CAREER MILESTONES [2025 - 2026]</span>
          </div>
        </motion.div>

        {/* Minimal Editorial Timeline with Colossal Year Numbers */}
        <div className="space-y-16 md:space-y-24">
          {EXPERIENCES.map((exp, idx) => (
            <motion.div
              key={exp.year}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => onHoverAction?.(exp.year)}
              onMouseLeave={onHoverEnd}
              className="group relative pt-8 border-t border-white/10 hover:border-[#00f0ff]/60 transition-colors duration-500"
            >
              {/* Subtle timeline glowing tracer node */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.12 + 0.1 }}
                className="absolute -top-1.5 left-0 w-3 h-3 rounded-full bg-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.8)]"
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                {/* Huge Year Number - Fades and slides in from left on scroll */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.75, delay: idx * 0.12 + 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="lg:col-span-4 flex items-baseline justify-between lg:block"
                >
                  <div className="font-display text-6xl md:text-8xl lg:text-9xl text-neutral-600 group-hover:text-white transition-colors duration-500 tracking-tighter leading-none">
                    {exp.year}
                  </div>
                  <div className="font-mono text-xs text-[#00f0ff] tracking-widest uppercase mt-3 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#00f0ff]" />
                    <span>{exp.period} • {exp.type}</span>
                  </div>
                </motion.div>

                {/* Role Details and Achievements - Fades and slides in from right/bottom on scroll */}
                <motion.div
                  initial={{ opacity: 0, x: 35 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.75, delay: idx * 0.12 + 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="lg:col-span-8 space-y-6"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, delay: idx * 0.12 + 0.2, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h3 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-white mb-2 group-hover:text-[#00f0ff] transition-colors">
                      {exp.role}
                    </h3>
                    <div className="font-mono text-xs tracking-wider text-neutral-400">
                      {exp.company}
                    </div>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, delay: idx * 0.12 + 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="text-neutral-300 text-base md:text-lg leading-relaxed font-light"
                  >
                    {exp.description}
                  </motion.p>

                  {/* Bullet Highlights - Staggered fade and slide in on scroll */}
                  <div className="space-y-2.5 pt-2">
                    {exp.achievements.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 25 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{
                          duration: 0.55,
                          delay: idx * 0.1 + 0.25 + i * 0.08,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="flex items-start gap-3 text-sm text-neutral-400"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#00f0ff] mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Technology Tags - Staggered fade and slide up on scroll */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.6, delay: idx * 0.12 + 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-wrap gap-2 pt-4"
                  >
                    {exp.technologies.map((tech, techIdx) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0.88 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: '-30px' }}
                        transition={{ duration: 0.4, delay: idx * 0.1 + 0.35 + techIdx * 0.04 }}
                        className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-xs font-mono text-neutral-400 hover:border-[#00f0ff]/40 hover:text-white transition-colors"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
