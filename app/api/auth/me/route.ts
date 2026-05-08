import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/server/auth";
import { createAdminClient } from "@/lib/server/supabase";

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({ id: user.id, email: user.email });
}

export async function PATCH(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { password } = await req.json();
    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { error } = await admin.auth.admin.updateUserById(user.id, {
      password
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
