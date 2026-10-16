import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Sparkles,
  ExternalLink,
  RotateCw,
  Trophy,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Lock,
  Cpu,
  Database,
  Plus,
  X,
  Layers,
  ChevronRight,
  TrendingUp,
  Flame,
  Cloud
} from 'lucide-react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { trackButtonClick, trackEvent, fetchAndUpdateGoogleSkillsPoints } from '../services/analyticsService';
import { GoogleSkillsAutoRefreshTicker } from './GoogleSkillsAutoRefreshTicker';

export interface GoogleBadge {
  name: string;
  icon?: string;
  earnedDate: string;
  category: string;
}

export interface GoogleSkillsData {
  accountEmail: string;
  totalPoints: number;
  tier: string;
  skillBadgesCount: number;
  questsCompleted: number;
  labsCompleted: number;
  arcadeMilestone: string;
  profileUrl: string;
  recentBadges: GoogleBadge[];
  updatedAt: string;
}

const DEFAULT_GOOGLE_SKILLS: GoogleSkillsData = {
  accountEmail: '4mn24ci023@gmail.com',
  totalPoints: 2850,
  tier: 'Google Cloud Arcade Legend // Gold Architect',
  skillBadgesCount: 24,
  questsCompleted: 16,
  labsCompleted: 98,
  arcadeMilestone: 'Tier 3 Champion - Elite Finisher',
  profileUrl: 'https://www.cloudskillsboost.google/public_profiles/4mn24ci023',
  recentBadges: [
    { name: 'Generative AI Explorer - Vertex AI & Gemini', icon: 'Sparkles', earnedDate: 'Oct 2026', category: 'AI & ML' },
    { name: 'Build and Secure Networks in Google Cloud', icon: 'ShieldCheck', earnedDate: 'Sep 2026', category: 'Infrastructure' },
    { name: 'Implement Cloud Security & IAM Governance', icon: 'Lock', earnedDate: 'Aug 2026', category: 'Security' },
    { name: 'Serverless Cloud Run & Cloud Functions Deployments', icon: 'Zap', earnedDate: 'Jul 2026', category: 'Serverless' },
    { name: 'Modern App Architecture with Kubernetes Engine (GKE)', icon: 'Cpu', earnedDate: 'Jun 2026', category: 'DevOps' },
    { name: 'BigQuery Data Analytics & Predictive Big Lake', icon: 'Database', earnedDate: 'May 2026', category: 'Data & Analytics' },
  ],
  updatedAt: new Date().toISOString(),
};

interface GoogleSkillsProfileCardProps {
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
}

export const GoogleSkillsProfileCard: React.FC<GoogleSkillsProfileCardProps> = ({
  onHoverAction,
  onHoverEnd,
}) => {
  const [data, setData] = useState<GoogleSkillsData>(DEFAULT_GOOGLE_SKILLS);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  // Upgrade form state
  const [editPoints, setEditPoints] = useState<number>(2850);
  const [editBadgesCount, setEditBadgesCount] = useState<number>(24);
  const [editQuests, setEditQuests] = useState<number>(16);
  const [editLabs, setEditLabs] = useState<number>(98);
  const [editTier, setEditTier] = useState<string>('Google Cloud Arcade Legend // Gold Architect');
  const [editProfileUrl, setEditProfileUrl] = useState<string>('https://www.cloudskillsboost.google/public_profiles/4mn24ci023');
  const [newBadgeTitle, setNewBadgeTitle] = useState<string>('');
  const [newBadgeCategory, setNewBadgeCategory] = useState<string>('Generative AI');

  // Real-time Firestore sync listener for upgradable Google skills
  useEffect(() => {
    const docRef = doc(db, 'google_skills', '4mn24ci023');
    
    // Attempt initial fetch or seed
    getDoc(docRef).then((snap) => {
      if (!snap.exists()) {
        // Seed default record to Firestore
        setDoc(docRef, DEFAULT_GOOGLE_SKILLS).catch(() => {});
      } else {
        const val = snap.data() as GoogleSkillsData;
        setData(val);
        setEditPoints(val.totalPoints);
        setEditBadgesCount(val.skillBadgesCount);
        setEditQuests(val.questsCompleted);
        setEditLabs(val.labsCompleted);
        setEditTier(val.tier || DEFAULT_GOOGLE_SKILLS.tier);
        setEditProfileUrl(val.profileUrl || DEFAULT_GOOGLE_SKILLS.profileUrl);
      }
    }).catch(() => {});

    // Listen for live real-time updates
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const updated = docSnap.data() as GoogleSkillsData;
        setData(updated);
        setEditPoints(updated.totalPoints);
        setEditBadgesCount(updated.skillBadgesCount);
        setEditQuests(updated.questsCompleted);
        setEditLabs(updated.labsCompleted);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync / Refresh with server endpoint
  const handleCheckSync = async () => {
    setIsSyncing(true);
    trackButtonClick('google_skills_refresh');
    try {
      const res = await fetch('/api/google-skills');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.warn('Google skills refresh notice:', e);
    } finally {
      setTimeout(() => setIsSyncing(false), 500);
    }
  };

  // Submit Skill Upgrade
  const handleSaveUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);

    const updatedBadges = [...data.recentBadges];
    if (newBadgeTitle.trim()) {
      updatedBadges.unshift({
        name: newBadgeTitle.trim(),
        icon: 'Sparkles',
        earnedDate: 'Just Now',
        category: newBadgeCategory.trim() || 'Skill Badge',
      });
    }

    const updatedRecord: GoogleSkillsData = {
      ...data,
      accountEmail: '4mn24ci023@gmail.com',
      totalPoints: Number(editPoints) || data.totalPoints,
      skillBadgesCount: newBadgeTitle.trim() ? (Number(editBadgesCount) || data.skillBadgesCount) + 1 : (Number(editBadgesCount) || data.skillBadgesCount),
      questsCompleted: Number(editQuests) || data.questsCompleted,
      labsCompleted: Number(editLabs) || data.labsCompleted,
      tier: editTier.trim() || data.tier,
      profileUrl: editProfileUrl.trim() || data.profileUrl,
      recentBadges: updatedBadges,
      updatedAt: new Date().toISOString(),
    };

    try {
      // 1. Write directly to Firestore document for permanent live persistence
      const docRef = doc(db, 'google_skills', '4mn24ci023');
      await setDoc(docRef, updatedRecord);

      // 2. Also notify the backend API
      await fetch('/api/google-skills/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalPoints: updatedRecord.totalPoints,
          skillBadgesCount: updatedRecord.skillBadgesCount,
          questsCompleted: updatedRecord.questsCompleted,
          labsCompleted: updatedRecord.labsCompleted,
          tier: updatedRecord.tier,
          profileUrl: updatedRecord.profileUrl,
          newBadgeName: newBadgeTitle.trim() || undefined,
        }),
      });

      setData(updatedRecord);
      setNewBadgeTitle('');
      setUpgradeSuccess(true);
      trackEvent({
        eventType: 'button_click',
        eventName: 'google_skills_upgraded',
        category: 'skills',
        metadata: {
          points: updatedRecord.totalPoints,
          account: '4mn24ci023@gmail.com',
        },
      });

      setTimeout(() => {
        setUpgradeSuccess(false);
        setIsUpgradeModalOpen(false);
      }, 1200);
    } catch (err) {
      console.error('Failed to upgrade skills:', err);
      // Still update local UI state gracefully
      setData(updatedRecord);
      setIsUpgradeModalOpen(false);
    } finally {
      setIsSyncing(false);
    }
  };

  const getBadgeIcon = (iconName?: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'Lock':
        return <Lock className="w-4 h-4 text-cyan-400" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-blue-400" />;
      case 'Database':
        return <Database className="w-4 h-4 text-rose-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#FBBC05]" />;
    }
  };

  return (
    <motion.div
      id="google-skills-accreditation"
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mt-12 sm:mt-16 pt-12 border-t border-white/10"
    >
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#4285F4] uppercase mb-2">
            {/* Google 4-color dots */}
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
              <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
              <span className="w-2 h-2 rounded-full bg-[#FBBC05]" />
              <span className="w-2 h-2 rounded-full bg-[#34A853]" />
            </div>
            <span>GOOGLE CLOUD SKILLS BOOST // ACCREDITATION DOSSIER</span>
          </div>

          <h3 className="font-display text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-tighter">
            GOOGLE SKILLS PROFILE & POINTS
          </h3>
        </div>

        {/* Action Controls: Live Sync & Upgrade Skills Button */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => {
              setIsUpgradeModalOpen(true);
              trackButtonClick('open_upgrade_google_skills_modal');
            }}
            onMouseEnter={() => onHoverAction?.('UPGRADE')}
            onMouseLeave={onHoverEnd}
            className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#4285F4]/20 via-[#34A853]/20 to-[#FBBC05]/20 border border-white/20 hover:border-[#4285F4] hover:bg-[#4285F4]/30 text-white font-mono text-xs uppercase font-bold tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(66,133,244,0.2)] cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#FBBC05]" />
            <span>UPGRADE SKILLS / POINTS</span>
          </button>

          <button
            onClick={handleCheckSync}
            disabled={isSyncing}
            className="p-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-[#4285F4]/50 hover:bg-[#4285F4]/10 text-neutral-300 hover:text-[#4285F4] transition-all cursor-pointer disabled:opacity-50"
            title="Check for live skill upgrades"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#4285F4]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Google Skills Dashboard Card */}
      <div className="relative rounded-3xl border border-white/15 bg-neutral-950/90 p-6 sm:p-9 backdrop-blur-2xl shadow-2xl overflow-hidden">
        {/* Ambient Google Glow behind the card */}
        <div className="absolute top-0 -left-10 w-96 h-96 bg-[#4285F4]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-10 w-96 h-96 bg-[#34A853]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header Strip: Account Email Pill & Accreditation Tier */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#4285F4] shadow-inner">
              <Cloud className="w-5 h-5 text-[#4285F4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs sm:text-sm font-bold text-white tracking-wide">
                  {data.accountEmail}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  VERIFIED PROFILE
                </span>
              </div>
              <div className="text-xs font-mono text-neutral-400 mt-0.5">
                Primary Google Cloud Skills Boost & Arcade Profile
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-mono tracking-wider uppercase font-semibold flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{data.tier}</span>
            </div>
          </div>
        </div>

        {/* Live Auto-Refresh Ticker & Polling Telemetry Controller */}
        <div className="relative z-10 my-6">
          <GoogleSkillsAutoRefreshTicker
            initialPoints={data.totalPoints}
            accountEmail={data.accountEmail}
            defaultIntervalSeconds={60}
            onPointsUpdate={(newPoints, profile) => {
              setData((prev) => ({
                ...prev,
                totalPoints: newPoints,
                skillBadgesCount: profile.skillBadgesCount || prev.skillBadgesCount,
                questsCompleted: profile.questsCompleted || prev.questsCompleted,
                labsCompleted: profile.labsCompleted || prev.labsCompleted,
                tier: profile.tier || prev.tier,
                recentBadges: (profile.recentBadges as GoogleBadge[]) || prev.recentBadges,
                updatedAt: profile.updatedAt || new Date().toISOString(),
              }));
            }}
            onHoverAction={onHoverAction}
            onHoverEnd={onHoverEnd}
          />
        </div>

        {/* Central Stat Counters: Colossal Points Counter */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* HUGE ARCADE POINTS */}
          <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-white/[0.02] relative overflow-hidden group hover:border-[#FBBC05]/60 hover:bg-[#FBBC05]/[0.02] transition-all">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
              <span>GOOGLE SKILL POINTS</span>
              <Flame className="w-4 h-4 text-[#FBBC05] animate-pulse" />
            </div>
            <div className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight group-hover:text-[#FBBC05] transition-colors flex items-baseline gap-1">
              <span>{data.totalPoints.toLocaleString()}</span>
              <span className="text-sm font-mono text-[#FBBC05] font-normal">PTS</span>
            </div>
            <div className="text-[11px] font-mono text-neutral-400 mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Arcade points eligible</span>
            </div>
          </div>

          {/* SKILL BADGES */}
          <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-white/[0.02] relative overflow-hidden group hover:border-[#4285F4]/60 hover:bg-[#4285F4]/[0.02] transition-all">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
              <span>SKILL BADGES</span>
              <Award className="w-4 h-4 text-[#4285F4]" />
            </div>
            <div className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight group-hover:text-[#4285F4] transition-colors">
              {data.skillBadgesCount}
            </div>
            <div className="text-[11px] font-mono text-neutral-400 mt-2">
              Hands-on lab credentials
            </div>
          </div>

          {/* QUESTS COMPLETED */}
          <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-white/[0.02] relative overflow-hidden group hover:border-[#34A853]/60 hover:bg-[#34A853]/[0.02] transition-all">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
              <span>QUESTS COMPLETED</span>
              <Layers className="w-4 h-4 text-[#34A853]" />
            </div>
            <div className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight group-hover:text-[#34A853] transition-colors">
              {data.questsCompleted}
            </div>
            <div className="text-[11px] font-mono text-neutral-400 mt-2">
              Structured learning paths
            </div>
          </div>

          {/* HANDS-ON LABS */}
          <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-white/[0.02] relative overflow-hidden group hover:border-[#EA4335]/60 hover:bg-[#EA4335]/[0.02] transition-all">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
              <span>HANDS-ON LABS</span>
              <Cpu className="w-4 h-4 text-[#EA4335]" />
            </div>
            <div className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight group-hover:text-[#EA4335] transition-colors">
              {data.labsCompleted}+
            </div>
            <div className="text-[11px] font-mono text-neutral-400 mt-2">
              GCP console scenarios
            </div>
          </div>
        </div>

        {/* Featured Badges Grid */}
        <div className="relative z-10 pt-4">
          <div className="flex items-center justify-between mb-4 text-xs font-mono text-neutral-400">
            <span className="flex items-center gap-2 text-white font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#FBBC05]" />
              VERIFIED GOOGLE CLOUD CREDENTIALS & BADGES
            </span>
            <span className="text-neutral-500">Live updated</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {data.recentBadges.map((badge, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-white/10 bg-white/[0.015] hover:border-[#4285F4]/50 hover:bg-white/[0.03] transition-all duration-300 flex items-start gap-3.5 group"
              >
                <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-[#4285F4] transition-all">
                  {getBadgeIcon(badge.icon)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono text-[#4285F4] uppercase font-bold tracking-wider">
                      {badge.category}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500 shrink-0">
                      {badge.earnedDate}
                    </span>
                  </div>

                  <h5 className="font-sans text-xs sm:text-sm font-semibold text-white leading-snug group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {badge.name}
                  </h5>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Ribbon & Direct Link */}
        <div className="relative z-10 mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">LAST UPGRADE SYNC:</span>
            <span className="text-white">
              {new Date(data.updatedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="text-[#4285F4] hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Earned Badge</span>
            </button>

            <a
              href={data.profileUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackButtonClick('open_google_skills_public_profile')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:border-[#4285F4] hover:text-[#4285F4] text-neutral-200 transition-colors cursor-pointer"
            >
              <span>Public Skills Boost Profile</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </div>
      </div>

      {/* UPGRADE MODAL / DIALOG */}
      <AnimatePresence>
        {isUpgradeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUpgradeModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-neutral-950 p-6 sm:p-8 text-white shadow-2xl z-10 overflow-hidden"
            >
              {/* Modal Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#4285F4]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#4285F4] uppercase font-bold">
                    <Cloud className="w-3.5 h-3.5" />
                    <span>UPGRADE GOOGLE SKILLS PROFILE</span>
                  </div>
                  <h4 className="font-display text-xl sm:text-2xl font-bold uppercase mt-1">
                    {data.accountEmail}
                  </h4>
                </div>

                <button
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {upgradeSuccess ? (
                <div className="py-12 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-display text-2xl text-white uppercase mb-2">
                    SKILLS UPGRADED SUCCESSFULLY!
                  </h4>
                  <p className="text-sm font-mono text-neutral-400">
                    Live points and badges are synchronized to Firestore.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSaveUpgrade} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1.5">
                        Total Points
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editPoints}
                        onChange={(e) => setEditPoints(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/[0.03] text-white font-mono text-sm focus:border-[#4285F4] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1.5">
                        Skill Badges
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editBadgesCount}
                        onChange={(e) => setEditBadgesCount(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/[0.03] text-white font-mono text-sm focus:border-[#4285F4] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1.5">
                        Quests Completed
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editQuests}
                        onChange={(e) => setEditQuests(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/[0.03] text-white font-mono text-sm focus:border-[#4285F4] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1.5">
                        Hands-on Labs
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editLabs}
                        onChange={(e) => setEditLabs(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/[0.03] text-white font-mono text-sm focus:border-[#4285F4] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1.5">
                      Skill Tier & Title
                    </label>
                    <input
                      type="text"
                      value={editTier}
                      onChange={(e) => setEditTier(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/[0.03] text-white font-mono text-xs focus:border-[#4285F4] focus:outline-none"
                    />
                  </div>

                  {/* Add New Badge Row */}
                  <div className="pt-2 border-t border-white/10">
                    <div className="text-xs font-mono text-[#FBBC05] uppercase font-bold mb-2 flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Newly Earned Badge (Optional)</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Badge Name (e.g. Gemini Multimodal)"
                        value={newBadgeTitle}
                        onChange={(e) => setNewBadgeTitle(e.target.value)}
                        className="col-span-2 px-3 py-2 rounded-xl border border-white/15 bg-white/[0.03] text-white font-mono text-xs focus:border-[#FBBC05] focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Category (AI, Cloud...)"
                        value={newBadgeCategory}
                        onChange={(e) => setNewBadgeCategory(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-white/15 bg-white/[0.03] text-white font-mono text-xs focus:border-[#FBBC05] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsUpgradeModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-white/15 hover:bg-white/5 text-neutral-300 font-mono text-xs uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSyncing}
                      className="px-6 py-2.5 rounded-xl bg-[#4285F4] hover:bg-[#3367D6] text-white font-mono text-xs uppercase font-bold tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(66,133,244,0.4)] cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSyncing ? (
                        <>
                          <RotateCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving to Cloud...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Save & Upgrade Profile</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
