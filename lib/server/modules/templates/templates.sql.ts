import { createAdminClient } from "../../supabase";

export const TemplatesSql = {
  async listTemplates(category?: string) {
    const admin = createAdminClient();
    let query = admin.from("form_templates").select("*").eq("is_public", true);
    if (category && category !== "all") {
      query = query.eq("category", category);
    }
    return await query.order("use_count", { ascending: false });
  },

  async getTemplateById(id: string) {
    const admin = createAdminClient();
    return await admin.from("form_templates").select("*").eq("id", id).single();
  },

  async upsertTemplate(data: any) {
    const admin = createAdminClient();
    return await admin.from("form_templates").upsert(data, { onConflict: "form_id" }).select().single();
  },

  async incrementUseCount(id: string) {
    const admin = createAdminClient();
    return await admin.rpc("increment_template_use_count", { template_id: id });
  }
};
