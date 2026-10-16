import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RotateCw,
  Play,
  Pause,
  CheckCircle2,
  Sparkles,
  Flame,
  Cloud,
  TrendingUp,
  Clock,
  ShieldCheck,
  Zap
} from 'lucide-react';
import {
  fetchAndUpdateGoogleSkillsPoints,
  GoogleSkillsProfileData,
  GoogleSkillsSyncResult,
  trackButtonClick
} from '../services/analyticsService';

interface GoogleSkillsAutoRefreshTickerProps {
  initialPoints?: number;
  accountEmail?: string;
  defaultIntervalSeconds?: number;
  onPointsUpdate?: (newPoints: number, profile: GoogleSkillsProfileData) => void;
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
}

const INTERVAL_OPTIONS = [
  { label: '30s', value: 30 },
  { label: '60s', value: 60 },
  { label: '2m', value: 120 },
  { label: '5m', value: 300 },
];

export const GoogleSkillsAutoRefreshTicker: React.FC<GoogleSkillsAutoRefreshTickerProps> = ({
  initialPoints = 2850,
  accountEmail = '4mn24ci023@gmail.com',
  defaultIntervalSeconds = 60,
  onPointsUpdate,
  onHoverAction,
  onHoverEnd,
}) => {
  const [points, setPoints] = useState<number>(initialPoints);
  const [pointsDelta, setPointsDelta] = useState<number | null>(null);
  const [isAutoRefreshActive, setIsAutoRefreshActive] = useState<boolean>(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(defaultIntervalSeconds);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(defaultIntervalSeconds);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync function wrapped for manual & scheduled calls
  const performSync = async (forceScrape = false) => {
    setIsSyncing(true);
    setSyncStatus('syncing');

    try {
      const result: GoogleSkillsSyncResult = await fetchAndUpdateGoogleSkillsPoints(accountEmail, {
        forceRefresh: true,
        forceScrape,
      });

      if (result.success && result.data) {
        setPoints(result.data.totalPoints);
        if (result.pointsDelta > 0) {
          setPointsDelta(result.pointsDelta);
          setTimeout(() => setPointsDelta(null), 5000);
        }
        if (onPointsUpdate) {
          onPointsUpdate(result.data.totalPoints, result.data);
        }
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setSyncStatus('success');
      } else {
        setSyncStatus('idle');
      }
    } catch {
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
      setSecondsRemaining(refreshInterval);
      setTimeout(() => setSyncStatus('idle'), 2500);
    }
  };

  // Main countdown & polling timer loop
  useEffect(() => {
    if (!isAutoRefreshActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          performSync(false);
          return refreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoRefreshActive, refreshInterval]);

  // Listen for external sync broadcasts from anywhere in the app
  useEffect(() => {
    const handleExternalSync = (e: Event) => {
      const customEvent = e as CustomEvent<GoogleSkillsSyncResult>;
      if (customEvent.detail?.data) {
        setPoints(customEvent.detail.data.totalPoints);
        setSecondsRemaining(refreshInterval);
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    };

    window.addEventListener('google-skills-synced', handleExternalSync);
    return () => window.removeEventListener('google-skills-synced', handleExternalSync);
  }, [refreshInterval]);

  // Progress percentage for circular/linear gauge
  const progressPercent = ((refreshInterval - secondsRemaining) / refreshInterval) * 100;

  return (
    <div
      id="google-skills-score-ticker"
      className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden select-none"
    >
      {/* Background Subtle Google Gradient Arc */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-[#4285F4]/10 via-transparent to-transparent pointer-events-none" />

      {/* Left Column: Live Score & Account Identity */}
      <div className="flex items-center gap-3.5 w-full md:w-auto">
        <div className="relative">
          <div className="w-11 h-11 rounded-xl bg-[#4285F4]/15 border border-[#4285F4]/40 flex items-center justify-center text-[#FBBC05] shadow-[0_0_15px_rgba(66,133,244,0.3)]">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>

          {/* Pulsing Live Radar Indicator */}
          {isAutoRefreshActive && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-black" />
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#4285F4] uppercase font-bold flex items-center gap-1">
              <span>LIVE GOOGLE SKILLS SCORE</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono text-neutral-300">
              {accountEmail}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              {points.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-[#FBBC05] font-bold">PTS</span>

            {/* Points Gain Notification */}
            <AnimatePresence>
              {pointsDelta !== null && (
                <motion.span
                  initial={{ opacity: 0, y: 5, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.9 }}
                  className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-0.5 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                >
                  <TrendingUp className="w-3 h-3" />
                  +{pointsDelta} PTS UPGRADE!
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Center Column: Auto-Refresh Countdown Timer & Progress Bar */}
      <div className="flex flex-col items-center gap-1.5 w-full md:w-auto">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
          <Clock className="w-3.5 h-3.5 text-[#4285F4]" />
          <span>
            {isAutoRefreshActive ? (
              <>
                Auto-sync in <span className="text-[#00f0ff] font-bold">{secondsRemaining}s</span>
              </>
            ) : (
              <span className="text-amber-400 font-bold">AUTO-REFRESH PAUSED</span>
            )}
          </span>
          <span className="text-neutral-500">•</span>
          <span className="text-neutral-400 text-[11px]">Synced {lastSyncTime}</span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full md:w-52 h-1.5 rounded-full bg-white/10 overflow-hidden relative">
          <motion.div
            className={`h-full rounded-full transition-all duration-300 ${
              isSyncing
                ? 'bg-gradient-to-r from-[#4285F4] to-[#00f0ff] animate-pulse w-full'
                : 'bg-gradient-to-r from-[#4285F4] via-[#FBBC05] to-[#34A853]'
            }`}
            style={{ width: isSyncing ? '100%' : `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Right Column: Timer Interval Picker & Controls */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        {/* Interval Selector Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] font-mono">
          {INTERVAL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setRefreshInterval(opt.value);
                setSecondsRemaining(opt.value);
                trackButtonClick('skills_ticker_interval_change', { interval: opt.value });
              }}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                refreshInterval === opt.value
                  ? 'bg-[#4285F4] text-white font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Play/Pause Timer Button */}
        <button
          onClick={() => {
            const nextState = !isAutoRefreshActive;
            setIsAutoRefreshActive(nextState);
            trackButtonClick('skills_ticker_toggle_pause', { active: nextState });
          }}
          className="p-2 rounded-xl border border-white/10 bg-white/[0.03] hover:border-white/30 text-neutral-300 hover:text-white transition-all cursor-pointer"
          title={isAutoRefreshActive ? 'Pause auto-refresh timer' : 'Resume auto-refresh timer'}
        >
          {isAutoRefreshActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
        </button>

        {/* Manual Instant Sync Button */}
        <button
          onClick={() => {
            performSync(true);
            trackButtonClick('skills_ticker_sync_now');
          }}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#4285F4]/40 bg-[#4285F4]/15 hover:bg-[#4285F4]/30 hover:border-[#4285F4] text-white font-mono text-xs font-bold transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(66,133,244,0.2)]"
          title="Force immediate scrape and live sync with Google Cloud Skills Boost"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#FBBC05]' : ''}`} />
          <span className="hidden sm:inline">SYNC NOW</span>
        </button>
      </div>
    </div>
  );
};
