import { useState } from "react";
import { loginWithEmail } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await loginWithEmail(email);
      setSubmitted(true);
      toast.success("Magic link sent!");
    } catch (err) {
      toast.error("Failed to send magic link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background element */}
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
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Enter your email to sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Check your email</h3>
                  <p className="text-muted-foreground mt-1">
                    We've sent a magic link to <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>
                <Button variant="outline" className="mt-4" onClick={() => setSubmitted(false)}>
                  Try another email
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="h-11"
                  />
                </div>
                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Magic Link"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
