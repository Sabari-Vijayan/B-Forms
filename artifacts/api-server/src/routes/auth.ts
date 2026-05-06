import { Router } from "express";
import { createSupabaseClient } from "../lib/supabase.js";
import { requireAuth, type AuthenticatedRequest } from "../lib/auth.js";

const router = Router();

router.post("/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  if (!data.session) {
    res.status(400).json({ error: "Account created but email confirmation is required. Disable it in Supabase: Auth → Providers → Email → turn off Confirm email." });
    return;
  }

  res.json({
    access_token: data.session.access_token,
    user: { id: data.user?.id, email: data.user?.email },
  });
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.json({
    access_token: data.session.access_token,
    user: { id: data.user?.id, email: data.user?.email },
  });
});

router.get("/auth/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  res.json({ id: req.user!.id, email: req.user!.email });
});

router.patch("/auth/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ error: "Password is required for update" });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  
  const supabase = createSupabaseClient(token || undefined);
  const { data, error } = await supabase.auth.updateUser({ password });

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.json({ id: data.user.id, email: data.user.email });
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
