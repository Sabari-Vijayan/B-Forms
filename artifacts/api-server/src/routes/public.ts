import { Router } from "express";
import multer from "multer";
import { nanoid } from "nanoid";
import { createAdminClient } from "../lib/supabase.js";

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post("/public/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const admin = createAdminClient();
  const file = req.file;
  const fileExt = file.originalname.split(".").pop();
  const fileName = `${nanoid()}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { data, error } = await admin.storage
    .from("form-attachments")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const { data: { publicUrl } } = admin.storage
    .from("form-attachments")
    .getPublicUrl(filePath);

  res.json({ url: publicUrl });
});

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

  res.json({
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
