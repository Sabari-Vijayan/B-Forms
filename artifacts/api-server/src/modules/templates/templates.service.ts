import { TemplatesSql } from "./templates.sql.js";
import { FormsSql } from "../forms/forms.sql.js";
import { FieldsSql } from "../fields/fields.sql.js";
import { generateSlug } from "../../lib/nanoid.js";

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
      original_language: "en", // Default for templates
      status: "draft",
    });

    if (fError) throw fError;

    // Copy fields (fields are stored as JSON in template for simplicity in this MVP)
    const fields = template.fields_json || [];
    for (const [idx, f] of fields.entries()) {
      await FieldsSql.createField(null as any, { // Admin bypass
        form_id: form.id,
        field_type: f.field_type,
        label: f.label,
        placeholder: f.placeholder,
        is_required: f.is_required,
        options_json: f.options_json,
        order_index: idx
      });
    }

    await TemplatesSql.incrementUseCount(templateId);
    return form;
  },

  async publishAsTemplate(formId: string, userId: string, templateData: any) {
    // Verify ownership
    const { data: form, error: fError } = await FormsSql.findFormById(null as any, formId);
    if (fError || form.user_id !== userId) throw new Error("Unauthorized");

    // Get fields to embed in template
    const { data: fields } = await FieldsSql.getFieldsByFormId(null as any, formId);

    return await TemplatesSql.upsertTemplate({
      form_id: formId,
      title: templateData.title,
      description: templateData.description,
      feature_image_url: templateData.feature_image_url,
      category: templateData.category,
      is_public: templateData.is_public,
      fields_json: fields
    });
  }
};
