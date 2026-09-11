import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Waves } from 'lucide-react';

interface SoundDesignProps {
  onHoverSound?: () => void;
  onClickSound?: () => void;
}

export const SoundDesign: React.FC<SoundDesignProps> = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const waveGainRef = useRef<GainNode | null>(null);
  const waveFilterRef = useRef<BiquadFilterNode | null>(null);
  const sprayGainRef = useRef<GainNode | null>(null);
  const subOscRef = useRef<OscillatorNode | null>(null);
  const waveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Generate realistic rhythmic ocean waves sound
  const initWaveAudio = useCallback(() => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Master gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // 1. Pink/Brown noise generator buffer for organic water texture
      const bufferSize = ctx.sampleRate * 8; // 8-second continuous buffer
      const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
      for (let channel = 0; channel < 2; channel++) {
        const data = buffer.getChannelData(channel);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          // Pink noise filter algorithm
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
          b6 = white * 0.115926;
        }
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;
      noiseSourceRef.current = noiseSource;

      // 2. Main wave resonance lowpass filter
      const waveFilter = ctx.createBiquadFilter();
      waveFilter.type = 'lowpass';
      waveFilter.frequency.setValueAtTime(220, ctx.currentTime);
      waveFilter.Q.setValueAtTime(2.2, ctx.currentTime);
      waveFilterRef.current = waveFilter;

      const waveGain = ctx.createGain();
      waveGain.gain.setValueAtTime(0.04, ctx.currentTime);
      waveGainRef.current = waveGain;

      // 3. Subtle water spray / crest foam bandpass filter
      const sprayFilter = ctx.createBiquadFilter();
      sprayFilter.type = 'bandpass';
      sprayFilter.frequency.setValueAtTime(850, ctx.currentTime);
      sprayFilter.Q.setValueAtTime(1.4, ctx.currentTime);

      const sprayGain = ctx.createGain();
      sprayGain.gain.setValueAtTime(0.01, ctx.currentTime);
      sprayGainRef.current = sprayGain;

      // 4. Sub-bass oceanic swell (38Hz sinusoidal warmth)
      const subOsc = ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(44, ctx.currentTime);
      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.015, ctx.currentTime);
      subOsc.connect(subGain);
      subGain.connect(masterGain);
      subOsc.start();
      subOscRef.current = subOsc;

      // Route noise through filters
      noiseSource.connect(waveFilter);
      waveFilter.connect(waveGain);
      waveGain.connect(masterGain);

      noiseSource.connect(sprayFilter);
      sprayFilter.connect(sprayGain);
      sprayGain.connect(masterGain);

      noiseSource.start();

      // Continuous rhythmic wave ebb & flow loop (period: 7.2s)
      const cycleWave = () => {
        if (!audioCtxRef.current || !waveFilterRef.current || !waveGainRef.current || !sprayGainRef.current) {
          return;
        }
        const now = audioCtxRef.current.currentTime;
        const waveFilterNode = waveFilterRef.current;
        const waveGainNode = waveGainRef.current;
        const sprayGainNode = sprayGainRef.current;

        // Swell In: Wave builds up toward shore (3.2 seconds)
        waveFilterNode.frequency.cancelScheduledValues(now);
        waveFilterNode.frequency.linearRampToValueAtTime(680, now + 3.2);

        waveGainNode.gain.cancelScheduledValues(now);
        waveGainNode.gain.linearRampToValueAtTime(0.09, now + 3.2);

        sprayGainNode.gain.cancelScheduledValues(now);
        sprayGainNode.gain.linearRampToValueAtTime(0.035, now + 3.0);

        // Crest & Recede: Wave breaks & washes smoothly back out (4.0 seconds)
        waveFilterNode.frequency.exponentialRampToValueAtTime(170, now + 7.2);
        waveGainNode.gain.exponentialRampToValueAtTime(0.02, now + 7.2);
        sprayGainNode.gain.exponentialRampToValueAtTime(0.003, now + 7.2);
      };

      cycleWave();
      waveIntervalRef.current = setInterval(cycleWave, 7200);
    } catch {
      // Audio initialization safely skipped if browser restricts autoplay
    }
  }, []);

  const toggleSound = useCallback(() => {
    if (!audioCtxRef.current) {
      initWaveAudio();
    }

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    if (masterGainRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      if (!isPlaying) {
        masterGainRef.current.gain.cancelScheduledValues(now);
        masterGainRef.current.gain.linearRampToValueAtTime(0.85, now + 1.8);
        setIsPlaying(true);
        window.dispatchEvent(new CustomEvent('wave-sound-state-change', { detail: { isPlaying: true } }));
      } else {
        masterGainRef.current.gain.cancelScheduledValues(now);
        masterGainRef.current.gain.linearRampToValueAtTime(0.0001, now + 0.9);
        setIsPlaying(false);
        window.dispatchEvent(new CustomEvent('wave-sound-state-change', { detail: { isPlaying: false } }));
      }
    }
  }, [initWaveAudio, isPlaying]);

  // Synchronize with external triggers
  useEffect(() => {
    const handleGlobalToggle = () => toggleSound();
    window.addEventListener('toggle-wave-sound', handleGlobalToggle);
    return () => window.removeEventListener('toggle-wave-sound', handleGlobalToggle);
  }, [toggleSound]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <button
      id="sound-toggle-btn"
      onClick={toggleSound}
      title={isPlaying ? 'Mute soothing ocean wave sound' : 'Play soothing ocean wave sound'}
      className={`group flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full border text-xs tracking-wider uppercase font-medium transition-all duration-300 cursor-pointer ${
        isPlaying
          ? 'bg-[#00f0ff]/15 border-[#00f0ff]/60 text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
          : 'bg-black/40 border-white/10 text-neutral-300 hover:border-[#00f0ff]/50 hover:text-white'
      }`}
      aria-label="Toggle ocean wave sound"
    >
      <Waves className={`w-3.5 h-3.5 ${isPlaying ? 'text-[#00f0ff] animate-pulse' : 'text-neutral-400'}`} />

      {/* Dynamic Sound Visualizer Bars in Aqua */}
      <div className="flex items-end gap-[2px] h-3 w-3.5">
        <span
          className={`w-[2px] bg-[#00f0ff] rounded-full transition-all duration-300 ${
            isPlaying ? 'h-full animate-[pulse_1.2s_ease-in-out_infinite]' : 'h-1.5 opacity-40'
          }`}
        />
        <span
          className={`w-[2px] bg-[#00f0ff] rounded-full transition-all duration-300 ${
            isPlaying ? 'h-2 animate-[pulse_0.9s_ease-in-out_infinite_150ms]' : 'h-2.5 opacity-60'
          }`}
        />
        <span
          className={`w-[2px] bg-[#00f0ff] rounded-full transition-all duration-300 ${
            isPlaying ? 'h-full animate-[pulse_1.4s_ease-in-out_infinite_300ms]' : 'h-1 opacity-40'
          }`}
        />
      </div>

      <span className="hidden sm:inline-block text-[10px] tracking-widest font-mono">
        {isPlaying ? 'WAVES [ON]' : 'WAVES [OFF]'}
      </span>

      {isPlaying ? (
        <Volume2 className="w-3 h-3 text-[#00f0ff]" />
      ) : (
        <VolumeX className="w-3 h-3 text-neutral-500 group-hover:text-neutral-300" />
      )}
    </button>
  );
};
