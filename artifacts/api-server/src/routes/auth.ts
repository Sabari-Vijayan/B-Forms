import { Router } from "express";
import { createSupabaseClient } from "../lib/supabase.js";
import { requireAuth, type AuthenticatedRequest } from "../lib/auth.js";

const router = Router();

router.post("/auth/login", async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== "string") {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  const supabase = createSupabaseClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.json({ success: true, message: "Check your email for a 6-digit code" });
});

router.post("/auth/verify", async (req, res) => {
  const { email, token } = req.body;
  if (!email || !token) {
    res.status(400).json({ error: "email and token are required" });
    return;
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: String(token).trim(),
    type: "email",
  });

  if (error || !data.session) {
    res.status(400).json({ error: error?.message || "Invalid or expired code" });
    return;
  }

  res.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    user: { id: data.user?.id, email: data.user?.email },
  });
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

export default router;
