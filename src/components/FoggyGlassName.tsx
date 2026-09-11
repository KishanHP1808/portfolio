import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Eye, CheckCircle2, Hand, Droplets, Briefcase, Timer, Zap } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { StormDropletCanvas } from './StormDropletCanvas';

interface FoggyGlassNameProps {
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
}

interface WaterDroplet {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  aspect: number;
}

interface RunningDrip {
  x: number;
  y: number;
  length: number;
  maxLength: number;
  speed: number;
  width: number;
  alpha: number;
}

export const FoggyGlassName: React.FC<FoggyGlassNameProps> = ({
  onHoverAction,
  onHoverEnd,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [percentCleared, setPercentCleared] = useState<number>(0);
  const [isRubbing, setIsRubbing] = useState<boolean>(false);
  const isRubbingRef = useRef<boolean>(false);
  const [hasStartedRubbing, setHasStartedRubbing] = useState<boolean>(false);
  const [isFullyRevealed, setIsFullyRevealed] = useState<boolean>(false);
  const [recoveryCountdown, setRecoveryCountdown] = useState<number | null>(null);
  const [thunderFlash, setThunderFlash] = useState<boolean>(false);

  // 20 seconds auto-recovery timeout requested by user
  const AUTO_REFOG_SECONDS = 20;

  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastWipeTimeRef = useRef<number>(0);
  const dropletsRef = useRef<WaterDroplet[]>([]);
  const dripsRef = useRef<RunningDrip[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const sampleCounterRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isRefoggingRef = useRef<boolean>(false);

  // Gentle squeak/rub acoustic for tactile immersion
  const playRubSound = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx && ctx.state === 'suspended') {
        ctx.resume();
      }
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      // Pitch variation like rubbing wet rubber/finger on glass
      osc.frequency.setValueAtTime(450 + Math.random() * 180, now);
      osc.frequency.exponentialRampToValueAtTime(700 + Math.random() * 200, now + 0.06);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(850, now);
      filter.Q.setValueAtTime(3, now);

      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Audio gracefully skipped if blocked by browser policy
    }
  }, []);

  // Generate realistic water droplets on the glass surface
  const initDroplets = useCallback((w: number, h: number) => {
    const list: WaterDroplet[] = [];
    const count = Math.min(220, Math.floor((w * h) / 2800));
    for (let i = 0; i < count; i++) {
      list.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: 1.5 + Math.random() * 5.5,
        opacity: 0.35 + Math.random() * 0.55,
        aspect: 0.8 + Math.random() * 0.4,
      });
    }
    dropletsRef.current = list;
  }, []);

  // Render the misty foggy condensation texture on canvas
  const renderFogTexture = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';

    // 1. Deep frosted glass background with cold cyan/aquatic mist tone
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(6, 18, 28, 0.96)');
    grad.addColorStop(0.5, 'rgba(8, 22, 34, 0.94)');
    grad.addColorStop(1, 'rgba(4, 14, 22, 0.97)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // 2. Add subtle frosted steam vignette & highlights
    const radial = ctx.createRadialGradient(w * 0.45, h * 0.45, 10, w * 0.5, h * 0.5, Math.max(w, h));
    radial.addColorStop(0, 'rgba(0, 240, 255, 0.08)');
    radial.addColorStop(0.6, 'rgba(255, 255, 255, 0.04)');
    radial.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, w, h);

    // 3. Render 3D condensation water droplets
    const droplets = dropletsRef.current;
    for (const d of droplets) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(d.x, d.y, d.radius, d.radius * d.aspect, 0, 0, Math.PI * 2);

      // Droplet base
      ctx.fillStyle = `rgba(180, 225, 240, ${d.opacity * 0.5})`;
      ctx.fill();

      // Droplet shadow (bottom-right)
      ctx.beginPath();
      ctx.ellipse(d.x + 0.8, d.y + 0.8, d.radius * 0.85, d.radius * d.aspect * 0.85, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 10, 20, ${d.opacity * 0.6})`;
      ctx.fill();

      // Droplet specular glint (top-left)
      ctx.beginPath();
      ctx.ellipse(d.x - 0.7, d.y - 0.7, d.radius * 0.45, d.radius * d.aspect * 0.45, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${d.opacity * 0.9})`;
      ctx.fill();

      ctx.restore();
    }

    // 4. Subtle frosted glass noise pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
    for (let i = 0; i < 500; i++) {
      const rx = Math.random() * w;
      const ry = Math.random() * h;
      ctx.fillRect(rx, ry, 1.2, 1.2);
    }

    ctx.restore();
  }, []);

  // Compute clear percentage by sampling canvas transparency
  const computeClearedPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    try {
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;

      const cols = 16;
      const rows = 10;
      let clearCount = 0;
      const totalPoints = cols * rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const sampleX = Math.floor((c + 0.5) * (w / cols));
          const sampleY = Math.floor((r + 0.5) * (h / rows));
          const pixel = ctx.getImageData(sampleX, sampleY, 1, 1).data;
          // Alpha < 60 means transparent/cleared
          if (pixel[3] < 60) {
            clearCount++;
          }
        }
      }

      const rawPct = Math.min(100, Math.max(0, Math.round((clearCount / (totalPoints || 1)) * 100)));
      const pct = Number.isFinite(rawPct) ? rawPct : 0;
      setPercentCleared(pct);

      if (pct >= 65 && !isFullyRevealed) {
        setIsFullyRevealed(true);
      }
    } catch {
      // Fallback in case of CORS or context issues
    }
  }, [isFullyRevealed]);

  // Rub / Erase stroke implementation with realistic feathered damp wiper edge
  const rubAtPoint = useCallback((currX: number, currY: number, isTouchInput: boolean = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const last = lastPosRef.current || { x: currX, y: currY };
    lastPosRef.current = { x: currX, y: currY };

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';

    // Interpolate points between last and curr to prevent gaps on fast movement
    const dist = Math.hypot(currX - last.x, currY - last.y);
    const steps = Math.max(1, Math.floor(dist / 4));

    // Generous touch radius so finger swiping on mobile is effortless and natural
    const isNarrow = canvas.width < 768;
    const brushRadius = (isTouchInput || isNarrow)
      ? Math.max(55, Math.min(85, canvas.width * 0.12))
      : Math.max(38, Math.min(65, canvas.width * 0.055));

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const ix = last.x + (currX - last.x) * t;
      const iy = last.y + (currY - last.y) * t;

      const radial = ctx.createRadialGradient(ix, iy, brushRadius * 0.2, ix, iy, brushRadius);
      radial.addColorStop(0, 'rgba(0, 0, 0, 1)');
      radial.addColorStop(0.65, 'rgba(0, 0, 0, 0.9)');
      radial.addColorStop(0.88, 'rgba(0, 0, 0, 0.4)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(ix, iy, brushRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Occasionally spawn an organic water condensation drip running down from wipe
    if (Math.random() < 0.12 && currY < canvas.height - 40) {
      dripsRef.current.push({
        x: currX + (Math.random() * 20 - 10),
        y: currY + brushRadius * 0.5,
        length: 2,
        maxLength: 25 + Math.random() * 55,
        speed: 1.2 + Math.random() * 2.2,
        width: 1.5 + Math.random() * 2,
        alpha: 0.8,
      });
    }

    // Play subtle audio squeak
    if (Math.random() < 0.25) {
      playRubSound();
    }

    // Throttled percentage calculation
    sampleCounterRef.current++;
    if (sampleCounterRef.current % 4 === 0) {
      computeClearedPercentage();
    }
  }, [computeClearedPercentage, playRubSound]);

  // Smooth progressive re-condensation of fog
  const reFogSmoothly = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      isRefoggingRef.current = false;
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      isRefoggingRef.current = false;
      return;
    }

    const offCanvas = document.createElement('canvas');
    offCanvas.width = canvas.width;
    offCanvas.height = canvas.height;
    const offCtx = offCanvas.getContext('2d');
    if (offCtx) {
      initDroplets(canvas.width, canvas.height);
      renderFogTexture(offCtx, canvas.width, canvas.height);
    }

    let step = 0;
    const totalSteps = 14;

    const stepFade = () => {
      step++;
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.12;
      ctx.drawImage(offCanvas, 0, 0);
      ctx.restore();

      if (step < totalSteps) {
        requestAnimationFrame(stepFade);
      } else {
        renderFogTexture(ctx, canvas.width, canvas.height);
        setPercentCleared(0);
        setIsFullyRevealed(false);
        setHasStartedRubbing(false);
        setRecoveryCountdown(null);
        isRefoggingRef.current = false;
      }
    };

    requestAnimationFrame(stepFade);
  }, [initDroplets, renderFogTexture]);

  // 20-Second Auto-Recovery Timer: Automatically refogs 20 seconds after user stops wiping
  useEffect(() => {
    if (percentCleared === 0) {
      setRecoveryCountdown(null);
      return;
    }

    const interval = setInterval(() => {
      if (isRubbingRef.current || isRubbing) {
        lastWipeTimeRef.current = Date.now();
        setRecoveryCountdown(AUTO_REFOG_SECONDS);
        return;
      }

      if (lastWipeTimeRef.current === 0) {
        lastWipeTimeRef.current = Date.now();
      }

      const elapsed = (Date.now() - lastWipeTimeRef.current) / 1000;
      const remaining = Math.max(0, AUTO_REFOG_SECONDS - elapsed);
      setRecoveryCountdown(Math.ceil(remaining));

      if (remaining <= 0 && !isRefoggingRef.current) {
        isRefoggingRef.current = true;
        reFogSmoothly();
      }
    }, 200);

    return () => clearInterval(interval);
  }, [percentCleared, isRubbing, reFogSmoothly]);

  // Animation loop for running water drips that slide down wiped edges
  useEffect(() => {
    let active = true;

    const animateDrips = () => {
      if (!active) return;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx && dripsRef.current.length > 0) {
          ctx.save();
          ctx.globalCompositeOperation = 'destination-out';

          for (let i = dripsRef.current.length - 1; i >= 0; i--) {
            const drip = dripsRef.current[i];
            drip.length += drip.speed;
            drip.y += drip.speed * 0.5;

            // Draw clean watery drip line
            ctx.beginPath();
            ctx.moveTo(drip.x, drip.y);
            ctx.lineTo(drip.x, drip.y + drip.length);
            ctx.lineWidth = drip.width;
            ctx.lineCap = 'round';
            ctx.strokeStyle = `rgba(0, 0, 0, ${drip.alpha})`;
            ctx.stroke();

            // Drip teardrop head
            ctx.beginPath();
            ctx.arc(drip.x, drip.y + drip.length, drip.width * 1.3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 0, 0, ${drip.alpha})`;
            ctx.fill();

            if (drip.length >= drip.maxLength || drip.y + drip.length >= canvas.height) {
              dripsRef.current.splice(i, 1);
            }
          }
          ctx.restore();
        }
      }
      animFrameRef.current = requestAnimationFrame(animateDrips);
    };

    animFrameRef.current = requestAnimationFrame(animateDrips);
    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Initialize and scale canvas to crisp dimensions
  const setupCanvas = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const w = Math.floor(rect.width);
    const h = Math.floor(rect.height);

    if (w <= 0 || h <= 0) return;

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    initDroplets(w, h);
    renderFogTexture(ctx, w, h);
    setPercentCleared(0);
    setIsFullyRevealed(false);
    lastPosRef.current = null;
    lastWipeTimeRef.current = 0;
    setRecoveryCountdown(null);
  }, [initDroplets, renderFogTexture]);

  useEffect(() => {
    setupCanvas();

    const handleResize = () => {
      setupCanvas();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setupCanvas]);

  // Action: Clear All Fog Instantly
  const handleClearAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setPercentCleared(100);
    setIsFullyRevealed(true);
    setHasStartedRubbing(true);
    lastWipeTimeRef.current = Date.now();
    setRecoveryCountdown(AUTO_REFOG_SECONDS);
    playRubSound();
  };

  // Canvas coordinates calculator helper
  const getCanvasCoords = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  // Mouse & Touch Pointer Event Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignored if unsupported
    }

    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    const isTouch = e.pointerType === 'touch';

    isRubbingRef.current = true;
    setIsRubbing(true);
    setHasStartedRubbing(true);
    lastWipeTimeRef.current = Date.now();
    lastPosRef.current = { x, y };
    rubAtPoint(x, y, isTouch);
    onHoverAction?.('RUB GLASS');
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const isTouch = e.pointerType === 'touch';

    // On touch devices, only rub while pressed down
    if (isTouch && !isRubbingRef.current) {
      return;
    }

    const { x, y } = getCanvasCoords(e.clientX, e.clientY);

    lastWipeTimeRef.current = Date.now();
    rubAtPoint(x, y, isTouch);
    setHasStartedRubbing(true);
    onHoverAction?.('RUB GLASS');
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignored
    }

    isRubbingRef.current = false;
    setIsRubbing(false);
    lastPosRef.current = null;
    lastWipeTimeRef.current = Date.now();
    computeClearedPercentage();
  };

  // Dedicated Native Touch Listeners with non-passive preventDefault so mobile browser never scrolls while rubbing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      isRubbingRef.current = true;
      setIsRubbing(true);
      setHasStartedRubbing(true);
      lastWipeTimeRef.current = Date.now();
      lastPosRef.current = { x, y };
      rubAtPoint(x, y, true);
      onHoverAction?.('RUB GLASS');
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      lastWipeTimeRef.current = Date.now();
      rubAtPoint(x, y, true);
      setHasStartedRubbing(true);
      onHoverAction?.('RUB GLASS');
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      isRubbingRef.current = false;
      setIsRubbing(false);
      lastPosRef.current = null;
      lastWipeTimeRef.current = Date.now();
      computeClearedPercentage();
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [computeClearedPercentage, onHoverAction, rubAtPoint]);

  return (
    <div
      ref={containerRef}
      id="foggy-glass-name-container"
      className="relative w-full rounded-3xl p-6 sm:p-8 md:p-12 bg-neutral-950/70 border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden select-none group"
    >
      {/* Dynamic Storming Background with Thunder Effect & Falling Droplet Splash */}
      <StormDropletCanvas onThunderFlash={() => {
        setThunderFlash(true);
        setTimeout(() => setThunderFlash(false), 350);
      }} />

      {/* Background ambient lighting under the glass */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#00f0ff]/15 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      {/* Recruiter / Hiring Header Status Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                percentCleared > 65 ? 'bg-emerald-400' : 'bg-[#00f0ff]'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                percentCleared > 65 ? 'bg-emerald-500' : 'bg-[#00f0ff]'
              }`}
            />
          </span>

          <span className="text-white font-semibold tracking-wider uppercase">
            {percentCleared >= 65 ? (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>CANDIDATE IDENTITY VERIFIED • READY TO HIRE</span>
              </span>
            ) : (
              <span className="text-neutral-300 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span>FOGGED STEAM GLASS • RUB TO REVEAL IDENTITY</span>
              </span>
            )}
          </span>
        </div>

        {/* Progress & Auto-Recovery Indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cleared Percentage Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-[10px] sm:text-[11px]">
            <span className="text-[#00f0ff] font-bold">{percentCleared}%</span>
            <span>STEAM CLEARED</span>
          </div>

          {/* 20-Second Auto-Recovery Countdown Badge */}
          {percentCleared > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-[10px] sm:text-[11px] font-mono animate-pulse">
              <Timer className="w-3.5 h-3.5" />
              <span>RE-FOGS IN {recoveryCountdown ?? AUTO_REFOG_SECONDS}s</span>
            </div>
          )}

          {/* Quick Wipe All Steam Button (Visible and touch-friendly on both mobile & desktop) */}
          <button
            onClick={handleClearAll}
            onMouseEnter={() => onHoverAction?.('CLEAR')}
            onMouseLeave={onHoverEnd}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/5 hover:bg-[#00f0ff] hover:text-black text-neutral-300 hover:border-[#00f0ff] border border-white/10 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer active:scale-95"
            title="Wipe entire glass surface clean"
          >
            <Eye className="w-3 h-3" />
            <span>WIPE ALL</span>
          </button>
        </div>
      </div>

      {/* Main Colossal Name: Single Line "KISHAN H.P" Sitting Directly Beneath the Foggy Glass with Thunder Reactions */}
      <div className="relative z-10 py-6 md:py-10 flex items-baseline overflow-hidden leading-none tracking-tighter">
        <motion.div
          initial={{ y: '100%', rotateX: -20, opacity: 0 }}
          animate={{ y: '0%', rotateX: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex flex-wrap sm:flex-nowrap items-baseline gap-3 sm:gap-5 md:gap-8 select-none"
        >
          {/* Name: KISHAN */}
          <h1
            className={`font-display text-[14vw] sm:text-[11vw] md:text-[9.5vw] lg:text-[7.8vw] xl:text-[7vw] uppercase font-extrabold transition-all duration-300 ${
              thunderFlash
                ? 'text-cyan-100 drop-shadow-[0_0_60px_#00f0ff] brightness-150'
                : percentCleared > 65
                ? 'text-white drop-shadow-[0_0_35px_rgba(0,240,255,0.7)]'
                : 'text-neutral-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]'
            }`}
          >
            KISHAN
          </h1>

          {/* Suffix: H.P */}
          <h1
            className={`font-display text-[14vw] sm:text-[11vw] md:text-[9.5vw] lg:text-[7.8vw] xl:text-[7vw] uppercase font-extrabold text-transparent bg-clip-text transition-all duration-300 ${
              thunderFlash
                ? 'bg-gradient-to-r from-white via-cyan-200 to-white drop-shadow-[0_0_65px_#00f0ff] brightness-150'
                : percentCleared > 65
                ? 'bg-gradient-to-r from-white via-[#00f0ff] to-cyan-300 drop-shadow-[0_0_40px_rgba(0,240,255,0.8)]'
                : 'bg-gradient-to-r from-white via-cyan-100 to-neutral-400'
            }`}
          >
            H.P
          </h1>

          {/* Decorative accent cyan beam */}
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className={`hidden md:inline-block h-3 md:h-5 w-16 md:w-28 bg-gradient-to-r from-[#00f0ff] to-transparent origin-left rounded-full transition-all duration-700 self-center ${
              thunderFlash
                ? 'shadow-[0_0_50px_#00f0ff] brightness-150'
                : percentCleared > 65
                ? 'shadow-[0_0_30px_#00f0ff]'
                : 'shadow-[0_0_15px_#00f0ff]'
            }`}
          />
        </motion.div>
      </div>

      {/* Sub-Header Recruiter Badges (Revealed under the name) */}
      <div className="relative z-10 pt-4 flex flex-wrap items-center gap-3 border-t border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2 text-neutral-300">
          <Briefcase className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span className="font-bold text-white">RECRUITER MATCH:</span>
          <span>Frontend Specialist &bull; UI/UX Architect &bull; React &bull; TypeScript</span>
        </div>

        {percentCleared >= 65 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center gap-1.5 text-[11px]"
          >
            <Sparkles className="w-3 h-3 text-emerald-300" />
            <span>AVAILABLE FOR IMMEDIATE INTERVIEWS & FULL-TIME OFFERS</span>
          </motion.div>
        )}
      </div>

      {/* The Foggy Glass Interactive Canvas (Covers the entire card, touch-none prevents screen scroll while rubbing) */}
      <canvas
        ref={canvasRef}
        id="foggy-glass-wipe-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={() => {
          isRubbingRef.current = false;
          setIsRubbing(false);
          lastPosRef.current = null;
          onHoverEnd?.();
        }}
        style={{ touchAction: 'none' }}
        className={`absolute inset-0 z-20 w-full h-full cursor-grab active:cursor-grabbing touch-none select-none transition-opacity duration-700 ${
          percentCleared >= 92 ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
        title="Rub finger or drag cursor across the glass to wipe away the fog"
      />

      {/* Interactive Helper Hint (Pulsing Hand / Prompt) */}
      <AnimatePresence>
        {!hasStartedRubbing && percentCleared < 15 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none p-4"
          >
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-black/85 border border-[#00f0ff]/50 shadow-[0_0_30px_rgba(0,240,255,0.4)] backdrop-blur-md glow-aqua-subtle">
              <motion.div
                animate={{ x: [-8, 8, -8], rotate: [-8, 8, -8] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                className="text-[#00f0ff]"
              >
                <Hand className="w-5 h-5" />
              </motion.div>
              <div className="flex flex-col">
                <span className="font-condensed font-extrabold uppercase text-white tracking-widest text-xs sm:text-sm">
                  RUB OR DRAG ACROSS GLASS
                </span>
                <span className="font-mono text-[10px] text-neutral-300">
                  Swipe finger or drag cursor to wipe away condensation
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
