import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { loginWithEmail, verifyOtp } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"email" | "code">("email");
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
      await loginWithEmail(email);
      setStep("code");
      toast.success("Code sent! Check your email.");
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      toast.error(err?.data?.error || "Failed to send code. Check your Supabase setup.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = char;
    setCode(next);
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (next.every(c => c !== "") && next.join("").length === 6) {
      handleVerify(next.join(""));
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      handleVerify(pasted);
    }
  };

  const handleVerify = async (fullCode?: string) => {
    const token = fullCode ?? code.join("");
    if (token.length !== 6) return;
    setIsLoading(true);
    try {
      await verifyOtp(email, token);
      toast.success("Signed in!");
      setLocation("/");
    } catch (err: any) {
      toast.error(err?.data?.error || "Invalid or expired code. Try again.");
      setCode(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-primary rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
            P
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Prompt to Form</h1>
          <p className="text-muted-foreground mt-2">The intelligent multilingual form builder</p>
        </div>

        <Card className="border-border/50 shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
          {step === "email" ? (
            <>
              <CardHeader>
                <CardTitle>Welcome</CardTitle>
                <CardDescription>Enter your email — we'll send you a 6-digit code</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendCode} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    autoFocus
                    className="h-11"
                  />
                  <Button type="submit" className="w-full h-11" disabled={isLoading}>
                    {isLoading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                    ) : (
                      <><Mail className="w-4 h-4 mr-2" /> Send Code</>
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle>Check your email</CardTitle>
                <CardDescription>
                  Enter the 6-digit code sent to <span className="font-medium text-foreground">{email}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                  {code.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleCodeChange(i, e.target.value)}
                      onKeyDown={e => handleCodeKeyDown(i, e)}
                      className="w-11 h-14 text-center text-xl font-bold border-2 rounded-lg bg-background focus:border-primary focus:outline-none transition-colors"
                      disabled={isLoading}
                    />
                  ))}
                </div>

                {isLoading && (
                  <div className="flex justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => handleVerify()}
                    disabled={code.join("").length !== 6 || isLoading}
                    className="w-full h-11"
                  >
                    Verify Code
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-muted-foreground"
                    onClick={() => {
                      setStep("email");
                      setCode(["", "", "", "", "", ""]);
                    }}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Use a different email
                  </Button>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Didn't get it?{" "}
                  <button
                    className="text-primary hover:underline font-medium"
                    onClick={handleSendCode as any}
                    disabled={isLoading}
                  >
                    Resend code
                  </button>
                </p>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
