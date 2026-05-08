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
    const body = await req.json();
    const template = await TemplatesService.publishAsTemplate(id, user.id, body);
    return NextResponse.json(template);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
