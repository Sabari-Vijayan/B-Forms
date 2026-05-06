import { createAdminClient, createSupabaseClient } from "../../lib/supabase.js";

/**
 * SQL layer for Forms. 
 * Handles all direct database interactions.
 */
export const FormsSql = {
  async getFormsByUserId(userId: string) {
    const admin = createAdminClient();
    return await admin
      .from("forms")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
  },

  async findFormById(id: string) {
    const admin = createAdminClient();
    return await admin
      .from("forms")
      .select("*")
      .eq("id", id)
      .single();
  },

  async findFormBySlug(slug: string) {
    const admin = createAdminClient();
    return await admin
      .from("forms")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();
  },

  async createForm(form: any) {
    const admin = createAdminClient();
    return await admin.from("forms").insert(form).select().single();
  },

  async updateForm(id: string, userId: string, updates: any) {
    const admin = createAdminClient();
    return await admin
      .from("forms")
      .update(updates)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();
  },

  async deleteForm(id: string, userId: string) {
    const admin = createAdminClient();
    return await admin
      .from("forms")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
  },

  async saveTranslation(formId: string, language: string, translationsJson: any) {
    const admin = createAdminClient();
    return await admin.from("form_translations").upsert({
      form_id: formId,
      language,
      translations_json: translationsJson,
      generated_at: new Date().toISOString()
    }, {
      onConflict: "form_id, language"
    });
  }
};
