import { generateFormFromPrompt, translateFields, detectLanguage } from "../../ai";

export const FormsGenerator = {
  async generateForm(prompt: string, targetLanguage?: string) {
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

  async detectLanguage(text: string) {
    return await detectLanguage(text);
  }
};
