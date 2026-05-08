import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/server/supabase";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  
  if (token) {
    const supabase = createSupabaseClient(token);
    await supabase.auth.signOut();
  }
  
  return NextResponse.json({ success: true });
}
