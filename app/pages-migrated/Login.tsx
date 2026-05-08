import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { login, signup } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { LogoIcon } from "@/components/Logo";

function AuthBanner() {
  const gridH = Array.from({ length: 26 }, (_, i) => i * 8);
  const gridV = Array.from({ length: 91 }, (_, i) => i * 16);

  const radioOptions = [
    { y: 64, w: 100, filled: false },
    { y: 88, w: 148, filled: true },
    { y: 112, w: 72, filled: false },
    { y: 136, w: 124, filled: false },
  ];

  const bars = [
    { w: 290, shade: "#222222" },
    { w: 210, shade: "#555" },
    { w: 145, shade: "#999" },
    { w: 85,  shade: "#c4c4c4" },
  ];

  return (
    <svg
      viewBox="0 0 1440 200"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full"
    >
      {/* Off-white background */}
      <rect width="1440" height="200" fill="#fafafa" />

      {/* Ultra-fine base grid */}
      {gridH.map(y => (
        <line key={`h${y}`} x1="0" y1={y} x2="1440" y2={y} stroke="#ebebeb" strokeWidth="0.5" />
      ))}
      {gridV.map(x => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="200" stroke="#ebebeb" strokeWidth="0.5" />
      ))}

      {/* ── SECTION 1: Form fields (left) ───────────────────────────── */}
      {/* Title bar */}
      <rect x="60" y="28" width="200" height="10" fill="#222222" />
      <rect x="268" y="28" width="80" height="10" fill="#d8d8d8" />

      {/* Row of two inputs */}
      <rect x="60" y="52" width="7" height="7" fill="#ccc" />
      <rect x="72" y="53" width="70" height="5" fill="#ccc" />
      <rect x="60" y="62" width="188" height="18" fill="none" stroke="#c8c8c8" strokeWidth="1" />

      <rect x="260" y="52" width="7" height="7" fill="#ccc" />
      <rect x="272" y="53" width="55" height="5" fill="#ccc" />
      <rect x="260" y="62" width="160" height="18" fill="none" stroke="#c8c8c8" strokeWidth="1" />

      {/* Textarea */}
      <rect x="60" y="96" width="7" height="7" fill="#ccc" />
      <rect x="72" y="97" width="85" height="5" fill="#ccc" />
      <rect x="60" y="107" width="360" height="52" fill="none" stroke="#c8c8c8" strokeWidth="1" />
      <line x1="76" y1="122" x2="404" y2="122" stroke="#e4e4e4" strokeWidth="0.5" />
      <line x1="76" y1="136" x2="370" y2="136" stroke="#e4e4e4" strokeWidth="0.5" />
      <line x1="76" y1="150" x2="390" y2="150" stroke="#e4e4e4" strokeWidth="0.5" />

      {/* Dashed section divider */}
      <line x1="480" y1="16" x2="480" y2="184" stroke="#d4d4d4" strokeWidth="1" strokeDasharray="3 4" />

      {/* ── SECTION 2: Choice question (center) ─────────────────────── */}
      <rect x="516" y="28" width="260" height="10" fill="#222222" />
      <rect x="784" y="28" width="100" height="10" fill="#e0e0e0" />

      {radioOptions.map(({ y, w, filled }, i) => (
        <g key={`opt-${i}`}>
          <circle cx="527" cy={y} r="8"
            fill={filled ? "#222222" : "none"}
            stroke={filled ? "none" : "#c8c8c8"}
            strokeWidth={filled ? 0 : 1.5}
          />
          {filled && <circle cx="527" cy={y} r="3.5" fill="#fafafa" />}
          <rect x="546" y={y - 5} width={w} height="8"
            fill={filled ? "#222222" : "#d8d8d8"}
          />
        </g>
      ))}

      {/* Rating row */}
      {[0, 1, 2, 3, 4].map(i => {
        const cx = 516 + i * 30;
        const cy = 173;
        const star = `M0,-9 L2.1,-3.1 L8.5,-2.9 L3.6,1.2 L5.5,7.6 L0,4.1 L-5.5,7.6 L-3.6,1.2 L-8.5,-2.9 L-2.1,-3.1 Z`;
        return (
          <path key={`star-${i}`}
            d={star}
            transform={`translate(${cx},${cy})`}
            fill={i < 3 ? "#222222" : "none"}
            stroke={i < 3 ? "none" : "#c8c8c8"}
            strokeWidth={i < 3 ? 0 : 1}
          />
        );
      })}
      <rect x="676" y="165" width="60" height="7" fill="#d0d0d0" />

      {/* Dashed section divider */}
      <line x1="910" y1="16" x2="910" y2="184" stroke="#d4d4d4" strokeWidth="1" strokeDasharray="3 4" />

      {/* ── SECTION 3: Response analytics (right) ──────────────────── */}
      <rect x="944" y="28" width="120" height="10" fill="#222222" />
      <rect x="1072" y="28" width="60" height="10" fill="#e0e0e0" />

      {bars.map(({ w, shade }, i) => {
        const y = 52 + i * 30;
        return (
          <g key={`bar-${i}`}>
            <rect x="944" y={y - 8} width={60 + i * 15} height="5" fill="#e0e0e0" />
            <rect x="944" y={y + 2} width="360" height="10" fill="#f0f0f0" />
            <rect x="944" y={y + 2} width={w} height="10" fill={shade} />
          </g>
        );
      })}

      {/* Submit button area */}
      <rect x="944" y="168" width="230" height="18" fill="none" stroke="#d0d0d0" strokeWidth="1" />
      <rect x="1192" y="168" width="180" height="18" fill="#222222" />
      <rect x="1210" y="176" width="80" height="5" fill="#fafafa" />
      <rect x="1298" y="176" width="12" height="5" fill="#666" />

      {/* Bottom edge line */}
      <rect x="0" y="198" width="1440" height="2" fill="#e8e8e8" />
    </svg>
  );
}

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
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* ── Desktop Image Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[60%] bg-muted border-r border-border relative overflow-hidden">
        <img 
          src="/ChatGPT Image May 5, 2026, 03_26_51 PM.png" 
          alt="Auth background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/5 pointer-events-none" />
      </div>

      <div className="flex-1 flex flex-col">
        {/* ── Mobile/Tablet Banner ── */}
        <div className="lg:hidden w-full overflow-hidden border-b border-border" style={{ height: "clamp(120px, 18vw, 200px)" }}>
          <AuthBanner />
        </div>

        {/* ── Form Area ── */}
        <div className="flex-1 flex items-center justify-center p-6 py-10 lg:py-20">
          <div className="w-full max-w-sm">
            {/* Logo + heading */}
            <div className="mb-8">
              <div className="mb-5">
                <div className="text-[#4f86ff]">
                  <LogoIcon size={36} />
                </div>
              </div>
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                {mode === "login" ? "Welcome back" : "Create an account"}
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                {mode === "login"
                  ? "Sign in to manage your forms and view submissions"
                  : "Sign up to start building multilingual AI-powered forms"}
              </p>
            </div>

            {/* Form fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                  className="h-11 border-border focus:border-foreground focus:ring-0 bg-background"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</Label>
                  {mode === "login" && (
                    <button type="button" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Forgot password?
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className="h-11 border-border focus:border-foreground focus:ring-0 bg-background"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-foreground text-background text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 mt-4 rounded-md"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === "login" ? "Sign In" : "Get Started"}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-border/50 text-center">
              <p className="text-sm text-muted-foreground">
                {mode === "login" ? (
                  <>
                    New to Prompt-to-Form?{" "}
                    <button 
                      className="text-foreground font-medium hover:underline underline-offset-4" 
                      onClick={() => setMode("signup")}
                    >
                      Create an account
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button 
                      className="text-foreground font-medium hover:underline underline-offset-4" 
                      onClick={() => setMode("login")}
                    >
                      Sign back in
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

