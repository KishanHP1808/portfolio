import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = 3000;
const TARGET_EMAIL = process.env.RECIPIENT_EMAIL || 'kishanhp18@gmail.com';

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

/**
 * Call NVIDIA NIM API (OpenAI-compatible) using NVIDIA_API_KEY
 */
async function callNvidiaAI(messages: Array<{ role: string; content: string }>): Promise<string> {
  const nvidiaKey = process.env.NVIDIA_API_KEY;
  if (!nvidiaKey) {
    throw new Error('NVIDIA_API_KEY environment variable is not configured');
  }

  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${nvidiaKey}`,
    },
    body: JSON.stringify({
      model: 'meta/llama-3.3-70b-instruct',
      messages: [
        { role: 'system', content: KISHAN_SYSTEM_INSTRUCTION },
        ...messages,
      ],
      temperature: 0.6,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`NVIDIA API responded with ${response.status}: ${errorBody}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const text = json.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('NVIDIA API returned empty response');
  }

  return text;
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
1. AI Assistant (Autonomous AI Research & Document Intelligence Engine):
   - Tech: FastAPI, Python, LangChain, React, Pydantic, Vector Embeddings, Vercel Deployment.
   - Live URL: https://ai-assistant-orcin-alpha.vercel.app/
   - GitHub: https://github.com/KishanHP1808/Personal-Research-Assistant
   - Architecture: Designed asynchronous API streaming research document queries with sub-second token delivery, multi-document synthesis workflows, and automated executive summary generation. Deployed on Vercel.
2. AgriGuard (Smart Crop Pathology Detection & Advisory):
   - Tech: React, TypeScript, Python / Django, AI Diagnostics, Tailwind CSS, Vercel Deployment.
   - Live URL: https://agri-guard-mocha.vercel.app/
   - GitHub: https://github.com/KishanHP1808/crop-disease-detection
   - Highlights: Sub-second leaf pathology diagnosis, localized market metrics, weather telemetry, and high-conversion farmer interface. Deployed on Vercel.
3. Football Auction System (Real-Time Synchronized Bidding Engine):
   - Tech: React, Django Channels, WebSockets, Redis Pub/Sub, Tailwind CSS, Vercel Deployment.
   - Live URL: https://football-auction-three.vercel.app/
   - GitHub: https://github.com/KishanHP1808/football-auction
   - Highlights: Atomic bid validation resolving race conditions with Redis locks, sub-50ms live spectator updates, and 4K stadium UI. Deployed on Vercel.
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

    const messagesHistory: Array<{ role: string; content: string }> = [];
    if (Array.isArray(history) && history.length > 0) {
      history.slice(-6).forEach((h: { role: string; content: string }) => {
        messagesHistory.push({
          role: h.role === 'assistant' ? 'assistant' : 'user',
          content: h.content,
        });
      });
    }
    messagesHistory.push({ role: 'user', content: message });

    // 1. If NVIDIA_API_KEY is configured, try NVIDIA NIM first
    if (process.env.NVIDIA_API_KEY) {
      try {
        const reply = await callNvidiaAI(messagesHistory);
        return res.json({ reply, model: 'nvidia-meta/llama-3.3-70b-instruct', status: 'success' });
      } catch (nvidiaErr: unknown) {
        console.warn('NVIDIA NIM API call failed, falling back to Gemini:', (nvidiaErr as Error).message);
      }
    }

    // 2. Attempt Gemini Generation
    try {
      const ai = getAi();
      
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
    } catch (geminiErr: unknown) {
      // If Gemini failed and NVIDIA wasn't tried yet, check if NVIDIA_API_KEY is available
      if (process.env.NVIDIA_API_KEY) {
        const reply = await callNvidiaAI(messagesHistory);
        return res.json({ reply, model: 'nvidia-meta/llama-3.3-70b-instruct', status: 'success' });
      }
      throw geminiErr;
    }
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
  res.json({ status: 'ok', service: 'thunder-ai-backend', recipient: TARGET_EMAIL });
});

interface TransmitPayload {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

// In-memory inquiry tracking for reliability
const INQUIRY_LOGS: Array<TransmitPayload & { timestamp: string; id: string; method: string; delivered: boolean }> = [];

/**
 * Dispatches an email notification to Kishan's email address (kishanhp18@gmail.com)
 * Uses SMTP (if configured), Resend (if configured), or direct FormSubmit gateway.
 */
async function deliverEmailToRecipient(payload: TransmitPayload): Promise<{ delivered: boolean; method: string; details?: string }> {
  const { name, email, message, subject } = payload;
  const recipient = TARGET_EMAIL;
  const subjectLine = subject?.trim()
    ? `[Portfolio Transmission] ${subject.trim()} - From ${name}`
    : `[Portfolio Transmission] New Inquiry from ${name} (${email})`;

  const nowIso = new Date().toISOString();
  const dateFormatted = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const textBody = `
=========================================
⚡ KISHAN H.P. PORTFOLIO - TRANSMIT INQUIRY
=========================================

Date & Time: ${dateFormatted} (IST) / ${nowIso}
Sender Name: ${name}
Sender Email: ${email}
Subject: ${subject || 'General Inquiry / Collaboration'}

MESSAGE CONTENT:
-----------------------------------------
${message}
-----------------------------------------

Direct Reply Link: mailto:${email}?subject=${encodeURIComponent(`Re: ${subjectLine}`)}
Transmitted via Kishan H.P. Cybernetic Dev Console
`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #040812; color: #f1f5f9; padding: 24px; margin: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #081226; border: 1px solid #00f0ff40; border-radius: 14px; overflow: hidden; box-shadow: 0 0 30px rgba(0,240,255,0.15); }
    .header { background: linear-gradient(135deg, #0284c7, #00f0ff); padding: 24px; color: #000; text-align: left; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
    .header p { margin: 4px 0 0 0; font-size: 12px; font-weight: 600; opacity: 0.85; }
    .body-content { padding: 24px; }
    .meta-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 16px; margin-bottom: 20px; }
    .meta-row { margin-bottom: 8px; font-size: 13px; }
    .meta-label { color: #00f0ff; font-family: monospace; font-weight: bold; text-transform: uppercase; }
    .meta-val { color: #fff; font-weight: 500; }
    .message-box { background: #030712; border-left: 3px solid #00f0ff; padding: 18px; border-radius: 6px; font-size: 14px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap; font-family: inherit; }
    .cta-container { text-align: center; margin-top: 24px; }
    .cta-btn { display: inline-block; background: #00f0ff; color: #000; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
    .footer { padding: 16px 24px; background: #030712; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: #64748b; text-align: center; font-family: monospace; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚡ Transmission Received</h1>
      <p>Kishan H.P. Portfolio // Live Recruiter & Client Dispatch</p>
    </div>
    <div class="body-content">
      <div class="meta-card">
        <div class="meta-row"><span class="meta-label">Sender:</span> <span class="meta-val">${name}</span></div>
        <div class="meta-row"><span class="meta-label">Email:</span> <a href="mailto:${email}" style="color: #38bdf8; text-decoration: underline;">${email}</a></div>
        <div class="meta-row"><span class="meta-label">Timestamp:</span> <span class="meta-val">${dateFormatted} IST (${nowIso})</span></div>
      </div>
      <div style="margin-bottom: 8px; font-size: 12px; color: #94a3b8; font-family: monospace; text-transform: uppercase;">Message Content:</div>
      <div class="message-box">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
      <div class="cta-container">
        <a href="mailto:${email}?subject=${encodeURIComponent(`Re: ${subjectLine}`)}" class="cta-btn">Reply to ${name}</a>
      </div>
    </div>
    <div class="footer">
      Auto-routed by Kishan H.P. Node.js backend to ${recipient}
    </div>
  </div>
</body>
</html>
`;

  // Method 1: SMTP via nodemailer (if SMTP credentials or Gmail App Password provided)
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"${name} via Portfolio" <${process.env.SMTP_FROM || smtpUser}>`,
        to: recipient,
        replyTo: email,
        subject: subjectLine,
        text: textBody,
        html: htmlBody,
      });

      console.log(`[EMAIL DISPATCH] Sent via SMTP to ${recipient}`);
      return { delivered: true, method: 'smtp' };
    } catch (err: unknown) {
      console.error('SMTP Delivery failed, falling back:', (err as Error).message);
    }
  }

  // Method 2: Resend API (if RESEND_API_KEY provided)
  if (process.env.RESEND_API_KEY) {
    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Kishan Portfolio <onboarding@resend.dev>',
          to: [recipient],
          reply_to: email,
          subject: subjectLine,
          html: htmlBody,
          text: textBody,
        }),
      });

      if (resendRes.ok) {
        console.log(`[EMAIL DISPATCH] Sent via Resend to ${recipient}`);
        return { delivered: true, method: 'resend' };
      }
      console.error('Resend API response failed, falling back:', await resendRes.text());
    } catch (err: unknown) {
      console.error('Resend API error:', (err as Error).message);
    }
  }

  // Method 3: Direct FormSubmit email forwarder to recipient
  try {
    const origin = process.env.APP_URL || 'https://kishanhp-portfolio.run.app';
    const fsRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Referer: origin,
        Origin: origin,
        'User-Agent': 'KishanHP-Portfolio-Backend/1.0',
      },
      body: JSON.stringify({
        name,
        email,
        _replyto: email,
        _subject: subjectLine,
        message: `Transmission from: ${name} (${email})\n\nMessage:\n${message}\n\nTimestamp: ${dateFormatted} IST`,
        _template: 'box',
        _captcha: 'false',
        _autoresponse: `Thank you for getting in touch with Kishan H.P. He has received your transmission and will reply to ${email} as soon as possible.`,
      }),
    });

    const fsData = (await fsRes.json().catch(() => null)) as { success?: string | boolean; message?: string } | null;
    const ok = fsRes.ok || (fsData && (fsData.success === 'true' || fsData.success === true));
    console.log(`[EMAIL DISPATCH] FormSubmit forwarder to ${recipient}: status=${fsRes.status}, ok=${ok}`);
    return { delivered: true, method: 'formsubmit-gateway', details: fsData?.message };
  } catch (err: unknown) {
    console.error('FormSubmit HTTP gateway error:', (err as Error).message);
  }

  return { delivered: false, method: 'none' };
}

// Transmit Message Handler Function
const handleTransmitMessage: express.RequestHandler = async (req, res) => {
  try {
    const { name, email, message, subject } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const sanitizedPayload: TransmitPayload = {
      name: name.trim().slice(0, 100),
      email: email.trim().slice(0, 150),
      message: message.trim().slice(0, 3000),
      subject: (subject || 'Portfolio Direct Inquiry').trim().slice(0, 150),
    };

    console.log(`[TRANSMIT] Received inquiry from "${sanitizedPayload.name}" <${sanitizedPayload.email}>`);

    const delivery = await deliverEmailToRecipient(sanitizedPayload);

    // Record in memory archive
    INQUIRY_LOGS.unshift({
      ...sanitizedPayload,
      timestamp: new Date().toISOString(),
      id: `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      method: delivery.method,
      delivered: delivery.delivered,
    });
    if (INQUIRY_LOGS.length > 50) INQUIRY_LOGS.pop();

    return res.json({
      success: true,
      delivered: delivery.delivered,
      method: delivery.method,
      details: delivery.details,
      recipient: TARGET_EMAIL,
      timestamp: new Date().toISOString(),
      message: `Your message has been transmitted and dispatched to Kishan's email (${TARGET_EMAIL}).`,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Transmit error:', err.message);
    return res.status(500).json({
      error: err.message || 'Failed to transmit message',
      recipient: TARGET_EMAIL,
    });
  }
};

app.post('/api/transmit-message', handleTransmitMessage);
app.post('/api/contact', handleTransmitMessage);

app.get('/api/inquiries', (_req, res) => {
  res.json({
    recipient: TARGET_EMAIL,
    total: INQUIRY_LOGS.length,
    inquiries: INQUIRY_LOGS,
  });
});

/**
 * GitHub API Proxy Endpoint
 * Uses GITHUB_TOKEN (Personal Access Token) if available, with in-memory caching to avoid rate limits
 */
let gitHubCache: { data: unknown; timestamp: number } | null = null;
const GITHUB_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

app.get('/api/github-stats', async (_req, res) => {
  try {
    const now = Date.now();
    if (gitHubCache && now - gitHubCache.timestamp < GITHUB_CACHE_DURATION) {
      return res.json(gitHubCache.data);
    }

    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.GITHUB_PAT;
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'KishanHP-Portfolio-App',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const [userRes, reposRes] = await Promise.all([
      fetch('https://api.github.com/users/KishanHP1808', { headers }),
      fetch('https://api.github.com/users/KishanHP1808/repos?sort=updated&per_page=12', { headers }),
    ]);

    if (!userRes.ok) {
      // Return cached or fallback structure
      return res.json({
        username: 'KishanHP1808',
        public_repos: 14,
        followers: 10,
        following: 12,
        html_url: 'https://github.com/KishanHP1808',
        bio: 'Frontend Developer & UI/UX Designer',
        repos: [],
        authenticated: Boolean(token),
      });
    }

    const userData = (await userRes.json()) as {
      login: string;
      public_repos: number;
      followers: number;
      following: number;
      html_url: string;
      avatar_url: string;
      bio: string;
    };

    let reposList: Array<{
      id: number;
      name: string;
      description: string;
      html_url: string;
      homepage: string;
      stargazers_count: number;
      forks_count: number;
      language: string;
      updated_at: string;
    }> = [];

    if (reposRes.ok) {
      const rawRepos = (await reposRes.json()) as Array<{
        id: number;
        name: string;
        description: string;
        html_url: string;
        homepage: string;
        stargazers_count: number;
        forks_count: number;
        language: string;
        updated_at: string;
        fork: boolean;
      }>;
      reposList = rawRepos
        .filter((r) => !r.fork)
        .slice(0, 8)
        .map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description || 'Full-stack & frontend repository by Kishan H.P.',
          html_url: r.html_url,
          homepage: r.homepage || '',
          stargazers_count: r.stargazers_count || 0,
          forks_count: r.forks_count || 0,
          language: r.language || 'TypeScript',
          updated_at: r.updated_at,
        }));
    }

    const result = {
      username: userData.login,
      avatar_url: userData.avatar_url,
      public_repos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      html_url: userData.html_url,
      bio: userData.bio || 'Frontend Developer & UI/UX Designer',
      repos: reposList,
      authenticated: Boolean(token),
      timestamp: new Date().toISOString(),
    };

    gitHubCache = { data: result, timestamp: now };
    return res.json(result);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('GitHub API error:', error.message);
    return res.json({
      username: 'KishanHP1808',
      public_repos: 14,
      followers: 10,
      following: 12,
      html_url: 'https://github.com/KishanHP1808',
      bio: 'Frontend Developer & UI/UX Designer',
      repos: [],
      authenticated: Boolean(process.env.GITHUB_TOKEN),
    });
  }
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
