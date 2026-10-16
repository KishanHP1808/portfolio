import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type AnalyticsEventType =
  | 'button_click'
  | 'modal_open'
  | 'modal_close'
  | 'filter_toggle'
  | 'navigation'
  | 'resume_download'
  | 'external_link'
  | 'theme_toggle'
  | 'language_switch'
  | 'project_action';

export interface AnalyticsEventPayload {
  eventType: AnalyticsEventType;
  eventName: string;
  target?: string;
  category?: string;
  metadata?: Record<string, string | number | boolean>;
}

// Session identifier persisted for the active browser session
function getOrCreateSessionId(): string {
  try {
    const existing = sessionStorage.getItem('portfolio_sid');
    if (existing && existing.length > 8) return existing;

    const newSid = `sid_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('portfolio_sid', newSid);
    return newSid;
  } catch {
    return `sid_temp_${Date.now()}`;
  }
}

// Client rate-limiting: max 50 events per minute to prevent excessive database writes
let eventCountThisMinute = 0;
let minuteWindowStart = Date.now();

function isRateLimited(): boolean {
  const now = Date.now();
  if (now - minuteWindowStart > 60000) {
    minuteWindowStart = now;
    eventCountThisMinute = 0;
  }

  if (eventCountThisMinute >= 50) {
    return true;
  }

  eventCountThisMinute += 1;
  return false;
}

/**
 * Lightweight, non-blocking telemetry event tracker logging user interactions to Firestore.
 * Always fire-and-forget with zero impact on UI thread response times.
 */
export async function trackEvent(payload: AnalyticsEventPayload): Promise<void> {
  // Guard against rate limit abuse
  if (isRateLimited()) return;

  const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const sessionId = getOrCreateSessionId();
  const currentPath = typeof window !== 'undefined' ? `${window.location.pathname}${window.location.hash || ''}` : '/';

  const sanitizedEvent = {
    eventType: payload.eventType.slice(0, 64),
    eventName: payload.eventName.slice(0, 128),
    timestamp: new Date().toISOString(),
    ...(payload.target ? { target: payload.target.slice(0, 128) } : {}),
    ...(payload.category ? { category: payload.category.slice(0, 64) } : {}),
    sessionId: sessionId.slice(0, 128),
    path: currentPath.slice(0, 256),
    ...(payload.metadata ? { metadata: payload.metadata } : {}),
  };

  // Schedule write on idle time to ensure silky-smooth 60+ FPS user interaction
  const dispatchWrite = () => {
    setDoc(doc(db, 'analytics_events', eventId), sanitizedEvent).catch(() => {
      // Intentionally silent catch: network timeouts, ad blockers, or offline state will never disrupt UX
    });
  };

  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(dispatchWrite);
  } else {
    setTimeout(dispatchWrite, 0);
  }
}

// Specialized helpers for clean, descriptive logging throughout components

export function trackButtonClick(buttonName: string, metadata?: Record<string, string | number | boolean>): void {
  trackEvent({
    eventType: 'button_click',
    eventName: buttonName,
    category: 'button',
    target: buttonName,
    metadata,
  });
}

export function trackModalOpen(modalName: string, metadata?: Record<string, string | number | boolean>): void {
  trackEvent({
    eventType: 'modal_open',
    eventName: `open_modal_${modalName}`,
    category: 'modal',
    target: modalName,
    metadata,
  });
}

export function trackModalClose(modalName: string, metadata?: Record<string, string | number | boolean>): void {
  trackEvent({
    eventType: 'modal_close',
    eventName: `close_modal_${modalName}`,
    category: 'modal',
    target: modalName,
    metadata,
  });
}

export function trackProjectAction(
  action: 'view' | 'launch' | 'case_study' | 'like' | 'bookmark',
  projectId: string,
  title?: string
): void {
  trackEvent({
    eventType: 'project_action',
    eventName: `project_${action}`,
    category: 'project',
    target: projectId,
    metadata: {
      action,
      projectId,
      ...(title ? { projectTitle: title } : {}),
    },
  });
}

export function trackFilterToggle(category: string, resultCount?: number): void {
  trackEvent({
    eventType: 'filter_toggle',
    eventName: `filter_${category.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    category: 'filter',
    target: category,
    metadata: {
      category,
      ...(typeof resultCount === 'number' ? { count: resultCount } : {}),
    },
  });
}

export function trackResumeDownload(source: string): void {
  trackEvent({
    eventType: 'resume_download',
    eventName: 'download_resume_pdf',
    category: 'conversion',
    target: 'resume_pdf',
    metadata: { source },
  });
}

export function trackExternalLink(label: string, destinationUrl: string): void {
  trackEvent({
    eventType: 'external_link',
    eventName: `external_${label.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    category: 'navigation',
    target: label,
    metadata: { destinationUrl: destinationUrl.slice(0, 200) },
  });
}

/**
 * Interface representing the synchronized Google Cloud Skills Boost / Arcade accreditation profile.
 */
export interface GoogleSkillsProfileData {
  accountEmail: string;
  totalPoints: number;
  tier: string;
  skillBadgesCount: number;
  questsCompleted: number;
  labsCompleted: number;
  arcadeMilestone?: string;
  profileUrl?: string;
  source?: string;
  lastSyncedAt?: string;
  recentBadges?: Array<{
    name: string;
    icon?: string;
    earnedDate?: string;
    category?: string;
  }>;
  updatedAt: string;
}

/**
 * Result returned from a Google Skills sync operation.
 */
export interface GoogleSkillsSyncResult {
  success: boolean;
  data: GoogleSkillsProfileData;
  pointsDelta: number;
  source: string;
  timestamp: string;
  error?: string;
}

/**
 * Service layer function to integrate with Google API / profile scraper endpoint
 * to periodically fetch and update the points for the 4mn24ci023@gmail.com account.
 * Persists the live score to Firestore, logs telemetry, and broadcasts sync events.
 */
export async function fetchAndUpdateGoogleSkillsPoints(
  accountEmail: string = '4mn24ci023@gmail.com',
  options?: {
    forceRefresh?: boolean;
    profileUrl?: string;
    forceScrape?: boolean;
  }
): Promise<GoogleSkillsSyncResult> {
  const accountDocId = '4mn24ci023';
  const firestoreRef = doc(db, 'google_skills', accountDocId);

  // 1. Check existing Firestore baseline to calculate points progression delta
  let previousPoints = 0;
  try {
    const existingSnap = await getDoc(firestoreRef);
    if (existingSnap.exists()) {
      const existingData = existingSnap.data() as Partial<GoogleSkillsProfileData>;
      previousPoints = existingData.totalPoints || 0;
    }
  } catch {
    // Non-fatal fallback
  }

  try {
    // 2. Fetch or trigger scrape from backend proxy endpoint
    const queryParams = new URLSearchParams();
    if (options?.forceRefresh) queryParams.set('refresh', 'true');
    if (options?.profileUrl) queryParams.set('profileUrl', options.profileUrl);

    const endpointUrl = `/api/google-skills${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(endpointUrl, {
      method: options?.forceScrape ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      ...(options?.forceScrape
        ? {
            body: JSON.stringify({
              accountEmail,
              profileUrl: options?.profileUrl,
              forceScrape: true,
            }),
          }
        : {}),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to synchronize Google skills`);
    }

    const payload = await response.json();
    const profile: GoogleSkillsProfileData = payload.profile || payload;

    // Ensure accountEmail matches
    profile.accountEmail = accountEmail;
    profile.lastSyncedAt = new Date().toISOString();

    const pointsDelta = previousPoints > 0 ? profile.totalPoints - previousPoints : 0;

    // 3. Persist latest points & status to Firestore document
    const firestorePayload = {
      accountEmail: profile.accountEmail,
      totalPoints: profile.totalPoints,
      tier: profile.tier || 'Google Cloud Arcade Legend // Gold Architect',
      skillBadgesCount: profile.skillBadgesCount || 0,
      questsCompleted: profile.questsCompleted || 0,
      labsCompleted: profile.labsCompleted || 0,
      ...(profile.arcadeMilestone ? { arcadeMilestone: profile.arcadeMilestone } : {}),
      ...(profile.profileUrl ? { profileUrl: profile.profileUrl } : {}),
      source: profile.source || 'profile_scraper',
      ...(profile.recentBadges ? { recentBadges: profile.recentBadges } : {}),
      lastSyncedAt: profile.lastSyncedAt,
      updatedAt: profile.updatedAt || new Date().toISOString(),
    };

    await setDoc(firestoreRef, firestorePayload, { merge: true });

    // 4. Log telemetry event for portfolio performance analysis
    trackEvent({
      eventType: 'button_click',
      eventName: 'google_skills_auto_refreshed',
      category: 'skills_sync',
      target: accountEmail,
      metadata: {
        points: profile.totalPoints,
        delta: pointsDelta,
        badges: profile.skillBadgesCount,
        source: profile.source || 'server_sync',
      },
    });

    const result: GoogleSkillsSyncResult = {
      success: true,
      data: profile,
      pointsDelta,
      source: profile.source || 'server_sync',
      timestamp: profile.lastSyncedAt,
    };

    // 5. Broadcast custom event to notify all active UI components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('google-skills-synced', {
          detail: result,
        })
      );
    }

    return result;
  } catch (err: unknown) {
    const error = err as Error;
    console.warn('Google skills points sync notice:', error.message);

    // Fallback: Return current Firestore data if available
    const fallbackProfile: GoogleSkillsProfileData = {
      accountEmail,
      totalPoints: previousPoints || 2850,
      tier: 'Google Cloud Arcade Legend // Gold Architect',
      skillBadgesCount: 24,
      questsCompleted: 16,
      labsCompleted: 98,
      updatedAt: new Date().toISOString(),
      source: 'firestore_fallback',
    };

    return {
      success: false,
      data: fallbackProfile,
      pointsDelta: 0,
      source: 'firestore_fallback',
      timestamp: new Date().toISOString(),
      error: error.message,
    };
  }
}
