import { createAdminClient, createSupabaseClient } from "../../lib/supabase.js";

export const TemplatesSql = {
  async listTemplates(category?: string) {
    const admin = createAdminClient();
    let query = admin.from("form_templates").select("id, form_id, user_id, title, description, feature_image_url, category, is_public, use_count, fields_json, created_at").eq("is_public", true);
    if (category && category !== "all") {
      query = query.eq("category", category);
    }
    return await query.order("use_count", { ascending: false });
  },

  async getTemplateById(id: string) {
    const admin = createAdminClient();
    return await admin.from("form_templates").select("id, form_id, user_id, title, description, feature_image_url, category, is_public, use_count, fields_json, created_at").eq("id", id).single();
  },

  async getTemplateByFormId(formId: string) {
    const admin = createAdminClient();
    return await admin.from("form_templates").select("id, form_id, user_id, title, description, feature_image_url, category, is_public, use_count, fields_json, created_at").eq("form_id", formId).single();
  },

  async upsertTemplate(data: any) {
    const admin = createAdminClient();
    return await admin.from("form_templates").upsert(data, { onConflict: "form_id" }).select().single();
  },

  async deleteTemplateByFormId(formId: string) {
    const admin = createAdminClient();
    return await admin.from("form_templates").delete().eq("form_id", formId);
  },

  async incrementUseCount(id: string) {
    const admin = createAdminClient();
    // Using RPC for atomic increment
    return await admin.rpc("increment_template_use_count", { template_id: id });
  }
};
