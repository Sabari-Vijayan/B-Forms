import { SubmissionsSql } from "./submissions.sql";
import { logger } from "../../logger";

const normalize = (l: string) => l.toLowerCase().split("-")[0];

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
    const fromLang = normalize(respondentLanguage);
    const toLang = normalize(targetLanguage);

    const { data: submission, error } = await SubmissionsSql.createSubmission({
      form_id: formId,
      respondent_language: fromLang,
      raw_responses_json: responses,
      translation_status: fromLang === toLang ? "skipped" : "pending"
    });

    if (error) throw error;

    // Trigger processing. We await it here for development/reliability, 
    // or keep it background for high-scale. Let's make it more reliable.
    if (fromLang !== toLang) {
      await this.processSubmission(submission.id, responses, fromLang, toLang).catch(err => {
         logger.error({ err }, "Translation processing failed");
      });
    } else {
      // Even if no translation needed, still analyze sentiment
      this.processSubmission(submission.id, responses, fromLang, toLang).catch(err => {
         logger.error({ err }, "Sentiment processing failed");
      });
    }

    return submission;
  },

  async processSubmission(submissionId: string, responses: any, fromLang: string, toLang: string) {
    try {
      const { translateResponse, analyzeSentiment } = await import("../../ai");
      
      let translated = null;
      if (fromLang !== toLang) {
        translated = await translateResponse(responses, fromLang, toLang);
      }

      const sentiment = await analyzeSentiment(responses, fromLang);

      await SubmissionsSql.updateSubmission(submissionId, {
        translated_responses_json: translated,
        sentiment_analysis_json: sentiment,
        translation_status: fromLang === toLang ? "skipped" : "done"
      });
    } catch (err) {
      logger.error({ err, submissionId }, "Submission processing failed");
      await SubmissionsSql.updateSubmission(submissionId, { translation_status: "failed" });
    }
  }
};
