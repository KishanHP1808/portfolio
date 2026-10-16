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
import { BackToTopButton } from './components/BackToTopButton';
import { OfficialSignatureWatermark } from './components/OfficialSignatureWatermark';
import { ElectricThunderCanvas } from './components/ElectricThunderCanvas';
import { ElectricCursorTrail } from './components/ElectricCursorTrail';
import { TermsAndConditionsModal } from './components/TermsAndConditionsModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { ResumeModal } from './components/ResumeModal';
import { TalkToHimModal } from './components/TalkTogetherModal';
import { AuthProfileModal } from './components/AuthProfileModal';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { useTheme } from './context/ThemeContext';
import { Project, CursorState } from './types';

export default function App() {
  const { theme, isLight } = useTheme();
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [talkToHimOpen, setTalkToHimOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>({
    text: '',
    active: false,
    variant: 'default',
  });

  // Global listeners for direct modal opening & URL hash routing
  useEffect(() => {
    const handleOpenTalk = () => setTalkToHimOpen(true);
    const handleOpenResume = () => setResumeOpen(true);
    const handleOpenAuth = () => setAuthModalOpen(true);
    const handleOpenTerms = () => setTermsOpen(true);
    const handleOpenPrivacy = () => setPrivacyOpen(true);

    window.addEventListener('open-talk-to-him', handleOpenTalk);
    window.addEventListener('open-talk-together', handleOpenTalk);
    window.addEventListener('open-resume', handleOpenResume);
    window.addEventListener('open-auth-modal', handleOpenAuth);
    window.addEventListener('open-terms-modal', handleOpenTerms);
    window.addEventListener('open-privacy-modal', handleOpenPrivacy);

    // Check URL hash for direct legal page navigation
    const checkHash = () => {
      if (window.location.hash === '#terms' || window.location.hash === '#terms-and-conditions') {
        setTermsOpen(true);
      } else if (window.location.hash === '#privacy' || window.location.hash === '#privacy-policy') {
        setPrivacyOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    return () => {
      window.removeEventListener('open-talk-to-him', handleOpenTalk);
      window.removeEventListener('open-talk-together', handleOpenTalk);
      window.removeEventListener('open-resume', handleOpenResume);
      window.removeEventListener('open-auth-modal', handleOpenAuth);
      window.removeEventListener('open-terms-modal', handleOpenTerms);
      window.removeEventListener('open-privacy-modal', handleOpenPrivacy);
      window.removeEventListener('hashchange', checkHash);
    };
  }, []);

  // Global Keyboard Shortcuts: 'Esc' to close any active modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
        setResumeOpen(false);
        setTalkToHimOpen(false);
        setAuthModalOpen(false);
        setTermsOpen(false);
        setPrivacyOpen(false);
        window.dispatchEvent(new CustomEvent('close-all-modals'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize Lenis smooth scroll for camera-like scroll choreography (optimized for 180 FPS)
  useEffect(() => {
    let lenis: Lenis | null = null;
    let animFrame: number;

    try {
      lenis = new Lenis({
        duration: 0.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 1.0,
        touchMultiplier: 1.2,
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
    <div
      className={`relative min-h-screen font-sans antialiased overflow-x-hidden transition-colors duration-500 ${
        isLight
          ? 'bg-[#f8fafc] text-[#09090b] selection:bg-[#0284c7] selection:text-white light'
          : 'bg-[#050505] text-[#ededed] selection:bg-[#00f0ff] selection:text-black dark'
      }`}
      data-theme={theme}
    >
      {/* Thin, Fixed Glowing Scroll Progress Bar */}
      <ScrollProgressBar />

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

        {/* Persistent Back to Top Button (Appears past HeroSection) */}
        <BackToTopButton
          onHoverAction={handleHoverAction}
          onHoverEnd={handleHoverEnd}
        />

        {/* Official Signature Watermark (Fixed at bottom right across all scroll phases) */}
        <OfficialSignatureWatermark
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

      {/* Terms & Conditions Modal Overlay */}
      <TermsAndConditionsModal
        isOpen={termsOpen}
        onClose={() => setTermsOpen(false)}
      />

      {/* Privacy Policy Modal Overlay */}
      <PrivacyPolicyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
      />
    </div>
  );
}
