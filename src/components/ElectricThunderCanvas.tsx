import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Segment {
  start: Point;
  end: Point;
  width: number;
  alpha: number;
}

interface LightningBolt {
  segments: Segment[];
  branches: Segment[];
  life: number;
  maxLife: number;
  color: string;
  glowColor: string;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export const ElectricThunderCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const bolts: LightningBolt[] = [];
    const sparks: SparkParticle[] = [];
    let flashAlpha = 0;

    // Recursive fractal midpoint displacement algorithm
    const generateBranch = (
      start: Point,
      end: Point,
      depth: number,
      segments: Segment[],
      branches: Segment[],
      branchProb = 0.45
    ) => {
      if (depth === 0) {
        segments.push({
          start,
          end,
          width: Math.max(1, depth * 0.8 + 1.2),
          alpha: 1,
        });
        return;
      }

      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;

      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Normal displacement
      const normalX = -dy / dist;
      const normalY = dx / dist;

      const displacement = (Math.random() - 0.5) * dist * 0.42;
      const midPoint: Point = {
        x: midX + normalX * displacement,
        y: midY + normalY * displacement,
      };

      generateBranch(start, midPoint, depth - 1, segments, branches, branchProb);
      generateBranch(midPoint, end, depth - 1, segments, branches, branchProb);

      // Branching fork
      if (Math.random() < branchProb && depth >= 2) {
        const branchAngle = (Math.random() - 0.5) * 0.9;
        const branchLength = dist * (0.35 + Math.random() * 0.35);
        const cos = Math.cos(branchAngle);
        const sin = Math.sin(branchAngle);

        const bx = dx * cos - dy * sin;
        const by = dx * sin + dy * cos;
        const bLen = Math.sqrt(bx * bx + by * by) || 1;

        const branchEnd: Point = {
          x: midPoint.x + (bx / bLen) * branchLength,
          y: midPoint.y + (by / bLen) * branchLength,
        };

        generateBranch(midPoint, branchEnd, depth - 2, branches, branches, 0.2);
      }
    };

    const createLightningBolt = (startX?: number, startY?: number, targetX?: number, targetY?: number) => {
      const sx = startX !== undefined ? startX : Math.random() * width;
      const sy = startY !== undefined ? startY : Math.random() * (height * 0.15);

      const tx = targetX !== undefined ? targetX : sx + (Math.random() - 0.5) * (width * 0.6);
      const ty = targetY !== undefined ? targetY : height * (0.45 + Math.random() * 0.5);

      const segments: Segment[] = [];
      const branches: Segment[] = [];

      generateBranch({ x: sx, y: sy }, { x: tx, y: ty }, 5, segments, branches);

      bolts.push({
        segments,
        branches,
        life: 14,
        maxLife: 14,
        color: '#00f0ff',
        glowColor: '#7000ff',
      });

      // Spawn spark explosion at ground/target impact
      for (let i = 0; i < 35; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 8;
        sparks.push({
          x: tx,
          y: ty,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 4,
          life: 25 + Math.random() * 20,
          maxLife: 45,
          color: Math.random() > 0.4 ? '#00f0ff' : '#ffffff',
          size: 1.5 + Math.random() * 2,
        });
      }

      flashAlpha = 0.35;
    };

    // Event listener to trigger lightning programmatically
    const handleUnleashThunder = (e: Event) => {
      const customEvent = e as CustomEvent<{ x?: number; y?: number; tx?: number; ty?: number }>;
      const detail = customEvent.detail || {};
      createLightningBolt(detail.x, detail.y, detail.tx, detail.ty);
    };

    window.addEventListener('unleash-thunder', handleUnleashThunder);

    // Subtle random atmospheric discharges occasionally
    const interval = setInterval(() => {
      if (Math.random() < 0.25) {
        createLightningBolt();
      }
    }, 12000);

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render screen lightning flash
      if (flashAlpha > 0.005) {
        ctx.fillStyle = `rgba(0, 240, 255, ${flashAlpha * 0.4})`;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 0.3})`;
        ctx.fillRect(0, 0, width, height);
        flashAlpha *= 0.82;
      }

      // Render lightning bolts
      for (let i = bolts.length - 1; i >= 0; i--) {
        const bolt = bolts[i];
        const progress = bolt.life / bolt.maxLife;

        // 1. Wide outer purple-cyan plasma halo
        ctx.save();
        ctx.strokeStyle = `rgba(112, 0, 255, ${progress * 0.45})`;
        ctx.lineWidth = 9;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 24;

        ctx.beginPath();
        for (const seg of bolt.segments) {
          ctx.moveTo(seg.start.x, seg.start.y);
          ctx.lineTo(seg.end.x, seg.end.y);
        }
        for (const seg of bolt.branches) {
          ctx.moveTo(seg.start.x, seg.start.y);
          ctx.lineTo(seg.end.x, seg.end.y);
        }
        ctx.stroke();

        // 2. Focused vibrant cyan core
        ctx.strokeStyle = `rgba(0, 240, 255, ${progress * 0.85})`;
        ctx.lineWidth = 3.5;
        ctx.shadowBlur = 12;
        ctx.stroke();

        // 3. Hot blazing white center thread
        ctx.strokeStyle = `rgba(255, 255, 255, ${progress})`;
        ctx.lineWidth = 1.4;
        ctx.shadowBlur = 4;
        ctx.stroke();
        ctx.restore();

        bolt.life--;
        if (bolt.life <= 0) {
          bolts.splice(i, 1);
        }
      }

      // Render sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vy += 0.18; // gravity
        spark.vx *= 0.96; // air friction
        spark.life--;

        const alpha = Math.max(0, spark.life / spark.maxLife);
        ctx.save();
        ctx.fillStyle = spark.color;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = spark.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (spark.life <= 0) {
          sparks.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('unleash-thunder', handleUnleashThunder);
      clearInterval(interval);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 select-none overflow-hidden"
    />
  );
};
