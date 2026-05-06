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

    // AI output already matches the hierarchical document model, but let's be robust
    let rawItems = Array.isArray(result.items) 
      ? result.items 
      : (Array.isArray((result as any).fields) 
        ? (result as any).fields 
        : (Array.isArray((result as any).form?.items) 
          ? (result as any).form?.items 
          : (Array.isArray((result as any).form?.fields) 
            ? (result as any).form?.fields 
            : [])));

    // Normalize items to the hierarchical structure if they came in flat
    const items = rawItems.map((item: any) => {
      // If it already has questionItem, it's mostly correct
      if (item.questionItem) return item;

      // Map flat structure (from older models or hallucinations) to hierarchical
      const itemId = item.itemId || item.id || Math.random().toString(36).substring(7);
      const title = item.title || item.label || "Untitled Question";
      const description = item.description || item.placeholder || "";
      const required = !!(item.required || item.is_required);
      
      const question: any = {
        questionId: item.questionId || Math.random().toString(36).substring(7),
        required
      };

      const type = (item.type || item.fieldType || "short_text").toLowerCase();
      
      if (type.includes("choice") || type.includes("radio") || type.includes("checkbox") || type.includes("drop")) {
        question.choiceQuestion = {
          type: type.includes("multi") || type.includes("checkbox") ? "CHECKBOX" : "RADIO",
          options: Array.isArray(item.options) ? item.options : (Array.isArray(item.options_json) ? item.options_json : ["Option 1"])
        };
      } else if (type.includes("rating") || type.includes("star")) {
        question.ratingQuestion = { maxRating: 5 };
      } else {
        question.textQuestion = { paragraph: type.includes("long") || type.includes("para") };
      }

      return {
        itemId,
        title,
        description,
        questionItem: { question }
      };
    });

    const formDocument = {
      info: {
        title: result.info?.title || (result as any).title || (result as any).form?.title || "Untitled Form",
        description: result.info?.description || (result as any).description || (result as any).form?.description || ""
      },
      items: items
    };

    const featureImageUrl = result.feature_image_url || (result as any).featureImageUrl || (result as any).form?.featureImageUrl || (result as any).form?.feature_image_url;

    res.json({
      form: formDocument,
      detectedLanguage,
      featureImageUrl
    });
  } catch (error: any) {
    logger.error({ error: error.message, prompt: req.body.prompt }, "AI Generation failed");
    res.status(500).json({ error: error.message });
  }
});

export default router;
