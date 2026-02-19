"use client";

import { useState, useEffect } from "react";

/**
 * Hydration-safe media query hook.
 * All values start as false on both server and client (no hydration mismatch).
 * After hydration, useEffect fires and reads the real viewport.
 */
const useMediaBreakpoint = () => {
  const [breakpoints, setBreakpoints] = useState({
    base: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    xl2: false,
  });

  useEffect(() => {
    const queries = {
      base: window.matchMedia("(max-width: 639px)"),
      sm: window.matchMedia("(min-width: 640px)"),
      md: window.matchMedia("(min-width: 768px)"),
      lg: window.matchMedia("(min-width: 1024px)"),
      xl: window.matchMedia("(min-width: 1280px)"),
      xl2: window.matchMedia("(min-width: 1536px)"),
    };

    const update = () => {
      setBreakpoints({
        base: queries.base.matches,
        sm: queries.sm.matches,
        md: queries.md.matches,
        lg: queries.lg.matches,
        xl: queries.xl.matches,
        xl2: queries.xl2.matches,
      });
    };

    update();

    const entries = Object.values(queries);
    entries.forEach((mq) => mq.addEventListener("change", update));
    return () => {
      entries.forEach((mq) => mq.removeEventListener("change", update));
    };
  }, []);

  return breakpoints;
};

export default useMediaBreakpoint;
