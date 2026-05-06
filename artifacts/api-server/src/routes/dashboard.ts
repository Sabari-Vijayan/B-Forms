import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../lib/auth.js";
import { FormsService } from "../modules/forms/forms.service.js";
import { logger } from "../lib/logger.js";

const router = Router();

/**
 * @summary Get dashboard summary stats
 */
router.get("/dashboard/summary", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const summary = await FormsService.getDashboardSummary(req.accessToken, req.user!.id);
    res.json(summary);
  } catch (error: any) {
    logger.error({ error: error.message }, "Failed to fetch dashboard summary");
    res.status(500).json({ error: error.message });
  }
});

export default router;
