import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Terminal,
  ArrowUpRight,
  Check,
  Github,
  FolderGit2,
  GitBranch,
  Star,
  ExternalLink,
  X,
  Code2,
  Layers
} from 'lucide-react';
import { SKILLS } from '../data/portfolioData';
import { SkillItem, GitWork } from '../types';

interface SkillsSectionProps {
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  onHoverAction,
  onHoverEnd,
}) => {
  // Default to Python or React
  const [activeSkill, setActiveSkill] = useState<SkillItem>(SKILLS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [inspectModalSkill, setInspectModalSkill] = useState<SkillItem | null>(null);
  const [isUserInteracting, setIsUserInteracting] = useState<boolean>(false);
  const gitWorkSectionRef = useRef<HTMLDivElement>(null);

  const categories = ['ALL', 'Frontend', 'Backend', 'AI & ML', 'Tools & Architecture', 'Design'];

  const filteredSkills =
    selectedCategory === 'ALL'
      ? SKILLS
      : SKILLS.filter((s) => s.category === selectedCategory);

  // Auto-cycle dominant skill slowly ONLY if user is not actively interacting
  useEffect(() => {
    if (isUserInteracting || inspectModalSkill) return;

    const interval = setInterval(() => {
      setActiveSkill((prev) => {
        const currentIndex = SKILLS.findIndex((s) => s.name === prev.name);
        const nextIndex = (currentIndex + 1) % SKILLS.length;
        return SKILLS[nextIndex];
      });
    }, 5500);

    return () => clearInterval(interval);
  }, [isUserInteracting, inspectModalSkill]);

  const handleSelectSkill = (skill: SkillItem, openModal = false) => {
    setActiveSkill(skill);
    setIsUserInteracting(true);
    if (openModal) {
      setInspectModalSkill(skill);
    }
  };

  // Close modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setInspectModalSkill(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section
      id="skills"
      className="relative w-full py-28 md:py-36 px-6 md:px-12 lg:px-16 border-t border-white/10 select-none overflow-hidden"
    >
      <div className="max-w-[1700px] mx-auto">
        {/* Header Metadata */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#00f0ff] uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TECHNICAL ARSENAL // VERIFIED ON GITHUB</span>
            </div>
            <h2 className="font-display text-5xl md:text-8xl lg:text-9xl text-white uppercase tracking-tighter">
              CAPABILITIES
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            {/* GitHub Profile Callout */}
            <a
              id="github-profile-link-skills"
              href="https://github.com/KishanHP1808"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.03] text-xs font-mono text-neutral-300 hover:text-white hover:border-[#00f0ff] transition-colors"
            >
              <Github className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span>GITHUB: KishanHP1808</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-500 group-hover:text-white transition-colors" />
            </a>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {categories.map((cat) => (
                <button
                  key={cat}
                  id={`skill-filter-${cat.toLowerCase().replace(/[\s&]+/g, '-')}`}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setIsUserInteracting(true);
                  }}
                  className={`px-4 py-2 rounded-full border transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'border-[#00f0ff] bg-[#00f0ff]/15 text-[#00f0ff] font-semibold shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                      : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white hover:border-white/30'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Dominant Skill Hero Display */}
        <div className="relative w-full rounded-3xl border border-white/15 bg-neutral-950/90 p-6 md:p-12 lg:p-14 mb-16 overflow-hidden glow-aqua-subtle">
          {/* Subtle background ambient glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00f0ff]/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Giant Display Name and highlight */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 font-mono text-xs text-[#00f0ff] mb-3 tracking-widest uppercase">
                <Terminal className="w-4 h-4" />
                <span>DOMINANT CAPABILITY • {activeSkill.category}</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSkill.name}
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -25, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <h3 className="font-display text-5xl md:text-7xl lg:text-8xl uppercase text-white tracking-tighter leading-none mb-4">
                    {activeSkill.name}
                  </h3>
                  <p className="text-neutral-300 font-serif-editorial italic text-xl md:text-2xl lg:text-3xl max-w-2xl font-light mb-6">
                    &ldquo;{activeSkill.highlight}&rdquo;
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <button
                  id="inspect-git-work-btn"
                  onClick={() => handleSelectSkill(activeSkill, true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00f0ff] text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#38bdf8] transition-colors cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                >
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>INSPECT GIT WORK IN DETAIL</span>
                </button>

                {activeSkill.gitWorks && activeSkill.gitWorks.length > 0 && (
                  <a
                    id="open-repo-direct-link"
                    href={activeSkill.gitWorks[0].repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/5 text-white font-mono text-xs uppercase tracking-wider hover:border-white hover:bg-white/10 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5 text-neutral-300" />
                    <span>OPEN REPO: {activeSkill.gitWorks[0].repoName.replace('KishanHP1808/', '')}</span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                  </a>
                )}
              </div>
            </div>

            {/* Right: Telemetry & Spec Card */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                  PROFICIENCY SPECS
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] font-mono text-[11px] font-bold">
                  {activeSkill.level}
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-neutral-500">CATEGORY</span>
                  <span className="text-white font-medium">{activeSkill.category}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-neutral-500">GITHUB EVIDENCE</span>
                  <span className="text-[#00f0ff] font-medium">
                    {activeSkill.gitWorks?.length || 1} Linked Repository
                    {(activeSkill.gitWorks?.length || 1) > 1 ? 'ies' : 'y'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-neutral-500">WORKSPACE</span>
                  <span className="text-neutral-300">KishanHP1808</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                <Check className="w-3.5 h-3.5 text-[#00f0ff] shrink-0" />
                <span>Verified in production codebases on GitHub</span>
              </div>
            </div>
          </div>

          {/* VERIFIED GITHUB WORK SHOWCASE BLOCK */}
          <div
            ref={gitWorkSectionRef}
            className="mt-10 pt-8 border-t border-white/10 relative"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-300">
                <FolderGit2 className="w-4 h-4 text-[#00f0ff]" />
                <span className="text-white font-semibold">
                  WORK ON GITHUB FOR {activeSkill.name.toUpperCase()}
                </span>
                <span className="text-neutral-500">//</span>
                <span className="text-neutral-400">ACCOUNT: KishanHP1808</span>
              </div>
              <span className="text-[11px] font-mono text-neutral-500">
                Click any repository or link below to inspect code on GitHub
              </span>
            </div>

            {/* Repositories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeSkill.gitWorks && activeSkill.gitWorks.length > 0 ? (
                activeSkill.gitWorks.map((work, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl border border-white/10 bg-black/40 hover:border-[#00f0ff]/50 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Repo Header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <Github className="w-4 h-4 text-[#00f0ff] shrink-0" />
                          <span className="font-mono text-xs text-white font-bold truncate">
                            {work.repoName.replace('KishanHP1808/', '')}
                          </span>
                        </div>
                        {work.primaryLanguage && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-300 shrink-0">
                            {work.primaryLanguage}
                          </span>
                        )}
                      </div>

                      {/* Usage / Role */}
                      <p className="text-xs font-mono text-[#00f0ff] mb-3">
                        {work.roleOrUsage}
                      </p>

                      {/* Key Implementations list */}
                      <ul className="space-y-1.5 mb-4">
                        {work.keyImplementations.map((impl, i) => (
                          <li
                            key={i}
                            className="text-[11px] text-neutral-400 flex items-start gap-1.5 leading-relaxed"
                          >
                            <span className="text-[#00f0ff] mt-0.5">•</span>
                            <span>{impl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Links */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                      <a
                        href={work.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-300 hover:text-white group-hover:text-[#00f0ff] transition-colors"
                      >
                        <span>VIEW REPO</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>

                      {work.liveUrl && (
                        <a
                          href={work.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-cyan-400 transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
                          <span>LIVE DEMO</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                /* Fallback general GitHub work card */
                <div className="col-span-full p-5 rounded-xl border border-white/10 bg-black/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-xs text-white font-bold mb-1">
                      <Github className="w-4 h-4 text-[#00f0ff]" />
                      <span>KishanHP1808 / Full Stack & Core Systems Repositories</span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      Applied across Kishan&apos;s active GitHub repositories and technical projects.
                    </p>
                  </div>
                  <a
                    href="https://github.com/KishanHP1808"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 text-xs font-mono text-white hover:border-[#00f0ff] transition-colors"
                  >
                    <span>BROWSE GITHUB</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Typography Skill Matrix (Click or press to inspect GitHub work) */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="text-xs font-mono tracking-widest uppercase text-neutral-400 flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span>
                SELECT ANY SKILL BELOW TO SHOW REPOSITORIES ON GITHUB ({filteredSkills.length} SKILLS)
              </span>
            </div>
            <span className="text-[11px] font-mono text-neutral-500">
              [Press card to view work // Click Git mark to open code directly]
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredSkills.map((skill) => {
              const isSelected = activeSkill.name === skill.name;
              const repoCount = skill.gitWorks?.length || 1;
              const firstRepo = skill.gitWorks?.[0];

              return (
                <div
                  key={skill.name}
                  id={`skill-card-${skill.name.toLowerCase().replace(/[\s&/]+/g, '-')}`}
                  onClick={() => handleSelectSkill(skill)}
                  onMouseEnter={() => {
                    handleSelectSkill(skill);
                    onHoverAction?.(skill.name);
                  }}
                  onMouseLeave={onHoverEnd}
                  className={`group relative p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#00f0ff] bg-[#00f0ff]/10 text-white shadow-[0_0_35px_rgba(0,240,255,0.3)]'
                      : 'border-white/10 bg-white/[0.02] text-neutral-300 hover:border-white/30 hover:bg-white/[0.05]'
                  }`}
                >
                  <div>
                    {/* Top Row: Category and Git indicator */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded ${
                          isSelected
                            ? 'bg-[#00f0ff] text-black font-bold'
                            : 'bg-white/5 text-neutral-400'
                        }`}
                      >
                        {skill.category}
                      </span>

                      {firstRepo && (
                        <a
                          href={firstRepo.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title={`Open ${firstRepo.repoName} on GitHub`}
                          className="p-1 rounded-md text-neutral-500 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Github className="w-3.5 h-3.5 text-[#00f0ff]" />
                        </a>
                      )}
                    </div>

                    {/* Skill Title */}
                    <h4 className="font-display text-2xl md:text-3xl uppercase tracking-tight text-white group-hover:text-[#00f0ff] transition-colors leading-tight mb-2">
                      {skill.name}
                    </h4>

                    {/* Skill Brief */}
                    <p className="text-xs text-neutral-400 line-clamp-2 mb-4">
                      {skill.highlight}
                    </p>
                  </div>

                  {/* Bottom: Repos Count & Open Work CTA */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-neutral-500">
                      {repoCount} {repoCount === 1 ? 'Repo' : 'Repos'} on Git
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectSkill(skill, true);
                      }}
                      className="inline-flex items-center gap-1 text-[#00f0ff] hover:underline font-semibold"
                    >
                      <span>INSPECT</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kinetic Infinite Typography Ticker */}
        <div className="relative w-full border-y border-white/10 py-6 overflow-hidden">
          <div className="flex whitespace-nowrap gap-12 animate-[marquee_25s_linear_infinite] select-none">
            {SKILLS.concat(SKILLS).map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-12 font-display text-4xl md:text-5xl uppercase text-neutral-600 hover:text-white transition-colors cursor-pointer"
                onClick={() => handleSelectSkill(s, true)}
              >
                <span>{s.name}</span>
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GIT WORK INSPECTOR MODAL */}
      <AnimatePresence>
        {inspectModalSkill && (
          <div
            id="git-work-modal-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md"
            onClick={() => setInspectModalSkill(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/20 bg-neutral-950 p-6 md:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.8)]"
            >
              {/* Close Button */}
              <button
                id="close-git-work-modal"
                onClick={() => setInspectModalSkill(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-neutral-400 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 font-mono text-xs text-[#00f0ff] uppercase tracking-widest mb-2">
                  <Github className="w-4 h-4" />
                  <span>KishanHP1808 // GITHUB WORK VERIFICATION</span>
                </div>
                <h3 className="font-display text-4xl md:text-6xl text-white uppercase tracking-tighter">
                  {inspectModalSkill.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-3 font-mono text-xs">
                  <span className="px-3 py-1 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] font-bold">
                    {inspectModalSkill.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-neutral-300">
                    Level: {inspectModalSkill.level}
                  </span>
                </div>
                <p className="mt-4 text-neutral-300 text-sm md:text-base italic font-serif-editorial">
                  &ldquo;{inspectModalSkill.highlight}&rdquo;
                </p>
              </div>

              {/* Repositories Breakdown */}
              <div className="space-y-6">
                <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-[#00f0ff]" />
                  <span>REPOSITORIES & IMPLEMENTATION PROOF ON GITHUB</span>
                </h4>

                {inspectModalSkill.gitWorks && inspectModalSkill.gitWorks.length > 0 ? (
                  inspectModalSkill.gitWorks.map((work: GitWork, idx: number) => (
                    <div
                      key={idx}
                      className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-[#00f0ff]/40 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Github className="w-4 h-4 text-[#00f0ff]" />
                            <h5 className="font-mono text-sm md:text-base font-bold text-white">
                              {work.repoName}
                            </h5>
                          </div>
                          <span className="text-xs font-mono text-[#00f0ff]">
                            {work.roleOrUsage}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {work.primaryLanguage && (
                            <span className="text-xs font-mono px-2.5 py-1 rounded bg-white/10 text-neutral-300">
                              {work.primaryLanguage}
                            </span>
                          )}
                          <a
                            href={work.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00f0ff] text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#38bdf8] transition-colors"
                          >
                            <span>VIEW ON GIT</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
                        <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                          Key Implementations & Source Evidence:
                        </span>
                        <ul className="space-y-2">
                          {work.keyImplementations.map((impl, i) => (
                            <li
                              key={i}
                              className="text-xs text-neutral-300 flex items-start gap-2 leading-relaxed font-sans"
                            >
                              <Check className="w-3.5 h-3.5 text-[#00f0ff] shrink-0 mt-0.5" />
                              <span>{impl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {work.liveUrl && (
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[11px] font-mono text-neutral-400">
                            Live Deployment Available:
                          </span>
                          <a
                            href={work.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:underline"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
                            <span>LAUNCH APPLICATION</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                    <p className="text-sm text-neutral-300 mb-4">
                      This capability is integrated throughout Kishan&apos;s GitHub profile and repositories under the account <span className="text-[#00f0ff] font-mono font-bold">KishanHP1808</span>.
                    </p>
                    <a
                      href="https://github.com/KishanHP1808"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00f0ff] text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#38bdf8] transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>VISIT KISHANHP1808 ON GITHUB</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
