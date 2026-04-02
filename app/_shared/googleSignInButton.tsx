"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, unknown>,
          ) => void;
        };
      };
    };
  }
}

type GoogleSignInButtonProps = {
  onCredential: (credential: string) => void;
  disabled?: boolean;
};

export default function GoogleSignInButton({
  onCredential,
  disabled = false,
}: GoogleSignInButtonProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const onCredentialRef = useRef(onCredential);
  const disabledRef = useRef(disabled);

  onCredentialRef.current = onCredential;
  disabledRef.current = disabled;

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || !divRef.current) return;

    const render = () => {
      const el = divRef.current;
      if (!window.google?.accounts?.id || !el) return;
      el.innerHTML = "";
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (res) => {
          console.log("res", res);
          if (disabledRef.current || !res.credential) return;
          onCredentialRef.current(res.credential);
        },
      });
      window.google.accounts.id.renderButton(el, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
      });
    };

    if (window.google?.accounts?.id) {
      render();
      return;
    }

    const intervalId = window.setInterval(() => {
      if (window.google?.accounts?.id) {
        window.clearInterval(intervalId);
        render();
      }
    }, 50);

    return () => window.clearInterval(intervalId);
  }, []);

  return <div ref={divRef} />;
}
