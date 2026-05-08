import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/server/auth";
import { TemplatesService } from "@/lib/server/modules/templates/templates.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = (await params).id;
    const form = await TemplatesService.useTemplate(id, user.id);
    return NextResponse.json(form, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
