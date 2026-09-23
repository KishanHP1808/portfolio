import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  Send,
  X,
  Sparkles,
  Bot,
  ExternalLink,
  Code2,
  Cpu,
  Brain,
  Terminal,
  Minimize2,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';

interface ThunderAiBotProps {
  onHoverAction?: (text: string) => void;
  onHoverEnd?: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init-1',
    role: 'assistant',
    timestamp: 'JUST NOW',
    content: `⚡ **SYSTEM ONLINE // THUNDER AI RESEARCH AGENT INITIALIZED**

I am **Thunder AI**, the autonomous technical intelligence & research assistant engineered into Kishan H.P.'s portfolio.

I possess complete architectural knowledge of Kishan's engineering work, including his **AI Assistant** platform, real-time WebSocket systems, **LeetCode (@Kishan_H_P)** algorithms, and 120FPS frontend craftsmanship.

What would you like to investigate?`,
  },
];

const PRESET_PROMPTS = [
  {
    label: 'AI Assistant',
    icon: Brain,
    prompt: 'Explain Kishan’s AI Assistant project and how its AI retrieval and multi-document architecture works.',
  },
  {
    label: 'Frontend & 120FPS Motion',
    icon: Cpu,
    prompt: 'How does Kishan achieve such fluid 120FPS animations and sub-frame responsiveness in his frontends?',
  },
  {
    label: 'LeetCode & Problem Solving',
    icon: Code2,
    prompt: 'Tell me about Kishan’s LeetCode profile and problem-solving methodology in data structures and algorithms.',
  },
  {
    label: 'Why Hire Kishan?',
    icon: Sparkles,
    prompt: 'Why should an engineering leader or product team hire Kishan H.P. as a Frontend / Full Stack Developer?',
  },
];

// Offline / instantaneous semantic responses if server API key is unavailable
const LOCAL_KNOWLEDGE_BASE: Record<string, string> = {
  research: `🔬 **AI Assistant — Autonomous AI Research & Document Intelligence**

Kishan engineered this production-grade document intelligence engine to solve unstructured knowledge synthesis:

- **Asynchronous FastAPI Engine**: Streams token payloads with sub-second time-to-first-token (TTFT).
- **Multi-Document Synthesis**: Constructs vector embedding pipelines using LangChain to correlate across multiple research papers, technical specs, and whitepapers.
- **Frontend Synergy**: Built with a reactive React interface that renders citations, executive summaries, and comparative analysis cards.
- **Deployment**: Deployed on Vercel with high-availability edge routing.
- **Live Demo**: [ai-assistant-orcin-alpha.vercel.app](https://ai-assistant-orcin-alpha.vercel.app/)
- **GitHub Repository**: [github.com/KishanHP1808/Personal-Research-Assistant](https://github.com/KishanHP1808/Personal-Research-Assistant)`,

  frontend: `⚡ **Kishan's Frontend Engineering Philosophy**

Kishan builds web applications that treat the browser as a 60-120FPS graphics runtime:

- **Bespoke Animation Choreography**: Combines Tailwind CSS v4, Motion, GSAP, and HTML5 Canvas to achieve cinematic transitions without layout thrashing.
- **Procedural Web Audio API**: Replaces heavy audio asset downloads with real-time mathematical sound synthesis (ocean wave generators, frequency filters, white-noise sculpting).
- **Physical Interaction Models**: Features real-time fluid ripples, procedural lightning arcs, and cursor-following holographic sheens.
- **Zero-Compromise Accessibility**: Every visual experiment maintains semantic landmarks, keyboard navigation, and WCAG AA contrast standards.`,

  leetcode: `🏆 **LeetCode & Algorithmic Problem Solving**

Kishan actively hones algorithmic problem-solving at [leetcode.com/u/Kishan_H_P](https://leetcode.com/u/Kishan_H_P):

- **Focus Areas**: Advanced Dynamic Programming, Graph Traversals (BFS/DFS, Dijkstra), Binary Trees, Two-Pointer Optimizations, and Trie structures.
- **Rigorous Complexity Analysis**: Prioritizes strictly minimal time and space complexities ($O(N)$ runtime with amortized space).
- **Real-World Translation**: Directly applies DSA concepts to frontend race condition avoidance, tree reconciliations, and state caching algorithms.`,

  hire: `🚀 **Why You Should Hire Kishan H.P.**

Kishan combines two rare superpowers: **Elite Visual Taste** and **Hardcore Systems Engineering**:

1. **Immediate Productivity**: Fluent across React 19, TypeScript, Next.js, Python, Django 5, WebSockets, and modern design systems in Figma.
2. **Proven Full-Stack Shipping**: Created and deployed real-world systems like **AgriGuard** (AI Crop Pathology on Vercel), **Football Auction** (real-time Redis pub/sub locks on Vercel), and **AI Assistant** (autonomous research agent on Vercel).
3. **High Standard of Craftsmanship**: He does not build cookie-cutter templates. Every project features tailored physics, bulletproof state handling, and meticulous attention to detail.
4. **Availability**: Ready for high-impact frontend and full-stack engineering roles. Reach him directly at **kishanhp18@gmail.com**!`,

  default: `⚡ **Thunder AI Knowledge Stream:**

Kishan H.P is a Frontend Developer, UI/UX Designer, and Full Stack Web Developer based in Mysuru, Karnataka, India.

- **Signature Projects (Live on Vercel)**:
  - *AgriGuard* (AI Crop Pathology & Advisory): https://agri-guard-mocha.vercel.app/
  - *Football Auction Engine* (Real-Time WebSockets & Redis locks): https://football-auction-three.vercel.app/
  - *AI Assistant* (FastAPI, LangChain, React, Autonomous Intelligence): https://ai-assistant-orcin-alpha.vercel.app/
- **Competitive Profile**: LeetCode (@Kishan_H_P), GitHub (@KishanHP1808)
- **Direct Reach**: kishanhp18@gmail.com`,
};

function getLocalFallback(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('research') || q.includes('assistant') || q.includes('document')) {
    return LOCAL_KNOWLEDGE_BASE.research;
  }
  if (q.includes('front') || q.includes('animation') || q.includes('120') || q.includes('motion') || q.includes('fps')) {
    return LOCAL_KNOWLEDGE_BASE.frontend;
  }
  if (q.includes('leetcode') || q.includes('algorithm') || q.includes('dsa') || q.includes('problem')) {
    return LOCAL_KNOWLEDGE_BASE.leetcode;
  }
  if (q.includes('hire') || q.includes('why') || q.includes('contact') || q.includes('role') || q.includes('experience')) {
    return LOCAL_KNOWLEDGE_BASE.hire;
  }
  return LOCAL_KNOWLEDGE_BASE.default;
}

export const ThunderAiBot: React.FC<ThunderAiBotProps> = ({ onHoverAction, onHoverEnd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Global listeners for Command+K and custom trigger events
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen((prev) => {
        const next = !prev;
        if (next) {
          playCyberChirp(900, 0.08);
          setTimeout(() => inputRef.current?.focus(), 150);
        }
        return next;
      });
    };

    const handleOpen = () => {
      setIsOpen(true);
      playCyberChirp(900, 0.08);
      setTimeout(() => inputRef.current?.focus(), 150);
    };

    const handleClose = () => {
      setIsOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Command+K or Ctrl+K triggers Thunder AI
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        handleToggle();
        return;
      }

      // Escape closes Thunder AI when open
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('open-thunder-ai', handleOpen);
    window.addEventListener('toggle-thunder-ai', handleToggle);
    window.addEventListener('close-thunder-ai', handleClose);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('open-thunder-ai', handleOpen);
      window.removeEventListener('toggle-thunder-ai', handleToggle);
      window.removeEventListener('close-thunder-ai', handleClose);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus input automatically whenever drawer opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Play procedural cybernetic chirp SFX
  const playCyberChirp = (freq = 880, duration = 0.08) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Ignore audio failure
    }
  };

  const triggerThunder = () => {
    playCyberChirp(220, 0.2);
    window.dispatchEvent(
      new CustomEvent('unleash-thunder', {
        detail: {
          x: window.innerWidth / 2,
          y: 100,
          tx: window.innerWidth / 2,
          ty: window.innerHeight * 0.8,
        },
      })
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    playCyberChirp(1200, 0.06);

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/thunder-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.reply || getLocalFallback(query),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
        playCyberChirp(700, 0.1);
      } else {
        // Graceful intelligent fallback
        const fallbackText = getLocalFallback(query);
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
        playCyberChirp(600, 0.08);
      }
    } catch {
      // Offline / Network fallback
      const fallbackText = getLocalFallback(query);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Bottom Center/Right Trigger Pill */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 select-none">
        {/* Quick Thunder Strike Trigger */}
        <button
          onClick={triggerThunder}
          title="Unleash High-Voltage Electric Thunder"
          className="hidden md:flex p-2.5 rounded-full bg-black/60 hover:bg-[#00f0ff]/15 border border-white/15 hover:border-[#00f0ff]/60 text-neutral-400 hover:text-[#00f0ff] transition-all duration-300 shadow-lg cursor-pointer group"
        >
          <Zap className="w-4 h-4 group-hover:scale-125 transition-transform text-[#00f0ff]" />
        </button>

        {/* Main Thunder AI Dock Pill */}
        <motion.button
          onClick={() => {
            playCyberChirp(900, 0.08);
            setIsOpen(!isOpen);
          }}
          onMouseEnter={() => onHoverAction?.('THUNDER AI')}
          onMouseLeave={onHoverEnd}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`group flex items-center gap-3 px-4 py-2.5 rounded-full border backdrop-blur-2xl transition-all duration-300 shadow-2xl cursor-pointer ${
            isOpen
              ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-white shadow-[0_0_35px_rgba(0,240,255,0.4)]'
              : 'bg-black/80 hover:bg-black/95 border-white/20 hover:border-[#00f0ff]/70 text-white shadow-[0_0_20px_rgba(0,0,0,0.8)]'
          }`}
        >
          {/* Animated Plasma Core Orb */}
          <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
            <span className="absolute inset-0 rounded-full bg-[#00f0ff] opacity-40 animate-ping" />
            <span className="absolute inset-0 rounded-full border border-[#00f0ff] animate-[spin_4s_linear_infinite]" />
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#00f0ff] via-white to-[#7000ff] shadow-[0_0_12px_#00f0ff]" />
          </div>

          {/* Label & Status */}
          <div className="flex flex-col items-start text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold tracking-wider text-white group-hover:text-[#00f0ff] transition-colors">
                THUNDER AI
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 text-cyan-300 border border-cyan-400/30 ml-1">
                ⌘K
              </kbd>
            </div>
            <span className="text-[9px] font-mono text-neutral-400 tracking-widest uppercase">
              RESEARCH AGENT
            </span>
          </div>

          <div className="pl-1 border-l border-white/15">
            <Terminal className="w-3.5 h-3.5 text-[#00f0ff] group-hover:rotate-12 transition-transform" />
          </div>
        </motion.button>
      </div>

      {/* Futuristic Holographic Research Terminal Drawer / Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="fixed bottom-22 right-4 sm:right-6 z-50 w-[94vw] sm:w-[480px] max-h-[82vh] h-[640px] flex flex-col rounded-3xl bg-[#030914]/95 border border-[#00f0ff]/30 shadow-[0_0_60px_rgba(0,240,255,0.25)] backdrop-blur-3xl overflow-hidden"
          >
            {/* Holographic Header Bar */}
            <div className="relative p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white tracking-wider">
                      THUNDER AI
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff]">
                      RESEARCH v3.8
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>NEURAL LINK CONNECTED</span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={triggerThunder}
                  title="Trigger Lightning Shockwave"
                  className="p-1.5 rounded-lg border border-white/10 hover:border-[#00f0ff]/50 text-neutral-400 hover:text-[#00f0ff] transition-colors cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
                  className="p-1.5 rounded-lg border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setMessages(INITIAL_MESSAGES)}
                  title="Reset Conversation"
                  className="p-1.5 rounded-lg border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close Terminal (Esc)"
                  className="p-1.5 rounded-lg border border-white/10 hover:border-red-400/50 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <kbd className="hidden sm:inline-block text-[8px] font-mono text-neutral-500">ESC</kbd>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Prompt Intelligence Chips */}
            <div className="px-4 py-2.5 border-b border-white/5 bg-black/40 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
              {PRESET_PROMPTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.prompt)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/10 text-neutral-300 hover:text-[#00f0ff] text-[11px] font-mono whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    <Icon className="w-3 h-3 text-[#00f0ff]" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Conversation Log Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs text-neutral-300 select-text">
              {messages.map((msg) => {
                const isBot = msg.role === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                  >
                    <div className="text-[9px] font-mono text-neutral-500 mb-1 flex items-center gap-1.5">
                      <span>{isBot ? 'THUNDER AI // AGENT' : 'YOU // RECRUITER'}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div
                      className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                        isBot
                          ? 'bg-white/[0.04] border border-[#00f0ff]/20 text-neutral-200 shadow-[0_0_20px_rgba(0,240,255,0.05)]'
                          : 'bg-[#00f0ff]/15 border border-[#00f0ff]/50 text-white shadow-[0_0_25px_rgba(0,240,255,0.2)]'
                      }`}
                    >
                      {/* Markdown links & bold rendering */}
                      {msg.content.split('\n').map((line, i) => (
                        <p key={i} className={line.trim() === '' ? 'h-2' : 'my-0.5'}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Streaming Indicator */}
              {isLoading && (
                <div className="flex flex-col items-start">
                  <div className="text-[9px] font-mono text-neutral-500 mb-1">
                    THUNDER AI // COMPUTING
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-[#00f0ff]/30 flex items-center gap-2 text-[#00f0ff]">
                    <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
                    <span className="text-xs font-mono">Synthesizing research neural weights...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Footer */}
            <div className="p-3.5 border-t border-white/10 bg-black/60 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="relative flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Thunder AI about Kishan's research, code, or stack..."
                  disabled={isLoading}
                  className="flex-1 bg-white/[0.05] border border-white/15 focus:border-[#00f0ff] rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#00f0ff] transition-all"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="p-2.5 rounded-xl bg-[#00f0ff] hover:bg-cyan-300 disabled:opacity-40 text-black transition-all font-mono font-bold cursor-pointer disabled:cursor-not-allowed shadow-[0_0_15px_#00f0ff]"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-neutral-500">
                <span>POWERED BY GEMINI 3.8 FLASH & RESEARCH ENGINE</span>
                <a
                  href={PERSONAL_INFO.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00f0ff] transition-colors flex items-center gap-1"
                >
                  <span>GITHUB</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
