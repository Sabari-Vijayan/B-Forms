import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/server/auth";
import { FormsService } from "@/lib/server/modules/forms/forms.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = (await params).id;
    const { languages } = await req.json();
    const result = await FormsService.publishForm(user.token, id, user.id, languages);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
