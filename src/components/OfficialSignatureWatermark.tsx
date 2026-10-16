import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, CheckCircle2, Sparkles, X, ChevronUp, ExternalLink, Award } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { PERSONAL_INFO } from '../data/portfolioData';
import { trackButtonClick } from '../services/analyticsService';

interface OfficialSignatureWatermarkProps {
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
}

export const OfficialSignatureWatermark: React.FC<OfficialSignatureWatermarkProps> = ({
  onHoverAction,
  onHoverEnd,
}) => {
  const { isLight } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div
      id="official-signature-watermark"
      className="fixed bottom-4 right-4 sm:bottom-5 sm:right-6 z-40 select-none pointer-events-auto"
    >
      <AnimatePresence>
        {isExpanded ? (
          /* Expanded Official Dossier / Security Watermark Card */
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={`w-[290px] sm:w-[320px] p-4 sm:p-5 rounded-2xl shadow-2xl backdrop-blur-2xl border transition-all duration-300 ${
              isLight
                ? 'bg-white/95 border-neutral-300 shadow-[0_15px_45px_rgba(0,0,0,0.15)] text-neutral-900'
                : 'bg-[#060b14]/95 border-[#00f0ff]/30 shadow-[0_15px_50px_rgba(0,0,0,0.85)] glow-aqua-subtle text-neutral-100'
            }`}
          >
            {/* Header / Security Seal */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#00f0ff]/20 border border-[#00f0ff]/50 flex items-center justify-center text-[#00f0ff]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-[#00f0ff] uppercase font-bold flex items-center gap-1.5">
                    <span>OFFICIAL SIGNATURE</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-[11px] font-display font-semibold tracking-tight text-white dark:text-white">
                    {PERSONAL_INFO.name}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Minimize watermark"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Handwritten Signature Canvas / Vector Representation */}
            <div className="my-3 py-2 px-3 rounded-xl bg-black/40 border border-white/5 relative overflow-hidden flex items-center justify-center">
              {/* Subtle Guilloche Pattern Background */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:8px_8px]" />

              <svg
                viewBox="0 0 320 160"
                className="w-full h-20 sm:h-22 filter drop-shadow-[0_0_10px_rgba(0,240,255,0.45)] text-[#00f0ff] dark:text-[#00f0ff]"
                fill="none"
                stroke="currentColor"
              >
                {/* "K" Main Stem */}
                <path d="M 52 48 C 50 68, 47 98, 45 138" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 49 50 C 47 52, 43 56, 40 60" strokeWidth="3" strokeLinecap="round" />
                {/* "K" Upper Arm and Loop */}
                <path d="M 80 72 C 72 82, 60 92, 50 96 C 47 97, 46 95, 48 93 C 54 88, 66 84, 76 80" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
                {/* "K" Lower Leg connecting to "i" */}
                <path d="M 52 96 C 60 106, 72 124, 82 134 C 88 140, 94 138, 98 128" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                {/* "i" Stem */}
                <path d="M 98 128 C 102 114, 107 98, 110 88 C 111 86, 112 88, 111 92 C 108 108, 107 122, 112 128 C 114 130, 118 130, 122 124" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="114" cy="74" r="3" fill="currentColor" stroke="none" />
                {/* "s" Loop and Belly */}
                <path d="M 122 124 C 128 114, 134 98, 137 92 C 139 88, 142 90, 140 94 C 136 102, 132 110, 134 116 C 136 122, 144 120, 148 114" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
                {/* "h" Ascender and Arch */}
                <path d="M 148 114 C 154 100, 164 68, 170 42 C 172 37, 174 38, 172 44 C 168 68, 162 104, 159 130 C 164 112, 172 98, 182 96 C 188 95, 192 100, 190 108 C 187 118, 185 125, 190 126 C 193 127, 197 122, 202 116" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                {/* "a" Loop and Right Downstroke */}
                <path d="M 204 114 C 200 106, 194 105, 188 110 C 183 115, 182 122, 186 126 C 190 130, 198 128, 204 118 C 206 114, 207 110, 207 116 C 206 122, 206 126, 210 126 C 213 126, 217 120, 222 112" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
                {/* "n" Double Hump & Sharp Upward Exit Tail */}
                <path d="M 222 112 C 226 104, 230 101, 234 106 C 235 108, 234 114, 233 122 C 238 112, 244 102, 249 104 C 253 105, 254 110, 252 118 C 250 124, 252 125, 258 122 C 265 118, 274 110, 280 104" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
                {/* "H" Left Stem */}
                <path d="M 238 66 C 237 76, 235 88, 233 100" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
                {/* "H" Right Stem */}
                <path d="M 254 58 C 253 70, 251 82, 249 94" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
                {/* "H" Crossbar */}
                <path d="M 235 84 C 242 82, 248 80, 253 77" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                {/* "." Period Dot */}
                <circle cx="260" cy="92" r="2.6" fill="currentColor" stroke="none" />
                {/* "P" Stem and Upper Loop */}
                <path d="M 270 48 C 268 62, 266 78, 263 94" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 269 50 C 278 48, 288 50, 292 56 C 295 62, 293 70, 286 74 C 279 78, 271 78, 266 76" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <div className="absolute bottom-1 right-2 text-[9px] font-mono text-[#00f0ff]/70 tracking-widest uppercase">
                ORIGINAL AUTOGRAPH
              </div>
            </div>

            {/* Verification Metadata Attributes */}
            <div className="space-y-1.5 text-[10px] font-mono text-neutral-400">
              <div className="flex items-center justify-between">
                <span>IDENTITY:</span>
                <span className="text-white font-semibold">{PERSONAL_INFO.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>LOCATION:</span>
                <span className="text-white">{PERSONAL_INFO.locationShort}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>SECURITY:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  AUTHENTICATED
                </span>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
              <span className="text-neutral-500">DIGITAL FINGERPRINT</span>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-[#00f0ff] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
              >
                <span>COLLAPSE</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* Sleek, Non-Intrusive Official Watermark Badge (Always Fixed on Scroll) */
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsExpanded(true)}
            onMouseEnter={() => onHoverAction?.('VERIFIED')}
            onMouseLeave={onHoverEnd}
            className={`group cursor-pointer flex items-center gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border shadow-xl backdrop-blur-xl transition-all duration-300 ${
              isLight
                ? 'bg-white/85 border-neutral-300/80 hover:border-black/40 hover:bg-white text-neutral-900 shadow-md'
                : 'bg-black/75 border-white/15 hover:border-[#00f0ff]/60 hover:bg-black/90 text-white shadow-[0_8px_30px_rgba(0,0,0,0.7)] glow-aqua-subtle'
            }`}
            title="Official Digital Signature Watermark • Kishan H.P (Click to view verification)"
          >
            {/* Embedded Mini Signature Glyph */}
            <div className="w-14 sm:w-18 h-6 sm:h-7 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity">
              <svg
                viewBox="0 0 320 160"
                className="w-full h-full text-[#00f0ff] drop-shadow-[0_0_6px_rgba(0,240,255,0.6)]"
                fill="none"
                stroke="currentColor"
              >
                <path d="M 52 48 C 50 68, 47 98, 45 138" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M 80 72 C 72 82, 60 92, 50 96 C 47 97, 46 95, 48 93 C 54 88, 66 84, 76 80" strokeWidth="3.8" strokeLinecap="round" />
                <path d="M 52 96 C 60 106, 72 124, 82 134 C 88 140, 94 138, 98 128" strokeWidth="4" strokeLinecap="round" />
                <path d="M 98 128 C 102 114, 107 98, 110 88 C 108 108, 107 122, 112 128" strokeWidth="3.8" strokeLinecap="round" />
                <circle cx="114" cy="74" r="3" fill="currentColor" stroke="none" />
                <path d="M 122 124 C 128 114, 134 98, 137 92 C 136 102, 132 110, 134 116 C 136 122, 144 120, 148 114" strokeWidth="3.6" strokeLinecap="round" />
                <path d="M 148 114 C 154 100, 164 68, 170 42 C 168 68, 162 104, 159 130 C 164 112, 172 98, 182 96 C 187 118, 185 125, 190 126" strokeWidth="4" strokeLinecap="round" />
                <path d="M 204 114 C 194 105, 182 122, 186 126 C 198 128, 204 118, 207 116 C 206 126, 210 126, 222 112" strokeWidth="3.6" strokeLinecap="round" />
                <path d="M 222 112 C 226 104, 233 122, 238 112 C 249 104, 252 118, 258 122 C 265 118, 274 110, 280 104" strokeWidth="3.8" strokeLinecap="round" />
                <path d="M 238 66 C 237 76, 235 88, 233 100" strokeWidth="3.6" strokeLinecap="round" />
                <path d="M 254 58 C 253 70, 251 82, 249 94" strokeWidth="3.6" strokeLinecap="round" />
                <path d="M 235 84 C 242 82, 248 80, 253 77" strokeWidth="3.2" strokeLinecap="round" />
                <circle cx="260" cy="92" r="2.6" fill="currentColor" stroke="none" />
                <path d="M 270 48 C 268 62, 266 78, 263 94" strokeWidth="3.8" strokeLinecap="round" />
                <path d="M 269 50 C 278 48, 288 50, 292 56 C 295 62, 293 70, 286 74 C 279 78, 271 78, 266 76" strokeWidth="3.6" strokeLinecap="round" />
              </svg>
            </div>

            {/* Official Watermark Label */}
            <div className="flex flex-col text-left pr-1">
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#00f0ff] uppercase font-bold flex items-center gap-1 leading-tight">
                <span>OFFICIAL WATERMARK</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
              </span>
              <span className="text-[10px] sm:text-[11px] font-display font-medium text-neutral-300 group-hover:text-white transition-colors leading-tight">
                Kishan H.P
              </span>
            </div>

            {/* Verified Icon Badge */}
            <div className="w-5 h-5 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] shrink-0 group-hover:scale-110 group-hover:border-[#00f0ff] transition-all">
              <ShieldCheck className="w-3 h-3" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
