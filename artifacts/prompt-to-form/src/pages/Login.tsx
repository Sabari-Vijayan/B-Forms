import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { login, signup } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const redirectTo = new URLSearchParams(search).get("redirect") || "/";
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      setLocation(redirectTo);
    } catch (err: any) {
      const msg = err?.data?.error ?? err?.message ?? "Something went wrong";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10">
          <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center text-sm font-bold mb-5">
            P
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {mode === "login" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "login"
              ? "Sign in to manage your forms"
              : "Sign up to start building multilingual forms"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
              className="h-10 border-border focus:border-foreground focus:ring-0 bg-background"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="h-10 border-border focus:border-foreground focus:ring-0 bg-background"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-foreground text-background text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button className="text-foreground underline underline-offset-2" onClick={() => setMode("signup")}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button className="text-foreground underline underline-offset-2" onClick={() => setMode("login")}>
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
