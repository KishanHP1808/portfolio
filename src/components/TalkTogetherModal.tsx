import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Instagram,
  Mail,
  MessageSquare,
  Phone,
  Copy,
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Send,
  Lock,
  Unlock,
  ArrowLeft,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface TalkToHimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
}

export const TalkToHimModal: React.FC<TalkToHimModalProps> = ({
  isOpen,
  onClose,
  onHoverAction,
  onHoverEnd,
}) => {
  const [copiedType, setCopiedType] = useState<'email' | 'phone' | 'instagram' | null>(null);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setShowPhoneNumber(false);
      setCopiedType(null);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopy = (text: string, type: 'email' | 'phone' | 'instagram') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const instagramHandle = PERSONAL_INFO.socials.instagramHandle || 'kishan_h.p.shaiva';
  const instagramUrl = PERSONAL_INFO.socials.instagram || 'https://www.instagram.com/kishan_h.p.shaiva?stkn=eWhsY3BtNnhsZDg4';
  const emailAddress = PERSONAL_INFO.email;
  const phoneNumber = PERSONAL_INFO.phone || '8431926645';

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="talk-to-him-modal-wrapper"
          className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative z-10 w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-[#080808] border border-white/15 p-4 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.95)] glow-aqua-subtle"
          >
            {/* Background cyber grid accent */}
            <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-[#00f0ff]/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-[#7000ff]/10 blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono text-[11px] text-emerald-400 uppercase tracking-widest font-semibold">
                    DIRECT CONNECT LINE
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-tight">
                  TALK TO HIM
                </h2>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  Connect with Kishan H.P for roles, design collaborations, or direct conversation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="talk-to-him-back-btn-top"
                  onClick={onClose}
                  onMouseEnter={() => onHoverAction?.('BACK')}
                  onMouseLeave={onHoverEnd}
                  className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-[#00f0ff] hover:border-[#00f0ff] hover:text-black text-white text-[11px] font-mono uppercase font-bold tracking-wider transition-all duration-300 cursor-pointer"
                  title="Back to Portfolio"
                >
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                  <span>BACK</span>
                </button>

                <button
                  id="talk-to-him-close-btn"
                  onClick={onClose}
                  onMouseEnter={() => onHoverAction?.('CLOSE')}
                  onMouseLeave={onHoverEnd}
                  className="p-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3 Channels Grid */}
            <div className="space-y-3.5">
              {/* OPTION 1: INSTAGRAM */}
              <div className="group relative p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-pink-500/50 hover:bg-white/[0.05] transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                      <Instagram className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-lg text-white tracking-wide">
                          INSTAGRAM
                        </span>
                        <span className="font-mono text-[10px] text-pink-400 px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20">
                          @{instagramHandle}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                        DM or message directly for design discussions, visuals & quick questions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => handleCopy(`@${instagramHandle}`, 'instagram')}
                      className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy Instagram handle"
                    >
                      {copiedType === 'instagram' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:brightness-110 text-xs font-mono font-semibold tracking-wider transition-all duration-300 shadow-md cursor-pointer"
                    >
                      <span>OPEN PROFILE</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* OPTION 2: EMAIL */}
              <div className="group relative p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#00f0ff]/50 hover:bg-white/[0.05] transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-lg text-white tracking-wide">
                          DIRECT EMAIL
                        </span>
                        <span className="font-mono text-[10px] text-[#00f0ff] px-2 py-0.5 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/20">
                          PRIORITY INBOX
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed font-mono">
                        {emailAddress}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => handleCopy(emailAddress, 'email')}
                      className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy Email Address"
                    >
                      {copiedType === 'email' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={`mailto:${emailAddress}?subject=Portfolio%20Inquiry%20-%20Talk%20To%20Him`}
                      className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white text-black hover:bg-[#00f0ff] text-xs font-mono font-semibold tracking-wider transition-all duration-300 shadow-md cursor-pointer"
                    >
                      <span>SEND EMAIL</span>
                      <Send className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* OPTION 3: TEXT OPTION (PHONE / SMS / WHATSAPP) - PROTECTED NUMBER REVEAL */}
              <div
                className={`group relative p-4 sm:p-5 rounded-2xl transition-all duration-300 border ${
                  showPhoneNumber
                    ? 'bg-emerald-950/20 border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                    : 'bg-white/[0.03] border-white/10 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display text-lg text-white tracking-wide">
                            TEXT OPTION
                          </span>
                          <span
                            className={`font-mono text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                              showPhoneNumber
                                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-semibold'
                                : 'bg-white/5 border-white/10 text-neutral-400'
                            }`}
                          >
                            {showPhoneNumber ? (
                              <>
                                <Unlock className="w-2.5 h-2.5" />
                                <span>NUMBER REVEALED</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-2.5 h-2.5" />
                                <span>PROTECTED LINE</span>
                              </>
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                          {!showPhoneNumber
                            ? "Number is hidden for privacy. Press the button to reveal his direct number for SMS, WhatsApp & calls."
                            : "Direct mobile line for SMS text, WhatsApp message, or direct phone call."}
                        </p>
                      </div>
                    </div>

                    {/* Reveal / Hide Button */}
                    {!showPhoneNumber ? (
                      <button
                        id="press-for-text-option-btn"
                        onClick={() => setShowPhoneNumber(true)}
                        onMouseEnter={() => onHoverAction?.('REVEAL')}
                        onMouseLeave={onHoverEnd}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-black font-condensed tracking-wider text-xs uppercase font-extrabold hover:bg-emerald-400 transition-all duration-300 self-start sm:self-auto cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.35)] shrink-0 active:scale-95"
                      >
                        <Eye className="w-4 h-4 text-black" />
                        <span>PRESS FOR TEXT OPTION</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowPhoneNumber(false)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 text-neutral-400 hover:text-white text-[11px] font-mono self-start sm:self-auto cursor-pointer"
                        title="Hide number again"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide Number</span>
                      </button>
                    )}
                  </div>

                  {/* Revealed Number Display Area */}
                  {showPhoneNumber && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="pt-3 mt-1 border-t border-emerald-500/20"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <span className="text-[10px] font-mono text-emerald-300/80 block uppercase tracking-wider">
                              Kishan H.P &bull; Direct Mobile Number
                            </span>
                            <span className="font-mono text-xl font-bold text-white tracking-widest">
                              +91 {phoneNumber}
                            </span>
                          </div>
                        </div>

                        {/* Direct Actions: SMS, WhatsApp, Call, Copy */}
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Send SMS */}
                          <a
                            href={`sms:${phoneNumber}?body=Hi%20Kishan,%20I%20saw%20your%20portfolio...`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-black text-xs font-mono font-bold hover:bg-emerald-400 transition-colors cursor-pointer"
                            title="Send SMS text message"
                          >
                            <Send className="w-3 h-3" />
                            <span>SMS TEXT</span>
                          </a>

                          {/* WhatsApp */}
                          <a
                            href={`https://wa.me/91${phoneNumber}?text=Hi%20Kishan,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20talk%20to%20you...`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-black text-xs font-mono font-bold hover:bg-[#20bd5a] transition-colors cursor-pointer"
                            title="Open WhatsApp chat"
                          >
                            <span>WHATSAPP</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </a>

                          {/* Direct Call */}
                          <a
                            href={`tel:${phoneNumber}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20 text-xs font-mono transition-colors cursor-pointer"
                            title="Call directly"
                          >
                            <Phone className="w-3 h-3" />
                            <span>CALL</span>
                          </a>

                          {/* Copy Number */}
                          <button
                            onClick={() => handleCopy(phoneNumber, 'phone')}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20 text-xs font-mono transition-colors cursor-pointer"
                            title="Copy phone number"
                          >
                            {copiedType === 'phone' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-green-400" />
                                <span>COPIED</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>COPY</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Prominent Bottom Back Option */}
            <div className="mt-5">
              <button
                id="talk-to-him-back-btn-bottom"
                onClick={onClose}
                onMouseEnter={() => onHoverAction?.('BACK')}
                onMouseLeave={onHoverEnd}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white hover:text-black text-neutral-300 font-mono text-xs uppercase font-bold tracking-wider transition-all duration-300 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>BACK TO PORTFOLIO</span>
              </button>
            </div>

            {/* Footer Note */}
            <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Direct communication guaranteed
              </span>
              <span>Mysuru, Karnataka • IST</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Also export alias TalkTogetherModal for backward compatibility
export const TalkTogetherModal = TalkToHimModal;
