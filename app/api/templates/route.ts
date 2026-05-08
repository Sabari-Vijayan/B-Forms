import { NextRequest, NextResponse } from "next/server";
import { TemplatesService } from "@/lib/server/modules/templates/templates.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const templates = await TemplatesService.getPublicTemplates(category);
    return NextResponse.json(templates);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
