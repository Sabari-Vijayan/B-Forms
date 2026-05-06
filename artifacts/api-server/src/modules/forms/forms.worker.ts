import { generateFormFromPrompt, translateFields, detectLanguage } from "../../lib/ai.js";

/**
 * Worker layer for Forms.
 * Handles CPU-intensive or long-running tasks like AI generation and translation.
 */
export const FormsWorker = {
  async generateForm(prompt: string, targetLanguage?: string) {
    // This could be offloaded to a background queue in the future
    return await generateFormFromPrompt(prompt, targetLanguage);
  },

  async translateForm(
    title: string,
    description: string | null | undefined,
    fields: any[],
    targetLanguage: string,
    sourceLanguage: string
  ) {
    return await translateFields(title, description, fields, targetLanguage, sourceLanguage);
  },

  detectLanguage(text: string) {
    return detectLanguage(text);
  }
};
