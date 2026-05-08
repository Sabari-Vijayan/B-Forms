import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/server/supabase";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!data.session) {
    return NextResponse.json({ 
      error: "Account created but email confirmation is required. Disable it in Supabase: Auth → Providers → Email → turn off Confirm email." 
    }, { status: 400 });
  }

  return NextResponse.json({
    access_token: data.session.access_token,
    user: { id: data.user?.id, email: data.user?.email },
  });
}
