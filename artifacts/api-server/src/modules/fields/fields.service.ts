import { FieldsSql } from "./fields.sql.js";
import { FormsSql } from "../forms/forms.sql.js";

export const FieldsService = {
  async listFields(accessToken: string, formId: string, userId: string) {
    // Verify ownership
    const { data: form } = await FormsSql.findFormById(accessToken, formId);
    if (!form || form.user_id !== userId) throw new Error("Unauthorized");

    const { data: fields, error } = await FieldsSql.getFieldsByFormId(accessToken, formId);
    if (error) throw error;

    return (fields || []).map((f) => ({
      id: f.id,
      formId: f.form_id,
      orderIndex: f.order_index,
      fieldType: f.field_type,
      label: f.label,
      placeholder: f.placeholder,
      isRequired: f.is_required,
      optionsJson: f.options_json,
    }));
  },

  async addField(accessToken: string, formId: string, userId: string, fieldData: any) {
    const { data: form } = await FormsSql.findFormById(accessToken, formId);
    if (!form || form.user_id !== userId) throw new Error("Unauthorized");

    const { data, error } = await FieldsSql.createField(accessToken, {
      ...fieldData,
      form_id: formId
    });
    if (error) throw error;
    return data;
  },

  async updateField(accessToken: string, formId: string, fieldId: string, userId: string, updates: any) {
    const { data: form } = await FormsSql.findFormById(accessToken, formId);
    if (!form || form.user_id !== userId) throw new Error("Unauthorized");

    const { data, error } = await FieldsSql.updateField(accessToken, fieldId, formId, updates);
    if (error) throw error;
    return data;
  },

  async deleteField(accessToken: string, formId: string, fieldId: string, userId: string) {
    const { data: form } = await FormsSql.findFormById(accessToken, formId);
    if (!form || form.user_id !== userId) throw new Error("Unauthorized");

    const { error } = await FieldsSql.deleteField(accessToken, fieldId, formId);
    if (error) throw error;
    return true;
  },

  async reorderFields(accessToken: string, formId: string, userId: string, fieldIds: string[]) {
    const { data: form } = await FormsSql.findFormById(accessToken, formId);
    if (!form || form.user_id !== userId) throw new Error("Unauthorized");

    const orders = fieldIds.map((id, index) => ({ id, order_index: index }));
    await FieldsSql.reorderFields(accessToken, formId, orders);
    return true;
  }
};
