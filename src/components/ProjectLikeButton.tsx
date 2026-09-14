import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { subscribeToProjectLikes, likeProject } from '../services/firebaseService';

interface ProjectLikeButtonProps {
  projectId: string;
  projectTitle: string;
  className?: string;
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
}

export const ProjectLikeButton: React.FC<ProjectLikeButtonProps> = ({
  projectId,
  projectTitle,
  className = '',
  onHoverAction,
  onHoverEnd,
}) => {
  const [likes, setLikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    // Check local storage to see if user has already appreciated this project in this session
    const stored = localStorage.getItem(`liked_${projectId}`);
    if (stored) {
      setHasLiked(true);
    }

    const unsubscribe = subscribeToProjectLikes(projectId, (count) => {
      setLikes(count);
    });

    return () => unsubscribe();
  }, [projectId]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked) return;

    try {
      setIsAnimating(true);
      setHasLiked(true);
      localStorage.setItem(`liked_${projectId}`, 'true');
      const newTotal = await likeProject(projectId);
      setLikes(newTotal);
      setTimeout(() => setIsAnimating(false), 800);
    } catch (err) {
      console.error('Failed to like project:', err);
      setIsAnimating(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      onMouseEnter={() => onHoverAction?.(hasLiked ? 'APPRECIATED' : 'APPLAUD')}
      onMouseLeave={onHoverEnd}
      title={hasLiked ? 'You endorsed this project' : `Endorse ${projectTitle}`}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-300 border cursor-pointer select-none ${
        hasLiked
          ? 'bg-[#00f0ff]/15 border-[#00f0ff]/40 text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.25)]'
          : 'bg-white/5 border-white/10 text-neutral-300 hover:border-[#00f0ff]/50 hover:text-white hover:bg-white/10'
      } ${className}`}
    >
      <Heart
        className={`w-3.5 h-3.5 transition-transform duration-300 ${
          hasLiked ? 'fill-[#00f0ff] text-[#00f0ff]' : 'text-neutral-400'
        } ${isAnimating ? 'scale-130' : 'scale-100'}`}
      />
      <span className="font-semibold">{likes}</span>
      <span className="text-[10px] text-neutral-400 uppercase tracking-wider hidden sm:inline">
        {likes === 1 ? 'Endorsement' : 'Endorsements'}
      </span>
      {isAnimating && (
        <Sparkles className="w-3 h-3 text-[#00f0ff] animate-spin" />
      )}
    </button>
  );
};
