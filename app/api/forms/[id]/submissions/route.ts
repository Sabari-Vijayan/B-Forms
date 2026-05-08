import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/server/auth";
import { SubmissionsService } from "@/lib/server/modules/submissions/submissions.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = (await params).id;
    const submissions = await SubmissionsService.getFormSubmissions(user.token, id);
    return NextResponse.json(submissions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
