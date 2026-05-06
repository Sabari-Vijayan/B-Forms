import { translateResponse, analyzeSentiment } from "../../lib/ai.js";

export const SubmissionsWorker = {
  async translateSubmission(responses: any, fromLang: string, toLang: string) {
    return await translateResponse(responses, fromLang, toLang);
  },

  async analyzeSentiment(responses: any, lang: string) {
    return await analyzeSentiment(responses, lang);
  }
};
