import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X, Download, FileText, Sparkles, ExternalLink, FolderArchive } from 'lucide-react';
import { PERSONAL_INFO, CERTIFICATES_DRIVE_CONFIG } from '../data/portfolioData';
import { SoundDesign } from './SoundDesign';
import { ResumeModal } from './ResumeModal';
import { generateClientResumePDF } from '../utils/resumeGenerator';

interface NavbarProps {
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onHoverAction, onHoverEnd }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [mysuruTime, setMysuruTime] = useState('');

  // Live Mysuru (IST, UTC+5:30) Time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setMysuruTime(new Intl.DateTimeFormat('en-GB', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Track scroll state
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global listener to open resume from anywhere
  useEffect(() => {
    const handleOpenResume = () => setResumeOpen(true);
    window.addEventListener('open-resume', handleOpenResume);
    return () => window.removeEventListener('open-resume', handleOpenResume);
  }, []);

  // Close menu on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { label: 'WORK', href: '#work', number: '01' },
    { label: 'ABOUT', href: '#about', number: '02' },
    { label: 'SKILLS', href: '#skills', number: '03' },
    { label: 'EXPERIENCE', href: '#experience', number: '04' },
    { label: 'CERTIFICATES', href: '#certificates', number: '05' },
    { label: 'CONTACT', href: '#contact', number: '06' },
  ];

  const handleLinkClick = (href: string) => {
    setMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const link = document.createElement('a');
      link.href = '/Kishan_HP_Resume.pdf';
      link.download = 'Kishan_HP_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Trigger client generator fallback in parallel
      setTimeout(() => {
        generateClientResumePDF();
      }, 150);
    } catch {
      generateClientResumePDF();
    }
  };

  return (
    <>
      <header
        id="main-navigation"
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled
            ? 'py-4 bg-[#050505]/85 backdrop-blur-md border-b border-white/[0.07]'
            : 'py-6 md:py-8 bg-transparent'
        }`}
      >
        <div className="max-w-[1700px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Location & Time Indicator (Top Left) */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onMouseEnter={() => onHoverAction?.('TOP')}
            onMouseLeave={onHoverEnd}
            className="group flex items-center gap-2.5 text-white tracking-widest transition-colors cursor-pointer py-1"
          >
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_10px_#00f0ff] group-hover:scale-125 transition-transform duration-300" />
            <span className="text-xs font-mono text-neutral-300 tracking-widest font-medium group-hover:text-white transition-colors">
              MYSURU {mysuruTime ? `[${mysuruTime} IST]` : '[IST]'}
            </span>
          </a>

          {/* Center / Right controls */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-8">
            {/* Desktop Minimal Quick Links */}
            <nav className="hidden lg:flex items-center gap-8 text-xs font-mono tracking-widest text-neutral-400">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link.href)}
                  onMouseEnter={() => onHoverAction?.(link.label)}
                  onMouseLeave={onHoverEnd}
                  className="hover:text-white transition-colors relative py-1 group uppercase cursor-pointer"
                >
                  <span>{link.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#00f0ff] transition-all duration-300 group-hover:w-full shadow-[0_0_6px_#00f0ff]" />
                </button>
              ))}
            </nav>

            {/* Quick Resume Download Action in Header */}
            <button
              id="header-resume-download-btn"
              onClick={() => setResumeOpen(true)}
              onMouseEnter={() => onHoverAction?.('RESUME')}
              onMouseLeave={onHoverEnd}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/10 hover:bg-[#00f0ff] hover:text-black text-[#00f0ff] transition-all duration-300 font-condensed tracking-widest text-xs uppercase font-bold cursor-pointer glow-aqua-subtle"
              title="Download or Preview Official Resume (PDF)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>RESUME</span>
            </button>

            {/* Sound / Atmosphere Design Toggle */}
            <SoundDesign />

            {/* Editorial MENU Trigger Button */}
            <button
              id="menu-toggle-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              onMouseEnter={() => onHoverAction?.(menuOpen ? 'CLOSE' : 'MENU')}
              onMouseLeave={onHoverEnd}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:border-[#00f0ff] hover:bg-[#00f0ff]/10 text-white transition-all duration-300 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              <span className="font-condensed tracking-widest text-xs uppercase font-bold">
                {menuOpen ? 'CLOSE' : 'MENU'}
              </span>
              <div className="flex flex-col gap-1 w-4">
                <span
                  className={`h-[1.5px] bg-white transition-all duration-300 ${
                    menuOpen ? 'rotate-45 translate-y-[2.5px] bg-[#00f0ff]' : 'w-full'
                  }`}
                />
                <span
                  className={`h-[1.5px] bg-white transition-all duration-300 ${
                    menuOpen ? '-rotate-45 -translate-y-[2.5px] bg-[#00f0ff]' : 'w-2/3 self-end'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Fixed Anchored Navigation Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Darkened Backdrop Overlay */}
            <motion.div
              id="menu-backdrop-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[105] bg-black/70 backdrop-blur-sm"
            />

            {/* Fixed Menu Card anchored right below the header */}
            <motion.div
              id="fixed-navigation-menu"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-20 sm:top-24 right-4 sm:right-8 md:right-12 z-[110] w-[calc(100%-2rem)] sm:w-[480px] max-h-[calc(100vh-6.5rem)] overflow-y-auto rounded-3xl bg-[#080a10]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(0,240,255,0.15)] p-5 sm:p-6 select-none flex flex-col justify-between"
            >
              {/* Menu Header inside Card */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-3 text-xs font-mono tracking-widest text-neutral-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] animate-pulse" />
                  <span className="text-[#00f0ff] font-semibold">NAVIGATION & ARCHIVE</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-[11px] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>ESC</span>
                </button>
              </div>

              {/* Navigation Options - Listed directly at the top in one fixed place */}
              <div className="flex flex-col space-y-1">
                {navLinks.map((item, idx) => (
                  <motion.button
                    key={item.label}
                    type="button"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.18, delay: idx * 0.03 }}
                    onClick={() => handleLinkClick(item.href)}
                    onMouseEnter={() => onHoverAction?.(item.label)}
                    onMouseLeave={onHoverEnd}
                    className="w-full flex items-center justify-between py-2.5 px-3.5 rounded-2xl hover:bg-white/[0.06] hover:border hover:border-white/10 border border-transparent transition-all group cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="font-mono text-xs text-[#00f0ff] font-bold tracking-wider">
                        {item.number}
                      </span>
                      <span className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-neutral-200 group-hover:text-white group-hover:translate-x-1.5 transition-transform duration-200">
                        {item.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.label === 'CERTIFICATES' && (
                        <a
                          href={CERTIFICATES_DRIVE_CONFIG.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black font-mono text-[10px] tracking-wider uppercase transition-all"
                          title="Open Live Google Drive Vault"
                        >
                          <FolderArchive className="w-3 h-3" />
                          <span>DRIVE ↗</span>
                        </a>
                      )}
                      <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-[#00f0ff] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                    </div>
                  </motion.button>
                ))}

                {/* 07 RESUME Link & Card */}
                <div className="mt-2 pt-3 border-t border-white/10">
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#00f0ff]/30 transition-colors">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#00f0ff] font-bold">07</span>
                        <span className="font-display text-lg font-bold text-white uppercase tracking-tight">
                          RESUME [PDF]
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 text-[10px] font-mono">
                        ATS READY
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleQuickDownload}
                        onMouseEnter={() => onHoverAction?.('DOWNLOAD')}
                        onMouseLeave={onHoverEnd}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#00f0ff] hover:bg-white text-black font-condensed tracking-wider uppercase text-xs font-bold transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>DOWNLOAD PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          setResumeOpen(true);
                        }}
                        onMouseEnter={() => onHoverAction?.('PREVIEW')}
                        onMouseLeave={onHoverEnd}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-white/15 bg-white/5 hover:border-[#00f0ff] text-white font-condensed tracking-wider uppercase text-xs font-semibold transition-all duration-200 cursor-pointer"
                      >
                        <span>PREVIEW</span>
                        <ExternalLink className="w-3 h-3 text-neutral-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Footer inside card: Contact info & Socials */}
              <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-2.5 text-xs font-mono">
                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="text-neutral-500 uppercase tracking-wider">DIRECT:</span>
                  <a
                    href={`mailto:${PERSONAL_INFO.email}`}
                    className="text-white hover:text-[#00f0ff] transition-colors"
                  >
                    {PERSONAL_INFO.email}
                  </a>
                </div>

                <div className="flex items-center justify-between gap-3 text-[11px] text-neutral-400 pt-1">
                  <a
                    href={PERSONAL_INFO.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white uppercase transition-colors"
                  >
                    GitHub
                  </a>
                  <a
                    href={PERSONAL_INFO.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white uppercase transition-colors"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={PERSONAL_INFO.socials.leetcode}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#FFA116] uppercase transition-colors"
                  >
                    LeetCode
                  </a>
                  <a
                    href={PERSONAL_INFO.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white uppercase transition-colors"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Interactive Resume Modal Overlay */}
      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
        onHoverAction={onHoverAction}
        onHoverEnd={onHoverEnd}
      />
    </>
  );
};

