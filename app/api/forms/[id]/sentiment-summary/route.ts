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
    const summary = await FormsService.generateFormSentimentSummary(user.token, id);
    return NextResponse.json({ summary });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
