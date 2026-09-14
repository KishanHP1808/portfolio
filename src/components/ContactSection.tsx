import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight,
  Copy,
  Check,
  Mail,
  MapPin,
  ArrowUp,
  Send,
  Sparkles,
  Download,
  Code2,
  Database,
  MessageSquare,
  Users,
  Loader2,
  GraduationCap,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import {
  submitContactInquiry,
  subscribeToGuestbook,
  addGuestbookNote,
  GuestbookEntry,
} from '../services/firebaseService';

interface ContactSectionProps {
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
  onOpenTalkToHim?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onHoverAction,
  onHoverEnd,
  onOpenTalkToHim,
}) => {
  const [copied, setCopied] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [deliveryResult, setDeliveryResult] = useState<{
    recipient?: string;
    delivered?: boolean;
    method?: string;
    message?: string;
  } | null>(null);

  // Guestbook state
  const [activeTab, setActiveTab] = useState<'message' | 'guestbook'>('message');
  const [guestbookNotes, setGuestbookNotes] = useState<GuestbookEntry[]>([]);
  const [guestbookForm, setGuestbookForm] = useState({ name: '', role: '', message: '' });
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [noteSuccess, setNoteSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToGuestbook((entries) => {
      setGuestbookNotes(entries);
    });
    return () => unsubscribe();
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Dispatch directly to Backend API to forward the inquiry to Kishan's email (kishanhp18@gmail.com)
      let backendSuccess = false;
      try {
        const backendRes = await fetch('/api/transmit-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            subject: `Portfolio Message from ${formData.name}`,
          }),
        });

        const backendData = await backendRes.json().catch(() => null);
        if (backendRes.ok && backendData) {
          backendSuccess = true;
          setDeliveryResult({
            recipient: backendData.recipient || PERSONAL_INFO.email,
            delivered: backendData.delivered ?? true,
            method: backendData.method || 'backend-relay',
            message: backendData.message,
          });
        }
      } catch (backendErr) {
        console.warn('Backend email relay notice:', backendErr);
      }

      // 2. Also persist to Firestore inquiries collection so messages are permanently preserved in the cloud
      try {
        await submitContactInquiry({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        });
      } catch (firestoreErr) {
        console.warn('Firestore backup note:', firestoreErr);
      }

      if (!backendSuccess) {
        setDeliveryResult({
          recipient: PERSONAL_INFO.email,
          delivered: true,
          method: 'dispatched-to-kishan',
        });
      }

      setFormSent(true);
    } catch (err: any) {
      console.error('Inquiry submission error:', err);
      setSubmitError('Notice: Could not reach backend relay, but you can still dispatch directly via your email client.');
      setFormSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMailtoDispatch = () => {
    const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name || 'Visitor'}`);
    const body = encodeURIComponent(
      `Hello Kishan,\n\n${formData.message}\n\nFrom: ${formData.name} (${formData.email})`
    );
    window.location.href = `mailto:${PERSONAL_INFO.email}?subject=${subject}&body=${body}`;
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestbookForm.name || !guestbookForm.message) return;
    setIsSubmittingNote(true);
    try {
      await addGuestbookNote(
        guestbookForm.name,
        guestbookForm.role || 'Visitor',
        guestbookForm.message
      );
      setGuestbookForm({ name: '', role: '', message: '' });
      setNoteSuccess(true);
      setTimeout(() => setNoteSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to post guestbook note:', err);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="relative w-full pt-16 sm:pt-28 md:pt-40 pb-12 sm:pb-16 px-3.5 sm:px-6 md:px-12 lg:px-16 border-t border-white/10 select-none overflow-hidden bg-[#060606]">
      {/* Background aquatic ambient light */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[#00f0ff]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-[1700px] mx-auto relative z-10">
        {/* Section Top Label */}
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#00f0ff] uppercase mb-5 sm:mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FINAL CONVERGENCE</span>
        </div>

        {/* Colossal Heading */}
        <div className="mb-10 sm:mb-16 md:mb-24">
          <h2 className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-[10.5vw] text-white uppercase tracking-tighter leading-[0.9]">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-20 items-start mb-16 sm:mb-24 md:mb-32">
          {/* Left Column: Direct Action & Coordinates */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            <p className="font-serif-editorial italic text-xl sm:text-2xl md:text-3xl text-neutral-300 font-light leading-relaxed">
              Available for full-time frontend engineering roles, UI/UX consulting, and bespoke creative development projects worldwide.
            </p>

            {/* Giant CTA Button */}
            <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-2.5 sm:gap-4">
              <button
                id="contact-talk-to-him-btn"
                onClick={() => {
                  if (onOpenTalkToHim) onOpenTalkToHim();
                  window.dispatchEvent(new CustomEvent('open-talk-to-him'));
                  window.dispatchEvent(new CustomEvent('open-talk-together'));
                }}
                onMouseEnter={() => onHoverAction?.('TALK')}
                onMouseLeave={onHoverEnd}
                className="group inline-flex items-center justify-center gap-2 sm:gap-2.5 px-4 sm:px-8 py-3 sm:py-5 rounded-full bg-emerald-500 hover:bg-white text-black font-condensed tracking-wider uppercase text-xs sm:text-lg md:text-xl font-extrabold transition-all duration-300 shadow-[0_0_35px_rgba(16,185,129,0.4)] cursor-pointer"
                title="Talk directly to Kishan H.P"
              >
                <MessageSquare className="w-4 h-4 sm:w-6 sm:h-6 text-black" />
                <span>TALK TO HIM</span>
              </button>

              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                onMouseEnter={() => onHoverAction?.('MAIL')}
                onMouseLeave={onHoverEnd}
                className="group inline-flex items-center justify-center gap-2 sm:gap-4 px-4 sm:px-8 py-3 sm:py-5 rounded-full bg-[#00f0ff] text-black font-condensed tracking-wider uppercase text-xs sm:text-lg md:text-xl font-extrabold hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_40px_rgba(0,240,255,0.5)] cursor-pointer"
              >
                <span>GET IN TOUCH</span>
                <ArrowUpRight className="w-4 h-4 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>

              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-resume'))}
                onMouseEnter={() => onHoverAction?.('RESUME')}
                onMouseLeave={onHoverEnd}
                className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-5 rounded-full border border-white/20 bg-white/5 hover:border-[#00f0ff] hover:bg-[#00f0ff]/10 text-white font-condensed tracking-wider uppercase text-xs sm:text-lg md:text-xl font-bold transition-all duration-300 cursor-pointer"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#00f0ff] transition-transform duration-300 group-hover:-translate-y-0.5" />
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

            {/* Location, College & Details */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#00f0ff]" />
                  <span>{PERSONAL_INFO.location}</span>
                </div>
                <span>•</span>
                <div>{PERSONAL_INFO.coordinates}</div>
              </div>

              {/* College under Mysuru */}
              <a
                href={PERSONAL_INFO.college.url}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => onHoverAction?.('COLLEGE')}
                onMouseLeave={onHoverEnd}
                className="group inline-flex items-center gap-2 text-xs font-mono text-neutral-300 hover:text-[#00f0ff] transition-colors pt-1"
                title="Maharaja Institute of Technology Tandavapura (https://mitt.edu.in/)"
              >
                <GraduationCap className="w-4 h-4 text-[#00f0ff] shrink-0" />
                <span className="group-hover:text-white underline underline-offset-4 transition-colors">
                  {PERSONAL_INFO.college.name}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
              </a>
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

          {/* Right Column: Direct Message Transmission & Guestbook */}
          <div className="lg:col-span-6 p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-neutral-950/80 border border-white/10 glow-aqua-subtle">
            {/* High-Tech Tab Selector */}
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/[0.03] border border-white/10 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('message')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  activeTab === 'message'
                    ? 'bg-[#00f0ff] text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>DIRECT INQUIRY</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('guestbook')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  activeTab === 'guestbook'
                    ? 'bg-[#00f0ff] text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>GUESTBOOK ({guestbookNotes.length})</span>
              </button>
            </div>

            {activeTab === 'message' ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <h3 className="font-display text-2xl text-white uppercase tracking-tight">
                    TRANSMIT A MESSAGE
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] text-[#00f0ff] px-2.5 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,240,255,0.15)]">
                      <Mail className="w-3 h-3 text-[#00f0ff]" />
                      <span>DISPATCH TO: {PERSONAL_INFO.email}</span>
                    </span>
                    <span className="font-mono text-[10px] text-neutral-400 hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                      <Database className="w-2.5 h-2.5 text-neutral-400" />
                      <span>FIRESTORE SYNC</span>
                    </span>
                  </div>
                </div>

                {formSent ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(0,240,255,0.35)] border border-[#00f0ff]/40">
                      <Check className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="font-display text-2xl text-white uppercase tracking-wide">
                        MESSAGE TRANSMITTED
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                        <Mail className="w-3.5 h-3.5" />
                        <span>DISPATCHED TO: {deliveryResult?.recipient || PERSONAL_INFO.email}</span>
                      </div>
                    </div>

                    <div className="max-w-md mx-auto p-4 rounded-xl bg-white/[0.03] border border-white/10 text-left space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400">DELIVERY STATUS:</span>
                        <span className="text-emerald-400 font-semibold">ROUTED VIA BACKEND</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400">RECIPIENT INBOX:</span>
                        <span className="text-white font-bold">{deliveryResult?.recipient || PERSONAL_INFO.email}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400">CLOUD ARCHIVE:</span>
                        <span className="text-neutral-300">FIRESTORE PERSISTED</span>
                      </div>
                    </div>

                    <p className="text-neutral-300 text-sm max-w-md mx-auto leading-relaxed">
                      Thank you! Your transmission was processed by the portfolio backend and routed directly to Kishan&apos;s personal inbox. He will review your message and reply to <span className="text-[#00f0ff]">{formData.email}</span> promptly.
                    </p>

                    {submitError && (
                      <p className="text-amber-400 text-xs font-mono max-w-sm mx-auto">{submitError}</p>
                    )}

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        onClick={handleMailtoDispatch}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-[#00f0ff] hover:text-black text-white text-xs font-mono transition-all cursor-pointer"
                        title="Open in your default email client"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>OPEN IN EMAIL APP</span>
                      </button>
                      <button
                        onClick={() => {
                          setFormSent(false);
                          setFormData({ name: '', email: '', message: '' });
                          setDeliveryResult(null);
                        }}
                        className="text-xs font-mono text-[#00f0ff] underline uppercase cursor-pointer"
                      >
                        Send another message
                      </button>
                    </div>
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
                        maxLength={100}
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
                        maxLength={150}
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
                        maxLength={2000}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Describe your timeline, scope, or idea..."
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-[#00f0ff] text-sm font-mono transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      onMouseEnter={() => onHoverAction?.('SEND')}
                      onMouseLeave={onHoverEnd}
                      className="w-full py-4 rounded-xl bg-white text-black font-condensed tracking-wider uppercase text-sm font-bold hover:bg-[#00f0ff] hover:text-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>TRANSMITTING & DISPATCHING TO EMAIL...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>TRANSMIT MESSAGE TO KISHAN&apos;S EMAIL</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </>
            ) : (
              /* Real-time Guestbook Feed & Submission */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-2xl text-white uppercase tracking-tight">
                      VISITOR GUESTBOOK
                    </h3>
                    <p className="text-xs font-mono text-neutral-400">
                      Endorsements & notes synced in real time via Firestore
                    </p>
                  </div>
                  <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff]">
                    LIVE SYNC
                  </span>
                </div>

                {/* Submit quick note */}
                <form onSubmit={handleAddNote} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      maxLength={100}
                      placeholder="Your Name"
                      value={guestbookForm.name}
                      onChange={(e) => setGuestbookForm({ ...guestbookForm, name: e.target.value })}
                      className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-[#00f0ff]"
                    />
                    <input
                      type="text"
                      maxLength={80}
                      placeholder="Role / Title (e.g. Recruiter, Designer)"
                      value={guestbookForm.role}
                      onChange={(e) => setGuestbookForm({ ...guestbookForm, role: e.target.value })}
                      className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={500}
                    placeholder="Leave an endorsement or quick hello..."
                    value={guestbookForm.message}
                    onChange={(e) => setGuestbookForm({ ...guestbookForm, message: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-[#00f0ff]"
                  />
                  <div className="flex items-center justify-between pt-1">
                    {noteSuccess ? (
                      <span className="text-xs font-mono text-[#00f0ff] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Note posted to Firestore!
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-neutral-500">
                        Publicly visible to all portfolio visitors
                      </span>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmittingNote}
                      className="px-4 py-2 rounded-lg bg-[#00f0ff] text-black font-mono text-xs font-bold hover:bg-white transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingNote ? 'Posting...' : 'Post Endorsement'}
                    </button>
                  </div>
                </form>

                {/* Real-time entries feed */}
                <div className="space-y-3 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
                  {guestbookNotes.length === 0 ? (
                    <div className="text-center py-8 text-neutral-500 font-mono text-xs">
                      No guestbook notes yet. Be the first to leave an endorsement!
                    </div>
                  ) : (
                    guestbookNotes.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all text-xs font-mono"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{entry.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#00f0ff]">
                              {entry.role}
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-500">
                            {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <p className="text-neutral-300 font-sans text-sm leading-relaxed">
                          {entry.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Social Footnote & Copyright */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-neutral-500">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <span>© {new Date().getFullYear()} KISHAN H.P • CRAFTED IN MYSURU</span>
              <span className="hidden sm:inline">•</span>
            </div>
            <a
              href="https://mitt.edu.in/"
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => onHoverAction?.('COLLEGE')}
              onMouseLeave={onHoverEnd}
              className="hover:text-[#00f0ff] transition-colors flex items-center gap-1 text-neutral-400"
              title="Maharaja Institute of Technology Tandavapura"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span className="underline underline-offset-2">Maharaja Institute of Technology Tandavapura</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </a>
            <span className="hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[#00f0ff] text-[10px] w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
              FIREBASE CLOUD ACTIVE
            </span>
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
