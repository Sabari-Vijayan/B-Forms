import { NextRequest } from "next/server";
import { createSupabaseClient } from "./supabase";

/**
 * In-memory cache for user sessions to avoid repeated Supabase Auth calls.
 * In Next.js Development mode, we use a global variable to persist the cache 
 * across Hot Module Replacement (HMR) / file saves.
 */
const SESSION_TTL = 60 * 1000; // 1 minute

interface CachedSession {
  user: any;
  timestamp: number;
}

const globalForAuth = global as unknown as { 
  sessionCache: Map<string, CachedSession> 
};

const sessionCache = globalForAuth.sessionCache || new Map<string, CachedSession>();

if (process.env.NODE_ENV !== "production") {
  globalForAuth.sessionCache = sessionCache;
}

export async function getUser(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  
  // Check cache
  const cached = sessionCache.get(token);
  if (cached && Date.now() - cached.timestamp < SESSION_TTL) {
    return {
      ...cached.user,
      token
    };
  }

  const supabase = createSupabaseClient(token);
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;

    const userData = {
      id: user.id,
      email: user.email,
    };

    // Store in cache
    sessionCache.set(token, { user: userData, timestamp: Date.now() });

    return {
      ...userData,
      token
    };
  } catch (err) {
    console.error("Auth error:", err);
    return null;
  }
}
