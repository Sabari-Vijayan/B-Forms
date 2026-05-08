import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/server/auth";
import { FormsService } from "@/lib/server/modules/forms/forms.service";
import { logger } from "@/lib/server/logger";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = (await params).id;
    const { data, error } = await FormsService.getFormDetail(user.token, id, user.id);
    if (error) {
       return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = (await params).id;
    const body = await req.json();
    const form = await FormsService.updateForm(user.token, id, user.id, body);
    return NextResponse.json(form);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = (await params).id;
    await FormsService.deleteForm(user.token, id, user.id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
