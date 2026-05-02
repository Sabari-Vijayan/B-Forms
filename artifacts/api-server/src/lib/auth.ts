import type { Request, Response, NextFunction } from "express";
import { createSupabaseClient } from "./supabase.js";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
  accessToken?: string;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const supabase = createSupabaseClient(token);
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    req.user = { id: user.id, email: user.email! };
    req.accessToken = token;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}
