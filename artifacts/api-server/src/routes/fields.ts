import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../lib/auth.js";
import { FieldsService } from "../modules/fields/fields.service.js";

const router = Router();

router.get("/forms/:id/fields", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const fields = await FieldsService.listFields(req.accessToken, req.params.id, req.user!.id);
    res.json(fields);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/forms/:id/fields", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const field = await FieldsService.addField(req.accessToken, req.params.id, req.user!.id, req.body);
    res.status(201).json(field);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/forms/:id/fields/reorder", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    await FieldsService.reorderFields(req.accessToken, req.params.id, req.user!.id, req.body.fieldIds);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/forms/:id/fields/:fieldId", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const field = await FieldsService.updateField(req.accessToken, req.params.id, req.params.fieldId, req.user!.id, req.body);
    res.json(field);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/forms/:id/fields/:fieldId", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    await FieldsService.deleteField(req.accessToken, req.params.id, req.params.fieldId, req.user!.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
