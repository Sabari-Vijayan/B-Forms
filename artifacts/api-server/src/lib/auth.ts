import type { Request, Response, NextFunction } from "express";
import { createSupabaseClient } from "./supabase.js";
import { logger } from "./logger.js";

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
    logger.warn({ url: req.url }, "Auth failed: No token provided");
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const supabase = createSupabaseClient(token);
    // In Supabase v2, it's recommended to pass the token explicitly to getUser
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      logger.warn(
        { 
          error: error?.message, 
          status: error?.status,
          url: req.url 
        }, 
        "Auth failed: getUser check failed"
      );
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    req.user = { id: user.id, email: user.email! };
    req.accessToken = token;
    next();
  } catch (err: any) {
    logger.error({ error: err.message, url: req.url }, "Auth failed: Exception during verification");
    res.status(401).json({ error: "Unauthorized" });
  }
}
