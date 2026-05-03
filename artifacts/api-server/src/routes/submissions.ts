import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../lib/auth.js";
import { createSupabaseClient, createAdminClient } from "../lib/supabase.js";
import { translateResponse } from "../lib/ai.js";

const router = Router();

router.get("/forms/:id/submissions", requireAuth, async (req: AuthenticatedRequest, res) => {
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
  const { data: submissions, error } = await admin
    .from("submissions")
    .select("*")
    .eq("form_id", req.params.id)
    .order("submitted_at", { ascending: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(
    (submissions || []).map((s) => ({
      id: s.id,
      formId: s.form_id,
      respondentLanguage: s.respondent_language,
      rawResponsesJson: s.raw_responses_json,
      translatedResponsesJson: s.translated_responses_json,
      translationStatus: s.translation_status,
      submittedAt: s.submitted_at,
    }))
  );
});

router.post("/public/forms/:slug/submit", async (req, res) => {
  const admin = createAdminClient();

  const { data: form, error: formLookupError } = await admin
    .from("forms")
    .select("*")
    .eq("slug", req.params.slug)
    .eq("status", "published")
    .single();

  if (formLookupError || !form) {
    res.status(404).json({ error: "Form not found or not published" });
    return;
  }

  if (form.closes_at && new Date(form.closes_at) < new Date()) {
    res.status(400).json({ error: "This form is closed" });
    return;
  }

  if (form.response_limit) {
    const { count } = await admin
      .from("submissions")
      .select("id", { count: "exact", head: true })
      .eq("form_id", form.id);
    if ((count || 0) >= form.response_limit) {
      res.status(400).json({ error: "Response limit reached" });
      return;
    }
  }

  const { respondentLanguage, responses } = req.body;
  if (!respondentLanguage || !responses) {
    res.status(400).json({ error: "respondentLanguage and responses are required" });
    return;
  }

  const { data: submission, error } = await admin
    .from("submissions")
    .insert({
      form_id: form.id,
      respondent_language: respondentLanguage,
      raw_responses_json: responses,
      translation_status: "pending",
    })
    .select()
    .single();

  if (error || !submission) {
    res.status(500).json({ error: error?.message || "Failed to submit" });
    return;
  }

  const creatorLang = form.preferred_language || form.original_language;
  const needsTranslation = respondentLanguage !== creatorLang;

  if (!needsTranslation) {
    await admin
      .from("submissions")
      .update({ translation_status: "skipped" })
      .eq("id", submission.id);
  } else {
    translateResponse(responses, respondentLanguage, creatorLang)
      .then(async (translated) => {
        await admin
          .from("submissions")
          .update({ translated_responses_json: translated, translation_status: "done" })
          .eq("id", submission.id);
      })
      .catch(() => {});
  }

  res.status(201).json({
    id: submission.id,
    formId: submission.form_id,
    respondentLanguage: submission.respondent_language,
    rawResponsesJson: submission.raw_responses_json,
    translatedResponsesJson: submission.translated_responses_json,
    translationStatus: submission.translation_status,
    submittedAt: submission.submitted_at,
  });
});

export default router;
