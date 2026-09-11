import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Copy, Check, Mail, MapPin, ArrowUp, Send, Sparkles, Download, Code2 } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface ContactSectionProps {
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onHoverAction,
  onHoverEnd,
}) => {
  const [copied, setCopied] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pre-populate mailto with inquiry
    const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name || 'Visitor'}`);
    const body = encodeURIComponent(
      `Hello Kishan,\n\n${formData.message}\n\nFrom: ${formData.name} (${formData.email})`
    );
    window.location.href = `mailto:${PERSONAL_INFO.email}?subject=${subject}&body=${body}`;
    setFormSent(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="relative w-full pt-28 md:pt-40 pb-16 px-6 md:px-12 lg:px-16 border-t border-white/10 select-none overflow-hidden bg-[#060606]">
      {/* Background aquatic ambient light */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[#00f0ff]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-[1700px] mx-auto relative z-10">
        {/* Section Top Label */}
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#00f0ff] uppercase mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FINAL CONVERGENCE</span>
        </div>

        {/* Colossal Heading */}
        <div className="mb-16 md:mb-24">
          <h2 className="font-display text-5xl md:text-8xl lg:text-[10.5vw] text-white uppercase tracking-tighter leading-[0.88]">
            LET&apos;S BUILD <br />
            <span className="text-stroke-subtle hover:text-white transition-colors duration-500">
              SOMETHING
            </span>{' '}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-[#00f0ff]">
              REMARKABLE.
            </span>
          </h2>
        </div>

        {/* Interactive Contact Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start mb-24 md:mb-32">
          {/* Left Column: Direct Action & Coordinates */}
          <div className="lg:col-span-6 space-y-8">
            <p className="font-serif-editorial italic text-2xl md:text-3xl text-neutral-300 font-light leading-relaxed">
              Available for full-time frontend engineering roles, UI/UX consulting, and bespoke creative development projects worldwide.
            </p>

            {/* Giant CTA Button */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                onMouseEnter={() => onHoverAction?.('MAIL')}
                onMouseLeave={onHoverEnd}
                className="group inline-flex items-center gap-4 px-8 py-5 rounded-full bg-[#00f0ff] text-black font-condensed tracking-wider uppercase text-lg md:text-xl font-extrabold hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_40px_rgba(0,240,255,0.5)] cursor-pointer"
              >
                <span>GET IN TOUCH</span>
                <ArrowUpRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>

              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-resume'))}
                onMouseEnter={() => onHoverAction?.('RESUME')}
                onMouseLeave={onHoverEnd}
                className="group inline-flex items-center gap-3 px-8 py-5 rounded-full border border-white/20 bg-white/5 hover:border-[#00f0ff] hover:bg-[#00f0ff]/10 text-white font-condensed tracking-wider uppercase text-lg md:text-xl font-bold transition-all duration-300 cursor-pointer"
              >
                <Download className="w-5 h-5 text-[#00f0ff] transition-transform duration-300 group-hover:-translate-y-0.5" />
                <span>DOWNLOAD RESUME (PDF)</span>
              </button>
            </div>

            {/* Email Quick Copy Box */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono uppercase text-neutral-500 tracking-wider mb-1">
                  DIRECT TRANSMISSION
                </div>
                <div className="font-mono text-base md:text-lg text-white font-medium">
                  {PERSONAL_INFO.email}
                </div>
              </div>

              <button
                onClick={handleCopyEmail}
                onMouseEnter={() => onHoverAction?.('COPY')}
                onMouseLeave={onHoverEnd}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/20 bg-white/5 hover:border-[#00f0ff] hover:text-[#00f0ff] text-xs font-mono transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#00f0ff]" />
                    <span className="text-[#00f0ff]">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY EMAIL</span>
                  </>
                )}
              </button>
            </div>

            {/* LeetCode Profile Showcase Card */}
            <a
              href={PERSONAL_INFO.socials.leetcode}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => onHoverAction?.('LEETCODE')}
              onMouseLeave={onHoverEnd}
              className="group p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#FFA116]/60 hover:bg-[#FFA116]/5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 transition-all duration-300 cursor-pointer block"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFA116]/10 border border-[#FFA116]/30 flex items-center justify-center font-mono font-bold text-[#FFA116] shrink-0 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(255,161,22,0.3)] transition-all">
                  <Code2 className="w-6 h-6 text-[#FFA116]" />
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase text-[#FFA116] tracking-wider flex items-center gap-1.5 font-semibold">
                    <span>LEETCODE PROFILE</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFA116] animate-pulse" />
                  </div>
                  <div className="font-mono text-base md:text-lg text-white font-medium group-hover:text-[#FFA116] transition-colors flex items-center gap-2">
                    <span>@{PERSONAL_INFO.socials.leetcodeUsername}</span>
                  </div>
                  <div className="text-xs text-neutral-400 font-mono mt-0.5">
                    Data Structures • Algorithms • Problem Solving
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-neutral-300 group-hover:border-[#FFA116]/50 group-hover:text-[#FFA116] transition-all shrink-0">
                <span>VIEW PROFILE</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>

            {/* Location & Details */}
            <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#00f0ff]" />
                <span>{PERSONAL_INFO.location}</span>
              </div>
              <span>•</span>
              <div>{PERSONAL_INFO.coordinates}</div>
            </div>

            {/* Quick Status Card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
              <div className="relative w-12 h-12 rounded-xl bg-neutral-900 border border-[#00f0ff]/40 flex items-center justify-center font-mono font-bold text-[#00f0ff] shrink-0 text-sm tracking-widest shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                KH
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-black" />
              </div>
              <div className="flex flex-col">
                <span className="font-condensed font-bold text-white text-lg tracking-wider uppercase">
                  {PERSONAL_INFO.name}
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  {PERSONAL_INFO.roles.join(' • ')}
                </span>
                <span className="text-[11px] font-mono text-cyan-400 mt-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
                  ONLINE & READY FOR NEW COLLABORATIONS
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Message Transmission Form */}
          <div className="lg:col-span-6 p-8 md:p-10 rounded-3xl bg-neutral-950/80 border border-white/10 glow-aqua-subtle">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-2xl text-white uppercase tracking-tight">
                TRANSMIT A MESSAGE
              </h3>
              <span className="font-mono text-[11px] text-[#00f0ff]">[DIRECT DISPATCH]</span>
            </div>

            {formSent ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <div className="font-display text-2xl text-white uppercase tracking-wide">
                  DISPATCH PREPARED
                </div>
                <p className="text-neutral-400 text-sm max-w-sm mx-auto">
                  Your email client has been summoned with your message. Thank you for connecting.
                </p>
                <button
                  onClick={() => setFormSent(false)}
                  className="mt-4 text-xs font-mono text-[#00f0ff] underline uppercase cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                    YOUR NAME / ORGANIZATION
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Thorne / Studio Alpha"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-[#00f0ff] text-sm font-mono transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-[#00f0ff] text-sm font-mono transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                    PROJECT INQUIRY / NOTE
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your timeline, scope, or idea..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-[#00f0ff] text-sm font-mono transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  onMouseEnter={() => onHoverAction?.('SEND')}
                  onMouseLeave={onHoverEnd}
                  className="w-full py-4 rounded-xl bg-white text-black font-condensed tracking-wider uppercase text-sm font-bold hover:bg-[#00f0ff] hover:text-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>TRANSMIT INQUIRY</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Social Footnote & Copyright */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-neutral-500">
          <div>
            © {new Date().getFullYear()} KISHAN H.P • CRAFTED IN MYSURU, KARNATAKA
          </div>

          <div className="flex items-center gap-8 text-neutral-400">
            <a
              href={PERSONAL_INFO.socials.github}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => onHoverAction?.('GITHUB')}
              onMouseLeave={onHoverEnd}
              className="hover:text-white uppercase transition-colors"
            >
              GitHub
            </a>
            <a
              href={PERSONAL_INFO.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => onHoverAction?.('LINKEDIN')}
              onMouseLeave={onHoverEnd}
              className="hover:text-white uppercase transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={PERSONAL_INFO.socials.leetcode}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => onHoverAction?.('LEETCODE')}
              onMouseLeave={onHoverEnd}
              className="hover:text-[#FFA116] uppercase transition-colors"
            >
              LeetCode
            </a>
            <a
              href={PERSONAL_INFO.socials.instagram}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => onHoverAction?.('INSTA')}
              onMouseLeave={onHoverEnd}
              className="hover:text-white uppercase transition-colors"
            >
              Instagram
            </a>
          </div>

          <button
            onClick={scrollToTop}
            onMouseEnter={() => onHoverAction?.('TOP')}
            onMouseLeave={onHoverEnd}
            className="flex items-center gap-2 hover:text-white transition-colors uppercase cursor-pointer"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#00f0ff]" />
          </button>
        </div>
      </div>
    </footer>
  );
};
