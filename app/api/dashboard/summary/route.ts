import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/server/auth";
import { FormsService } from "@/lib/server/modules/forms/forms.service";
import { logger } from "@/lib/server/logger";

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const summary = await FormsService.getDashboardSummary(user.token, user.id);
    return NextResponse.json(summary);
  } catch (error: any) {
    logger.error({ error: error.message }, "Failed to fetch dashboard summary");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
