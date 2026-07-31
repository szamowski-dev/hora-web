"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (configuration: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: { theme: "outline"; size: "large"; shape: "pill"; text: "continue_with" },
          ) => void;
        };
      };
    };
  }
}

export function GoogleSignInButton({
  clientId,
  onCredential,
  disabled = false,
}: {
  clientId: string;
  onCredential: (credential: string) => void;
  disabled?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    const markReady = () => window.setTimeout(() => setScriptReady(true), 0);
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (existing) {
      if (window.google) markReady();
      else existing.addEventListener("load", markReady, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = markReady;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!scriptReady || !container.current || !window.google || disabled) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (response.credential) onCredential(response.credential);
      },
    });
    container.current.replaceChildren();
    window.google.accounts.id.renderButton(container.current, {
      theme: "outline",
      size: "large",
      shape: "pill",
      text: "continue_with",
    });
  }, [clientId, disabled, onCredential, scriptReady]);

  return (
    <div aria-busy={!scriptReady} className={disabled ? "pointer-events-none opacity-60" : undefined}>
      <div ref={container} />
      {!scriptReady ? <p className="mt-3 text-sm text-muted">Loading Google sign-in…</p> : null}
    </div>
  );
}
