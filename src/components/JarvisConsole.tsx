import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal,
  Cpu,
  Zap,
  Activity,
  Sparkles,
  Briefcase,
  Download,
  Crosshair,
  Radio,
  Layers,
  ChevronRight,
  Volume2,
  VolumeX,
  Scan,
  ShieldCheck,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface JarvisConsoleProps {
  onOpenContact?: () => void;
  onOpenTalkToHim?: () => void;
  onOpenResume?: () => void;
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
}

type JarvisMode = 'core' | 'hirer' | 'matrix';

export const JarvisConsole: React.FC<JarvisConsoleProps> = ({
  onOpenContact,
  onOpenTalkToHim,
  onOpenResume,
  onHoverAction,
  onHoverEnd,
}) => {
  const [activeMode, setActiveMode] = useState<JarvisMode>('core');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(100);
  const [audioOscillation, setAudioOscillation] = useState<number[]>([]);
  const [systemUptime, setSystemUptime] = useState<string>('00:00:00');
  const [activeLogIndex, setActiveLogIndex] = useState<number>(0);

  // Subtle web audio sound effects
  const playHoloSound = (type: 'beep' | 'scan' | 'click') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'beep') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.08);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'scan') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch {
      // Audio context may be restricted before user interaction
    }
  };

  // Simulated live audio spectrum wave bars
  useEffect(() => {
    const interval = setInterval(() => {
      const bars = Array.from({ length: 18 }, () => Math.floor(Math.random() * 85) + 15);
      setAudioOscillation(bars);
    }, 90);
    return () => clearInterval(interval);
  }, []);

  // Live timer simulation
  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const diff = Math.floor((Date.now() - start) / 1000);
      const hours = String(Math.floor(diff / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
      const seconds = String(diff % 60).padStart(2, '0');
      setSystemUptime(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // System status logs rotating
  const logs = useMemo(
    () => [
      'J.A.R.V.I.S. PROTOCOL // ALL NEURAL CORES NOMINAL',
      'CANDIDATE: KISHAN H.P. // READY FOR HIGH-IMPACT ROLES',
      'STACK: REACT 19 • NEXT.JS • TYPESCRIPT • TAILWIND',
      'LATENCY: 8.3ms // SUB-50ms UI INTERACTION ACCORD',
      'ARCHITECTING HIGH-VELOCITY DIGITAL EXPERIENCES',
    ],
    []
  );

  useEffect(() => {
    const logInterval = setInterval(() => {
      setActiveLogIndex((prev) => (prev + 1) % logs.length);
    }, 3200);
    return () => clearInterval(logInterval);
  }, [logs.length]);

  // Recruiter scan trigger
  const triggerRecruiterScan = () => {
    setIsScanning(true);
    setScanProgress(10);
    playHoloSound('scan');

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          playHoloSound('beep');
          return 100;
        }
        return prev + 15;
      });
    }, 120);
  };

  const handleModeChange = (mode: JarvisMode) => {
    setActiveMode(mode);
    playHoloSound('click');
    if (mode === 'hirer') {
      triggerRecruiterScan();
    }
  };

  return (
    <div
      id="jarvis-sys-console"
      className="relative w-full h-full rounded-xl overflow-hidden bg-[#030914] border border-[#00f0ff]/30 p-4 md:p-5 flex flex-col justify-between select-none shadow-[inset_0_0_40px_rgba(0,240,255,0.08)]"
    >
      {/* Background Holographic Grid, Scanlines & Arc Reactor Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#00f0ff18_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#00f0ff]/5 via-transparent to-[#0284c7]/10 pointer-events-none" />

      {/* Subtle CRT Scanline overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-60 z-0" />

      {/* Top Holographic HUD Bar */}
      <div className="relative z-10 flex items-center justify-between gap-2 text-[10px] font-mono tracking-wider border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 bg-[#00f0ff]/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#00f0ff]/30 text-[#00f0ff] font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)]">
            <Terminal className="w-3 h-3 text-[#00f0ff] animate-pulse" />
            SYS.DEV // CONSOLE
          </span>

          <span className="hidden sm:inline-flex items-center gap-1 text-[9px] text-neutral-400 font-mono">
            <Activity className="w-2.5 h-2.5 text-[#00f0ff]" />
            UPTIME {systemUptime}
          </span>
        </div>

        {/* Audio FX & Status Pill */}
        <div className="flex items-center gap-2">
          <button
            id="jarvis-sound-toggle"
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playHoloSound('beep');
            }}
            title={soundEnabled ? 'Mute J.A.R.V.I.S. Audio FX' : 'Enable J.A.R.V.I.S. Audio FX'}
            className={`p-1.5 rounded-full border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
          </button>

          <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30 flex items-center gap-1 font-bold text-[9px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            J.A.R.V.I.S. ONLINE
          </span>
        </div>
      </div>

      {/* Mode Navigation Tabs: ARC CORE | HIRER SCAN | TECH MATRIX */}
      <div className="relative z-10 flex items-center justify-between gap-1 mt-2 p-1 rounded-lg bg-black/60 border border-white/10">
        <button
          id="jarvis-tab-core"
          onClick={() => handleModeChange('core')}
          onMouseEnter={() => onHoverAction?.('ARC CORE')}
          onMouseLeave={onHoverEnd}
          className={`flex-1 py-1.5 px-1.5 xs:px-2 rounded text-[9px] xs:text-[10px] font-mono tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 ${
            activeMode === 'core'
              ? 'bg-[#00f0ff] text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.5)]'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Crosshair className="w-3 h-3 shrink-0" />
          <span>CORE</span>
        </button>

        <button
          id="jarvis-tab-hirer"
          onClick={() => handleModeChange('hirer')}
          onMouseEnter={() => onHoverAction?.('HIRER SCAN')}
          onMouseLeave={onHoverEnd}
          className={`flex-1 py-1.5 px-1.5 xs:px-2 rounded text-[9px] xs:text-[10px] font-mono tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 relative ${
            activeMode === 'hirer'
              ? 'bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] text-black font-bold shadow-[0_0_20px_rgba(0,240,255,0.6)]'
              : 'text-neutral-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="relative flex h-1.5 w-1.5 xs:h-2 xs:w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 xs:h-2 xs:w-2 bg-[#00f0ff]" />
          </span>
          <Briefcase className="w-3 h-3 shrink-0 text-current" />
          <span>HIRER</span>
        </button>

        <button
          id="jarvis-tab-matrix"
          onClick={() => handleModeChange('matrix')}
          onMouseEnter={() => onHoverAction?.('TECH MATRIX')}
          onMouseLeave={onHoverEnd}
          className={`flex-1 py-1.5 px-1.5 xs:px-2 rounded text-[9px] xs:text-[10px] font-mono tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 ${
            activeMode === 'matrix'
              ? 'bg-[#00f0ff] text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.5)]'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-3 h-3 shrink-0" />
          <span>MATRIX</span>
        </button>
      </div>

      {/* Main Interactive HUD Display Area */}
      <div className="relative z-10 my-auto py-2 flex flex-col items-center justify-center min-h-[200px] sm:min-h-[220px]">
        <AnimatePresence mode="wait">
          {/* 1. ARC REACTOR CORE VIEW */}
          {activeMode === 'core' && (
            <motion.div
              key="core-view"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="relative w-full flex flex-col items-center"
            >
              {/* Central Holographic Gyroscope Arc Reactor */}
              <div className="relative w-36 h-36 xs:w-44 xs:h-44 sm:w-48 sm:h-48 flex items-center justify-center">
                {/* Ambient Plasma Ring Glow */}
                <div className="absolute inset-0 rounded-full bg-[#00f0ff]/15 blur-2xl animate-pulse pointer-events-none" />

                <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                  <defs>
                    <linearGradient id="jarvisArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
                    </linearGradient>
                    <radialGradient id="reactorGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                      <stop offset="60%" stopColor="#00f0ff" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Outer Calibrated Azimuth Ring with degree ticks */}
                  <circle
                    cx="100"
                    cy="100"
                    r="92"
                    stroke="rgba(0,240,255,0.2)"
                    strokeWidth="1"
                    strokeDasharray="4 8"
                    className="animate-[spin_40s_linear_infinite]"
                    style={{ transformOrigin: 'center' }}
                  />

                  {/* Outer Telemetry Segment Arcs */}
                  <circle
                    cx="100"
                    cy="100"
                    r="84"
                    stroke="url(#jarvisArcGrad)"
                    strokeWidth="2"
                    strokeDasharray="45 15 15 15 60 25"
                    className="animate-[spin_22s_linear_infinite]"
                    style={{ transformOrigin: 'center' }}
                  />

                  {/* Counter-rotating Segment Ring */}
                  <circle
                    cx="100"
                    cy="100"
                    r="72"
                    stroke="#00f0ff"
                    strokeWidth="1.5"
                    strokeDasharray="20 40 10 30"
                    strokeOpacity="0.75"
                    className="animate-[spin_16s_linear_infinite_reverse]"
                    style={{ transformOrigin: 'center' }}
                  />

                  {/* Hexagonal Node Aperture points */}
                  {[0, 60, 120, 180, 240, 300].map((deg, i) => {
                    const rad = (deg * Math.PI) / 180;
                    const x = 100 + 64 * Math.cos(rad);
                    const y = 100 + 64 * Math.sin(rad);
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="2.5"
                        fill="#00f0ff"
                        className="animate-ping"
                        style={{ animationDuration: `${2 + i * 0.4}s` }}
                      />
                    );
                  })}

                  {/* Middle Energy Aperture Ring */}
                  <circle
                    cx="100"
                    cy="100"
                    r="52"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1"
                    strokeDasharray="2 6"
                  />

                  {/* High-speed Inner Reactor Ring */}
                  <circle
                    cx="100"
                    cy="100"
                    r="36"
                    stroke="#00f0ff"
                    strokeWidth="2.5"
                    strokeDasharray="8 12 24 8"
                    className="animate-[spin_6s_linear_infinite]"
                    style={{ transformOrigin: 'center' }}
                  />

                  {/* Center Reactor Plasma Core */}
                  <circle cx="100" cy="100" r="22" fill="url(#reactorGlow)" />
                  <circle cx="100" cy="100" r="14" fill="#00f0ff" fillOpacity="0.25" className="animate-pulse" />
                  <circle cx="100" cy="100" r="6" fill="#00f0ff" className="shadow-[0_0_15px_#00f0ff]" />

                  {/* Crosshairs */}
                  <line x1="15" y1="100" x2="185" y2="100" stroke="rgba(0,240,255,0.15)" strokeWidth="0.75" />
                  <line x1="100" y1="15" x2="100" y2="185" stroke="rgba(0,240,255,0.15)" strokeWidth="0.75" />
                </svg>

                {/* Central Hologram Icon Floating */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Zap className="w-5 h-5 text-white drop-shadow-[0_0_8px_#00f0ff] animate-pulse" />
                </div>

                {/* Corner Telemetry Badges */}
                <div className="absolute top-1 left-0 font-mono text-[9px] text-[#00f0ff]/80">
                  <span className="block text-[8px] text-neutral-500">EFFICIENCY</span>
                  99.8%
                </div>
                <div className="absolute top-1 right-0 font-mono text-[9px] text-right text-[#00f0ff]/80">
                  <span className="block text-[8px] text-neutral-500">REACTOR PWR</span>
                  1.21 GW
                </div>
                <div className="absolute bottom-1 left-0 font-mono text-[9px] text-[#00f0ff]/80">
                  <span className="block text-[8px] text-neutral-500">FRAME RATE</span>
                  120 FPS
                </div>
                <div className="absolute bottom-1 right-0 font-mono text-[9px] text-right text-[#00f0ff]/80">
                  <span className="block text-[8px] text-neutral-500">TEMP</span>
                  31.4°C
                </div>
              </div>

              {/* Holographic J.A.R.V.I.S. Audio Spectrum Waveform */}
              <div className="w-full mt-2 flex items-center justify-center gap-1 h-6 px-3">
                {audioOscillation.map((val, idx) => (
                  <span
                    key={idx}
                    className="w-1 bg-[#00f0ff] rounded-full transition-all duration-75"
                    style={{
                      height: `${val}%`,
                      opacity: 0.35 + (val / 100) * 0.65,
                      boxShadow: val > 60 ? '0 0 6px #00f0ff' : 'none',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* 2. RECRUITER & HIRER PROTOCOL SCAN (MAGNET FOR HIRERS) */}
          {activeMode === 'hirer' && (
            <motion.div
              key="hirer-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="relative w-full space-y-2.5 p-2 rounded-xl bg-black/50 border border-[#00f0ff]/30 overflow-hidden"
            >
              {/* Scanning Laser Beam Sweep Animation */}
              {isScanning && (
                <motion.div
                  initial={{ top: '0%' }}
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                  className="absolute left-0 right-0 h-[2px] bg-[#00f0ff] shadow-[0_0_15px_#00f0ff] z-20 pointer-events-none"
                />
              )}

              {/* Hirer Scan Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[10px] font-mono">
                <div className="flex items-center gap-1.5 text-[#00f0ff] font-bold">
                  <Scan className="w-3.5 h-3.5 animate-spin" />
                  <span>CANDIDATE SUITABILITY AUDIT</span>
                </div>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  {scanProgress}% MATCH
                </span>
              </div>

              {/* Candidate Quick Stats for Recruiter */}
              <div className="grid grid-cols-2 gap-2 text-left">
                <div className="p-2 rounded bg-white/[0.03] border border-white/10">
                  <span className="text-[9px] font-mono uppercase text-neutral-400 block">ROLE PROFILE</span>
                  <span className="text-xs font-condensed font-bold text-white tracking-wide">
                    Full-Stack & Frontend Lead
                  </span>
                </div>

                <div className="p-2 rounded bg-white/[0.03] border border-white/10">
                  <span className="text-[9px] font-mono uppercase text-neutral-400 block">ONBOARDING VELOCITY</span>
                  <span className="text-xs font-condensed font-bold text-[#00f0ff] tracking-wide">
                    Immediate Ship (Day 1)
                  </span>
                </div>
              </div>

              {/* Hirer Key Strengths Checklist */}
              <div className="space-y-1 text-left font-mono text-[10px]">
                <div className="flex items-center gap-1.5 text-neutral-200">
                  <CheckCircle2 className="w-3 h-3 text-[#00f0ff] shrink-0" />
                  <span>Production-tested React 19, Next.js & TS</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-200">
                  <CheckCircle2 className="w-3 h-3 text-[#00f0ff] shrink-0" />
                  <span>Sub-50ms Micro-interactions & Motion design</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-200">
                  <CheckCircle2 className="w-3 h-3 text-[#00f0ff] shrink-0" />
                  <span>Scalable REST/GraphQL, Node & Cloud deployments</span>
                </div>
              </div>

              {/* Direct Recruiter CTAs inside Console */}
              <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                <button
                  id="jarvis-hire-now-btn"
                  onClick={() => {
                    playHoloSound('click');
                    if (onOpenTalkToHim) onOpenTalkToHim();
                    else if (onOpenContact) onOpenContact();
                  }}
                  className="flex-1 py-2 px-2.5 rounded-lg bg-[#00f0ff] hover:bg-[#38bdf8] text-black font-condensed font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
                >
                  <Briefcase className="w-3 h-3" />
                  <span>HIRE / TALK TO HIM</span>
                </button>

                <button
                  id="jarvis-cv-btn"
                  onClick={() => {
                    playHoloSound('click');
                    if (onOpenResume) onOpenResume();
                  }}
                  className="py-2 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-condensed font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3 h-3 text-[#00f0ff]" />
                  <span>DOSSIER</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* 3. TECH MATRIX & SUBSYSTEM POWER DISTRIBUTION */}
          {activeMode === 'matrix' && (
            <motion.div
              key="matrix-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative w-full space-y-2 p-2 rounded-xl bg-black/50 border border-[#00f0ff]/20 text-left font-mono"
            >
              <div className="flex items-center justify-between text-[10px] text-neutral-400 border-b border-white/10 pb-1.5">
                <span className="flex items-center gap-1 text-[#00f0ff]">
                  <Cpu className="w-3 h-3" /> SUBSYSTEM POWER MATRIX
                </span>
                <span>OVERCLOCKED</span>
              </div>

              {[
                { name: 'React 19 / Next.js', pwr: 98, status: 'MAX FLUX', color: 'bg-[#00f0ff]' },
                { name: 'TypeScript / Architecture', pwr: 96, status: 'OPTIMAL', color: 'bg-cyan-400' },
                { name: 'UI/UX & Creative Motion', pwr: 99, status: 'MASTER', color: 'bg-emerald-400' },
                { name: 'Backend / Node / APIs', pwr: 92, status: 'SYNCHRONIZED', color: 'bg-blue-400' },
              ].map((sub, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-white font-medium">{sub.name}</span>
                    <span className="text-neutral-400">
                      {sub.pwr}% [{sub.status}]
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sub.pwr}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className={`h-full ${sub.color} rounded-full shadow-[0_0_8px_rgba(0,240,255,0.6)]`}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-1.5 flex items-center justify-between text-[9px] text-neutral-400 border-t border-white/5">
                <span>RUNTIME: BROWSER + V8</span>
                <span className="text-[#00f0ff]">ZERO TECH DEBT</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Holographic Directive & Live Log Ticker */}
      <div className="relative z-10 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/10">
        <div className="flex items-center justify-between text-[9px] font-mono text-[#00f0ff] mb-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#00f0ff]" />
            JARVIS DIRECTIVE v4.9
          </span>
          <span className="text-neutral-500 font-mono">NODE: BANGALORE</span>
        </div>

        <div className="font-mono text-[10px] text-neutral-300 leading-snug line-clamp-1 flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3 text-[#00f0ff] shrink-0 animate-pulse" />
          <span className="truncate">{logs[activeLogIndex]}</span>
        </div>
      </div>
    </div>
  );
};
