"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setStoredToken } from "@/lib/auth";
import { Loader2 } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      setError("Missing auth code. Please try signing in again.");
      return;
    }

    fetch(`/api/auth/callback?code=${encodeURIComponent(code)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.access_token) {
          setStoredToken(data.access_token);
          router.push("/");
        } else {
          setError(data.error || "Authentication failed. Please try again.");
        }
      })
      .catch(() => {
        setError("Authentication failed. Please try again.");
      });
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <h2 className="text-xl font-semibold text-destructive">Authentication Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="text-primary hover:underline"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
