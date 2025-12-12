"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectAuthState } from "../slices/auth-slice";
import {
  generateSessionId,
  createSession,
  addSession,
  finalizeSession,
  getActiveSession,
  type SessionData,
} from "../utils/sessionTracker";

/**
 * Hook to track session duration for authenticated users
 * Tracks time from page load until tab close
 */
export function useSessionTracker() {
  const { token, user } = useSelector(selectAuthState);
  const isAuthenticated = !!token;
  const userId = user?.id || user?.userId || undefined;

  const sessionIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const visibleStartTimeRef = useRef<number | null>(null);
  const accumulatedDurationRef = useRef<number>(0);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize session on mount if authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    // Check if there's an active session (e.g., page refresh)
    const activeSession = getActiveSession(userId);
    if (activeSession) {
      // Resume existing session
      sessionIdRef.current = activeSession.sessionId;
      startTimeRef.current = activeSession.startTime;
      accumulatedDurationRef.current = activeSession.duration;
    } else {
      // Create new session
      const newSessionId = generateSessionId();
      const startTime = Date.now();
      sessionIdRef.current = newSessionId;
      startTimeRef.current = startTime;
      accumulatedDurationRef.current = 0;

      const session = createSession(newSessionId, startTime, userId);
      addSession(session, userId);
    }

    visibleStartTimeRef.current = Date.now();
    isVisibleRef.current = document.visibilityState === "visible";

    // Save session periodically as backup (every 30 seconds)
    saveIntervalRef.current = setInterval(() => {
      if (sessionIdRef.current && isVisibleRef.current) {
        const currentTime = Date.now();
        const visibleDuration =
          currentTime - (visibleStartTimeRef.current || currentTime);
        const totalDuration = accumulatedDurationRef.current + visibleDuration;

        const session: SessionData = {
          sessionId: sessionIdRef.current,
          userId,
          startTime: startTimeRef.current || Date.now(),
          endTime: undefined,
          duration: totalDuration,
          date: new Date().toISOString(),
        };
        addSession(session, userId);
      }
    }, 30000); // 30 seconds

    // Handle visibility change (tab switching)
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === "visible";
      const now = Date.now();

      if (isVisibleRef.current && !isVisible) {
        // Tab became hidden - pause tracking
        if (visibleStartTimeRef.current) {
          const visibleDuration = now - visibleStartTimeRef.current;
          accumulatedDurationRef.current += visibleDuration;
        }
        isVisibleRef.current = false;
      } else if (!isVisibleRef.current && isVisible) {
        // Tab became visible - resume tracking
        visibleStartTimeRef.current = now;
        isVisibleRef.current = true;
      }
    };

    // Handle page unload (tab/window close)
    const handleBeforeUnload = () => {
      if (sessionIdRef.current && startTimeRef.current) {
        const now = Date.now();
        let finalDuration = accumulatedDurationRef.current;

        // Add any remaining visible time
        if (isVisibleRef.current && visibleStartTimeRef.current) {
          finalDuration += now - visibleStartTimeRef.current;
        }

        finalizeSession(sessionIdRef.current, now, finalDuration, userId);
      }
    };

    // Handle pagehide (for mobile browsers)
    const handlePageHide = () => {
      handleBeforeUnload();
    };

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);

    // Cleanup
    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }

      // Final save on unmount
      if (sessionIdRef.current && startTimeRef.current) {
        const now = Date.now();
        let finalDuration = accumulatedDurationRef.current;

        if (isVisibleRef.current && visibleStartTimeRef.current) {
          finalDuration += now - visibleStartTimeRef.current;
        }

        finalizeSession(sessionIdRef.current, now, finalDuration, userId);
      }

      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [isAuthenticated, userId]);
}
