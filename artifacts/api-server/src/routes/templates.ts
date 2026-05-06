import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../lib/auth.js";
import { TemplatesService } from "../modules/templates/templates.service.js";

const router = Router();

router.get("/templates", async (req, res) => {
  try {
    const category = req.query.category as string;
    const templates = await TemplatesService.getPublicTemplates(category);
    res.json(templates);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/templates/:id/use", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const form = await TemplatesService.useTemplate(req.params.id as string, req.user!.id);
    res.status(201).json(form);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/forms/:id/template", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const template = await TemplatesService.publishAsTemplate(req.params.id as string, req.user!.id, req.body);
    res.json(template);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
