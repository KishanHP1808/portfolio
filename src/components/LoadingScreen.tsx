import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  Zap,
  Volume2,
  VolumeX,
  Gauge,
  FastForward,
  Flame,
  Activity,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const completedRef = useRef(false);

  // Speed state: 0 to 200 km/h
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(1000);
  const [gear, setGear] = useState('1');
  const [boostPsi, setBoostPsi] = useState(0);
  const [isRedline, setIsRedline] = useState(false);
  const [hasReached200, setHasReached200] = useState(false);
  const [screenFlash, setScreenFlash] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const engineGainRef = useRef<GainNode | null>(null);
  const engineOscRef = useRef<OscillatorNode | null>(null);

  // Initialize Web Audio safely
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  // Bulletproof instant skip handler
  const handleSkip = useCallback(
    (e?: React.SyntheticEvent) => {
      e?.stopPropagation();
      e?.preventDefault();
      if (completedRef.current) return;
      completedRef.current = true;
      if (engineOscRef.current) {
        try {
          engineOscRef.current.stop();
        } catch {
          // ignore
        }
      }
      onComplete();
    },
    [onComplete]
  );

  // Keyboard shortcut listener for instantaneous skipping (Escape, Space, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  // Web Audio engine sound synthesis
  useEffect(() => {
    if (!soundEnabled) {
      if (engineGainRef.current) {
        engineGainRef.current.gain.value = 0;
      }
      return;
    }

    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      if (!engineOscRef.current) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        engineOscRef.current = osc;
        engineGainRef.current = gain;
      }

      if (engineOscRef.current && engineGainRef.current) {
        // Pitch shifts with RPM
        const targetFreq = 45 + (rpm / 9000) * 180;
        engineOscRef.current.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.05);
        engineGainRef.current.gain.setTargetAtTime(0.05, ctx.currentTime, 0.05);
      }
    } catch {
      // Safe fallback
    }

    return () => {
      if (engineGainRef.current) {
        engineGainRef.current.gain.value = 0;
      }
    };
  }, [soundEnabled, rpm, initAudio]);

  // Speedometer physics simulation: 0 to 200 km/h over ~3.1s, stays for 3-4s total
  useEffect(() => {
    completedRef.current = false;
    let animFrame: number;
    const startTime = performance.now();
    const duration = 3100; // 3.1s to hit 200 km/h

    const updateSpeed = (now: number) => {
      const elapsed = Math.max(0, now - startTime);
      const progress = Math.max(0, Math.min(1, elapsed / duration));

      // Non-linear realistic acceleration curve (vigorous launch + aggressive powerband)
      // Easing: starts fast, pulls hard through mid-gears, surges into 200
      const eased = Math.pow(progress, 1.35);
      const rawSpeed = Math.min(200, Math.max(0, Math.round(eased * 200)));
      const currentSpeed = Number.isFinite(rawSpeed) ? rawSpeed : 0;
      setSpeed(currentSpeed);

      // Gear calculation & RPM calculation
      let calculatedGear = '1';
      let currentRpm = 1000;
      let calculatedBoost = 0;

      if (currentSpeed < 45) {
        calculatedGear = '1';
        currentRpm = 1200 + (currentSpeed / 45) * 6500;
        calculatedBoost = (currentSpeed / 45) * 18;
      } else if (currentSpeed < 90) {
        calculatedGear = '2';
        currentRpm = 4500 + ((currentSpeed - 45) / 45) * 3800;
        calculatedBoost = 18 + ((currentSpeed - 45) / 45) * 4;
      } else if (currentSpeed < 140) {
        calculatedGear = '3';
        currentRpm = 5000 + ((currentSpeed - 90) / 50) * 3500;
        calculatedBoost = 22;
      } else if (currentSpeed < 185) {
        calculatedGear = '4';
        currentRpm = 5800 + ((currentSpeed - 140) / 45) * 2800;
        calculatedBoost = 23.5;
      } else {
        calculatedGear = '5';
        currentRpm = 7200 + ((currentSpeed - 185) / 15) * 1800;
        calculatedBoost = 24.8;
      }

      setGear(calculatedGear);
      const rawRpm = Math.round(Math.min(9000, Math.max(1000, currentRpm)));
      setRpm(Number.isFinite(rawRpm) ? rawRpm : 1000);
      const rawBoost = parseFloat(calculatedBoost.toFixed(1));
      setBoostPsi(Number.isFinite(rawBoost) ? rawBoost : 0);

      if (currentSpeed >= 190) {
        setIsRedline(true);
      }

      if (progress < 1) {
        animFrame = requestAnimationFrame(updateSpeed);
      } else {
        // Reached 200 KM/H!
        setSpeed(200);
        setRpm(9000);
        setGear('5');
        setIsRedline(true);
        setHasReached200(true);
        setScreenFlash(true);

        // Flash sonic warp effect and transition to interface at 3.55s total
        setTimeout(() => setScreenFlash(false), 300);

        setTimeout(() => {
          if (!completedRef.current) {
            completedRef.current = true;
            onComplete();
          }
        }, 450);
      }
    };

    animFrame = requestAnimationFrame(updateSpeed);

    return () => cancelAnimationFrame(animFrame);
  }, [onComplete]);

  // High-Speed Tunnel & Asphalt Motion Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Speed streak particles (light streaks rushing toward edges)
    interface Streak {
      x: number;
      y: number;
      z: number;
      length: number;
      color: string;
      width: number;
    }

    const streaks: Streak[] = [];
    const STREAK_COUNT = 140;
    for (let i = 0; i < STREAK_COUNT; i++) {
      streaks.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        length: Math.random() * 80 + 20,
        color:
          i % 4 === 0
            ? '#00f0ff'
            : i % 4 === 1
            ? '#ff3b30'
            : i % 4 === 2
            ? '#38bdf8'
            : '#ffffff',
        width: Math.random() * 2 + 1,
      });
    }

    let animFrame: number;
    const render = () => {
      ctx.fillStyle = 'rgba(6, 7, 10, 0.4)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Dynamic velocity tied to current speed (0 - 200)
      const velocity = 2 + (speed / 200) * 45;

      for (let i = 0; i < streaks.length; i++) {
        const s = streaks[i];
        s.z -= velocity;

        if (s.z <= 10) {
          s.x = (Math.random() - 0.5) * width * 2;
          s.y = (Math.random() - 0.5) * height * 2;
          s.z = width;
        }

        const k = 260 / s.z;
        const px = s.x * k + cx;
        const py = s.y * k + cy;

        const prevZ = s.z + s.length * (velocity / 12);
        const pk = 260 / prevZ;
        const prevX = s.x * pk + cx;
        const prevY = s.y * pk + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const alpha = Math.min(1, Math.max(0.1, (1 - s.z / width) * 1.8));

          ctx.beginPath();
          ctx.strokeStyle = s.color;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = s.width * (speed > 160 ? 1.8 : 1);
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(px, py);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      animFrame = requestAnimationFrame(render);
    };

    animFrame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrame);
    };
  }, [speed]);

  // Speedometer Needle Angle Math:
  // Gauge spans 260 degrees (-130 deg at 0 km/h, +130 deg at 240 km/h)
  // At 200 km/h: angle = -130 + (200 / 240) * 260 = +86.66 degrees
  const safeSpeed = typeof speed === 'number' && Number.isFinite(speed) ? Math.max(0, Math.min(200, Math.round(speed))) : 0;
  const safeRpm = typeof rpm === 'number' && Number.isFinite(rpm) ? Math.max(1000, Math.min(9000, Math.round(rpm))) : 1000;
  const safeBoost = typeof boostPsi === 'number' && Number.isFinite(boostPsi) ? boostPsi : 0;
  const needleAngle = -130 + (safeSpeed / 240) * 260;

  // Gauge Tick Marks (0 to 240 km/h, every 20 km/h)
  const ticks = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240];

  return (
    <motion.div
      id="speedometer-gateway"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.15,
        filter: 'blur(20px)',
        transition: { duration: 0.35, ease: [0.76, 0, 0.24, 1] },
      }}
      className="fixed inset-0 z-[10000] bg-[#050608] flex flex-col justify-between p-4 sm:p-8 select-none overflow-hidden"
    >
      {/* Dynamic Tunnel Streaks Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* 200 KM/H Warp Flash Overlay */}
      {screenFlash && (
        <div className="absolute inset-0 bg-cyan-400/40 backdrop-blur-md pointer-events-none transition-opacity duration-200 z-50 animate-pulse" />
      )}

      {/* Top Telemetry Bar */}
      <div className="relative z-50 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-neutral-400">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="text-white font-bold flex items-center gap-1.5 text-xs sm:text-sm tracking-wider">
            <Gauge className="w-4 h-4 text-[#00f0ff]" />
            <span>SPORT+ LAUNCH MODE</span>
          </span>
          <span className="hidden sm:inline-block text-neutral-600">|</span>
          <span className="hidden sm:inline-block text-neutral-400 text-[11px]">
            {hasReached200 ? (
              <span className="text-[#00f0ff] font-bold">200 KM/H HIT &bull; LAUNCHING</span>
            ) : (
              <span>ACCELERATING TO 200 KM/H</span>
            )}
          </span>
        </div>

        {/* Right Action: Sound Toggle + Bulletproof Instant Skip Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Engine Sound' : 'Enable Engine Sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#00f0ff]" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-500" />
            )}
          </button>

          <button
            type="button"
            id="skip-speedometer-intro"
            onClick={handleSkip}
            onPointerDown={handleSkip}
            onTouchEnd={handleSkip}
            className="px-4 py-2 rounded-full border border-white/20 bg-white/10 hover:bg-[#00f0ff] hover:text-black text-white text-xs font-mono font-bold tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(0,240,255,0.8)]"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>SKIP INTRO</span>
            <span className="hidden sm:inline-block text-[10px] opacity-75 font-normal">[ESC]</span>
          </button>
        </div>
      </div>

      {/* Center Instrument Cluster: The Hypercar Speedometer */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto w-full max-w-2xl mx-auto">
        {/* Radial Instrument Cluster Housing */}
        <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] md:w-[460px] md:h-[460px] flex items-center justify-center">
          {/* External Carbon Bezel Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-white/15 bg-neutral-950/80 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,0,0,0.95)]" />

          {/* Glowing Radial Speed Arc Underlay */}
          <div
            className="absolute inset-4 rounded-full border border-white/10 transition-all duration-150"
            style={{
              boxShadow: isRedline
                ? 'inset 0 0 60px rgba(255, 59, 48, 0.4), 0 0 40px rgba(255, 59, 48, 0.3)'
                : 'inset 0 0 50px rgba(0, 240, 255, 0.25), 0 0 35px rgba(0, 240, 255, 0.2)',
            }}
          />

          {/* SVG Speedometer Gauge Face */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 460 460">
            {/* Background Track Circle */}
            <circle
              cx="230"
              cy="230"
              r="190"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="10"
              strokeDasharray="860"
              strokeDashoffset="240"
              strokeLinecap="round"
            />

            {/* Active Speed Progress Arc */}
            {/* Circumference for r=190 is ~1193.8. Active arc is ~860 px */}
            <circle
              cx="230"
              cy="230"
              r="190"
              fill="none"
              stroke={safeSpeed >= 185 ? 'url(#redlineGradient)' : 'url(#speedGradient)'}
              strokeWidth="12"
              strokeDasharray="1194"
              strokeDashoffset={Math.max(0, Math.round(1194 - (safeSpeed / 240) * 860))}
              strokeLinecap="round"
              className="transition-all duration-75 ease-out"
              style={{
                filter: safeSpeed >= 185 ? 'drop-shadow(0 0 12px #ff3b30)' : 'drop-shadow(0 0 10px #00f0ff)',
              }}
            />

            {/* RPM Inner Arc Track */}
            <circle
              cx="230"
              cy="230"
              r="150"
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="5"
              strokeDasharray="680"
              strokeDashoffset="190"
              strokeLinecap="round"
            />

            {/* RPM Active Arc */}
            <circle
              cx="230"
              cy="230"
              r="150"
              fill="none"
              stroke={safeRpm > 7800 ? '#ff3b30' : '#38bdf8'}
              strokeWidth="6"
              strokeDasharray="942"
              strokeDashoffset={Math.max(0, Math.round(942 - (safeRpm / 9000) * 680))}
              strokeLinecap="round"
              className="transition-all duration-75 ease-out"
            />

            {/* Gradients */}
            <defs>
              <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="70%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
              <linearGradient id="redlineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="65%" stopColor="#ff9500" />
                <stop offset="100%" stopColor="#ff3b30" />
              </linearGradient>
            </defs>
          </svg>

          {/* Tick marks and Numbers (0 to 240) */}
          <div className="absolute inset-0 pointer-events-none">
            {ticks.map((val) => {
              // Rotation angle in degrees
              const angle = -130 + (val / 240) * 260;
              const isPast = speed >= val;
              const isTarget200 = val === 200;

              return (
                <div
                  key={val}
                  className="absolute inset-0 flex items-start justify-center"
                  style={{
                    transform: `rotate(${angle}deg)`,
                  }}
                >
                  {/* Tick Line */}
                  <div
                    className={`mt-2 sm:mt-3 w-[2px] transition-colors duration-100 ${
                      val % 40 === 0 ? 'h-4 sm:h-5' : 'h-2.5 sm:h-3'
                    } ${
                      isTarget200
                        ? isPast
                          ? 'bg-red-500 shadow-[0_0_12px_#ff3b30] w-[3px]'
                          : 'bg-red-400/80 w-[2.5px]'
                        : isPast
                        ? 'bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]'
                        : 'bg-white/20'
                    }`}
                  />

                  {/* Tick Number */}
                  {val % 20 === 0 && (
                    <div
                      className="absolute top-7 sm:top-9 font-mono text-[10px] sm:text-xs font-bold tracking-tight transition-colors duration-100"
                      style={{
                        transform: `rotate(${-angle}deg)`,
                        color:
                          val === 200
                            ? isPast
                              ? '#ff3b30'
                              : '#f87171'
                            : isPast
                            ? '#ffffff'
                            : 'rgba(255, 255, 255, 0.3)',
                        textShadow:
                          val === 200 && isPast
                            ? '0 0 10px #ff3b30'
                            : isPast
                            ? '0 0 8px rgba(0, 240, 255, 0.6)'
                            : 'none',
                      }}
                    >
                      {val}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mechanical Needle */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-75 ease-out"
            style={{
              transform: `rotate(${needleAngle}deg)`,
            }}
          >
            {/* The luminous Needle Blade pointing upwards before rotation */}
            <div
              className={`absolute top-8 sm:top-10 w-1 sm:w-1.5 h-[120px] sm:h-[155px] md:h-[170px] rounded-full origin-bottom shadow-lg transition-colors duration-100 ${
                safeSpeed >= 185
                  ? 'bg-gradient-to-t from-red-600 via-red-500 to-white shadow-[0_0_20px_#ff3b30]'
                  : 'bg-gradient-to-t from-[#00f0ff] via-[#38bdf8] to-white shadow-[0_0_15px_#00f0ff]'
              }`}
            />
          </div>

          {/* Center Hub & Digital Speed Readout */}
          <div className="relative z-20 w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-neutral-950/95 border border-white/20 flex flex-col items-center justify-center p-2 shadow-[0_0_40px_rgba(0,0,0,0.9)]">
            {/* Gear & Launch Indicator */}
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-[10px] sm:text-xs text-neutral-300 font-bold">
                GEAR {gear}
              </span>
              <span className="font-mono text-[10px] sm:text-xs text-[#00f0ff] flex items-center gap-1">
                <Flame className="w-3 h-3 text-red-500 fill-red-500" />
                {safeBoost} PSI
              </span>
            </div>

            {/* BIG DIGITAL SPEED NUMBER: 0 -> 200 */}
            <div className="font-display font-black text-6xl sm:text-7xl md:text-8xl leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-400">
              {safeSpeed}
            </div>

            {/* Unit */}
            <div className="font-mono text-xs sm:text-sm font-bold tracking-widest text-[#00f0ff] uppercase mt-0.5 flex items-center gap-1.5">
              <span>KM / H</span>
              {safeSpeed >= 200 && (
                <span className="text-red-500 animate-pulse font-extrabold">&bull; MAX</span>
              )}
            </div>

            {/* RPM Readout */}
            <div className="mt-1 font-mono text-[10px] sm:text-[11px] text-neutral-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-neutral-500" />
              <span>{safeRpm.toLocaleString()} RPM</span>
            </div>
          </div>
        </div>

        {/* User Name Directly Below the Speedometer Meter */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-5 sm:mt-6 flex flex-col items-center justify-center text-center"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] animate-pulse" />
            <h2 className="font-display text-lg sm:text-xl md:text-2xl font-black tracking-widest uppercase text-white drop-shadow-[0_0_20px_rgba(0,240,255,0.55)]">
              {PERSONAL_INFO.name}
            </h2>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] animate-pulse" />
          </div>
          <div className="text-[11px] sm:text-xs font-mono text-neutral-400 tracking-[0.2em] uppercase mt-1 flex items-center gap-1.5">
            <span>FRONTEND ARCHITECT</span>
            <span className="text-[#00f0ff]">&bull;</span>
            <span>UI/UX DESIGNER</span>
          </div>
        </motion.div>

        {/* Dynamic Launch Status Banner */}
        <div className="mt-4 text-center font-mono">
          {hasReached200 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-red-500/50 bg-red-500/10 text-red-400 font-bold text-xs sm:text-sm shadow-[0_0_30px_rgba(255,59,48,0.5)]"
            >
              <Zap className="w-4 h-4 fill-red-400 text-red-400 animate-bounce" />
              <span>200 KM/H REACHED &bull; LAUNCHING PORTFOLIO...</span>
            </motion.div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-neutral-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
              <span>ACCELERATING &bull; TARGET 200 KM/H</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="relative z-10 flex flex-col gap-2 max-w-xl mx-auto w-full">
        <div className="flex justify-between items-center font-mono text-[11px] text-neutral-400">
          <span className="flex items-center gap-1.5">
            <span>VELOCITY:</span>
            <span className="text-white font-bold">{safeSpeed} / 200 KM/H</span>
          </span>
          <span className="text-[#00f0ff] font-semibold">
            {safeSpeed >= 200 ? 'SYSTEM READY' : `${Math.round((safeSpeed / 200) * 100)}% ENGAGED`}
          </span>
        </div>

        {/* Progress bar mapped to 0 -> 200 km/h */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden relative">
          <div
            className={`h-full transition-all duration-75 ease-out ${
              safeSpeed >= 185
                ? 'bg-gradient-to-r from-[#00f0ff] via-amber-400 to-red-500 shadow-[0_0_12px_#ff3b30]'
                : 'bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] shadow-[0_0_10px_#00f0ff]'
            }`}
            style={{ width: `${Math.max(0, Math.min(100, (safeSpeed / 200) * 100))}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};
