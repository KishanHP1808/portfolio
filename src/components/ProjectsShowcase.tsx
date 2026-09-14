import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Sparkles, ChevronRight, Eye } from 'lucide-react';
import { PROJECTS } from '../data/portfolioData';
import { Project } from '../types';
import { HoloTiltCard } from './HoloTiltCard';
import { ProjectLikeButton } from './ProjectLikeButton';

interface ProjectsShowcaseProps {
  onSelectProject: (project: Project) => void;
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
}

export const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({
  onSelectProject,
  onHoverAction,
  onHoverEnd,
}) => {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  return (
    <section id="work" className="relative w-full py-16 sm:py-24 md:py-36 px-3.5 sm:px-6 md:px-12 lg:px-16 select-none">
      {/* Editorial Section Header */}
      <div className="max-w-[1700px] mx-auto mb-12 sm:mb-20 md:mb-28 border-b border-white/10 pb-6 sm:pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#00f0ff] uppercase mb-2 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SELECTED REPERTOIRE</span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white uppercase tracking-tighter">
            FEATURED WORK
          </h2>
        </div>

        <div className="flex items-baseline gap-4 font-mono text-xs text-neutral-400">
          <span>CINEMATIC CASE STUDIES</span>
          <span className="text-[#00f0ff]">[01 — {PROJECTS.length.toString().padStart(2, '0')}]</span>
        </div>
      </div>

      {/* Cinematic Project Scenes (Sequential Full-Width Presentations) */}
      <div className="max-w-[1700px] mx-auto space-y-16 sm:space-y-28 md:space-y-48">
        {PROJECTS.map((project, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <div
              key={project.id}
              className="relative group"
              onMouseEnter={() => {
                setActiveProjectIndex(idx);
                onHoverAction?.('EXPLORE');
              }}
              onMouseLeave={onHoverEnd}
            >
              {/* Scene Container Grid */}
              <div
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Visual Imagery Column (Occupies 7 Columns with 3D Holographic Tilt) */}
                <div
                  className={`lg:col-span-7 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}
                  onClick={() => onSelectProject(project)}
                  onMouseEnter={() => onHoverAction?.('VIEW')}
                  onMouseLeave={onHoverEnd}
                >
                  <HoloTiltCard
                    tiltIntensity={9}
                    className="rounded-2xl border border-white/10 bg-neutral-950 glow-aqua-subtle transition-all duration-700 group-hover:border-[#00f0ff]/50 group-hover:shadow-[0_0_50px_rgba(0,240,255,0.35)]"
                  >
                    <div className="relative aspect-[16/10] md:aspect-[16/9] rounded-2xl overflow-hidden">
                      {/* Oversized Cinematic Photo with slow zoom on hover */}
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover object-center grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1600&auto=format&fit=crop';
                        }}
                      />

                      {/* Dark gradient lighting and subtle film overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-500 group-hover:opacity-60" />

                      {/* Edge-to-edge overlay with project tags & telemetry */}
                      <div className="absolute top-5 left-5 right-5 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-[#00f0ff] font-semibold">
                            PROJECT {project.number}
                          </span>
                          {project.liveUrl?.includes('onrender.com') && (
                            <span className="hidden sm:flex items-center gap-1.5 bg-cyan-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-500/30 text-[#00f0ff] text-[10px] font-mono">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
                              DEPLOYED ON RENDER
                            </span>
                          )}
                        </div>
                        <span className="bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-neutral-300">
                          {project.year}
                        </span>
                      </div>

                      {/* Interactive center reveal pill on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="px-6 py-3 rounded-full bg-[#00f0ff] text-black font-condensed tracking-widest uppercase font-bold text-sm flex items-center gap-2 shadow-[0_0_35px_rgba(0,240,255,0.85)] scale-90 group-hover:scale-100 transition-transform duration-300">
                          <Eye className="w-4 h-4" />
                          <span>OPEN CASE STUDY</span>
                        </div>
                      </div>

                      {/* Bottom strip inside image */}
                      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs font-mono text-neutral-400">
                        <span className="hidden sm:inline-block">{project.category}</span>
                        <span className="text-[#00f0ff]">{project.role}</span>
                      </div>
                    </div>
                  </HoloTiltCard>
                </div>

                {/* Editorial Typography Column (Occupies 5 Columns) */}
                <div
                  className={`lg:col-span-5 ${isEven ? 'lg:order-2' : 'lg:order-1'} flex flex-col justify-center`}
                >
                  {/* Project Number */}
                  <div className="font-mono text-sm tracking-[0.25em] text-[#00f0ff] mb-2">
                    PROJECT {project.number} / {PROJECTS.length.toString().padStart(2, '0')}
                  </div>

                  {/* Masked Title with bold condensed type */}
                  <div className="overflow-hidden mb-3 sm:mb-4">
                    <h3
                      onClick={() => onSelectProject(project)}
                      className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white uppercase tracking-tighter cursor-pointer hover:text-[#00f0ff] transition-colors duration-300"
                    >
                      {project.title}
                    </h3>
                  </div>

                  {/* Subtitle / Category statement */}
                  <p className="font-serif-editorial italic text-lg sm:text-xl md:text-2xl text-neutral-300 font-light mb-3 sm:mb-4">
                    {project.subtitle}
                  </p>

                  {/* Description paragraph */}
                  <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-5 sm:mb-6">
                    {project.description}
                  </p>

                  {/* Metadata spec pills */}
                  <div className="grid grid-cols-2 gap-4 py-3 sm:py-4 border-y border-white/10 mb-5 sm:mb-6 text-xs font-mono">
                    <div>
                      <div className="text-neutral-500 uppercase tracking-wider mb-1">Role</div>
                      <div className="text-neutral-200">{project.role}</div>
                    </div>
                    <div>
                      <div className="text-neutral-500 uppercase tracking-wider mb-1">Timeline</div>
                      <div className="text-neutral-200">{project.year} • Live</div>
                    </div>
                  </div>

                  {/* Technologies tags */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/10 bg-white/[0.03] text-[10px] sm:text-[11px] font-mono text-neutral-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Interactive CTA buttons */}
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        onMouseEnter={() => onHoverAction?.('LAUNCH')}
                        onMouseLeave={onHoverEnd}
                        className="group/live inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#00f0ff] text-black hover:bg-white transition-all duration-300 font-condensed tracking-wider uppercase text-xs sm:text-sm font-bold shadow-[0_0_25px_rgba(0,240,255,0.45)]"
                      >
                        <span>LAUNCH LIVE APP</span>
                        <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover/live:translate-x-1 group-hover/live:-translate-y-1" />
                      </a>
                    )}

                    <button
                      onClick={() => onSelectProject(project)}
                      onMouseEnter={() => onHoverAction?.('CASE')}
                      onMouseLeave={onHoverEnd}
                      className="group/btn inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border border-white/20 bg-white/5 hover:border-white hover:bg-white/10 transition-all duration-300 text-white font-condensed tracking-wider uppercase text-xs sm:text-sm font-semibold cursor-pointer"
                    >
                      <span>VIEW CASE STUDY</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 text-neutral-400 group-hover/btn:text-white" />
                    </button>

                    {/* Real-time Firebase Appreciation Endorsement */}
                    <ProjectLikeButton
                      projectId={project.id}
                      projectTitle={project.title}
                      onHoverAction={onHoverAction}
                      onHoverEnd={onHoverEnd}
                    />
                  </div>
                </div>
              </div>

              {/* Cinematic Scene Divider with coordinate line */}
              <div className="mt-20 md:mt-28 flex items-center justify-between text-[11px] font-mono text-neutral-600 border-t border-white/[0.06] pt-4">
                <span>SCENE 0{idx + 1}</span>
                <span className="hidden sm:inline-block">KISHAN H.P • DIGITAL PORTFOLIO</span>
                <span>STATUS: ARCHIVED & ACTIVE</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
