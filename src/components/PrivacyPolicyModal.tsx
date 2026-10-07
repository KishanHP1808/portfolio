import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Lock, EyeOff, Database, Server, UserCheck } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-950 border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-neutral-200"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg sm:text-xl uppercase tracking-tight text-white font-bold">
                    PRIVACY POLICY
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                    COMPLIANCE STANDARD
                  </span>
                </div>
                <p className="text-[11px] font-mono text-neutral-400">
                  Visitor Data Protection, Zero-Tracking Commitment & Client Confidentiality
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-8 font-sans text-sm leading-relaxed text-neutral-300">
            {/* Highlight: Zero Third-Party Advertising / Data Brokers */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-4">
              <EyeOff className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs sm:text-sm">
                <span className="font-bold text-emerald-300 uppercase tracking-wide block">
                  ZERO-DATA MONETIZATION GUARANTEE
                </span>
                <p className="text-neutral-300 leading-normal">
                  Kishan H.P. does not sell, rent, monetize, or trade any visitor data or client contact
                  information to third-party ad brokers, marketing networks, or algorithmic crawlers.
                  Your communications are kept strictly confidential.
                </p>
              </div>
            </div>

            {/* Section 1 */}
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase tracking-wider">
                <span>01.</span>
                <span>INFORMATION WE COLLECT</span>
              </div>
              <h3 className="font-display text-base text-white uppercase">Voluntary Submission Only</h3>
              <p>
                We only receive personal information that you intentionally provide to us through direct portfolio interactions:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                  <span className="text-xs font-mono text-white font-bold block">
                    Contact Form & Inquiries
                  </span>
                  <p className="text-xs text-neutral-400">
                    Your name, email address, project requirements, budget bracket, and timeline provided when sending a project proposal.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                  <span className="text-xs font-mono text-white font-bold block">
                    Public Guestbook & Sign-In
                  </span>
                  <p className="text-xs text-neutral-400">
                    If you choose to sign a note in the Guestbook or bookmark projects via Google Sign-In, your public display name and avatar are displayed with your note.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase tracking-wider">
                <span>02.</span>
                <span>HOW YOUR DATA IS UTILIZED</span>
              </div>
              <h3 className="font-display text-base text-white uppercase">Direct Purpose Limitation</h3>
              <ul className="space-y-1.5 pl-4 text-xs sm:text-sm list-disc text-neutral-400">
                <li>To evaluate incoming client proposals and respond directly via email with feasibility analysis and timeline schedules.</li>
                <li>To maintain persistent saved bookmarks and private client notes for signed-in users.</li>
                <li>To repel automated bot spam and detect fraudulent solicitations before they enter email relays.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase tracking-wider">
                <span>03.</span>
                <span>COOKIES & LOCAL STORAGE</span>
              </div>
              <h3 className="font-display text-base text-white uppercase">Strictly Functional State</h3>
              <p>
                This website does not utilize tracking cookies, Facebook pixels, or invasive behavioral telemetry.
                Local storage is used solely to remember your preferred theme (Dark vs. Light mode) and your language preference (English vs. Kannada) across page reloads.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase tracking-wider">
                <span>04.</span>
                <span>SECURITY & CLOUD INFRASTRUCTURE</span>
              </div>
              <h3 className="font-display text-base text-white uppercase">Robust Technical Protection</h3>
              <p>
                Data submitted via the inquiry form and guestbook is secured using Google Cloud Firestore with
                strict security rules enforcing user-level isolation and read/write authentication checks.
                Email relays are processed via encrypted HTTPS channels.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-2 pb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase tracking-wider">
                <span>05.</span>
                <span>YOUR RIGHTS & DATA DELETION</span>
              </div>
              <h3 className="font-display text-base text-white uppercase">Full Control Over Your Records</h3>
              <p>
                You have the right to request immediate and complete deletion of any message, guestbook note, or
                private data associated with your email address at any time. Simply send an email request to:
              </p>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-xs text-[#00f0ff] w-fit">
                {PERSONAL_INFO.email}
              </div>
            </section>
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>Last Updated: October 2026</span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-emerald-400 text-black font-condensed font-bold uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
            >
              ACCEPT & CLOSE
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
