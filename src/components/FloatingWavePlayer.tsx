import React, { useState, useEffect } from 'react';
import { Waves, Volume2, VolumeX } from 'lucide-react';

export const FloatingWavePlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const handleState = (e: Event) => {
      const customEvent = e as CustomEvent<{ isPlaying: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.isPlaying === 'boolean') {
        setIsPlaying(customEvent.detail.isPlaying);
      }
    };

    window.addEventListener('wave-sound-state-change', handleState);
    return () => window.removeEventListener('wave-sound-state-change', handleState);
  }, []);

  const handleToggle = () => {
    window.dispatchEvent(new CustomEvent('toggle-wave-sound'));
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center">
      <button
        onClick={handleToggle}
        title={isPlaying ? 'Pause soothing ocean wave sound' : 'Play soothing ocean wave sound'}
        className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-full border backdrop-blur-xl transition-all duration-300 shadow-lg cursor-pointer ${
          isPlaying
            ? 'bg-[#00f0ff]/15 border-[#00f0ff]/50 text-[#00f0ff] shadow-[0_0_25px_rgba(0,240,255,0.25)]'
            : 'bg-black/60 hover:bg-black/85 border-white/15 text-neutral-300 hover:border-[#00f0ff]/40 hover:text-white'
        }`}
      >
        <Waves className={`w-4 h-4 ${isPlaying ? 'animate-bounce text-[#00f0ff]' : 'text-neutral-400 group-hover:text-white'}`} />

        {/* Dynamic visualizer bars */}
        <div className="flex items-end gap-[2px] h-3.5 w-4">
          <span
            className={`w-[2.5px] bg-[#00f0ff] rounded-full transition-all duration-300 ${
              isPlaying ? 'h-full animate-[pulse_1.1s_ease-in-out_infinite]' : 'h-1.5 opacity-40'
            }`}
          />
          <span
            className={`w-[2.5px] bg-[#00f0ff] rounded-full transition-all duration-300 ${
              isPlaying ? 'h-2.5 animate-[pulse_0.8s_ease-in-out_infinite_150ms]' : 'h-2 opacity-50'
            }`}
          />
          <span
            className={`w-[2.5px] bg-[#00f0ff] rounded-full transition-all duration-300 ${
              isPlaying ? 'h-full animate-[pulse_1.3s_ease-in-out_infinite_300ms]' : 'h-1 opacity-30'
            }`}
          />
        </div>

        <span className="text-[11px] font-mono tracking-widest uppercase font-semibold">
          {isPlaying ? 'OCEAN WAVES [PLAYING]' : 'OCEAN WAVES [AUDIO]'}
        </span>

        {isPlaying ? (
          <Volume2 className="w-3.5 h-3.5 text-[#00f0ff]" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300" />
        )}
      </button>
    </div>
  );
};
