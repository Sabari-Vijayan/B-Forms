import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../lib/auth.js";
import { FormsWorker } from "../modules/forms/forms.worker.js";
import { detectLanguage } from "../lib/ai.js";
import { logger } from "../lib/logger.js";

const router = Router();

router.post("/ai/generate", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { prompt, language } = req.body;
    if (!prompt) {
       res.status(400).json({ error: "Prompt is required" });
       return;
    }

    const detectedLanguage = language || detectLanguage(prompt);
    const result = await FormsWorker.generateForm(prompt, detectedLanguage);

    // Map AI output to API schema (AIGeneratedForm -> GenerateFormResult)
    const formattedForm = {
      title: result.title,
      description: result.description || null,
      featureImageUrl: result.feature_image_url || null,
      fields: result.fields.map((f, idx) => ({
        label: f.label,
        fieldType: f.field_type,
        placeholder: f.placeholder || null,
        isRequired: f.is_required,
        optionsJson: f.options || null,
        orderIndex: idx
      }))
    };

    res.json({
      form: formattedForm,
      detectedLanguage
    });
  } catch (error: any) {
    logger.error({ error: error.message, prompt: req.body.prompt }, "AI Generation failed");
    res.status(500).json({ error: error.message });
  }
});

export default router;
