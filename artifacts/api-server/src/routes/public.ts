import { Router } from "express";
import { createAdminClient } from "../lib/supabase.js";

const router = Router();

router.get("/public/forms/:slug", async (req, res) => {
  const admin = createAdminClient();

  const { data: form, error } = await admin
    .from("forms")
    .select("*")
    .eq("slug", req.params.slug)
    .eq("status", "published")
    .single();

  if (error || !form) {
    res.status(404).json({ error: "Form not found or not published" });
    return;
  }

  const [fieldsResult, translationsResult] = await Promise.all([
    admin
      .from("form_fields")
      .select("*")
      .eq("form_id", form.id)
      .order("order_index"),
    admin
      .from("form_translations")
      .select("*")
      .eq("form_id", form.id),
  ]);

  const fields = (fieldsResult.data || []).map((f) => ({
    id: f.id,
    formId: f.form_id,
    orderIndex: f.order_index,
    fieldType: f.field_type,
    label: f.label,
    placeholder: f.placeholder,
    isRequired: f.is_required,
    optionsJson: f.options_json,
  }));

  const translations = (translationsResult.data || []).map((t) => ({
    id: t.id,
    formId: t.form_id,
    language: t.language,
    translationsJson: t.translations_json,
    generatedAt: t.generated_at,
  }));

  res.json({
    id: form.id,
    title: form.title,
    description: form.description,
    featureImageUrl: form.feature_image_url,
    slug: form.slug,
    originalLanguage: form.original_language,
    supportedLanguages: form.supported_languages || [],
    fields,
    translations,
  });
});

router.get("/forms/:id/translations", async (req, res) => {
  const admin = createAdminClient();
  const { data: translations, error } = await admin
    .from("form_translations")
    .select("*")
    .eq("form_id", req.params.id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(
    (translations || []).map((t) => ({
      id: t.id,
      formId: t.form_id,
      language: t.language,
      translationsJson: t.translations_json,
      generatedAt: t.generated_at,
    }))
  );
});

export default router;
