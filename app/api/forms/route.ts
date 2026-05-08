import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/server/auth";
import { FormsService } from "@/lib/server/modules/forms/forms.service";
import { logger } from "@/lib/server/logger";

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await FormsService.getUserDashboard(user.token, user.id);
    return NextResponse.json(data);
  } catch (error: any) {
    logger.error({ error: error.message }, "Failed to fetch forms");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const form = await FormsService.createManualForm(user.token, user.id, body);
    return NextResponse.json(form, { status: 201 });
  } catch (error: any) {
    logger.error({ error: error.message }, "Failed to create form");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
