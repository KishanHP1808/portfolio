import { jsPDF } from 'jspdf';
import { PERSONAL_INFO, PROJECTS, EXPERIENCES, CERTIFICATES, SKILLS } from '../data/portfolioData';

/**
 * Generates an ATS-friendly, high-fidelity PDF resume for Kishan H.P.
 * and triggers immediate browser download.
 */
export const generateClientResumePDF = (): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const COLOR_PRIMARY = [0, 168, 204]; // Aqua / Cyan
  const COLOR_DARK = [15, 23, 42]; // Slate 900
  const COLOR_TEXT = [51, 65, 85]; // Slate 700
  const COLOR_MUTED = [100, 116, 139]; // Slate 500
  const COLOR_LINE = [226, 232, 240]; // Slate 200

  let y = margin;

  // Top Accent Bar
  doc.setFillColor(0, 240, 255);
  doc.rect(0, 0, pageWidth, 6, 'F');

  y += 14;

  // Name Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
  doc.text(PERSONAL_INFO.name, margin, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
  doc.text('FRONTEND DEVELOPER & UI/UX DESIGNER | FULL STACK WEB DEVELOPER', margin, y + 16);

  y += 24;

  // Contact Info Row
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
  const contactLine = `${PERSONAL_INFO.location}  |  ${PERSONAL_INFO.email}  |  github.com/KishanHP1808  |  leetcode.com/u/Kishan_H_P`;
  doc.text(contactLine, margin, y);

  y += 14;

  // Divider
  doc.setDrawColor(COLOR_LINE[0], COLOR_LINE[1], COLOR_LINE[2]);
  doc.setLineWidth(0.75);
  doc.line(margin, y, pageWidth - margin, y);

  y += 16;

  // Helper function for Section Titles
  const renderSectionHeader = (title: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.text(title.toUpperCase(), margin, y);

    const textWidth = doc.getTextWidth(title.toUpperCase());
    doc.setDrawColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.setLineWidth(1);
    doc.line(margin, y + 3, margin + textWidth, y + 3);

    doc.setDrawColor(COLOR_LINE[0], COLOR_LINE[1], COLOR_LINE[2]);
    doc.setLineWidth(0.5);
    doc.line(margin + textWidth + 8, y + 3, pageWidth - margin, y + 3);

    y += 14;
  };

  // 1. PROFESSIONAL SUMMARY
  renderSectionHeader('Professional Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);
  const summary =
    'Passionate Frontend Developer and UI/UX Designer based in Mysuru, Karnataka, specializing in high-performance web applications, fluid motion architecture, and clean full-stack systems. Demonstrated expertise across React, TypeScript, Next.js, Python/Django, RESTful APIs, and modern Figma design systems. Committed to building robust, accessible, user-centric digital experiences.';
  const splitSummary = doc.splitTextToSize(summary, contentWidth);
  doc.text(splitSummary, margin, y);
  y += splitSummary.length * 11 + 6;

  // 2. TECHNICAL SKILLS
  renderSectionHeader('Core Technical Capabilities');
  const skillGroups = [
    {
      label: 'Frontend & UI:',
      items: 'React.js, Next.js, TypeScript, JavaScript (ES6+), Tailwind CSS, HTML5, CSS3, GSAP, Responsive Design'
    },
    {
      label: 'Backend & Systems:',
      items: 'Node.js, Express, Python, Django 5, Django REST Framework, FastAPI, REST APIs, WebSockets, JWT Auth'
    },
    {
      label: 'Design & Prototyping:',
      items: 'Figma (Design Systems, Auto-Layout, Interactive Prototyping), UI/UX Wireframing, Information Architecture'
    },
    {
      label: 'DevOps & Tooling:',
      items: 'Git, GitHub, Docker, CI/CD Actions, Render, Vercel, Vite, Linux Shell, Redis'
    }
  ];

  skillGroups.forEach((group) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
    doc.text(group.label, margin, y);

    const labelWidth = doc.getTextWidth(group.label);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);
    const itemsText = doc.splitTextToSize(group.items, contentWidth - labelWidth - 8);
    doc.text(itemsText, margin + labelWidth + 6, y);
    y += Math.max(12, itemsText.length * 10);
  });

  y += 4;

  // 3. SELECTED PROJECTS
  renderSectionHeader('Featured Engineering Projects');

  const selectedProjects = [
    {
      title: 'AgriGuard — Smart Crop Disease Detection & Agricultural Advisory',
      tech: 'React, TypeScript, Python / Django, AI Diagnostics, Tailwind CSS, Vercel',
      live: 'https://agri-guard-mocha.vercel.app/',
      github: 'github.com/KishanHP1808/crop-disease-detection',
      points: [
        'Engineered an automated crop pathology detection web platform serving diagnostic insights with an ultra-responsive mobile interface.',
        'Designed RESTful Django API endpoints processing high-res leaf disease imagery with sub-second diagnostic feedback.',
        'Integrated localized market pricing indicators, weather analytics, and multilingual agricultural advisories.'
      ]
    },
    {
      title: 'Football Auction System — Real-Time Bidding & Valuation Arena',
      tech: 'React, Django Channels, WebSockets, Redis, Tailwind CSS, Vercel',
      live: 'https://football-auction-three.vercel.app/',
      github: 'github.com/KishanHP1808/football-auction',
      points: [
        'Architected a synchronized live auction engine with real-time countdown clocks, atomic bid validation, and dynamic team budget tracking.',
        'Resolved split-second race conditions using Redis pub/sub locks and optimistic state reconciliations.',
        'Crafted an immersive 4K stadium dashboard delivering sub-50ms live spectator updates.'
      ]
    },
    {
      title: 'SmartAttend — Biometric Attendance & Facial Recognition System',
      tech: 'Python, OpenCV, Tkinter/Web UI, SQLite',
      github: 'github.com/KishanHP1808/Smart-attend',
      points: [
        'Built biometric optical verification pipeline recording real-time student/employee attendance logs.',
        'Exported automated CSV reports and integrated administrative management portals.'
      ]
    },
    {
      title: 'AI Assistant — Autonomous AI Research & Document Intelligence',
      tech: 'FastAPI, Python, LangChain, React, Pydantic, Vercel',
      live: 'https://ai-assistant-orcin-alpha.vercel.app/',
      github: 'github.com/KishanHP1808/Personal-Research-Assistant',
      points: [
        'Designed an asynchronous API streaming research queries with sub-second token delivery.',
        'Constructed multi-document synthesis workflows and automated executive report generation.'
      ]
    }
  ];

  selectedProjects.forEach((proj) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
    doc.text(proj.title, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
    const links = [proj.github, proj.live ? 'Live: ' + proj.live : ''].filter(Boolean).join('  |  ');
    const linkWidth = doc.getTextWidth(links);
    doc.text(links, pageWidth - margin - linkWidth, y);

    y += 10;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.text('Tech Stack: ' + proj.tech, margin, y);
    y += 9;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);
    proj.points.forEach((pt) => {
      doc.text('•', margin + 4, y);
      const splitPt = doc.splitTextToSize(pt, contentWidth - 14);
      doc.text(splitPt, margin + 12, y);
      y += splitPt.length * 8.5 + 1;
    });

    y += 3;
  });

  // 4. EXPERIENCE
  renderSectionHeader('Experience & Engineering Roles');

  const expData = [
    {
      role: 'Full Stack & Advanced Frontend Developer',
      org: 'Creative Digital Labs & Independent Projects',
      period: '2025 – Present',
      desc: 'Spearheading modern responsive web applications, architecting real-time WebSocket client systems, and crafting accessible component libraries in React, Next.js, and TypeScript.'
    },
    {
      role: 'UI/UX Designer & Web Developer',
      org: 'Digital Product Initiatives',
      period: '2024 – 2025',
      desc: 'Created end-to-end design systems in Figma with auto-layout tokenization. Translated prototypes into high-performance full-stack web applications with Python/Django backends.'
    }
  ];

  expData.forEach((exp) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
    doc.text(exp.role, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
    const periodWidth = doc.getTextWidth(exp.period);
    doc.text(exp.period, pageWidth - margin - periodWidth, y);

    y += 10;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.text(exp.org, margin, y);
    y += 9;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);
    const splitDesc = doc.splitTextToSize(exp.desc, contentWidth);
    doc.text(splitDesc, margin, y);
    y += splitDesc.length * 8.5 + 4;
  });

  // 5. CERTIFICATIONS
  renderSectionHeader('Certifications & Honors');
  const certList = [
    'Meta Certified Front-End Developer Professional (React, JavaScript, Web Performance)',
    'Google UX Design Professional Specialization (Figma, User Research, Interaction Design)',
    'Full Stack Web Engineering & Cloud Deployment (HackerRank & freeCodeCamp)',
    'DeepLearning.AI Machine Learning & Neural Networks Specialization'
  ];

  certList.forEach((cert) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);
    doc.text('•  ' + cert, margin + 2, y);
    y += 9.5;
  });

  // Footer
  doc.setDrawColor(COLOR_LINE[0], COLOR_LINE[1], COLOR_LINE[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, pageHeight - 24, pageWidth - margin, pageHeight - 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
  doc.text('Kishan H.P  •  Portfolio & Verified Credentials: github.com/KishanHP1808', margin, pageHeight - 14);
  const rightFooter = 'Available for Full-time Roles & Select Freelance Engagements';
  doc.text(rightFooter, pageWidth - margin - doc.getTextWidth(rightFooter), pageHeight - 14);

  // Trigger download
  doc.save('Kishan_HP_Resume.pdf');
};
