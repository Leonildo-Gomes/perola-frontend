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

function GoogleG() {
  return (
    <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  );
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
        <GoogleG />
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
            <GoogleG />
            {text}
          </Button>
        )}
      </div>
    </>
  );
}
