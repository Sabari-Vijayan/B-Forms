import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../lib/auth.js";
import { createSupabaseClient, createAdminClient } from "../lib/supabase.js";
import { generateFormFromPrompt, translateFields, detectLanguage } from "../lib/ai.js";
import { generateSlug } from "../lib/nanoid.js";

const router = Router();

router.get("/forms", requireAuth, async (req: AuthenticatedRequest, res) => {
  const supabase = createSupabaseClient(req.accessToken);
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("user_id", req.user!.id)
    .order("created_at", { ascending: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(
    (data || []).map((f) => ({
      id: f.id,
      userId: f.user_id,
      title: f.title,
      description: f.description,
      slug: f.slug,
      originalLanguage: f.original_language,
      preferredLanguage: f.preferred_language ?? null,
      status: f.status,
      supportedLanguages: f.supported_languages || [],
      responseLimit: f.response_limit,
      closesAt: f.closes_at,
      createdAt: f.created_at,
    }))
  );
});

router.post("/forms", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { title, description, originalLanguage, fields } = req.body;
  if (!title || !originalLanguage) {
    res.status(400).json({ error: "title and originalLanguage are required" });
    return;
  }

  const admin = createAdminClient();
  const slug = generateSlug();

  const { data: form, error: formError } = await admin
    .from("forms")
    .insert({
      user_id: req.user!.id,
      title,
      description: description || null,
      slug,
      original_language: originalLanguage,
      status: "draft",
      supported_languages: [],
    })
    .select()
    .single();

  if (formError || !form) {
    res.status(500).json({ error: formError?.message || "Failed to create form" });
    return;
  }

  let createdFields: unknown[] = [];
  if (fields && Array.isArray(fields) && fields.length > 0) {
    const fieldRows = fields.map((f: Record<string, unknown>, i: number) => ({
      form_id: form.id,
      order_index: f.orderIndex ?? i,
      field_type: f.fieldType,
      label: f.label,
      placeholder: f.placeholder || null,
      is_required: f.isRequired ?? false,
      options_json: f.optionsJson || null,
    }));

    const { data: fData, error: fErr } = await admin
      .from("form_fields")
      .insert(fieldRows)
      .select();

    if (!fErr && fData) createdFields = fData;
  }

  res.status(201).json({
    id: form.id,
    userId: form.user_id,
    title: form.title,
    description: form.description,
    slug: form.slug,
    originalLanguage: form.original_language,
    status: form.status,
    supportedLanguages: form.supported_languages || [],
    responseLimit: form.response_limit,
    closesAt: form.closes_at,
    createdAt: form.created_at,
    fields: (createdFields as Record<string, unknown>[]).map((f) => ({
      id: f.id,
      formId: f.form_id,
      orderIndex: f.order_index,
      fieldType: f.field_type,
      label: f.label,
      placeholder: f.placeholder,
      isRequired: f.is_required,
      optionsJson: f.options_json,
    })),
  });
});

router.get("/forms/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  const supabase = createSupabaseClient(req.accessToken);
  const { data: form, error } = await supabase
    .from("forms")
    .select("*")
    .eq("id", req.params.id)
    .eq("user_id", req.user!.id)
    .single();

  if (error || !form) {
    res.status(404).json({ error: "Form not found" });
    return;
  }

  const { data: fields } = await supabase
    .from("form_fields")
    .select("*")
    .eq("form_id", form.id)
    .order("order_index");

  res.json({
    id: form.id,
    userId: form.user_id,
    title: form.title,
    description: form.description,
    slug: form.slug,
    originalLanguage: form.original_language,
    preferredLanguage: form.preferred_language ?? null,
    status: form.status,
    supportedLanguages: form.supported_languages || [],
    responseLimit: form.response_limit,
    closesAt: form.closes_at,
    createdAt: form.created_at,
    fields: (fields || []).map((f) => ({
      id: f.id,
      formId: f.form_id,
      orderIndex: f.order_index,
      fieldType: f.field_type,
      label: f.label,
      placeholder: f.placeholder,
      isRequired: f.is_required,
      optionsJson: f.options_json,
    })),
  });
});

router.patch("/forms/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  const admin = createAdminClient();
  const { title, description, status, supportedLanguages, preferredLanguage, responseLimit, closesAt } = req.body;

  const { data: existing } = await createSupabaseClient(req.accessToken)
    .from("forms")
    .select("id")
    .eq("id", req.params.id)
    .eq("user_id", req.user!.id)
    .single();

  if (!existing) {
    res.status(404).json({ error: "Form not found" });
    return;
  }

  const updates: Record<string, unknown> = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (status !== undefined) updates.status = status;
  if (supportedLanguages !== undefined) updates.supported_languages = supportedLanguages;
  if (preferredLanguage !== undefined) updates.preferred_language = preferredLanguage;
  if (responseLimit !== undefined) updates.response_limit = responseLimit;
  if (closesAt !== undefined) updates.closes_at = closesAt;

  const { data: form, error } = await admin
    .from("forms")
    .update(updates)
    .eq("id", req.params.id)
    .select()
    .single();

  if (error || !form) {
    res.status(500).json({ error: error?.message || "Update failed" });
    return;
  }

  res.json({
    id: form.id,
    userId: form.user_id,
    title: form.title,
    description: form.description,
    slug: form.slug,
    originalLanguage: form.original_language,
    preferredLanguage: form.preferred_language ?? null,
    status: form.status,
    supportedLanguages: form.supported_languages || [],
    responseLimit: form.response_limit,
    closesAt: form.closes_at,
    createdAt: form.created_at,
  });
});

router.delete("/forms/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  const admin = createAdminClient();
  const { data: existing } = await createSupabaseClient(req.accessToken)
    .from("forms")
    .select("id")
    .eq("id", req.params.id)
    .eq("user_id", req.user!.id)
    .single();

  if (!existing) {
    res.status(404).json({ error: "Form not found" });
    return;
  }

  await admin.from("forms").delete().eq("id", req.params.id);
  res.status(204).send();
});

router.post("/forms/:id/publish", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { languages } = req.body;
  const admin = createAdminClient();

  const { data: form } = await createSupabaseClient(req.accessToken)
    .from("forms")
    .select("*, form_fields(*)")
    .eq("id", req.params.id)
    .eq("user_id", req.user!.id)
    .single();

  if (!form) {
    res.status(404).json({ error: "Form not found" });
    return;
  }

  const formFields = (form.form_fields || []) as Record<string, unknown>[];
  const results = await Promise.allSettled(
    (languages || []).map(async (lang: string) => {
      if (lang === form.original_language) return;
      const translations = await translateFields(
        form.title as string,
        form.description as string | null,
        formFields.map((f) => ({
          id: f.id as string,
          label: f.label as string,
          placeholder: f.placeholder as string | null,
          options: f.options_json as string[] | null,
        })),
        lang,
        form.original_language
      );
      await admin.from("form_translations").upsert(
        {
          form_id: form.id,
          language: lang,
          translations_json: translations,
          generated_at: new Date().toISOString(),
        },
        { onConflict: "form_id,language" }
      );
    })
  );

  const { data: updatedForm } = await admin
    .from("forms")
    .update({ status: "published", supported_languages: languages || [] })
    .eq("id", form.id)
    .select()
    .single();

  const failed = results.filter((r) => r.status === "rejected").length;
  res.json({
    success: true,
    failedLanguages: failed,
    form: updatedForm
      ? {
          id: updatedForm.id,
          userId: updatedForm.user_id,
          title: updatedForm.title,
          description: updatedForm.description,
          slug: updatedForm.slug,
          originalLanguage: updatedForm.original_language,
          status: updatedForm.status,
          supportedLanguages: updatedForm.supported_languages || [],
          responseLimit: updatedForm.response_limit,
          closesAt: updatedForm.closes_at,
          createdAt: updatedForm.created_at,
        }
      : null,
  });
});

router.get("/forms/:id/stats", requireAuth, async (req: AuthenticatedRequest, res) => {
  const supabase = createSupabaseClient(req.accessToken);

  const { data: form } = await supabase
    .from("forms")
    .select("id")
    .eq("id", req.params.id)
    .eq("user_id", req.user!.id)
    .single();

  if (!form) {
    res.status(404).json({ error: "Form not found" });
    return;
  }

  const admin = createAdminClient();
  const { data: submissions } = await admin
    .from("submissions")
    .select("respondent_language, submitted_at")
    .eq("form_id", req.params.id);

  const total = submissions?.length || 0;
  const languageBreakdown: Record<string, number> = {};
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  let recent = 0;

  for (const s of submissions || []) {
    languageBreakdown[s.respondent_language] = (languageBreakdown[s.respondent_language] || 0) + 1;
    if (s.submitted_at > oneDayAgo) recent++;
  }

  res.json({ totalResponses: total, languageBreakdown, recentResponses: recent });
});

router.get("/dashboard/summary", requireAuth, async (req: AuthenticatedRequest, res) => {
  const supabase = createSupabaseClient(req.accessToken);
  const admin = createAdminClient();

  const { data: forms } = await supabase
    .from("forms")
    .select("*")
    .eq("user_id", req.user!.id)
    .order("created_at", { ascending: false });

  const formList = forms || [];
  const published = formList.filter((f) => f.status === "published").length;
  const drafts = formList.filter((f) => f.status === "draft").length;

  const recentForms = formList.slice(0, 5).map((f) => ({
    id: f.id,
    userId: f.user_id,
    title: f.title,
    description: f.description,
    slug: f.slug,
    originalLanguage: f.original_language,
    preferredLanguage: f.preferred_language ?? null,
    status: f.status,
    supportedLanguages: f.supported_languages || [],
    responseLimit: f.response_limit,
    closesAt: f.closes_at,
    createdAt: f.created_at,
  }));

  // Default empties
  let totalResponses = 0;
  const weeklyTrend: { date: string; count: number }[] = [];
  const topLanguages: { language: string; count: number }[] = [];
  let mostActiveForm: { id: string; title: string; responseCount: number } | null = null;

  if (formList.length > 0) {
    const formIds = formList.map((f) => f.id);

    // Fetch all submissions with language + date
    const { data: subs } = await admin
      .from("submissions")
      .select("form_id, respondent_language, submitted_at")
      .in("form_id", formIds);

    const submissions = subs || [];
    totalResponses = submissions.length;

    // Weekly trend: last 7 days
    const now = new Date();
    const dayMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dayMap[d.toISOString().slice(0, 10)] = 0;
    }
    for (const s of submissions) {
      const day = s.submitted_at.slice(0, 10);
      if (day in dayMap) dayMap[day]++;
    }
    for (const [date, count] of Object.entries(dayMap)) {
      weeklyTrend.push({ date, count });
    }

    // Language breakdown
    const langMap: Record<string, number> = {};
    for (const s of submissions) {
      langMap[s.respondent_language] = (langMap[s.respondent_language] || 0) + 1;
    }
    for (const [language, count] of Object.entries(langMap)) {
      topLanguages.push({ language, count });
    }
    topLanguages.sort((a, b) => b.count - a.count);

    // Most active form
    const formCountMap: Record<string, number> = {};
    for (const s of submissions) {
      formCountMap[s.form_id] = (formCountMap[s.form_id] || 0) + 1;
    }
    let maxCount = 0;
    let maxFormId = "";
    for (const [fid, cnt] of Object.entries(formCountMap)) {
      if (cnt > maxCount) { maxCount = cnt; maxFormId = fid; }
    }
    if (maxFormId) {
      const f = formList.find((f) => f.id === maxFormId);
      if (f) mostActiveForm = { id: f.id, title: f.title, responseCount: maxCount };
    }
  }

  res.json({
    totalForms: formList.length,
    publishedForms: published,
    draftForms: drafts,
    totalResponses,
    recentForms,
    weeklyTrend,
    topLanguages,
    mostActiveForm,
  });
});

router.post("/ai/generate", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string" || prompt.length < 5) {
    res.status(400).json({ error: "Invalid prompt. Must be at least 5 characters." });
    return;
  }

  try {
    const detectedLanguage = detectLanguage(prompt);
    const form = await generateFormFromPrompt(prompt);
    res.json({
      form: {
        title: form.title,
        description: form.description,
        fields: form.fields.map((f, i) => ({
          fieldType: f.field_type,
          label: f.label,
          placeholder: f.placeholder,
          isRequired: f.is_required,
          optionsJson: f.options,
          orderIndex: i,
        })),
      },
      detectedLanguage,
    });
  } catch (err) {
    req.log?.error({ err }, "Form generation failed");
    res.status(500).json({ error: "Form generation failed. Please try again." });
  }
});

export default router;
