import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LogIn,
  LogOut,
  User,
  Bookmark,
  Sparkles,
  ExternalLink,
  Save,
  Check,
  X,
  Shield,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  syncUserProfile,
  subscribeToUserProfile,
  saveUserNotes,
  UserProfileDoc,
} from '../services/firebaseService';
import { PROJECTS } from '../data/portfolioData';

interface AuthProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
}

export const AuthProfileModal: React.FC<AuthProfileModalProps> = ({
  isOpen,
  onClose,
  onHoverAction,
  onHoverEnd,
}) => {
  const { user, signInWithGoogle, signOut, loading, error: authError } = useAuth();
  const [profile, setProfile] = useState<UserProfileDoc | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Sync profile to Firestore upon login and subscribe
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setNotes('');
      return;
    }

    syncUserProfile({
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    }).catch(console.error);

    const unsubscribe = subscribeToUserProfile(user.uid, (data) => {
      setProfile(data);
      if (data?.notes !== undefined) {
        setNotes(data.notes);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveNotes = async () => {
    if (!user) return;
    setIsSavingNotes(true);
    try {
      await saveUserNotes(user.uid, notes);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Close modal on Escape key
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

  const bookmarkedProjects = PROJECTS.filter((p) =>
    profile?.savedProjects?.includes(p.id)
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#080a12] border border-white/15 p-5 sm:p-7 text-white shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(0,240,255,0.15)] custom-scrollbar"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
                  RECRUITER & VISITOR HUB
                </h3>
                <p className="text-[11px] font-mono text-neutral-400">
                  Secured by Firebase Auth & Firestore Database
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!user ? (
            /* Sign-in Callout */
            <div className="text-center py-6 sm:py-8 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-[#00f0ff] shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                <LogIn className="w-8 h-8" />
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <h4 className="font-display text-2xl font-bold uppercase tracking-tight">
                  SIGN IN WITH GOOGLE
                </h4>
                <p className="text-sm font-sans text-neutral-300 leading-relaxed">
                  Sign in to save projects to your recruiter shortlist, take private hiring notes, and post verified recommendations with your Google profile.
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-300 max-w-md mx-auto">
                  {authError}
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={handleSignIn}
                  disabled={isSigningIn || loading}
                  onMouseEnter={() => onHoverAction?.('SIGN IN')}
                  onMouseLeave={onHoverEnd}
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-white hover:bg-[#00f0ff] text-black font-condensed uppercase tracking-wider text-sm font-extrabold transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(0,240,255,0.5)] cursor-pointer disabled:opacity-60"
                >
                  {isSigningIn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>CONNECTING SECURE SESSION...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.35 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                      </svg>
                      <span>CONTINUE WITH GOOGLE AUTH</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] font-mono text-neutral-500 pt-2">
                Firestore DB: <span className="text-[#00f0ff]/80">ai-studio-kishanhpfrontend</span>
              </div>
            </div>
          ) : (
            /* Authenticated User Dashboard */
            <div className="space-y-6">
              {/* User Identity Card */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-12 h-12 rounded-full border border-[#00f0ff]/40 object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] flex items-center justify-center font-bold">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-lg font-bold text-white">
                        {user.displayName || 'Authenticated Visitor'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-400 text-[10px] font-mono">
                        VERIFIED
                      </span>
                    </div>
                    <div className="text-xs font-mono text-neutral-400">
                      {user.email}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  title="Sign out of Firebase Auth"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:border-red-500/40 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 text-xs font-mono transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">SIGN OUT</span>
                </button>
              </div>

              {/* Bookmarked Projects Matrix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase tracking-wider">
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>SAVED PROJECTS ({bookmarkedProjects.length})</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500">
                    Synced to Firestore
                  </span>
                </div>

                {bookmarkedProjects.length === 0 ? (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center text-xs font-mono text-neutral-400">
                    No projects shortlisted yet. Click the bookmark icon on any project to pin it to your personal shortlist.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                    {bookmarkedProjects.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-white font-mono">{p.title}</div>
                          <div className="text-[10px] text-neutral-400 font-sans line-clamp-1">
                            {p.subtitle}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#00f0ff]">
                            {p.category}
                          </span>
                          {p.liveUrl && (
                            <a
                              href={p.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recruiter Private Notes / Scratchpad */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#00f0ff]" />
                    <span>PRIVATE RECRUITER / INTERVIEW NOTES</span>
                  </label>
                  {notesSaved && (
                    <span className="text-emerald-400 text-xs font-mono flex items-center gap-1">
                      <Check className="w-3 h-3" /> Saved to Firestore
                    </span>
                  )}
                </div>

                <textarea
                  rows={3}
                  maxLength={1000}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Keep private interview impressions, candidate notes, or follow-up timelines..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#00f0ff] text-xs font-mono transition-colors resize-none"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono text-neutral-500">
                    {notes.length}/1000 chars • Private to your account
                  </span>
                  <button
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00f0ff] hover:bg-white text-black text-xs font-mono font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSavingNotes ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>SAVE NOTES</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
