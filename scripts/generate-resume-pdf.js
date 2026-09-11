import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";

// Initialize jsPDF document (A4 portrait)
const doc = new jsPDF({
  orientation: "portrait",
  unit: "pt",
  format: "a4"
});

const pageWidth = doc.internal.pageSize.getWidth(); // ~595.28 pt
const pageHeight = doc.internal.pageSize.getHeight(); // ~841.89 pt
const margin = 40;
const contentWidth = pageWidth - margin * 2;

// Colors
const COLOR_PRIMARY = [14, 165, 233]; // Modern Cyan / Teal #0ea5e9
const COLOR_DARK = [15, 23, 42]; // Slate 900
const COLOR_TEXT = [51, 65, 85]; // Slate 700
const COLOR_MUTED = [100, 116, 139]; // Slate 500
const COLOR_BG_CARD = [248, 250, 252]; // Slate 50
const COLOR_LINE = [226, 232, 240]; // Slate 200

let y = margin;

// Top Accent bar
doc.setFillColor(...COLOR_PRIMARY);
doc.rect(0, 0, pageWidth, 6, "F");

y += 12;

// Header Section
doc.setFont("helvetica", "bold");
doc.setFontSize(24);
doc.setTextColor(...COLOR_DARK);
doc.text("KISHAN H.P.", margin, y);

doc.setFont("helvetica", "normal");
doc.setFontSize(10.5);
doc.setTextColor(...COLOR_PRIMARY);
doc.text("FRONTEND DEVELOPER & UI/UX DESIGNER | FULL STACK WEB DEVELOPER", margin, y + 16);

y += 24;

// Contact Row
doc.setFontSize(8.5);
doc.setTextColor(...COLOR_MUTED);
const contactInfo = [
  "Mysuru, Karnataka, India",
  "kishanhp18@gmail.com",
  "github.com/KishanHP1808",
  "linkedin.com/in/kishan-h-p-9766063b3"
].join("  |  ");
doc.text(contactInfo, margin, y);

y += 14;

// Divider
doc.setDrawColor(...COLOR_LINE);
doc.setLineWidth(0.75);
doc.line(margin, y, pageWidth - margin, y);

y += 16;

// Helper: Section Title
function renderSectionHeader(title) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text(title.toUpperCase(), margin, y);
  
  doc.setDrawColor(...COLOR_PRIMARY);
  doc.setLineWidth(1);
  const textWidth = doc.getTextWidth(title.toUpperCase());
  doc.line(margin, y + 3, margin + textWidth, y + 3);
  
  doc.setDrawColor(...COLOR_LINE);
  doc.setLineWidth(0.5);
  doc.line(margin + textWidth + 8, y + 3, pageWidth - margin, y + 3);
  
  y += 14;
}

// 1. PROFESSIONAL SUMMARY
renderSectionHeader("Professional Summary");
doc.setFont("helvetica", "normal");
doc.setFontSize(8.5);
doc.setTextColor(...COLOR_TEXT);
const summary = "Innovative Frontend Developer and UI/UX Designer based in Mysuru, Karnataka, specializing in high-performance web applications, fluid motion architecture, and clean full-stack systems. Demonstrated expertise across React, TypeScript, Next.js, Python/Django, RESTful APIs, and modern Figma design systems. Committed to building robust, accessible, user-centric digital experiences.";
const splitSummary = doc.splitTextToSize(summary, contentWidth);
doc.text(splitSummary, margin, y);
y += splitSummary.length * 11 + 6;

// 2. TECHNICAL CAPABILITIES & SKILLS
renderSectionHeader("Core Technical Skills");
const skillGroups = [
  { label: "Frontend & UI:", items: "React.js, Next.js, TypeScript, JavaScript (ES6+), Tailwind CSS, HTML5, CSS3, GSAP, Motion, Responsive Design" },
  { label: "Backend & Systems:", items: "Node.js, Express, Python, Django 5, Django REST Framework, FastAPI, REST APIs, WebSockets, JWT Auth" },
  { label: "Design & Prototyping:", items: "Figma (Design Systems, Auto-Layout, Interactive Prototyping), UI/UX Wireframing, Information Architecture" },
  { label: "DevOps & Tooling:", items: "Git, GitHub, Docker, CI/CD Actions, Render, Vercel, Vite, Linux Shell, Redis" }
];

skillGroups.forEach(group => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(group.label, margin, y);
  
  const labelWidth = doc.getTextWidth(group.label);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLOR_TEXT);
  const itemsText = doc.splitTextToSize(group.items, contentWidth - labelWidth - 8);
  doc.text(itemsText, margin + labelWidth + 6, y);
  y += Math.max(12, itemsText.length * 10);
});

y += 4;

// 3. FEATURED PROJECTS & SYSTEM ARCHITECTURE
renderSectionHeader("Selected Engineering Projects");

const projects = [
  {
    title: "AgriGuard — Smart Crop Disease Detection & Agricultural Advisory",
    tech: "React, TypeScript, Python / Django, AI Diagnostics, Tailwind CSS",
    live: "https://agri-guard-yw1o.onrender.com",
    github: "github.com/KishanHP1808/crop-disease-detection",
    points: [
      "Engineered an automated crop pathology detection web platform serving diagnostic insights for farmers with an ultra-responsive mobile interface.",
      "Designed RESTful Django API endpoints processing high-res leaf disease imagery with sub-second feedback.",
      "Integrated localized market pricing indicators, weather analytics, and multilingual agricultural advisories."
    ]
  },
  {
    title: "Football Auction System — Real-Time Bidding & Player Valuation",
    tech: "React, Django Channels, WebSockets, Redis, Tailwind CSS",
    live: "https://football-auction-uak7.onrender.com",
    github: "github.com/KishanHP1808/football-auction",
    points: [
      "Architected a synchronized live auction engine with real-time countdown clocks, atomic bid validation, and dynamic team budget tracking.",
      "Resolved split-second race conditions using Redis pub/sub locks and optimistic state reconciliations.",
      "Crafted an immersive 4K stadium dashboard delivering sub-50ms live spectator updates."
    ]
  },
  {
    title: "SmartAttend — Modern Attendance & Facial Recognition System",
    tech: "Python, OpenCV, Tkinter/Web UI, SQLite",
    github: "github.com/KishanHP1808/Smart-attend",
    points: [
      "Built biometric optical verification pipeline recording real-time student/employee attendance logs.",
      "Exported automated CSV reports and integrated administrative management portals."
    ]
  },
  {
    title: "Personal Research Assistant — AI Document Intelligence & Retrieval",
    tech: "FastAPI, Python, LangChain, React, Pydantic",
    live: "https://personal-research-assistant-vzr7.onrender.com/",
    github: "github.com/KishanHP1808/Personal-Research-Assistant",
    points: [
      "Designed an asynchronous API streaming research document queries with sub-second token delivery.",
      "Constructed multi-document synthesis workflows and automated executive summary generation."
    ]
  }
];

projects.forEach((proj, idx) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(proj.title, margin, y);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_MUTED);
  const links = [proj.github, proj.live ? "Live: " + proj.live : ""].filter(Boolean).join("  |  ");
  const linkWidth = doc.getTextWidth(links);
  doc.text(links, pageWidth - margin - linkWidth, y);
  
  y += 10;
  
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("Tech Stack: " + proj.tech, margin, y);
  y += 9;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_TEXT);
  proj.points.forEach(pt => {
    doc.text("•", margin + 4, y);
    const splitPt = doc.splitTextToSize(pt, contentWidth - 14);
    doc.text(splitPt, margin + 12, y);
    y += splitPt.length * 8.5 + 1;
  });
  
  y += 3;
});

// 4. EXPERIENCE
renderSectionHeader("Experience & Engineering Roles");

const experiences = [
  {
    role: "Full Stack & Advanced Frontend Developer",
    org: "Creative Digital Labs & Independent Projects",
    period: "2025 – Present",
    desc: "Spearheading modern responsive web applications, architecting real-time WebSocket client systems, and crafting accessible component libraries in React, Next.js, and TypeScript."
  },
  {
    role: "UI/UX Designer & Web Developer",
    org: "Digital Product Initiatives",
    period: "2024 – 2025",
    desc: "Created end-to-end design systems in Figma with auto-layout tokenization. Translated prototypes into high-performance full-stack web applications with Python/Django backends."
  }
];

experiences.forEach(exp => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(exp.role, margin, y);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_MUTED);
  const periodWidth = doc.getTextWidth(exp.period);
  doc.text(exp.period, pageWidth - margin - periodWidth, y);
  
  y += 10;
  
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text(exp.org, margin, y);
  y += 9;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_TEXT);
  const splitDesc = doc.splitTextToSize(exp.desc, contentWidth);
  doc.text(splitDesc, margin, y);
  y += splitDesc.length * 8.5 + 4;
});

// 5. CERTIFICATIONS & CREDENTIALS
renderSectionHeader("Certifications & Accreditations");
const certs = [
  "Meta Certified Front-End Developer Professional (React, JavaScript, Web Performance)",
  "Google UX Design Professional Specialization (Figma, User Research, Interaction Design)",
  "Full Stack Web Engineering & Cloud Deployment (HackerRank & freeCodeCamp)",
  "DeepLearning.AI Machine Learning & Neural Networks Specialization"
];

certs.forEach(cert => {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_TEXT);
  doc.text("•  " + cert, margin + 2, y);
  y += 9.5;
});

// Footer
doc.setDrawColor(...COLOR_LINE);
doc.setLineWidth(0.5);
doc.line(margin, pageHeight - 24, pageWidth - margin, pageHeight - 24);

doc.setFont("helvetica", "normal");
doc.setFontSize(7);
doc.setTextColor(...COLOR_MUTED);
doc.text("Kishan H.P.  •  Portfolio & Verified Credentials: github.com/KishanHP1808", margin, pageHeight - 14);
doc.text("Available for Full-time Roles & Select Freelance Engagements", pageWidth - margin - doc.getTextWidth("Available for Full-time Roles & Select Freelance Engagements"), pageHeight - 14);

// Save output to public directory
const publicDir = path.join(process.cwd(), "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
fs.writeFileSync(path.join(publicDir, "Kishan_HP_Resume.pdf"), pdfBuffer);
fs.writeFileSync(path.join(publicDir, "resume.pdf"), pdfBuffer);

console.log("Successfully generated Kishan_HP_Resume.pdf and resume.pdf in public/");
