"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/store";
import { getUser } from "@/lib/slices/auth-slice";

/**
 * Reads the signed-in user out of the session cookie and into the store.
 *
 * This used to be dispatched from the nav, which AppProvider deliberately
 * hides on /shorts — so reloading anywhere under /shorts left the store with
 * no token at all until the reader navigated to a route that renders the nav.
 * The bootstrap has to run on every route, so it lives in its own always
 * mounted component rather than riding along with a piece of chrome.
 */
export const AuthBootstrap = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUser() as any);
  }, [dispatch]);

  return null;
};

export default AuthBootstrap;
