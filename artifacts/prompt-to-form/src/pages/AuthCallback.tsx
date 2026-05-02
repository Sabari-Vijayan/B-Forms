import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { setStoredToken } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      setError("Missing auth code. Please try signing in again.");
      return;
    }

    fetch(`/api/auth/callback?code=${encodeURIComponent(code)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.access_token) {
          setStoredToken(data.access_token);
          setLocation("/");
        } else {
          setError(data.error || "Authentication failed. Please try again.");
        }
      })
      .catch(() => {
        setError("Authentication failed. Please try again.");
      });
  }, [setLocation]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <h2 className="text-xl font-semibold text-destructive">Authentication Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => setLocation("/login")}
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
