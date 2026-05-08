import { TemplatesSql } from "./templates.sql";
import { FormsSql } from "../forms/forms.sql";
import { generateSlug } from "../../nanoid";

export const TemplatesService = {
  async getPublicTemplates(category?: string) {
    const { data, error } = await TemplatesSql.listTemplates(category);
    if (error) throw error;
    return data;
  },

  async useTemplate(templateId: string, userId: string) {
    const { data: template, error: tError } = await TemplatesSql.getTemplateById(templateId);
    if (tError) throw tError;

    const slug = generateSlug();
    const { data: form, error: fError } = await FormsSql.createForm({
      user_id: userId,
      title: template.title,
      description: template.description,
      feature_image_url: template.feature_image_url,
      slug,
      original_language: "en",
      status: "draft",
      document_json: template.document_json,
    });

    if (fError) throw fError;

    await TemplatesSql.incrementUseCount(templateId);
    return form;
  },

  async publishAsTemplate(formId: string, userId: string, templateData: any) {
    const { data: form, error: fError } = await FormsSql.findFormById(formId);
    if (fError || form.user_id !== userId) throw new Error("Unauthorized");

    return await TemplatesSql.upsertTemplate({
      form_id: formId,
      user_id: userId,
      title: templateData.title,
      description: templateData.description,
      feature_image_url: templateData.feature_image_url,
      category: templateData.category,
      is_public: templateData.is_public,
      document_json: form.document_json
    });
  }
};
