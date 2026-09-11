import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Github, CheckCircle2, Layers, Cpu, Compass } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onHoverAction,
  onHoverEnd,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-y-auto">
        {/* Dark blurred backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-white/15 rounded-2xl shadow-2xl p-6 md:p-10 z-10 custom-scrollbar"
        >
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
            <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-[#00f0ff]">
              <span>PROJECT {project.number}</span>
              <span className="text-neutral-600">•</span>
              <span className="text-neutral-400">{project.category}</span>
            </div>

            <button
              onClick={onClose}
              onMouseEnter={() => onHoverAction?.('CLOSE')}
              onMouseLeave={onHoverEnd}
              className="p-2 rounded-full border border-white/10 hover:border-[#00f0ff] hover:text-[#00f0ff] text-neutral-300 transition-colors cursor-pointer"
              aria-label="Close Case Study"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title & Headline */}
          <div className="mb-8">
            <h2 className="font-display text-4xl md:text-6xl text-white uppercase tracking-tighter mb-2">
              {project.title}
            </h2>
            <p className="text-neutral-400 text-lg md:text-xl font-light">
              {project.subtitle}
            </p>
          </div>

          {/* Hero Project Image with Cinematic Lighting */}
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-10 border border-white/10 bg-neutral-900">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (project.id === 'football-auction') {
                  target.src = 'https://wallpapers.com/images/featured/messi-4k-ultra-hd-t7otmb1xwl662a0r.jpg';
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-300">
              <span className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                ROLE: {project.role}
              </span>
              <span className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                YEAR: {project.year}
              </span>
            </div>
          </div>

          {/* Core Grid: Overview, Challenge & Solution */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
            {/* Left: Deep Dive Description */}
            <div className="md:col-span-8 space-y-6">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#00f0ff] mb-3 flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  EXECUTIVE SUMMARY
                </h3>
                <p className="text-neutral-300 leading-relaxed text-base">
                  {project.longDescription}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    THE CHALLENGE
                  </h4>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {project.challenge}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    THE SOLUTION
                  </h4>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              </div>

              {/* Key Deliverables Highlights */}
              <div className="pt-2">
                <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#00f0ff]" />
                  KEY ARCHITECTURAL HIGHLIGHTS
                </h3>
                <div className="space-y-2.5">
                  {project.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-[#00f0ff] mt-0.5 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Technologies & Actions */}
            <div className="md:col-span-4 space-y-6">
              <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10">
                <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#00f0ff]" />
                  TECHNOLOGIES
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-neutral-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => onHoverAction?.('LAUNCH')}
                    onMouseLeave={onHoverEnd}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#00f0ff] text-black font-condensed uppercase tracking-wider text-sm font-bold hover:bg-[#38bdf8] transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                  >
                    <span>VIEW LIVE APPLICATION</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => onHoverAction?.('CODE')}
                    onMouseLeave={onHoverEnd}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border border-white/20 bg-black/40 text-white font-condensed uppercase tracking-wider text-sm font-semibold hover:border-white transition-all"
                  >
                    <span>EXPLORE SOURCE CODE</span>
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
