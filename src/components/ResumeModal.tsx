import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download,
  FileText,
  X,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Upload,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  Code2
} from 'lucide-react';
import { PERSONAL_INFO, EXPERIENCES, CERTIFICATES } from '../data/portfolioData';
import { generateClientResumePDF } from '../utils/resumeGenerator';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
  onHoverAction,
  onHoverEnd
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [customPdfUrl, setCustomPdfUrl] = useState<string | null>(null);
  const [customFileName, setCustomFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownload = () => {
    setDownloading(true);

    try {
      if (customPdfUrl) {
        const link = document.createElement('a');
        link.href = customPdfUrl;
        link.download = customFileName || 'Kishan_HP_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Try direct file download
        const link = document.createElement('a');
        link.href = '/Kishan_HP_Resume.pdf';
        link.download = 'Kishan_HP_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Also run client-side generator to ensure a valid file is always received
        setTimeout(() => {
          generateClientResumePDF();
        }, 150);
      }

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Download error, triggering fallback generator', err);
      generateClientResumePDF();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } finally {
      setDownloading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setCustomPdfUrl(url);
      setCustomFileName(file.name);
    }
  };

  const activePdfHref = customPdfUrl || '/Kishan_HP_Resume.pdf';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl rounded-3xl bg-[#040e1c] border border-[#00f0ff]/30 shadow-[0_0_80px_rgba(0,240,255,0.2)] max-h-[90vh] flex flex-col overflow-hidden text-neutral-200"
          >
            {/* Top Modal Navigation Header */}
            <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-2xl text-white uppercase tracking-tight">
                      CURRICULUM VITAE & RESUME
                    </h2>
                    <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 text-[10px] font-mono uppercase tracking-wider">
                      VERIFIED PDF
                    </span>
                  </div>
                  <p className="text-xs font-mono text-neutral-400">
                    KISHAN H.P • FRONTEND DEVELOPER & UI/UX DESIGNER
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="p-2 rounded-full border border-white/20 text-neutral-400 hover:text-white hover:border-white transition-colors cursor-pointer"
                  aria-label="Close Resume"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Action Download Banner */}
            <div className="px-6 md:px-8 py-4 bg-gradient-to-r from-[#00f0ff]/10 via-cyan-900/20 to-transparent border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                <Sparkles className="w-4 h-4 text-[#00f0ff]" />
                <span>
                  {customFileName
                    ? `Active Custom File: ${customFileName}`
                    : 'Official ATS-Optimized Document (A4 Standard Format)'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* File Upload Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  onMouseEnter={() => onHoverAction?.('UPLOAD')}
                  onMouseLeave={onHoverEnd}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 hover:border-white text-xs font-mono text-neutral-300 hover:text-white transition-all cursor-pointer"
                  title="Upload or replace with your custom PDF file"
                >
                  <Upload className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span>REPLACE PDF</span>
                </button>

                <a
                  href={activePdfHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 hover:border-[#00f0ff] text-xs font-mono text-neutral-300 hover:text-white transition-all"
                >
                  <span>OPEN VIEWER</span>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                </a>

                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  onMouseEnter={() => onHoverAction?.('DOWNLOAD')}
                  onMouseLeave={onHoverEnd}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#00f0ff] text-black font-condensed tracking-wider uppercase text-xs font-bold hover:bg-white transition-all duration-300 shadow-[0_0_25px_rgba(0,240,255,0.4)] cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {downloadSuccess
                      ? 'DOWNLOAD COMPLETE!'
                      : downloading
                      ? 'PREPARING...'
                      : 'DOWNLOAD PDF'}
                  </span>
                </button>
              </div>
            </div>

            {/* Scrollable Resume Content Dossier */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 text-neutral-300 font-light">
              {/* Paper Layout Container */}
              <div className="p-6 md:p-10 rounded-2xl bg-[#020711] border border-white/10 space-y-8 shadow-inner">
                {/* Resume Header */}
                <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h1 className="font-display text-4xl md:text-5xl text-white uppercase tracking-tight">
                      {PERSONAL_INFO.name}
                    </h1>
                    <p className="font-mono text-xs md:text-sm text-[#00f0ff] mt-1 uppercase tracking-wider">
                      Frontend Developer & UI/UX Designer • Full Stack Developer
                    </p>
                  </div>
                  <div className="text-left md:text-right font-mono text-xs text-neutral-400 space-y-0.5">
                    <div>{PERSONAL_INFO.location}</div>
                    <div className="text-[#00f0ff]">{PERSONAL_INFO.email}</div>
                    <div>github.com/KishanHP1808</div>
                    <div className="text-[#FFA116]">leetcode.com/u/Kishan_H_P</div>
                  </div>
                </div>

                {/* Professional Synopsis */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase tracking-widest">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>PROFESSIONAL SUMMARY</span>
                  </div>
                  <p className="text-sm md:text-base leading-relaxed text-neutral-300 font-light">
                    Innovative Frontend Developer and UI/UX Designer based in Mysuru, Karnataka,
                    specializing in high-performance web applications, fluid motion architecture, and
                    clean full-stack systems. Demonstrated expertise across React, TypeScript, Next.js,
                    Python/Django, RESTful APIs, and modern Figma design systems. Committed to building
                    robust, accessible, user-centric digital experiences.
                  </p>
                </div>

                {/* Core Technical Capabilities */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase tracking-widest">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>TECHNICAL CAPABILITIES</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="text-white font-bold mb-1 uppercase text-[#00f0ff]">
                        Frontend & Design
                      </div>
                      <div className="text-neutral-400 leading-relaxed">
                        React.js, Next.js, TypeScript, JavaScript (ES6+), Tailwind CSS, HTML5/CSS3,
                        Figma (Design Systems, Auto-Layout, Prototyping), UI/UX Architecture.
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="text-white font-bold mb-1 uppercase text-[#00f0ff]">
                        Backend & Cloud
                      </div>
                      <div className="text-neutral-400 leading-relaxed">
                        Node.js, Express, Python, Django 5, FastAPI, REST APIs, WebSockets, Redis,
                        Docker, Git/GitHub, CI/CD Pipelines, Render.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Engineering Projects */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase tracking-widest">
                    <Layers className="w-3.5 h-3.5" />
                    <span>FEATURED ENGINEERING PROJECTS</span>
                  </div>

                  <div className="space-y-4 text-xs">
                    {/* Project 1 */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-display text-base text-white uppercase">
                          AGRIGUARD — CROP DISEASE DETECTION PLATFORM
                        </div>
                        <span className="font-mono text-[11px] text-[#00f0ff]">
                          React • TypeScript • Python / Django
                        </span>
                      </div>
                      <p className="text-neutral-300 font-light leading-relaxed">
                        Engineered automated diagnostic web platform for commercial farmers with
                        sub-second image pathology detection, weather advisory feeds, and touch-first
                        field UX.
                      </p>
                    </div>

                    {/* Project 2 */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-display text-base text-white uppercase">
                          FOOTBALL AUCTION — REAL-TIME BIDDING ARENA
                        </div>
                        <span className="font-mono text-[11px] text-[#00f0ff]">
                          React • WebSockets • Redis • Django
                        </span>
                      </div>
                      <p className="text-neutral-300 font-light leading-relaxed">
                        Architected synchronous bidding platform with zero-latency countdown clocks,
                        Redis pub/sub race-condition avoidance, and dynamic team budget calculations.
                      </p>
                    </div>

                    {/* Project 3 */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-display text-base text-white uppercase">
                          SMARTATTEND — BIOMETRIC FACIAL VERIFICATION
                        </div>
                        <span className="font-mono text-[11px] text-[#00f0ff]">
                          Python • OpenCV • SQLite
                        </span>
                      </div>
                      <p className="text-neutral-300 font-light leading-relaxed">
                        Constructed facial recognition attendance system recording automated biometric
                        timestamps with CSV administrative export utilities.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Experience */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase tracking-widest">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>EXPERIENCE</span>
                  </div>

                  <div className="space-y-3">
                    {EXPERIENCES.map((exp) => (
                      <div
                        key={exp.role}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-bold text-white text-sm">{exp.role}</span>
                          <span className="font-mono text-xs text-[#00f0ff]">{exp.period}</span>
                        </div>
                        <div className="text-xs font-mono text-neutral-400">{exp.company}</div>
                        <p className="text-xs text-neutral-300 font-light pt-1">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase tracking-widest">
                    <Award className="w-3.5 h-3.5" />
                    <span>ACCREDITATIONS & HONORS</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {CERTIFICATES.slice(0, 4).map((c) => (
                      <div
                        key={c.id}
                        className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
                        <div>
                          <div className="text-white font-medium">{c.title}</div>
                          <div className="text-neutral-400 text-[11px] font-mono">{c.issuer}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Modal Actions */}
            <div className="p-6 md:p-8 border-t border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <span className="text-[#00f0ff]">[STATUS]</span>
                <span>READY FOR RECRUITMENT & DIRECT REVIEW</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full border border-white/20 text-xs font-mono text-neutral-400 hover:text-white hover:border-white transition-colors cursor-pointer"
                >
                  CLOSE
                </button>

                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  onMouseEnter={() => onHoverAction?.('DOWNLOAD')}
                  onMouseLeave={onHoverEnd}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#00f0ff] text-black font-condensed tracking-wider uppercase text-xs font-bold hover:bg-white transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {downloadSuccess ? 'DOWNLOADED SUCCESSFULLY' : 'DOWNLOAD RESUME (PDF)'}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
