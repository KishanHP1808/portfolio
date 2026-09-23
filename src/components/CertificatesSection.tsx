import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  FolderArchive,
  Cloud,
  RefreshCw,
  LayoutGrid,
  List,
  UploadCloud,
  FileCheck2,
  Info,
  ArrowLeft,
} from 'lucide-react';
import { CERTIFICATES, PERSONAL_INFO, CERTIFICATES_DRIVE_CONFIG } from '../data/portfolioData';
import { Certificate } from '../types';
import { HoloTiltCard } from './HoloTiltCard';

interface CertificatesSectionProps {
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({
  onHoverAction,
  onHoverEnd,
}) => {
  const [activeTab, setActiveTab] = useState<'drive' | 'matrix'>('drive');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [driveView, setDriveView] = useState<'grid' | 'list'>('grid');
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [iframeLoading, setIframeLoading] = useState<boolean>(true);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const categories = [
    'ALL',
    'Frontend & Architecture',
    'UI/UX & Design Systems',
    'Full Stack & Cloud',
    'AI & Machine Learning'
  ];

  const filteredCerts =
    activeCategory === 'ALL'
      ? CERTIFICATES
      : CERTIFICATES.filter((c) => c.category === activeCategory);

  const handleRefreshDrive = () => {
    setIframeLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  // Close certificate modal on Escape or close-all-modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedCert) {
        setSelectedCert(null);
      }
    };
    const handleCloseAll = () => setSelectedCert(null);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('close-all-modals', handleCloseAll);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('close-all-modals', handleCloseAll);
    };
  }, [selectedCert]);

  return (
    <section
      id="certificates"
      className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-16 border-t border-white/10 select-none bg-[#070707]/60"
    >
      <div className="max-w-[1700px] mx-auto">
        {/* Section Header */}
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#00f0ff] uppercase mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>OFFICIAL ACCREDITATION MATRIX & CLOUD VAULT</span>
            </div>
            <h2 className="font-display text-5xl md:text-8xl lg:text-9xl text-white uppercase tracking-tighter leading-none">
              CERTIFICATES
            </h2>
          </div>

          {/* Header Action: Direct Google Drive Link */}
          <div className="flex flex-col sm:flex-row items-start md:items-end gap-4 font-mono text-xs">
            <div className="hidden lg:flex flex-col items-end text-neutral-400">
              <span className="text-[#00f0ff] flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5" />
                <span>REAL-TIME CLOUD STORAGE</span>
              </span>
              <span>ZERO ALTERATIONS REQUIRED FOR FUTURE UPLOADS</span>
            </div>

            <a
              id="header-open-drive-btn"
              href={CERTIFICATES_DRIVE_CONFIG.url}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => onHoverAction?.('DRIVE')}
              onMouseLeave={onHoverEnd}
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#00f0ff] text-black font-condensed tracking-wider uppercase text-xs sm:text-sm font-extrabold hover:bg-white transition-all duration-300 shadow-[0_0_25px_rgba(0,240,255,0.4)] cursor-pointer"
            >
              <FolderArchive className="w-4 h-4" />
              <span>OPEN GOOGLE DRIVE ↗</span>
            </a>
          </div>
        </div>

        {/* Primary View Switcher: Live Google Drive Vault vs Verified Credential Matrix */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 p-2 rounded-2xl bg-white/[0.02] border border-white/10">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('drive')}
              onMouseEnter={() => onHoverAction?.('DRIVE')}
              onMouseLeave={onHoverEnd}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'drive'
                  ? 'bg-[#00f0ff] text-black font-bold shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                  : 'bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Cloud className="w-4 h-4" />
              <span>LIVE GOOGLE DRIVE VAULT</span>
              <span className="relative flex h-2 w-2 ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              onMouseEnter={() => onHoverAction?.('MATRIX')}
              onMouseLeave={onHoverEnd}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-[#00f0ff] text-black font-bold shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                  : 'bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>INDEXED CREDENTIAL MATRIX ({CERTIFICATES.length})</span>
            </button>
          </div>

          <div className="text-xs font-mono text-neutral-400 px-3 hidden md:block">
            {activeTab === 'drive'
              ? 'Synced directly with Google Drive • Instant dynamic updates'
              : 'Verified Industry Accreditations & Honor Badges'}
          </div>
        </div>

        {/* TAB 1: LIVE GOOGLE DRIVE VAULT */}
        {activeTab === 'drive' && (
          <div className="space-y-6">
            {/* Real-Time Sync Informational Callout */}
            <div className="p-6 md:p-8 rounded-3xl bg-neutral-950/80 border border-[#00f0ff]/30 shadow-[0_0_40px_rgba(0,240,255,0.1)] flex flex-col lg:flex-row lg:items-center justify-between gap-6 glow-aqua-subtle">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] shrink-0 mt-1">
                  <Cloud className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-xl text-white uppercase tracking-tight">
                      LIVE GOOGLE DRIVE CERTIFICATE REPOSITORY
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 text-[10px] font-mono tracking-widest uppercase">
                      AUTO-SYNCING
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-3xl leading-relaxed">
                    This drive folder is directly embedded into your portfolio. Whenever you drop
                    new certificates, diplomas, or degrees into your Google Drive, they will be
                    instantly accessible and presented here without any alterations or code changes
                    required.
                  </p>
                </div>
              </div>

              {/* Quick Drive Actions */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <a
                  href={CERTIFICATES_DRIVE_CONFIG.url}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => onHoverAction?.('UPLOAD')}
                  onMouseLeave={onHoverEnd}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/5 hover:border-[#00f0ff] text-white font-condensed tracking-wider uppercase text-xs font-semibold transition-all duration-300 cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span>ADD CERTIFICATES TO DRIVE</span>
                </a>

                <a
                  href={CERTIFICATES_DRIVE_CONFIG.url}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => onHoverAction?.('OPEN')}
                  onMouseLeave={onHoverEnd}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00f0ff] text-black font-condensed tracking-wider uppercase text-xs font-bold hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
                >
                  <span>LAUNCH DRIVE FOLDER</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Embedded Google Drive Interactive Container */}
            <div className="relative rounded-3xl bg-neutral-950 border border-white/10 overflow-hidden shadow-2xl">
              {/* Drive Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-black/60 text-xs font-mono">
                <div className="flex items-center gap-3 text-neutral-400">
                  <span className="text-[#00f0ff] font-bold">DRIVE ID:</span>
                  <span className="font-mono text-neutral-300 text-[11px] bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    {CERTIFICATES_DRIVE_CONFIG.folderId}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Grid / List Switcher */}
                  <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                    <button
                      onClick={() => setDriveView('grid')}
                      className={`p-1.5 rounded transition-colors ${
                        driveView === 'grid'
                          ? 'bg-[#00f0ff] text-black font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDriveView('list')}
                      className={`p-1.5 rounded transition-colors ${
                        driveView === 'list'
                          ? 'bg-[#00f0ff] text-black font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                      title="List View"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Refresh Button */}
                  <button
                    onClick={handleRefreshDrive}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-[#00f0ff] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    title="Refresh Google Drive View"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${iframeLoading ? 'animate-spin text-[#00f0ff]' : ''}`} />
                    <span className="hidden sm:inline">REFRESH</span>
                  </button>

                  {/* Open in New Window */}
                  <a
                    href={CERTIFICATES_DRIVE_CONFIG.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-all cursor-pointer font-bold"
                  >
                    <span>OPEN FULLSCREEN</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Iframe Frame View */}
              <div className="relative w-full h-[650px] md:h-[750px] bg-[#0d0d0d]">
                {iframeLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#050505]/90 backdrop-blur-sm">
                    <div className="w-10 h-10 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-mono tracking-widest text-[#00f0ff] uppercase">
                      CONNECTING TO GOOGLE DRIVE ARCHIVE...
                    </span>
                  </div>
                )}

                <iframe
                  key={iframeKey}
                  ref={iframeRef}
                  src={
                    driveView === 'grid'
                      ? CERTIFICATES_DRIVE_CONFIG.embedUrl
                      : CERTIFICATES_DRIVE_CONFIG.embedListUrl
                  }
                  title="Google Drive Certificates Repository"
                  className="w-full h-full border-0 bg-[#050505]"
                  onLoad={() => setIframeLoading(false)}
                  allow="autoplay; encrypted-media"
                />

                {/* Bottom Overlay Helper / Direct Access fallback */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#050505]/95 backdrop-blur-md border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Info className="w-4 h-4 text-[#00f0ff] shrink-0" />
                    <span>
                      Viewing live certificates from Google Drive. If your browser restricts Google
                      cookies or requires account login, open directly via the button on the right.
                    </span>
                  </div>
                  <a
                    href={CERTIFICATES_DRIVE_CONFIG.url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00f0ff] text-black font-condensed tracking-wider uppercase text-xs font-bold hover:bg-white transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                  >
                    <FolderArchive className="w-3.5 h-3.5" />
                    <span>OPEN IN GOOGLE DRIVE TAB</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INDEXED CREDENTIAL MATRIX */}
        {activeTab === 'matrix' && (
          <div className="space-y-12">
            {/* Category Filters */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  onMouseEnter={() => onHoverAction?.('FILTER')}
                  onMouseLeave={onHoverEnd}
                  className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#00f0ff] text-black font-bold shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                      : 'bg-white/[0.03] border border-white/10 text-neutral-400 hover:text-white hover:border-white/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Certificates Column Grid with 3D Holographic Perspective */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredCerts.map((cert) => (
                <HoloTiltCard
                  key={cert.id}
                  tiltIntensity={10}
                  className="rounded-3xl"
                  onClick={() => setSelectedCert(cert)}
                  onMouseEnter={() => onHoverAction?.('VERIFY')}
                  onMouseLeave={onHoverEnd}
                >
                  <div className="relative p-8 md:p-10 rounded-3xl bg-neutral-950/80 border border-white/10 hover:border-[#00f0ff]/70 transition-all duration-500 flex flex-col justify-between h-full hover:shadow-[0_0_40px_rgba(0,240,255,0.2)] glow-aqua-subtle">
                    {/* Card Top: Number, Issuer Badge & Year */}
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-6">
                        <span className="font-display text-3xl text-neutral-600 group-hover:text-white transition-colors duration-300">
                          {cert.number}
                        </span>

                        <div className="flex items-center gap-2">
                          {cert.badge && (
                            <span className="px-2.5 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-[10px] font-mono tracking-widest uppercase">
                              {cert.badge}
                            </span>
                          )}
                          <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-neutral-400 text-[11px] font-mono">
                            {cert.issueDate}
                          </span>
                        </div>
                      </div>

                      {/* Issuer Name */}
                      <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase tracking-wider mb-2">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{cert.issuer}</span>
                      </div>

                      {/* Certificate Title */}
                      <h3 className="font-display text-2xl md:text-3xl text-white uppercase tracking-tight group-hover:text-[#00f0ff] transition-colors duration-300 mb-4 leading-snug">
                        {cert.title}
                      </h3>

                      {/* Description */}
                      <p className="text-neutral-400 text-sm leading-relaxed mb-6 font-light">
                        {cert.description}
                      </p>
                    </div>

                    {/* Card Bottom: Skills & Action Link */}
                    <div className="pt-6 border-t border-white/10 space-y-4">
                      {/* Skill Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {cert.skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/10 text-[11px] font-mono text-neutral-400"
                          >
                            {skill}
                          </span>
                        ))}
                        {cert.skills.length > 4 && (
                          <span className="px-2 py-1 rounded-md bg-white/[0.03] border border-white/10 text-[10px] font-mono text-neutral-500">
                            +{cert.skills.length - 4} more
                          </span>
                        )}
                      </div>

                      {/* Verification CTA */}
                      <div className="flex items-center justify-between pt-2 text-xs font-mono">
                        <span className="text-neutral-500 group-hover:text-neutral-300 transition-colors">
                          ID: {cert.credentialId}
                        </span>

                        <div className="flex items-center gap-3">
                          <a
                            href={CERTIFICATES_DRIVE_CONFIG.url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-neutral-400 hover:text-[#00f0ff] transition-colors"
                            title="View In Google Drive"
                          >
                            <FolderArchive className="w-3.5 h-3.5" />
                            <span>DRIVE</span>
                          </a>

                          <a
                            href={cert.credentialUrl || PERSONAL_INFO.socials.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-[#00f0ff] hover:text-white transition-colors"
                          >
                            <span>VERIFY</span>
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </HoloTiltCard>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Callout Banner */}
        <div className="mt-16 p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#00f0ff]/20 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="font-display text-xl text-white uppercase tracking-tight">
                CONTINUOUS TECHNICAL ACCREDITATION & CLOUD REPOSITORY
              </div>
              <p className="text-neutral-400 text-sm mt-0.5 font-light">
                All certificates, degree credentials, and achievement badges uploaded to the Google Drive
                vault are permanently preserved and instantly verifiable.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <a
              href={CERTIFICATES_DRIVE_CONFIG.url}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => onHoverAction?.('DRIVE')}
              onMouseLeave={onHoverEnd}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#00f0ff] text-black hover:bg-white transition-all duration-300 font-condensed tracking-wider uppercase text-sm font-bold shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            >
              <FolderArchive className="w-4 h-4" />
              <span>ACCESS GOOGLE DRIVE VAULT</span>
            </a>

            <a
              href={PERSONAL_INFO.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => onHoverAction?.('LINKEDIN')}
              onMouseLeave={onHoverEnd}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-white/20 bg-white/5 hover:border-white text-white transition-all duration-300 font-condensed tracking-wider uppercase text-sm font-semibold"
            >
              <span>LINKEDIN CREDENTIALS</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Modal / Certificate Detail Overlay */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl p-8 md:p-10 rounded-3xl bg-neutral-950 border border-white/20 glow-aqua max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4 gap-3">
                <div className="flex items-center gap-3">
                  <button
                    id="cert-modal-back-btn-top"
                    onClick={() => setSelectedCert(null)}
                    className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-[#00f0ff] hover:border-[#00f0ff] hover:text-black text-white text-xs font-mono font-bold tracking-wider transition-all duration-300 cursor-pointer"
                    title="Back to Certificates"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                    <span>BACK TO CERTIFICATES</span>
                  </button>

                  <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase tracking-widest">
                    <Award className="w-4 h-4" />
                    <span>CREDENTIAL DOSSIER</span>
                  </div>
                </div>

                <button
                  id="cert-modal-close-icon-btn"
                  onClick={() => setSelectedCert(null)}
                  className="px-3 py-1 rounded-full border border-white/20 text-xs font-mono text-neutral-400 hover:text-white hover:border-white transition-colors cursor-pointer"
                >
                  ESC / CLOSE
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase text-neutral-500 tracking-wider">
                    {selectedCert.issuer} • {selectedCert.issueDate}
                  </span>
                  <h3 className="font-display text-3xl md:text-4xl text-white uppercase tracking-tight mt-1">
                    {selectedCert.title}
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-neutral-500">CREDENTIAL ID</div>
                    <div className="font-mono text-sm text-white font-medium">{selectedCert.credentialId}</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>AUTHENTICATED</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-mono uppercase text-neutral-400 mb-2">SYNOPSIS & SCOPE</div>
                  <p className="text-neutral-300 text-sm md:text-base leading-relaxed font-light">
                    {selectedCert.description}
                  </p>
                </div>

                <div>
                  <div className="text-xs font-mono uppercase text-neutral-400 mb-2">VALIDATED COMPETENCIES</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-neutral-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <button
                    id="cert-modal-back-btn-bottom"
                    onClick={() => setSelectedCert(null)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/5 text-xs font-mono font-bold uppercase tracking-wider text-neutral-200 hover:text-black hover:bg-white transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>BACK TO CERTIFICATES</span>
                  </button>

                  <div className="flex flex-wrap items-center gap-3">

                  <a
                    href={CERTIFICATES_DRIVE_CONFIG.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/10 text-[#00f0ff] font-condensed tracking-wider uppercase text-xs font-bold hover:bg-[#00f0ff] hover:text-black transition-all"
                  >
                    <FolderArchive className="w-3.5 h-3.5" />
                    <span>OPEN GOOGLE DRIVE ARCHIVE</span>
                  </a>

                  <a
                    href={selectedCert.credentialUrl || PERSONAL_INFO.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00f0ff] text-black font-condensed tracking-wider uppercase text-xs font-bold hover:bg-[#38bdf8] transition-all"
                  >
                    <span>OPEN LINKEDIN VERIFICATION</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
