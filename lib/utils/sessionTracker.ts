/**
 * Session Tracking Utility
 * Handles session duration tracking and localStorage management
 */

export interface SessionData {
  sessionId: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  duration: number;
  date: string;
}

export interface SessionTrackingData {
  sessions: SessionData[];
  totalDuration: number;
}

const STORAGE_PREFIX = "session_tracking";

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Get localStorage key for user sessions
 */
function getStorageKey(userId?: string): string {
  return userId ? `${STORAGE_PREFIX}_${userId}` : STORAGE_PREFIX;
}

/**
 * Get session tracking data from localStorage
 */
export function getSessionTrackingData(userId?: string): SessionTrackingData {
  if (typeof window === "undefined") {
    return { sessions: [], totalDuration: 0 };
  }

  const key = getStorageKey(userId);
  const stored = localStorage.getItem(key);

  if (!stored) {
    return { sessions: [], totalDuration: 0 };
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error parsing session tracking data:", error);
    return { sessions: [], totalDuration: 0 };
  }
}

/**
 * Save session tracking data to localStorage
 */
export function saveSessionTrackingData(
  data: SessionTrackingData,
  userId?: string
): void {
  if (typeof window === "undefined") {
    return;
  }

  const key = getStorageKey(userId);
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving session tracking data:", error);
  }
}

/**
 * Add a new session to tracking data
 */
export function addSession(
  sessionData: SessionData,
  userId?: string
): SessionTrackingData {
  const trackingData = getSessionTrackingData(userId);

  // Update or add session
  const existingIndex = trackingData.sessions.findIndex(
    (s) => s.sessionId === sessionData.sessionId
  );

  if (existingIndex >= 0) {
    // Update existing session
    trackingData.sessions[existingIndex] = sessionData;
  } else {
    // Add new session
    trackingData.sessions.push(sessionData);
  }

  // Recalculate total duration
  trackingData.totalDuration = trackingData.sessions.reduce(
    (total, session) => total + session.duration,
    0
  );

  saveSessionTrackingData(trackingData, userId);
  return trackingData;
}

/**
 * Create a new session entry
 */
export function createSession(
  sessionId: string,
  startTime: number,
  userId?: string
): SessionData {
  return {
    sessionId,
    userId,
    startTime,
    endTime: undefined,
    duration: 0,
    date: new Date().toISOString(),
  };
}

/**
 * Update session with end time and duration
 */
export function finalizeSession(
  sessionId: string,
  endTime: number,
  duration: number,
  userId?: string
): void {
  const trackingData = getSessionTrackingData(userId);
  const session = trackingData.sessions.find((s) => s.sessionId === sessionId);

  if (session) {
    session.endTime = endTime;
    session.duration = duration;
    trackingData.totalDuration = trackingData.sessions.reduce(
      (total, s) => total + s.duration,
      0
    );
    saveSessionTrackingData(trackingData, userId);
  }
}

/**
 * Get active session (session without endTime)
 */
export function getActiveSession(
  userId?: string
): SessionData | undefined {
  const trackingData = getSessionTrackingData(userId);
  return trackingData.sessions.find((s) => !s.endTime);
}

