import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Zap, Volume2, VolumeX } from 'lucide-react';

interface StormDropletCanvasProps {
  onThunderFlash?: () => void;
}

interface RainParticle {
  x: number;
  y: number;
  speed: number;
  length: number;
  alpha: number;
}

interface SplashParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  gravity: number;
}

interface WaterRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
  lineWidth: number;
}

interface LightningBranch {
  points: { x: number; y: number }[];
  alpha: number;
  width: number;
}

export const StormDropletCanvas: React.FC<StormDropletCanvasProps> = ({ onThunderFlash }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [thunderActive, setThunderActive] = useState<boolean>(false);

  // Storm simulation state
  const rainRef = useRef<RainParticle[]>([]);
  const splashesRef = useRef<SplashParticle[]>([]);
  const ripplesRef = useRef<WaterRipple[]>([]);
  const lightningRef = useRef<LightningBranch[]>([]);
  const flashAlphaRef = useRef<number>(0);

  // Main hero water droplet state
  const dropRef = useRef<{
    x: number;
    y: number;
    vy: number;
    radius: number;
    active: boolean;
    tailLength: number;
  }>({
    x: 0,
    y: -50,
    vy: 0,
    radius: 7.5,
    active: false,
    tailLength: 20,
  });

  const nextDropTimerRef = useRef<number>(100); // frames until next drop
  const animIdRef = useRef<number | null>(null);

  // Realistic synthesized thunder rumble acoustic (Web Audio API)
  const playThunderSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Generate brown/pink noise burst for rolling thunder
      const bufferSize = ctx.sampleRate * 2.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Low-pass brownian noise filter
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 2.2);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.08); // Strike peak
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.4); // Deep rumble tail

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch {
      // Audio gracefully muted if restricted
    }
  }, [soundEnabled]);

  // Generate realistic jagged lightning bolt
  const triggerLightning = useCallback(
    (targetX?: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = canvas.width;
      const h = canvas.height;

      flashAlphaRef.current = 0.95;
      setThunderActive(true);
      setTimeout(() => setThunderActive(false), 400);

      playThunderSound();
      onThunderFlash?.();

      const startX = targetX !== undefined ? targetX : w * (0.2 + Math.random() * 0.6);
      const branches: LightningBranch[] = [];

      // Main bolt
      const mainPoints: { x: number; y: number }[] = [{ x: startX, y: 0 }];
      let cx = startX;
      let cy = 0;
      const groundY = h * 0.82;

      while (cy < groundY) {
        const stepY = 15 + Math.random() * 25;
        const stepX = (Math.random() - 0.5) * 35;
        cx += stepX;
        cy += stepY;
        mainPoints.push({ x: cx, y: Math.min(groundY, cy) });

        // Branch off occasionally
        if (Math.random() < 0.28 && cy < groundY * 0.8) {
          const subBranch: { x: number; y: number }[] = [{ x: cx, y: cy }];
          let bx = cx;
          let by = cy;
          for (let b = 0; b < 5; b++) {
            bx += (Math.random() - 0.5) * 30;
            by += 12 + Math.random() * 20;
            subBranch.push({ x: bx, y: by });
          }
          branches.push({ points: subBranch, alpha: 0.7, width: 1.5 });
        }
      }

      branches.unshift({ points: mainPoints, alpha: 1.0, width: 3.5 });
      lightningRef.current = branches;
    },
    [onThunderFlash, playThunderSound]
  );

  // Spawn a fresh falling water droplet
  const spawnDrop = useCallback((customX?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.width;
    const dropX = customX !== undefined ? customX : w * (0.25 + Math.random() * 0.5);

    dropRef.current = {
      x: dropX,
      y: -20,
      vy: 2.5,
      radius: 6.5 + Math.random() * 2.5,
      active: true,
      tailLength: 25,
    };
  }, []);

  // Trigger impact splash when droplet hits the puddle ground
  const impactDrop = useCallback((impactX: number, impactY: number, radius: number) => {
    // 1. Expanding liquid ground ripples (flattened elliptical perspective)
    ripplesRef.current.push(
      {
        x: impactX,
        y: impactY,
        radius: 4,
        maxRadius: 65 + radius * 5,
        alpha: 0.9,
        speed: 2.2,
        lineWidth: 2.5,
      },
      {
        x: impactX,
        y: impactY,
        radius: 1,
        maxRadius: 40 + radius * 3,
        alpha: 0.7,
        speed: 1.5,
        lineWidth: 1.8,
      }
    );

    // 2. Upward exploding water splash crown & micro-droplets
    const splashCount = 18 + Math.floor(Math.random() * 10);
    for (let i = 0; i < splashCount; i++) {
      const angle = -Math.PI * (0.15 + Math.random() * 0.7); // upward cone
      const speed = 3.5 + Math.random() * 6.5;
      splashesRef.current.push({
        x: impactX + (Math.random() - 0.5) * 6,
        y: impactY - 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.2 + Math.random() * 2.4,
        alpha: 0.95,
        gravity: 0.22,
      });
    }

    // 3. Spontaneous thunder chance on heavy impact!
    if (Math.random() < 0.35) {
      triggerLightning(impactX);
    }
  }, [triggerLightning]);

  // Main animation frame loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animActive = true;

    // Resize canvas to match container
    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = Math.floor(rect.width);
      canvas.height = Math.floor(rect.height);

      // Initialize background storm rain
      const rainCount = Math.min(120, Math.floor(canvas.width / 12));
      const rainList: RainParticle[] = [];
      for (let i = 0; i < rainCount; i++) {
        rainList.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: 12 + Math.random() * 16,
          length: 15 + Math.random() * 25,
          alpha: 0.15 + Math.random() * 0.35,
        });
      }
      rainRef.current = rainList;
    };

    resize();
    window.addEventListener('resize', resize);

    // Launch first droplet right away
    spawnDrop();

    let lastRenderTime = 0;

    const render = (currentTime: number) => {
      if (!animActive) return;
      const rawElapsed = lastRenderTime > 0 ? (currentTime - lastRenderTime) / 1000 : 0.016;
      const elapsed = Math.max(0.001, Math.min(Number.isFinite(rawElapsed) ? rawElapsed : 0.016, 0.05));
      lastRenderTime = currentTime;
      const dt = elapsed * 60;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        const w = canvas.width;
        const h = canvas.height;
        const groundY = h * 0.88;

        // 1. Draw Storm Atmosphere (Dark tempestuous skies with rolling storm clouds)
        ctx.clearRect(0, 0, w, h);

        // Ambient storm sky gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
        skyGrad.addColorStop(0, 'rgba(4, 12, 22, 0.92)');
        skyGrad.addColorStop(0.5, 'rgba(6, 18, 30, 0.88)');
        skyGrad.addColorStop(1, 'rgba(2, 8, 16, 0.96)');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. Thunder Screen Flash Layer
        if (flashAlphaRef.current > 0.01) {
          ctx.fillStyle = `rgba(200, 245, 255, ${flashAlphaRef.current * 0.55})`;
          ctx.fillRect(0, 0, w, h);
          flashAlphaRef.current *= Math.pow(0.86, dt); // rapid decay
        }

        // 3. Render Lightning Bolts
        if (lightningRef.current.length > 0) {
          ctx.save();
          for (const bolt of lightningRef.current) {
            if (bolt.points.length < 2) continue;

            // Electric glow halo
            ctx.beginPath();
            ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
            for (let i = 1; i < bolt.points.length; i++) {
              ctx.lineTo(bolt.points[i].x, bolt.points[i].y);
            }
            ctx.strokeStyle = `rgba(0, 240, 255, ${bolt.alpha * 0.6})`;
            ctx.lineWidth = bolt.width * 2.8;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 25;
            ctx.stroke();

            // Core electric white arc
            ctx.beginPath();
            ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
            for (let i = 1; i < bolt.points.length; i++) {
              ctx.lineTo(bolt.points[i].x, bolt.points[i].y);
            }
            ctx.strokeStyle = `rgba(255, 255, 255, ${bolt.alpha})`;
            ctx.lineWidth = bolt.width;
            ctx.stroke();

            bolt.alpha *= Math.pow(0.82, dt);
          }
          lightningRef.current = lightningRef.current.filter((b) => b.alpha > 0.05);
          ctx.restore();
        }

        // 4. Background Storm Rain
        ctx.save();
        ctx.strokeStyle = 'rgba(160, 220, 240, 0.35)';
        ctx.lineWidth = 1.2;
        const windDrift = 3.5;
        for (const r of rainRef.current) {
          ctx.beginPath();
          ctx.moveTo(r.x, r.y);
          ctx.lineTo(r.x - windDrift * (r.length / 18), r.y + r.length);
          ctx.strokeStyle = `rgba(180, 230, 255, ${r.alpha})`;
          ctx.stroke();

          r.y += r.speed * dt;
          r.x -= windDrift * dt;
          if (r.y > h) {
            r.y = -20;
            r.x = Math.random() * (w + 100);
          }
        }
        ctx.restore();

        // 5. Reflective Wet Ground / Puddle Floor
        ctx.save();
        const puddleGrad = ctx.createLinearGradient(0, groundY - 15, 0, h);
        puddleGrad.addColorStop(0, 'rgba(0, 240, 255, 0.03)');
        puddleGrad.addColorStop(0.1, 'rgba(0, 240, 255, 0.12)');
        puddleGrad.addColorStop(0.5, 'rgba(4, 20, 36, 0.7)');
        puddleGrad.addColorStop(1, 'rgba(2, 10, 18, 0.95)');
        ctx.fillStyle = puddleGrad;
        ctx.fillRect(0, groundY - 10, w, h - groundY + 10);

        // Ground horizon line with electric aqua sheen
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(w, groundY);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();

        // 6. Render Ground Water Ripples (Flattened ellipses for 3D depth)
        ctx.save();
        const ripAlphaDecay = Math.pow(0.965, dt);
        for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
          const rip = ripplesRef.current[i];
          rip.radius += rip.speed * dt;
          rip.alpha *= ripAlphaDecay;

          if (rip.radius <= 0 || rip.radius >= rip.maxRadius || rip.alpha <= 0.02) {
            ripplesRef.current.splice(i, 1);
            continue;
          }

          const majorRadius = Math.max(0.1, rip.radius);
          const minorRadius = Math.max(0.05, majorRadius * 0.32);

          ctx.beginPath();
          // Flatten Y by 0.32 to simulate perspective water plane
          ctx.ellipse(rip.x, rip.y, majorRadius, minorRadius, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 240, 255, ${Math.max(0, rip.alpha * 0.8)})`;
          ctx.lineWidth = rip.lineWidth;
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 8;
          ctx.stroke();

          // Second inner bright crest
          const innerMajor = Math.max(0.1, majorRadius * 0.75);
          const innerMinor = Math.max(0.05, innerMajor * 0.32);
          ctx.beginPath();
          ctx.ellipse(rip.x, rip.y, innerMajor, innerMinor, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, rip.alpha * 0.5)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();

        // 7. Render Splashing Crown Droplets
        ctx.save();
        const splashAlphaDecay = Math.pow(0.96, dt);
        for (let i = splashesRef.current.length - 1; i >= 0; i--) {
          const s = splashesRef.current[i];
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          s.vy += s.gravity * dt; // Gravity pulling splash back down
          s.alpha *= splashAlphaDecay;

          // Droplet body with aqua glow
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 245, 255, ${s.alpha})`;
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 6;
          ctx.fill();

          if (s.y >= groundY + 15 || s.alpha <= 0.03) {
            splashesRef.current.splice(i, 1);
          }
        }
        ctx.restore();

        // 8. Render Main Falling Water Droplet
        const drop = dropRef.current;
        if (drop.active) {
          drop.vy += 0.42 * dt; // Gravity acceleration
          drop.y += drop.vy * dt;

          ctx.save();
          // Draw teardrop shape with hydrodynamic tail
          const tx = drop.x;
          const ty = drop.y;
          const r = drop.radius;
          const tail = Math.min(35, drop.vy * 2.2);

          // Droplet trail / refraction glow
          ctx.beginPath();
          ctx.moveTo(tx, ty - tail);
          ctx.quadraticCurveTo(tx - r * 1.1, ty + r * 0.2, tx - r, ty + r * 0.6);
          ctx.arc(tx, ty + r * 0.6, r, Math.PI, 0, true);
          ctx.quadraticCurveTo(tx + r * 1.1, ty + r * 0.2, tx, ty - tail);
          ctx.closePath();

          // Droplet gradient (liquid cyan and specular highlights)
          const dropGrad = ctx.createRadialGradient(tx - r * 0.3, ty, r * 0.1, tx, ty + r * 0.5, r * 1.6);
          dropGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          dropGrad.addColorStop(0.35, 'rgba(120, 235, 255, 0.85)');
          dropGrad.addColorStop(0.75, 'rgba(0, 180, 240, 0.7)');
          dropGrad.addColorStop(1, 'rgba(0, 70, 140, 0.85)');
          ctx.fillStyle = dropGrad;
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 15;
          ctx.fill();

          // Specular glint highlight
          const specRadiusX = Math.max(0.1, Math.abs(r * 0.3));
          const specRadiusY = Math.max(0.05, Math.abs(r * 0.18));
          ctx.beginPath();
          ctx.ellipse(tx - r * 0.35, ty + r * 0.2, specRadiusX, specRadiusY, -Math.PI / 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fill();

          ctx.restore();

          // Check if droplet hits the ground
          if (drop.y >= groundY - 8) {
            drop.active = false;
            impactDrop(drop.x, groundY, drop.radius);
            nextDropTimerRef.current = 40 + Math.floor(Math.random() * 60); // schedule next drop
          }
        } else {
          // Decrement timer to spawn next drop
          nextDropTimerRef.current -= dt;
          if (nextDropTimerRef.current <= 0) {
            spawnDrop();
          }
        }
      }

      animIdRef.current = requestAnimationFrame(render);
    };

    animIdRef.current = requestAnimationFrame(render);

    return () => {
      animActive = false;
      window.removeEventListener('resize', resize);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, [impactDrop, spawnDrop]);

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden rounded-3xl">
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />

      {/* Control Overlay: Thunder Strike & Sound */}
      <div className="absolute top-4 right-4 z-30 pointer-events-auto flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerLightning();
            spawnDrop();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wider uppercase transition-all duration-300 border cursor-pointer ${
            thunderActive
              ? 'bg-[#00f0ff] text-black border-[#00f0ff] shadow-[0_0_20px_#00f0ff]'
              : 'bg-black/70 hover:bg-black/90 text-[#00f0ff] border-[#00f0ff]/40 hover:border-[#00f0ff]'
          }`}
          title="Trigger a thunder strike and droplet splash"
        >
          <Zap className="w-3 h-3 text-amber-300 animate-pulse" />
          <span>THUNDER STRIKE</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setSoundEnabled(!soundEnabled);
          }}
          className="p-1.5 rounded-full bg-black/70 hover:bg-black/90 border border-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          title={soundEnabled ? 'Mute storm audio' : 'Enable storm thunder audio'}
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-[#00f0ff]" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Cinematic ground atmospheric fog layer */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#020813] via-[#041426]/70 to-transparent pointer-events-none" />
    </div>
  );
};
