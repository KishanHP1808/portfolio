import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import { AtmosphericBackground } from './components/AtmosphericBackground';
import { CustomCursor } from './components/CustomCursor';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProjectsShowcase } from './components/ProjectsShowcase';
import { ProjectModal } from './components/ProjectModal';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { CertificatesSection } from './components/CertificatesSection';
import { ContactSection } from './components/ContactSection';
import { FloatingWavePlayer } from './components/FloatingWavePlayer';
import { FloatingBackNavigator } from './components/FloatingBackNavigator';
import { ElectricThunderCanvas } from './components/ElectricThunderCanvas';
import { ElectricCursorTrail } from './components/ElectricCursorTrail';
import { ThunderAiBot } from './components/ThunderAiBot';
import { ResumeModal } from './components/ResumeModal';
import { TalkToHimModal } from './components/TalkTogetherModal';
import { AuthProfileModal } from './components/AuthProfileModal';
import { Project, CursorState } from './types';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [talkToHimOpen, setTalkToHimOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>({
    text: '',
    active: false,
    variant: 'default',
  });

  // Global listeners for direct modal opening
  useEffect(() => {
    const handleOpenTalk = () => setTalkToHimOpen(true);
    const handleOpenResume = () => setResumeOpen(true);
    const handleOpenAuth = () => setAuthModalOpen(true);

    window.addEventListener('open-talk-to-him', handleOpenTalk);
    window.addEventListener('open-talk-together', handleOpenTalk);
    window.addEventListener('open-resume', handleOpenResume);
    window.addEventListener('open-auth-modal', handleOpenAuth);

    return () => {
      window.removeEventListener('open-talk-to-him', handleOpenTalk);
      window.removeEventListener('open-talk-together', handleOpenTalk);
      window.removeEventListener('open-resume', handleOpenResume);
      window.removeEventListener('open-auth-modal', handleOpenAuth);
    };
  }, []);

  // Initialize Lenis smooth scroll for camera-like scroll choreography (optimized for 180 FPS)
  useEffect(() => {
    let lenis: Lenis | null = null;
    let animFrame: number;

    try {
      lenis = new Lenis({
        duration: 0.95,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 1.05,
        touchMultiplier: 1.6,
        smoothWheel: true,
        autoResize: true,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        animFrame = requestAnimationFrame(raf);
      };

      animFrame = requestAnimationFrame(raf);
    } catch {
      // Fallback gracefully if smooth scroll can't initialize
    }

    return () => {
      cancelAnimationFrame(animFrame);
      lenis?.destroy();
    };
  }, []);

  const handleHoverAction = (text: string) => {
    setCursorState({
      text,
      active: true,
      variant: 'project',
    });
  };

  const handleHoverEnd = () => {
    setCursorState({
      text: '',
      active: false,
      variant: 'default',
    });
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#ededed] selection:bg-[#00f0ff] selection:text-black font-sans antialiased overflow-x-hidden">
      {/* Interactive Custom Cursor */}
      <CustomCursor cursorState={cursorState} />

      {/* Bioluminescent Micro-Spark Cursor Trail */}
      <ElectricCursorTrail />

      {/* Cinematic Studio Atmospheric Background & Grain Texture */}
      <AtmosphericBackground />

      {/* Procedural High-Voltage Electric Thunder & Plasma Arc Canvas */}
      <ElectricThunderCanvas />

      {/* Quantum Interface Gateway (2-4 sec or immediately skipped) */}
      <AnimatePresence>
        {loading && (
          <LoadingScreen onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {/* Main Portfolio Content */}
      <div
        className={`relative z-10 transition-all duration-1000 transform ease-out ${
          loading
            ? 'opacity-0 scale-[0.96] blur-md pointer-events-none'
            : 'opacity-100 scale-100 blur-0'
        }`}
      >
        {/* Minimal High-End Agency Navigation */}
        <Navbar
          onHoverAction={handleHoverAction}
          onHoverEnd={handleHoverEnd}
          onOpenTalkToHim={() => setTalkToHimOpen(true)}
          onOpenResume={() => setResumeOpen(true)}
          onOpenAuthModal={() => setAuthModalOpen(true)}
        />

        {/* Hero Section */}
        <HeroSection
          onHoverAction={handleHoverAction}
          onHoverEnd={handleHoverEnd}
          onOpenContact={scrollToContact}
          onOpenTalkToHim={() => setTalkToHimOpen(true)}
          onOpenResume={() => setResumeOpen(true)}
        />

        {/* Project Showcase (Selected Work) */}
        <ProjectsShowcase
          onSelectProject={(project) => setSelectedProject(project)}
          onHoverAction={handleHoverAction}
          onHoverEnd={handleHoverEnd}
        />

        {/* About Section */}
        <AboutSection
          onHoverAction={handleHoverAction}
          onHoverEnd={handleHoverEnd}
        />

        {/* Dynamic Typography-Based Skills Matrix */}
        <SkillsSection
          onHoverAction={handleHoverAction}
          onHoverEnd={handleHoverEnd}
        />

        {/* Editorial Experience Timeline */}
        <ExperienceTimeline
          onHoverAction={handleHoverAction}
          onHoverEnd={handleHoverEnd}
        />

        {/* Official Accreditation & Certificates Column Matrix */}
        <CertificatesSection
          onHoverAction={handleHoverAction}
          onHoverEnd={handleHoverEnd}
        />

        {/* Contact Section */}
        <ContactSection
          onHoverAction={handleHoverAction}
          onHoverEnd={handleHoverEnd}
          onOpenTalkToHim={() => setTalkToHimOpen(true)}
        />

        {/* Global Floating Ocean Wave Sound Controller */}
        <FloatingWavePlayer />

        {/* Global Floating Phase Back Navigator (Back options for all phases) */}
        <FloatingBackNavigator
          onHoverAction={handleHoverAction}
          onHoverEnd={handleHoverEnd}
        />

        {/* Autonomous Research Agent AI Bot - Thunder AI */}
        <ThunderAiBot
          onHoverAction={handleHoverAction}
          onHoverEnd={handleHoverEnd}
        />
      </div>

      {/* Interactive Case Study Modal Overlay */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onHoverAction={handleHoverAction}
        onHoverEnd={handleHoverEnd}
      />

      {/* Interactive Resume Modal Overlay */}
      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
        onHoverAction={handleHoverAction}
        onHoverEnd={handleHoverEnd}
      />

      {/* Interactive Talk To Him Modal Overlay */}
      <TalkToHimModal
        isOpen={talkToHimOpen}
        onClose={() => setTalkToHimOpen(false)}
        onHoverAction={handleHoverAction}
        onHoverEnd={handleHoverEnd}
      />

      {/* Recruiter & Visitor Auth Hub (Google Auth + Firestore Persistence) */}
      <AuthProfileModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onHoverAction={handleHoverAction}
        onHoverEnd={handleHoverEnd}
      />
    </div>
  );
}
