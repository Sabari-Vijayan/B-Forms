import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../lib/auth.js";
import { createSupabaseClient, createAdminClient } from "../lib/supabase.js";

const router = Router();

router.get("/forms/:id/fields", requireAuth, async (req: AuthenticatedRequest, res) => {
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

  const { data: fields, error } = await supabase
    .from("form_fields")
    .select("*")
    .eq("form_id", req.params.id)
    .order("order_index");

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(
    (fields || []).map((f) => ({
      id: f.id,
      formId: f.form_id,
      orderIndex: f.order_index,
      fieldType: f.field_type,
      label: f.label,
      placeholder: f.placeholder,
      isRequired: f.is_required,
      optionsJson: f.options_json,
    }))
  );
});

router.post("/forms/:id/fields", requireAuth, async (req: AuthenticatedRequest, res) => {
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

  const { fieldType, label, placeholder, isRequired, optionsJson, orderIndex } = req.body;

  const { data: field, error } = await admin
    .from("form_fields")
    .insert({
      form_id: req.params.id,
      order_index: orderIndex ?? 0,
      field_type: fieldType,
      label,
      placeholder: placeholder || null,
      is_required: isRequired ?? false,
      options_json: optionsJson || null,
    })
    .select()
    .single();

  if (error || !field) {
    res.status(500).json({ error: error?.message || "Failed to create field" });
    return;
  }

  res.status(201).json({
    id: field.id,
    formId: field.form_id,
    orderIndex: field.order_index,
    fieldType: field.field_type,
    label: field.label,
    placeholder: field.placeholder,
    isRequired: field.is_required,
    optionsJson: field.options_json,
  });
});

router.patch("/forms/:id/fields/reorder", requireAuth, async (req: AuthenticatedRequest, res) => {
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

  const { fieldIds } = req.body;
  if (!Array.isArray(fieldIds)) {
    res.status(400).json({ error: "fieldIds must be an array" });
    return;
  }

  await Promise.all(
    fieldIds.map((fieldId: string, index: number) =>
      admin
        .from("form_fields")
        .update({ order_index: index })
        .eq("id", fieldId)
        .eq("form_id", req.params.id)
    )
  );

  res.json({ success: true });
});

router.patch("/forms/:id/fields/:fieldId", requireAuth, async (req: AuthenticatedRequest, res) => {
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

  const { label, placeholder, isRequired, optionsJson, orderIndex } = req.body;
  const updates: Record<string, unknown> = {};
  if (label !== undefined) updates.label = label;
  if (placeholder !== undefined) updates.placeholder = placeholder;
  if (isRequired !== undefined) updates.is_required = isRequired;
  if (optionsJson !== undefined) updates.options_json = optionsJson;
  if (orderIndex !== undefined) updates.order_index = orderIndex;

  const { data: field, error } = await admin
    .from("form_fields")
    .update(updates)
    .eq("id", req.params.fieldId)
    .eq("form_id", req.params.id)
    .select()
    .single();

  if (error || !field) {
    res.status(500).json({ error: error?.message || "Update failed" });
    return;
  }

  res.json({
    id: field.id,
    formId: field.form_id,
    orderIndex: field.order_index,
    fieldType: field.field_type,
    label: field.label,
    placeholder: field.placeholder,
    isRequired: field.is_required,
    optionsJson: field.options_json,
  });
});

router.delete("/forms/:id/fields/:fieldId", requireAuth, async (req: AuthenticatedRequest, res) => {
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

  await admin
    .from("form_fields")
    .delete()
    .eq("id", req.params.fieldId)
    .eq("form_id", req.params.id);

  res.status(204).send();
});

export default router;
