import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../lib/auth.js";
import { FormsService } from "../modules/forms/forms.service.js";
import { logger } from "../lib/logger.js";

const router = Router();

router.get("/forms", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const data = await FormsService.getUserDashboard(req.accessToken!, req.user!.id);
    res.json(data);
  } catch (error: any) {
    logger.error({ error: error.message }, "Failed to fetch forms");
    res.status(500).json({ error: error.message });
  }
});

router.post("/forms", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const form = await FormsService.createManualForm(req.accessToken!, req.user!.id, req.body);
    res.status(201).json(form);
  } catch (error: any) {
    logger.error({ error: error.message }, "Failed to create form");
    res.status(500).json({ error: error.message });
  }
});

router.get("/forms/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { data, error } = await FormsService.getFormDetail(req.accessToken!, req.params.id as string, req.user!.id);
    if (error) {
       res.status(404).json({ error: "Form not found" });
       return;
    }
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/forms/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const form = await FormsService.updateForm(req.accessToken!, req.params.id as string, req.user!.id, req.body);
    res.json(form);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/forms/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    await FormsService.deleteForm(req.accessToken!, req.params.id as string, req.user!.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/forms/:id/sentiment-summary", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const summary = await FormsService.generateFormSentimentSummary(req.accessToken!, req.params.id as string);
    res.json({ summary });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.post("/forms/:id/duplicate", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const newForm = await FormsService.duplicateForm(req.accessToken!, req.params.id as string, req.user!.id);
    res.status(201).json(newForm);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/forms/:id/publish", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const result = await FormsService.publishForm(
      req.accessToken!,
      req.params.id as string,
      req.user!.id,
      req.body.languages
    );
    res.json(result);
  } catch (error: any) {
    logger.error({ error: error.message, formId: req.params.id as string }, "Failed to publish form");
    res.status(500).json({ error: error.message });
  }
});

export default router;
