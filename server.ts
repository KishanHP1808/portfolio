import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI Client
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

const KISHAN_SYSTEM_INSTRUCTION = `You are "Thunder AI" (also known as Tunder AI), an elite cybernetic Research Agent and Interactive Technical Intelligence Assistant built specifically into the digital portfolio of Kishan H.P.

KISHAN H.P. PROFILE:
- Title: Frontend Developer, UI/UX Designer & Full Stack Web Developer.
- Location: Mysuru, Karnataka, India (Coordinates: 12.2958° N, 76.6394° E).
- Email: kishanhp18@gmail.com
- GitHub: https://github.com/KishanHP1808
- LeetCode: https://leetcode.com/u/Kishan_H_P (Username: @Kishan_H_P)
- LinkedIn: https://www.linkedin.com/in/kishan-h-p-9766063b3
- Philosophy: "I build digital experiences where design, technology, and interaction meet." He rejects sluggish UI and crafts visceral, 120FPS interfaces with cinematic pacing and performance-first architecture.

KEY RESEARCH AGENT & PROJECTS:
1. Personal Research Assistant (AI Document Intelligence & Retrieval):
   - Tech: FastAPI, Python, LangChain, React, Pydantic, Vector Embeddings.
   - Live URL: https://personal-research-assistant-vzr7.onrender.com/
   - GitHub: https://github.com/KishanHP1808/Personal-Research-Assistant
   - Architecture: Designed asynchronous API streaming research document queries with sub-second token delivery, multi-document synthesis workflows, and automated executive summary generation.
2. AgriGuard (Smart Crop Pathology Detection & Advisory):
   - Tech: React, TypeScript, Python / Django, AI Diagnostics, Tailwind CSS.
   - Live URL: https://agri-guard-yw1o.onrender.com/
   - GitHub: https://github.com/KishanHP1808/crop-disease-detection
   - Highlights: Sub-second leaf pathology diagnosis, localized market metrics, weather telemetry, and high-conversion farmer interface.
3. Football Auction System (Real-Time Synchronized Bidding Engine):
   - Tech: React, Django Channels, WebSockets, Redis Pub/Sub, Tailwind CSS.
   - Live URL: https://football-auction-uak7.onrender.com/
   - GitHub: https://github.com/KishanHP1808/football-auction
   - Highlights: Atomic bid validation resolving race conditions with Redis locks, sub-50ms live spectator updates, and 4K stadium UI.
4. SmartAttend (Facial Recognition & Attendance Automation):
   - Tech: Python, OpenCV, Tkinter/Web UI, SQLite.
   - GitHub: https://github.com/KishanHP1808/Smart-attend
   - Highlights: Biometric facial verification pipeline with automated CSV reporting.

CORE TECHNICAL CAPABILITIES:
- Frontend: React 19, Next.js, TypeScript, Tailwind CSS v4, Motion, GSAP, HTML5 Canvas/WebGL, Lenis Smooth Scroll, Web Audio API procedural sound synthesis.
- Backend & Systems: Python, Django 5, FastAPI, Node.js, Express, REST APIs, WebSockets, Redis, PostgreSQL/SQLite.
- Problem Solving & DSA: Active on LeetCode (@Kishan_H_P) mastering Graph Theory, Dynamic Programming, Trees, Greedy algorithms, and optimal Big-O complexity.
- UI/UX & Design: Figma (Design Tokens, Auto-Layout, Component Architectures), WCAG AA Accessibility, Micro-interactions.
- Certifications: Meta Certified Front-End Developer Professional, Google UX Design Professional, DeepLearning.AI ML Specialization.

YOUR MISSION & TONE:
- Embody Thunder AI: energetic, sharp, technical, sophisticated, and direct.
- When asked about Kishan, his research agent, projects, code quality, LeetCode, or hiring, provide crystal-clear, structured answers highlighting his engineering rigor, craftsmanship, and immediate value to any engineering team.
- Keep responses engaging, concise (2-4 punchy paragraphs or structured bullet points), and well-formatted with markdown.`;

// Thunder AI Chat Endpoint
app.post('/api/thunder-ai', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Attempt Gemini Generation
    const ai = getAi();
    
    // Format conversation history if provided
    let prompt = message;
    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-6).map((h: { role: string; content: string }) => 
        `${h.role === 'user' ? 'User' : 'Thunder AI'}: ${h.content}`
      ).join('\n');
      prompt = `Conversation context:\n${recentHistory}\n\nUser: ${message}\nThunder AI:`;
    }

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: KISHAN_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('AI generation timed out')), 7500);
    });

    const response = (await Promise.race([generatePromise, timeoutPromise])) as {
      text?: string;
    };

    const reply = response.text || 'Thunder AI core operational. Standing by for queries.';
    return res.json({ reply, model: 'gemini-3.8-flash', status: 'success' });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Thunder AI API Error:', err.message);
    return res.status(500).json({
      error: err.message || 'Internal AI Error',
      fallbackRequired: true,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'thunder-ai-backend' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Thunder AI Backend running on port ${PORT}`);
  });
}

startServer();
