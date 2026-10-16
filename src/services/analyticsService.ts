import { doc, setDoc } from 'firebase/firestore';
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
