import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../lib/auth.js";
import { SubmissionsService } from "../modules/submissions/submissions.service.js";
import { FormsService } from "../modules/forms/forms.service.js";

const router = Router();

router.get("/forms/:id/submissions", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const submissions = await SubmissionsService.getFormSubmissions(req.accessToken, req.params.id);
    res.json(submissions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/public/forms/:slug/submit", async (req, res) => {
  try {
    const { respondentLanguage, responses } = req.body;
    // We need to find the form by slug to get the original language
    const { data: form } = await FormsService.getFormBySlug(req.params.slug);
    if (!form) {
       res.status(404).json({ error: "Form not found" });
       return;
    }

    const submission = await SubmissionsService.submitForm(
      form.id, 
      respondentLanguage, 
      responses, 
      form.preferredLanguage || form.originalLanguage
    );
    res.status(201).json(submission);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
