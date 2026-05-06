import { createAdminClient, createSupabaseClient } from "../../lib/supabase.js";

export const FieldsSql = {
  async getFieldsByFormId(accessToken: string, formId: string) {
    const supabase = createSupabaseClient(accessToken);
    return await supabase
      .from("form_fields")
      .select("*")
      .eq("form_id", formId)
      .order("order_index", { ascending: true });
  },

  async createField(accessToken: string, field: any) {
    const supabase = createSupabaseClient(accessToken);
    return await supabase.from("form_fields").insert(field).select().single();
  },

  async updateField(accessToken: string, id: string, formId: string, updates: any) {
    const supabase = createSupabaseClient(accessToken);
    return await supabase
      .from("form_fields")
      .update(updates)
      .eq("id", id)
      .eq("form_id", formId)
      .select()
      .single();
  },

  async deleteField(accessToken: string, id: string, formId: string) {
    const supabase = createSupabaseClient(accessToken);
    return await supabase
      .from("form_fields")
      .delete()
      .eq("id", id)
      .eq("form_id", formId);
  },

  async reorderFields(accessToken: string, formId: string, fieldOrders: { id: string, order_index: number }[]) {
    const supabase = createSupabaseClient(accessToken);
    // In a real app, use a RPC call or a batch update
    for (const item of fieldOrders) {
      await supabase
        .from("form_fields")
        .update({ order_index: item.order_index })
        .eq("id", item.id)
        .eq("form_id", formId);
    }
  }
};
