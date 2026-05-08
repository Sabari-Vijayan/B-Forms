import { NextRequest, NextResponse } from "next/server";
import { SubmissionsService } from "@/lib/server/modules/submissions/submissions.service";
import { FormsService } from "@/lib/server/modules/forms/forms.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;
    const { respondentLanguage, responses } = await req.json();
    const { data: form } = await FormsService.getFormBySlug(slug);
    if (!form) {
       return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const submission = await SubmissionsService.submitForm(
      form.id, 
      respondentLanguage, 
      responses, 
      form.preferredLanguage || form.originalLanguage
    );
    return NextResponse.json(submission, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
