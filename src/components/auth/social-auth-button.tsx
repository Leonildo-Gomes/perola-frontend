"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface GoogleIdentity {
  accounts: {
    id: {
      initialize: (config: { client_id: string; callback: (r: { credential: string }) => void }) => void;
      renderButton: (el: HTMLElement, options: Record<string, unknown>) => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

interface SocialAuthButtonProps {
  mode: "login" | "register";
  disabled?: boolean;
  onCredential: (idToken: string) => void;
}

/** Google Sign-In (Google Identity Services). Falls back to a disabled button without a client id. */
export function SocialAuthButton({ mode, disabled, onCredential }: SocialAuthButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const callbackRef = useRef(onCredential);
  callbackRef.current = onCredential;
  const text = mode === "login" ? "Continuar com o Google" : "Criar conta com o Google";

  const render = useCallback(() => {
    if (!GOOGLE_CLIENT_ID || !window.google || !containerRef.current) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (r) => callbackRef.current(r.credential),
    });
    window.google.accounts.id.renderButton(containerRef.current, {
      theme: "outline",
      size: "large",
      shape: "pill",
      text: mode === "login" ? "continue_with" : "signup_with",
      width: Math.min(containerRef.current.offsetWidth || 320, 400),
      locale: "pt",
    });
    setReady(true);
  }, [mode]);

  useEffect(() => {
    if (window.google) render();
  }, [render]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <Button type="button" variant="outline" className="w-full" disabled title="Google Sign-In não configurado">
        {text}
      </Button>
    );
  }

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={render} />
      <div
        className={disabled ? "pointer-events-none opacity-50" : undefined}
        aria-disabled={disabled || undefined}
      >
        <div ref={containerRef} className="flex min-h-[44px] w-full justify-center" />
        {!ready && (
          <Button type="button" variant="outline" className="w-full" disabled>
            {text}
          </Button>
        )}
      </div>
    </>
  );
}
