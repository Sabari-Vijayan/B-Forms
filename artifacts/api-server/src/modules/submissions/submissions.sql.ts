import { createAdminClient, createSupabaseClient } from "../../lib/supabase.js";

export const SubmissionsSql = {
  async getSubmissionsByFormId(accessToken: string, formId: string) {
    const supabase = createSupabaseClient(accessToken);
    return await supabase
      .from("submissions")
      .select("*")
      .eq("form_id", formId)
      .order("submitted_at", { ascending: false });
  },

  async getSubmissionsByFormIds(accessToken: string, formIds: string[]) {
    const supabase = createSupabaseClient(accessToken);
    return await supabase
      .from("submissions")
      .select("*")
      .in("form_id", formIds)
      .order("submitted_at", { ascending: false });
  },

  async createSubmission(submission: any) {
    const admin = createAdminClient();
    return await admin.from("submissions").insert(submission).select().single();
  },

  async updateSubmission(id: string, updates: any) {
    const admin = createAdminClient();
    return await admin.from("submissions").update(updates).eq("id", id).select().single();
  }
};
