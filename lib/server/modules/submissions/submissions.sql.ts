import { createAdminClient, createSupabaseClient } from "../../supabase";

export const SubmissionsSql = {
  async getSubmissionsByFormId(accessToken: string, formId: string) {
    const supabase = createSupabaseClient(accessToken);
    return await supabase
      .from("submissions")
      .select("*")
      .eq("form_id", formId)
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
