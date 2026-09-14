import React, { useState, useEffect } from 'react';
import { Bookmark, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  toggleProjectBookmark,
  subscribeToUserProfile,
} from '../services/firebaseService';

interface ProjectBookmarkButtonProps {
  projectId: string;
  projectTitle: string;
  className?: string;
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
  onOpenAuthModal?: () => void;
}

export const ProjectBookmarkButton: React.FC<ProjectBookmarkButtonProps> = ({
  projectId,
  projectTitle,
  className = '',
  onHoverAction,
  onHoverEnd,
  onOpenAuthModal,
}) => {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      setIsBookmarked(false);
      return;
    }

    const unsubscribe = subscribeToUserProfile(user.uid, (profile) => {
      if (profile?.savedProjects) {
        setIsBookmarked(profile.savedProjects.includes(projectId));
      } else {
        setIsBookmarked(false);
      }
    });

    return () => unsubscribe();
  }, [user, projectId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      if (onOpenAuthModal) onOpenAuthModal();
      window.dispatchEvent(new CustomEvent('open-auth-modal'));
      return;
    }

    try {
      setIsSaving(true);
      const updated = await toggleProjectBookmark(user.uid, projectId);
      setIsBookmarked(updated.includes(projectId));
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      onMouseEnter={() =>
        onHoverAction?.(isBookmarked ? 'SAVED' : user ? 'BOOKMARK' : 'SIGN IN')
      }
      onMouseLeave={onHoverEnd}
      title={
        isBookmarked
          ? 'Saved in your recruiter shortlist'
          : user
          ? `Bookmark ${projectTitle} to Firestore`
          : 'Sign in to save project'
      }
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-300 border cursor-pointer select-none ${
        isBookmarked
          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
          : 'bg-white/5 border-white/10 text-neutral-300 hover:border-emerald-500/50 hover:text-white hover:bg-white/10'
      } ${className}`}
    >
      <Bookmark
        className={`w-3.5 h-3.5 transition-transform duration-300 ${
          isBookmarked ? 'fill-emerald-400 text-emerald-400 scale-110' : 'text-neutral-400'
        }`}
      />
      <span className="font-semibold text-[10px] uppercase tracking-wider hidden sm:inline">
        {isBookmarked ? 'SHORTLISTED' : 'SAVE'}
      </span>
      {isSaving && <Sparkles className="w-3 h-3 text-emerald-400 animate-spin" />}
    </button>
  );
};
