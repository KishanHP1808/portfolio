import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, ShieldAlert, Scale, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({ isOpen, onClose }) => {
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
              <div className="w-9 h-9 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] flex items-center justify-center shrink-0">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg sm:text-xl uppercase tracking-tight text-white font-bold">
                    TERMS & CONDITIONS
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[#00f0ff] text-[10px] font-mono">
                    LEGAL VER. 2.4
                  </span>
                </div>
                <p className="text-[11px] font-mono text-neutral-400">
                  Client Engagement, Code Licensing & Anti-Fraud Commercial Terms
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
            {/* Highlight Box: Anti-Fraud & Fake Customer Policy */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs sm:text-sm">
                <span className="font-bold text-amber-300 uppercase tracking-wide block">
                  CLIENT INTEGRITY & ANTI-FRAUD SCREENING NOTICE
                </span>
                <p className="text-neutral-300 leading-normal">
                  To protect delivery schedules for verified commercial partners, automated solicitations,
                  uncompensated test projects, scam pitches (e.g. crypto/forex, unverified third-party brokers),
                  and fake customer inquiries are filtered and discarded. Only legitimate clients and verified
                  employers receive direct project dispatch and consultations.
                </p>
              </div>
            </div>

            {/* Section 1 */}
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase tracking-wider">
                <span>01.</span>
                <span>ACCEPTANCE OF TERMS & PORTFOLIO SCOPE</span>
              </div>
              <h3 className="font-display text-base text-white uppercase">Engagement Overview</h3>
              <p>
                By accessing this portfolio website ({window.location.hostname}) or initiating contact with
                Kishan H.P., you agree to be bound by these Terms and Conditions. This platform serves as an
                official showcase of engineering projects, architectural case studies, UI/UX design systems,
                and technical accreditations authored by Kishan H.P.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase tracking-wider">
                <span>02.</span>
                <span>INTELLECTUAL PROPERTY & CODE LICENSING</span>
              </div>
              <h3 className="font-display text-base text-white uppercase">Ownership of Deliverables</h3>
              <p>
                All visual assets, bespoke animations, typography hierarchies, and original frontend codebases
                featured across this website are the intellectual property of Kishan H.P., unless explicitly
                designated as client deliverables or open-source software under individual repositories on GitHub.
              </p>
              <ul className="space-y-1.5 pl-4 text-xs sm:text-sm list-disc text-neutral-400">
                <li>Client-commissioned deliverables transfer intellectual property rights upon full project milestone settlement.</li>
                <li>Public open-source codebases maintain their respective repository licenses (MIT, Apache 2.0).</li>
                <li>Unauthorized replication of this site&apos;s custom visual layouts for commercial cloning without attribution is prohibited.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase tracking-wider">
                <span>03.</span>
                <span>CLIENT SCREENING & ENCOUNTERING FAKE INQUIRIES</span>
              </div>
              <h3 className="font-display text-base text-white uppercase">Zero-Tolerance for Fraud & Spam</h3>
              <p>
                Kishan reserves the right to qualify, inspect, and decline any commercial inquiry that displays
                indicia of fraudulent solicitation, phishing, or bad-faith intent:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ACCEPTED ENGAGEMENTS</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Direct corporate, startup, or individual commercial contracts with clear scope, defined budgets, and verifiable identities.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-rose-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>REJECTED / FILTERED</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Unsolicited marketing blasts, unpaid speculative work (&ldquo;free trial designs&rdquo;), revenue-share with zero budget, and Telegram/crypto scams.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase tracking-wider">
                <span>04.</span>
                <span>PROJECT ESTIMATES, MILESTONES & REVISIONS</span>
              </div>
              <h3 className="font-display text-base text-white uppercase">Commercial Integrity</h3>
              <p>
                All project quotations and timelines provided following initial discovery are tailored to defined
                technical specifications. Significant scope expansions during production will be structured via
                supplementary milestone agreements.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase tracking-wider">
                <span>05.</span>
                <span>LIMITATION OF LIABILITY</span>
              </div>
              <h3 className="font-display text-base text-white uppercase">Standard Disclaimer</h3>
              <p>
                This portfolio website is provided &ldquo;as is&rdquo; without warranties of continuous zero-downtime
                availability. In no event shall Kishan H.P. be liable for third-party hosting service disruptions,
                external cloud provider updates, or browser compatibility regressions beyond standard modern web norms.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-2 pb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase tracking-wider">
                <span>06.</span>
                <span>JURISDICTION & CONTACT</span>
              </div>
              <h3 className="font-display text-base text-white uppercase">Governing Law</h3>
              <p>
                These terms are governed by the laws of Karnataka, India, with exclusive jurisdiction in the courts
                of Mysuru. For formal contract inquiries, write directly to:
              </p>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-xs text-[#00f0ff] w-fit">
                {PERSONAL_INFO.email} • {PERSONAL_INFO.location}
              </div>
            </section>
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>Last Revised: October 2026</span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-[#00f0ff] text-black font-condensed font-bold uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
            >
              I UNDERSTAND & CLOSE
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
