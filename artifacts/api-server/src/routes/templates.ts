import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../lib/auth.js";
import { createSupabaseClient, createAdminClient } from "../lib/supabase.js";
import { generateSlug } from "../lib/nanoid.js";

const router = Router();

function mapTemplate(t: Record<string, unknown>, fields?: unknown[]) {
  return {
    id: t.id,
    formId: t.form_id,
    userId: t.user_id,
    title: t.title,
    description: t.description ?? null,
    category: t.category,
    isPublic: t.is_public,
    useCount: t.use_count,
    createdAt: t.created_at,
    fieldCount: t.field_count ?? (Array.isArray(fields) ? fields.length : 0),
    ...(fields !== undefined ? { fields: (fields as Record<string, unknown>[]).map(mapField) } : {}),
  };
}

function mapField(f: Record<string, unknown>) {
  return {
    id: f.id,
    formId: f.form_id,
    orderIndex: f.order_index,
    fieldType: f.field_type,
    label: f.label,
    placeholder: f.placeholder ?? null,
    isRequired: f.is_required,
    optionsJson: f.options_json ?? null,
  };
}

// GET /templates — list public templates (no auth required)
router.get("/templates", async (req, res) => {
  const admin = createAdminClient();
  const category = typeof req.query.category === "string" ? req.query.category : undefined;

  let query = admin
    .from("form_templates")
    .select("*, form_fields(count)")
    .eq("is_public", true)
    .order("use_count", { ascending: false });

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  // Fetch field counts separately since Supabase count embed has quirks
  const templateIds = (data || []).map((t) => t.form_id as string);
  let fieldCounts: Record<string, number> = {};
  if (templateIds.length > 0) {
    const { data: fields } = await admin
      .from("form_fields")
      .select("form_id")
      .in("form_id", templateIds);
    for (const f of fields || []) {
      fieldCounts[f.form_id] = (fieldCounts[f.form_id] || 0) + 1;
    }
  }

  res.json(
    (data || []).map((t) => mapTemplate({ ...t, field_count: fieldCounts[t.form_id as string] ?? 0 }))
  );
});

// GET /templates/my — list current user's templates
router.get("/templates/my", requireAuth, async (req: AuthenticatedRequest, res) => {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("form_templates")
    .select("*")
    .eq("user_id", req.user!.id)
    .order("created_at", { ascending: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const formIds = (data || []).map((t) => t.form_id as string);
  let fieldCounts: Record<string, number> = {};
  if (formIds.length > 0) {
    const { data: fields } = await admin
      .from("form_fields")
      .select("form_id")
      .in("form_id", formIds);
    for (const f of fields || []) {
      fieldCounts[f.form_id] = (fieldCounts[f.form_id] || 0) + 1;
    }
  }

  res.json(
    (data || []).map((t) => mapTemplate({ ...t, field_count: fieldCounts[t.form_id as string] ?? 0 }))
  );
});

// POST /templates/:id/use — use a template (creates a new form for current user)
router.post("/templates/:id/use", requireAuth, async (req: AuthenticatedRequest, res) => {
  const admin = createAdminClient();

  const { data: tmpl, error: tmplErr } = await admin
    .from("form_templates")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (tmplErr || !tmpl) {
    res.status(404).json({ error: "Template not found" });
    return;
  }

  // Only allow using public templates or own templates
  if (!tmpl.is_public && tmpl.user_id !== req.user!.id) {
    res.status(404).json({ error: "Template not found" });
    return;
  }

  // Fetch original fields
  const { data: sourceFields } = await admin
    .from("form_fields")
    .select("*")
    .eq("form_id", tmpl.form_id)
    .order("order_index");

  // Fetch original form for language info
  const { data: sourceForm } = await admin
    .from("forms")
    .select("original_language")
    .eq("id", tmpl.form_id)
    .single();

  const slug = generateSlug();
  const { data: newForm, error: formErr } = await admin
    .from("forms")
    .insert({
      user_id: req.user!.id,
      title: tmpl.title,
      description: tmpl.description,
      slug,
      original_language: sourceForm?.original_language || "en",
      status: "draft",
      supported_languages: [],
    })
    .select()
    .single();

  if (formErr || !newForm) {
    res.status(500).json({ error: formErr?.message || "Failed to create form from template" });
    return;
  }

  let createdFields: unknown[] = [];
  if ((sourceFields || []).length > 0) {
    const { data: fData } = await admin
      .from("form_fields")
      .insert(
        (sourceFields || []).map((f) => ({
          form_id: newForm.id,
          order_index: f.order_index,
          field_type: f.field_type,
          label: f.label,
          placeholder: f.placeholder,
          is_required: f.is_required,
          options_json: f.options_json,
        }))
      )
      .select();
    if (fData) createdFields = fData;
  }

  // Increment use_count
  await admin
    .from("form_templates")
    .update({ use_count: (tmpl.use_count || 0) + 1 })
    .eq("id", tmpl.id);

  res.status(201).json({
    id: newForm.id,
    userId: newForm.user_id,
    title: newForm.title,
    description: newForm.description,
    slug: newForm.slug,
    originalLanguage: newForm.original_language,
    status: newForm.status,
    supportedLanguages: newForm.supported_languages || [],
    responseLimit: newForm.response_limit,
    closesAt: newForm.closes_at,
    createdAt: newForm.created_at,
    fields: (createdFields as Record<string, unknown>[]).map(mapField),
  });
});

// GET /forms/:id/template — get template status for a form
router.get("/forms/:id/template", requireAuth, async (req: AuthenticatedRequest, res) => {
  const supabase = createSupabaseClient(req.accessToken);
  const admin = createAdminClient();

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

  const { data: tmpl, error } = await admin
    .from("form_templates")
    .select("*")
    .eq("form_id", req.params.id)
    .single();

  if (error || !tmpl) {
    res.status(404).json({ error: "Not a template" });
    return;
  }

  const { data: fields } = await admin
    .from("form_fields")
    .select("*")
    .eq("form_id", tmpl.form_id)
    .order("order_index");

  res.json(mapTemplate({ ...tmpl, field_count: (fields || []).length }, fields || []));
});

// POST /forms/:id/template — publish or update as template
router.post("/forms/:id/template", requireAuth, async (req: AuthenticatedRequest, res) => {
  const supabase = createSupabaseClient(req.accessToken);
  const admin = createAdminClient();

  const { title, description, category, isPublic } = req.body;

  const { data: form } = await supabase
    .from("forms")
    .select("*")
    .eq("id", req.params.id)
    .eq("user_id", req.user!.id)
    .single();

  if (!form) {
    res.status(404).json({ error: "Form not found" });
    return;
  }

  const { data: existing } = await admin
    .from("form_templates")
    .select("id, use_count")
    .eq("form_id", req.params.id)
    .single();

  let tmpl: Record<string, unknown> | null = null;

  if (existing) {
    const { data: updated } = await admin
      .from("form_templates")
      .update({
        title: title || form.title,
        description: description ?? null,
        category: category || "general",
        is_public: isPublic ?? true,
      })
      .eq("id", existing.id)
      .select()
      .single();
    tmpl = updated;
  } else {
    const { data: created } = await admin
      .from("form_templates")
      .insert({
        form_id: form.id,
        user_id: req.user!.id,
        title: title || form.title,
        description: description ?? null,
        category: category || "general",
        is_public: isPublic ?? true,
        use_count: 0,
      })
      .select()
      .single();
    tmpl = created;
  }

  if (!tmpl) {
    res.status(500).json({ error: "Failed to save template" });
    return;
  }

  const { data: fields } = await admin
    .from("form_fields")
    .select("*")
    .eq("form_id", req.params.id)
    .order("order_index");

  res.json(mapTemplate({ ...tmpl, field_count: (fields || []).length }, fields || []));
});

// DELETE /forms/:id/template — remove template status
router.delete("/forms/:id/template", requireAuth, async (req: AuthenticatedRequest, res) => {
  const supabase = createSupabaseClient(req.accessToken);
  const admin = createAdminClient();

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

  await admin.from("form_templates").delete().eq("form_id", req.params.id);
  res.status(204).send();
});

export default router;
