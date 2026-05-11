"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export type OpenLoginDialogOptions = {
  title?: string;
  message?: string;
  previousUrl?: string;
};

type LoginDialogContextValue = {
  openLoginDialog: (opts?: OpenLoginDialogOptions) => void;
  closeLoginDialog: () => void;
  isOpen: boolean;
};

const LoginDialogContext = createContext<LoginDialogContextValue | null>(null);

const DEFAULTS = {
  title: "Sign in to keep reading",
  message: "Log in to continue.",
};

export function LoginDialogProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<OpenLoginDialogOptions>({});

  const openLoginDialog = useCallback((opts?: OpenLoginDialogOptions) => {
    setOptions(opts ?? {});
    setIsOpen(true);
  }, []);

  const closeLoginDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLoginDialog();
    };
    document.addEventListener("keydown", handleEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, closeLoginDialog]);

  const handleLogin = useCallback(() => {
    const previous =
      options.previousUrl ??
      (typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : "/");
    setIsOpen(false);
    router.push(`/auth/login?previous=${encodeURIComponent(previous)}`);
  }, [options.previousUrl, router]);

  const value = useMemo<LoginDialogContextValue>(
    () => ({ openLoginDialog, closeLoginDialog, isOpen }),
    [openLoginDialog, closeLoginDialog, isOpen]
  );

  const title = options.title ?? DEFAULTS.title;
  const message = options.message ?? DEFAULTS.message;

  return (
    <LoginDialogContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeLoginDialog();
            }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm grid place-items-center px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-[#0f1b28] border border-[#122034] rounded-2xl w-full max-w-[400px] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
              role="dialog"
              aria-modal="true"
              aria-labelledby="login-dialog-title"
            >
              <h2
                id="login-dialog-title"
                className="text-[20px] font-bold text-white"
              >
                {title}
              </h2>
              <p className="text-[#a7b4c7] text-sm mt-2">{message}</p>
              <div className="flex flex-col gap-2 mt-6">
                <Button
                  onClick={handleLogin}
                  className="bg-[#05834B] text-white font-semibold rounded-lg"
                >
                  Log in
                </Button>
                <Button
                  onClick={closeLoginDialog}
                  variant="light"
                  className="text-[#a7b4c7] font-semibold rounded-lg"
                >
                  Maybe later
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LoginDialogContext.Provider>
  );
}

export function useLoginDialog(): LoginDialogContextValue {
  const ctx = useContext(LoginDialogContext);
  if (!ctx) {
    throw new Error(
      "useLoginDialog must be used inside <LoginDialogProvider>"
    );
  }
  return ctx;
}
