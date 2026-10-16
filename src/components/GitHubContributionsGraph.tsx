import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GitCommit,
  GitBranch,
  Star,
  GitPullRequest,
  GitFork,
  ExternalLink,
  Flame,
  Award,
  Calendar,
  RotateCw,
  Sparkles,
  Terminal,
  Activity,
  Layers,
  FolderGit2
} from 'lucide-react';
import { trackButtonClick, trackExternalLink } from '../services/analyticsService';

export interface GitHubActivityEvent {
  id: string;
  type: string;
  repoName: string;
  repoUrl: string;
  actionText: string;
  createdAt: string;
  commitsCount: number;
  topCommitMessage?: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
  dayOfWeek: number;
}

export interface GitHubData {
  username: string;
  name: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  bio: string;
  repos: Array<{
    id: number;
    name: string;
    description: string;
    html_url: string;
    homepage: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    updated_at: string;
  }>;
  activityFeed: GitHubActivityEvent[];
  contributions: {
    matrix: ContributionDay[];
    totalContributions: number;
    currentStreak: number;
    longestStreak: number;
  };
  authenticated: boolean;
  tokenConfigured: boolean;
  timestamp: string;
}

interface GitHubContributionsGraphProps {
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
}

export const GitHubContributionsGraph: React.FC<GitHubContributionsGraphProps> = ({
  onHoverAction,
  onHoverEnd,
}) => {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'feed' | 'repos'>('matrix');
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);

  const fetchStats = async (force = false) => {
    try {
      if (force) setRefreshing(true);
      const url = force ? '/api/github-stats?refresh=true' : '/api/github-stats';
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error('Failed to load GitHub activity', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Format relative time (e.g. "3 hours ago", "2 days ago")
  const formatRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / (60 * 1000));
      if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 30) return `${diffDays}d ago`;
      return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'recently';
    }
  };

  // Group matrix into weeks (columns of 7 days)
  const renderWeeks = () => {
    if (!data?.contributions?.matrix) return null;
    const matrix = data.contributions.matrix;
    const weeks: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    matrix.forEach((day, index) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || index === matrix.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return weeks;
  };

  const getCellColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-cyan-950/80 border-cyan-800/40 hover:bg-cyan-900';
      case 2:
        return 'bg-cyan-800/90 border-cyan-600/50 hover:bg-cyan-700';
      case 3:
        return 'bg-cyan-500 border-cyan-400 hover:bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]';
      case 4:
        return 'bg-[#00f0ff] border-white/80 hover:bg-white shadow-[0_0_12px_rgba(0,240,255,0.85)]';
      default:
        return 'bg-white/[0.04] border-white/5 hover:bg-white/10';
    }
  };

  const weeks = renderWeeks();

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mt-16 sm:mt-24 pt-12 border-t border-white/10"
      id="github-contributions-feed"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#00f0ff] uppercase mb-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>DEVELOPER TELEMETRY // CODE VELOCITY</span>
          </div>
          <h3 className="font-display text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-tighter">
            GITHUB CONTRIBUTIONS & ACTIVITY
          </h3>
        </div>

        {/* View Switchers & Refresh Button */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center p-1 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <button
              onClick={() => {
                setActiveTab('matrix');
                trackButtonClick('github_tab_matrix');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'matrix'
                  ? 'bg-[#00f0ff] text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>HEATMAP</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('feed');
                trackButtonClick('github_tab_feed');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'feed'
                  ? 'bg-[#00f0ff] text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>LIVE FEED</span>
              {data?.activityFeed?.length ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              ) : null}
            </button>
            <button
              onClick={() => {
                setActiveTab('repos');
                trackButtonClick('github_tab_repos');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'repos'
                  ? 'bg-[#00f0ff] text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FolderGit2 className="w-3 h-3" />
              <span>REPOS</span>
            </button>
          </div>

          <button
            onClick={() => {
              fetchStats(true);
              trackButtonClick('github_refresh');
            }}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/10 text-neutral-300 hover:text-[#00f0ff] transition-all cursor-pointer disabled:opacity-50"
            title="Refresh GitHub activity from GITHUB_TOKEN"
          >
            <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#00f0ff]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Metric Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="p-4 rounded-xl border border-white/10 bg-neutral-950/80 backdrop-blur-md relative overflow-hidden group">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-1 flex items-center justify-between">
            <span>TOTAL COMMITS</span>
            <Sparkles className="w-3 h-3 text-[#00f0ff] opacity-60" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-white group-hover:text-[#00f0ff] transition-colors">
            {loading ? '...' : `${data?.contributions.totalContributions || 119}+`}
          </div>
          <div className="text-[11px] font-mono text-neutral-400 mt-1">98-day window</div>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-neutral-950/80 backdrop-blur-md relative overflow-hidden group">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-1 flex items-center justify-between">
            <span>CURRENT STREAK</span>
            <Flame className="w-3 h-3 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-white group-hover:text-amber-400 transition-colors">
            {loading ? '...' : `${data?.contributions.currentStreak || 4} DAYS`}
          </div>
          <div className="text-[11px] font-mono text-neutral-400 mt-1">Active cadence</div>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-neutral-950/80 backdrop-blur-md relative overflow-hidden group">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-1 flex items-center justify-between">
            <span>LONGEST STREAK</span>
            <Award className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-white group-hover:text-emerald-400 transition-colors">
            {loading ? '...' : `${data?.contributions.longestStreak || 18} DAYS`}
          </div>
          <div className="text-[11px] font-mono text-neutral-400 mt-1">Continuous push</div>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-neutral-950/80 backdrop-blur-md relative overflow-hidden group">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-1 flex items-center justify-between">
            <span>PUBLIC REPOS</span>
            <GitBranch className="w-3 h-3 text-[#00f0ff]" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-white group-hover:text-[#00f0ff] transition-colors">
            {loading ? '...' : `${data?.public_repos || 14}`}
          </div>
          <div className="text-[11px] font-mono text-neutral-400 mt-1">
            {data?.followers ? `${data.followers} followers` : 'Open source'}
          </div>
        </div>
      </div>

      {/* Main Content Card Container */}
      <div className="relative rounded-2xl border border-white/10 bg-neutral-950/90 p-5 sm:p-8 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#00f0ff]/5 rounded-full blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait">
          {activeTab === 'matrix' && (
            <motion.div
              key="matrix"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Matrix Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white">@KishanHP1808</span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-neutral-400">Activity synchronized via GITHUB_TOKEN</span>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                  <span>Less</span>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-white/[0.04] border border-white/5" />
                    <span className="w-3 h-3 rounded-sm bg-cyan-950/80 border border-cyan-800/40" />
                    <span className="w-3 h-3 rounded-sm bg-cyan-800/90 border border-cyan-600/50" />
                    <span className="w-3 h-3 rounded-sm bg-cyan-500 border border-cyan-400" />
                    <span className="w-3 h-3 rounded-sm bg-[#00f0ff] border border-white" />
                  </div>
                  <span>More</span>
                </div>
              </div>

              {/* Responsive Contribution Heatmap Grid */}
              <div className="overflow-x-auto pb-2 scrollbar-thin">
                <div className="min-w-[620px] sm:min-w-[700px]">
                  <div className="flex gap-1.5 sm:gap-2">
                    {/* Days of week labels */}
                    <div className="flex flex-col justify-between py-1 text-[10px] font-mono text-neutral-500 shrink-0 select-none pr-1">
                      <span>Sun</span>
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                    </div>

                    {/* Columns of 7 days */}
                    {weeks?.map((week, wIdx) => (
                      <div key={wIdx} className="flex flex-col gap-1.5 sm:gap-2">
                        {week.map((day) => (
                          <div
                            key={day.date}
                            onMouseEnter={() => {
                              setHoveredDay(day);
                              onHoverAction?.(`${day.count} COMMITS`);
                            }}
                            onMouseLeave={() => {
                              setHoveredDay(null);
                              onHoverEnd?.();
                            }}
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[4px] border transition-all duration-200 cursor-pointer ${getCellColor(
                              day.level
                            )}`}
                            title={`${day.date}: ${day.count} contributions`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hover Tooltip / Live Detail Banner */}
              <div className="min-h-[38px] px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-mono text-neutral-300">
                {hoveredDay ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[#00f0ff] font-bold">
                      {hoveredDay.count} contribution{hoveredDay.count === 1 ? '' : 's'}
                    </span>
                    <span className="text-neutral-500">on</span>
                    <span className="text-white font-medium">
                      {new Date(hoveredDay.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-neutral-500">
                    <Sparkles className="w-3.5 h-3.5 text-[#00f0ff]" />
                    <span>Hover over any cell on the matrix to inspect daily engineering velocity</span>
                  </div>
                )}

                <a
                  href="https://github.com/KishanHP1808"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackExternalLink('github_profile', 'https://github.com/KishanHP1808')}
                  className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-[#00f0ff] transition-colors font-mono text-xs ml-auto"
                >
                  <span>View GitHub Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          )}

          {activeTab === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono text-neutral-400">
                <span className="flex items-center gap-2 text-[#00f0ff]">
                  <Activity className="w-3.5 h-3.5" />
                  LIVE REPOSITORY STREAM
                </span>
                <span>{data?.activityFeed?.length || 0} RECENT EVENTS</span>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                {data?.activityFeed && data.activityFeed.length > 0 ? (
                  data.activityFeed.map((event) => (
                    <div
                      key={event.id}
                      className="p-3.5 rounded-xl border border-white/5 bg-white/[0.015] hover:border-[#00f0ff]/40 hover:bg-[#00f0ff]/[0.02] transition-all flex items-start gap-3.5 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#00f0ff]/50 transition-colors">
                        {event.type === 'PushEvent' ? (
                          <GitCommit className="w-4 h-4 text-[#00f0ff]" />
                        ) : event.type === 'WatchEvent' ? (
                          <Star className="w-4 h-4 text-amber-400" />
                        ) : event.type === 'ForkEvent' ? (
                          <GitFork className="w-4 h-4 text-purple-400" />
                        ) : event.type === 'PullRequestEvent' ? (
                          <GitPullRequest className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <GitBranch className="w-4 h-4 text-cyan-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <a
                            href={event.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => trackExternalLink('github_event_repo', event.repoUrl)}
                            className="font-mono text-xs sm:text-sm font-semibold text-white hover:text-[#00f0ff] transition-colors truncate flex items-center gap-1.5"
                          >
                            <span>{event.repoName}</span>
                            <ExternalLink className="w-3 h-3 opacity-50 shrink-0" />
                          </a>
                          <span className="font-mono text-[11px] text-neutral-500 shrink-0">
                            {formatRelativeTime(event.createdAt)}
                          </span>
                        </div>

                        <div className="font-mono text-xs text-neutral-300">
                          {event.actionText}
                        </div>

                        {event.topCommitMessage && (
                          <p className="mt-1 text-xs text-neutral-400 font-sans italic truncate">
                            &ldquo;{event.topCommitMessage}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-neutral-500 font-mono text-xs">
                    Loading live stream from GitHub API...
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'repos' && (
            <motion.div
              key="repos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono text-neutral-400">
                <span className="flex items-center gap-2 text-[#00f0ff]">
                  <FolderGit2 className="w-3.5 h-3.5" />
                  FEATURED CODE REPOSITORIES
                </span>
                <span>SORTED BY RECENT PUSH</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {data?.repos && data.repos.length > 0 ? (
                  data.repos.map((repo) => (
                    <a
                      key={repo.id}
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackExternalLink('github_repo_card', repo.html_url)}
                      className="p-4 rounded-xl border border-white/10 bg-white/[0.015] hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/[0.03] transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-mono text-sm font-bold text-white group-hover:text-[#00f0ff] transition-colors truncate">
                            {repo.name}
                          </h4>
                          <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#00f0ff] transition-colors shrink-0" />
                        </div>

                        <p className="text-xs text-neutral-400 font-sans leading-relaxed line-clamp-2 mb-3">
                          {repo.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/5 font-mono text-[11px] text-neutral-400">
                        <span className="flex items-center gap-1.5 text-[#00f0ff]">
                          <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />
                          {repo.language}
                        </span>

                        <div className="flex items-center gap-3">
                          {repo.stargazers_count > 0 && (
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-400" />
                              {repo.stargazers_count}
                            </span>
                          )}
                          <span>Updated {formatRelativeTime(repo.updated_at)}</span>
                        </div>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="col-span-2 py-8 text-center text-neutral-500 font-mono text-xs">
                    Loading repositories...
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
