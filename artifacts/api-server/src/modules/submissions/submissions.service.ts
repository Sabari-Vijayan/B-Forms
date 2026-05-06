import { SubmissionsSql } from "./submissions.sql.js";
import { SubmissionsWorker } from "./submissions.worker.ts";

export const SubmissionsService = {
  async getFormSubmissions(accessToken: string, formId: string) {
    const { data, error } = await SubmissionsSql.getSubmissionsByFormId(accessToken, formId);
    if (error) throw error;
    
    return (data || []).map(s => ({
      id: s.id,
      formId: s.form_id,
      respondentLanguage: s.respondent_language,
      rawResponsesJson: s.raw_responses_json,
      translatedResponsesJson: s.translated_responses_json,
      sentimentAnalysisJson: s.sentiment_analysis_json,
      translationStatus: s.translation_status,
      submittedAt: s.submitted_at
    }));
  },

  async submitForm(formId: string, respondentLanguage: string, responses: any, targetLanguage: string) {
    const { data: submission, error } = await SubmissionsSql.createSubmission({
      form_id: formId,
      respondent_language: respondentLanguage,
      raw_responses_json: responses,
      translation_status: targetLanguage === respondentLanguage ? "skipped" : "pending"
    });

    if (error) throw error;

    // Trigger background processing (translation + sentiment)
    this.processSubmission(submission.id, responses, respondentLanguage, targetLanguage);

    return submission;
  },

  async processSubmission(submissionId: string, responses: any, fromLang: string, toLang: string) {
    try {
      let translated = null;
      if (fromLang !== toLang) {
        translated = await SubmissionsWorker.translateSubmission(responses, fromLang, toLang);
      }

      const sentiment = await SubmissionsWorker.analyzeSentiment(responses, fromLang);

      await SubmissionsSql.updateSubmission(submissionId, {
        translated_responses_json: translated,
        sentiment_analysis_json: sentiment,
        translation_status: fromLang === toLang ? "skipped" : "done"
      });
    } catch (err) {
      console.error("Submission processing failed:", err);
      await SubmissionsSql.updateSubmission(submissionId, { translation_status: "failed" });
    }
  }
};
