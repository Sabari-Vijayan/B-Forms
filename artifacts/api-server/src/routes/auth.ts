import { Router } from "express";
import { createSupabaseClient, createAdminClient } from "../lib/supabase.js";
import { requireAuth, type AuthenticatedRequest } from "../lib/auth.js";

const router = Router();

router.post("/auth/login", async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== "string") {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  const supabase = createSupabaseClient();
  const appUrl = process.env.APP_URL || `https://${process.env.REPLIT_DEV_DOMAIN}`;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${appUrl}/auth/callback` },
  });

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.json({ success: true, message: "Check your email for a login link" });
});

router.get("/auth/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  res.json({ id: req.user!.id, email: req.user!.email });
});

router.post("/auth/logout", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (token) {
    const supabase = createSupabaseClient(token);
    await supabase.auth.signOut();
  }
  res.json({ success: true });
});

router.get("/auth/callback", async (req, res) => {
  const code = req.query.code as string;
  if (!code) {
    res.status(400).json({ error: "Missing code" });
    return;
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.session) {
    res.status(400).json({ error: "Auth failed" });
    return;
  }

  res.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    user: { id: data.user?.id, email: data.user?.email },
  });
});

export default router;
