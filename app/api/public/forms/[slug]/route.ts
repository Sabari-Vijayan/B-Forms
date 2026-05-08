import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/server/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const admin = createAdminClient();
  const slug = (await params).slug;

  const { data: form, error } = await admin
    .from("forms")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !form) {
    return NextResponse.json({ error: "Form not found or not published" }, { status: 404 });
  }

  const { data: translationsResult } = await admin
    .from("form_translations")
    .select("*")
    .eq("form_id", form.id);

  const translations = (translationsResult || []).map((t) => ({
    id: t.id,
    formId: t.form_id,
    language: t.language,
    translationsJson: t.translations_json,
    generatedAt: t.generated_at,
  }));

  return NextResponse.json({
    id: form.id,
    title: form.title,
    description: form.description,
    featureImageUrl: form.feature_image_url,
    slug: form.slug,
    originalLanguage: form.original_language,
    supportedLanguages: form.supported_languages || [],
    documentJson: form.document_json,
    translations,
  });
}
