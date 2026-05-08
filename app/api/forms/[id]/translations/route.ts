import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/server/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = createAdminClient();
  const id = (await params).id;
  const { data: translations, error } = await admin
    .from("form_translations")
    .select("*")
    .eq("form_id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    (translations || []).map((t) => ({
      id: t.id,
      formId: t.form_id,
      language: t.language,
      translationsJson: t.translations_json,
      generatedAt: t.generated_at,
    }))
  );
}
