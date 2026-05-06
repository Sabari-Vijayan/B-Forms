import { FormsSql } from "./forms.sql.js";
import { FormsWorker } from "./forms.worker.js";
import { generateSlug } from "../../lib/nanoid.js";
import { FieldsSql } from "../fields/fields.sql.js";
import { SubmissionsSql } from "../submissions/submissions.sql.js";
import { generateSentimentSummary } from "../../lib/ai.js";

export const FormsService = {
  // ... (existing methods)

  async generateFormSentimentSummary(accessToken: string, formId: string) {
    const { data: form } = await FormsSql.findFormById(accessToken, formId);
    if (!form) throw new Error("Form not found");

    const { data: fields } = await FieldsSql.getFieldsByFormId(accessToken, formId);
    const { data: submissions } = await SubmissionsSql.getSubmissionsByFormId(accessToken, formId);

    if (!submissions || submissions.length === 0) {
      return "No submissions yet to analyze.";
    }

    const cleanedSubmissions = submissions.map(s => ({
      respondentLanguage: s.respondent_language,
      responses: s.translated_responses_json || s.raw_responses_json
    }));

    const cleanedFields = (fields || []).map(f => ({
      id: f.id,
      label: f.label
    }));

    return await generateSentimentSummary(form.title, cleanedSubmissions, cleanedFields);
  },

  async getUserDashboard(accessToken: string, userId: string) {
    const { data, error } = await FormsSql.getFormsByUserId(accessToken, userId);
    if (error) throw error;

    return (data || []).map((f) => ({
      id: f.id,
      userId: f.user_id,
      title: f.title,
      description: f.description,
      featureImageUrl: f.feature_image_url,
      slug: f.slug,
      originalLanguage: f.original_language,
      preferredLanguage: f.preferred_language ?? null,
      status: f.status,
      supportedLanguages: f.supported_languages || [],
      responseLimit: f.response_limit,
      closesAt: f.closes_at,
      createdAt: f.created_at,
    }));
  },

  async getDashboardSummary(accessToken: string, userId: string) {
    // 1. Get all forms for user
    const { data: forms, error: formsError } = await FormsSql.getFormsByUserId(accessToken, userId);
    if (formsError) throw formsError;

    const totalForms = forms?.length || 0;
    const publishedForms = forms?.filter(f => f.status === "published").length || 0;
    const draftForms = forms?.filter(f => f.status === "draft").length || 0;
    
    // 2. Get all submissions for these forms
    const formIds = forms?.map(f => f.id) || [];
    const { data: submissions, error: subsError } = await SubmissionsSql.getSubmissionsByFormIds(accessToken, formIds);
    if (subsError) throw subsError;

    const totalResponses = submissions?.length || 0;

    // 3. Weekly Trend (last 7 days)
    const today = new Date();
    const weeklyTrend = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      const dateStr = d.toISOString().split("T")[0];
      const count = submissions?.filter(s => s.submitted_at.startsWith(dateStr)).length || 0;
      return { date: dateStr, count };
    });

    // 4. Top Languages
    const langCounts: Record<string, number> = {};
    submissions?.forEach(s => {
      langCounts[s.respondent_language] = (langCounts[s.respondent_language] || 0) + 1;
    });
    const topLanguages = Object.entries(langCounts)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count);

    // 5. Most Active Form
    const formResponseCounts: Record<string, number> = {};
    submissions?.forEach(s => {
      formResponseCounts[s.form_id] = (formResponseCounts[s.form_id] || 0) + 1;
    });
    
    let mostActiveForm = null;
    const mostActiveFormId = Object.entries(formResponseCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0];

    if (mostActiveFormId) {
      const f = forms?.find(form => form.id === mostActiveFormId);
      if (f) {
        mostActiveForm = {
          id: f.id,
          title: f.title,
          responseCount: formResponseCounts[mostActiveFormId]
        };
      }
    }

    // 6. Recent Forms
    const recentForms = (forms || []).slice(0, 5).map(f => ({
      id: f.id,
      userId: f.user_id,
      title: f.title,
      description: f.description,
      featureImageUrl: f.feature_image_url,
      slug: f.slug,
      originalLanguage: f.original_language,
      status: f.status,
      supportedLanguages: f.supported_languages || [],
      createdAt: f.created_at
    }));

    return {
      totalForms,
      publishedForms,
      draftForms,
      totalResponses,
      recentForms,
      weeklyTrend,
      topLanguages,
      mostActiveForm
    };
  },

  async getFormDetail(accessToken: string, formId: string, userId: string) {
    const { data: form, error: fError } = await FormsSql.findFormById(accessToken, formId);
    if (fError || !form || form.user_id !== userId) {
      return { data: null, error: new Error("Form not found") };
    }

    const { data: fields } = await FieldsSql.getFieldsByFormId(accessToken, formId);

    return {
      data: {
        id: form.id,
        userId: form.user_id,
        title: form.title,
        description: form.description,
        featureImageUrl: form.feature_image_url,
        slug: form.slug,
        originalLanguage: form.original_language,
        preferredLanguage: form.preferred_language ?? null,
        status: form.status,
        supportedLanguages: form.supported_languages || [],
        responseLimit: form.response_limit,
        closesAt: form.closes_at,
        createdAt: form.created_at,
        fields: (fields || []).map((f) => ({
          id: f.id,
          formId: f.form_id,
          orderIndex: f.order_index,
          fieldType: f.field_type,
          label: f.label,
          placeholder: f.placeholder,
          isRequired: f.is_required,
          optionsJson: f.options_json,
        })),
      },
      error: null
    };
  },

  async getFormBySlug(slug: string) {
    const { data, error } = await FormsSql.findFormBySlug(slug);
    if (error) return { data: null, error };
    return {
      data: {
        id: data.id,
        originalLanguage: data.original_language,
        preferredLanguage: data.preferred_language ?? null,
        status: data.status,
      },
      error: null
    };
  },

  async createManualForm(accessToken: string, userId: string, body: any) {
    const { title, description, featureImageUrl, originalLanguage, fields } = body;
    const slug = generateSlug();

    const { data: form, error: formError } = await FormsSql.createForm({
      user_id: userId,
      title,
      description,
      feature_image_url: featureImageUrl,
      slug,
      original_language: originalLanguage,
      status: "draft",
    });

    if (formError) throw formError;

    // If fields are provided (e.g. from AI generation), create them
    if (fields && Array.isArray(fields)) {
      for (const f of fields) {
        await FieldsSql.createField(accessToken, {
          form_id: form.id,
          order_index: f.orderIndex ?? 0,
          field_type: f.fieldType,
          label: f.label,
          placeholder: f.placeholder,
          is_required: f.isRequired ?? false,
          options_json: f.optionsJson,
        });
      }
    }

    return form;
  },

  async updateForm(accessToken: string, formId: string, userId: string, updates: any) {
    // Map camelCase to snake_case for the DB
    const dbUpdates: any = { ...updates };
    
    if (updates.featureImageUrl !== undefined) {
      dbUpdates.feature_image_url = updates.featureImageUrl;
      delete dbUpdates.featureImageUrl;
    }
    if (updates.preferredLanguage !== undefined) {
      dbUpdates.preferred_language = updates.preferredLanguage;
      delete dbUpdates.preferredLanguage;
    }
    if (updates.supportedLanguages !== undefined) {
      dbUpdates.supported_languages = updates.supportedLanguages;
      delete dbUpdates.supportedLanguages;
    }
    if (updates.responseLimit !== undefined) {
      dbUpdates.response_limit = updates.responseLimit;
      delete dbUpdates.responseLimit;
    }
    if (updates.closesAt !== undefined) {
      dbUpdates.closes_at = updates.closesAt;
      delete dbUpdates.closesAt;
    }

    const { data, error } = await FormsSql.updateForm(accessToken, formId, userId, dbUpdates);
    if (error) throw error;
    
    // Map back to camelCase for the response
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      featureImageUrl: data.feature_image_url,
      slug: data.slug,
      originalLanguage: data.original_language,
      preferredLanguage: data.preferred_language ?? null,
      status: data.status,
      supportedLanguages: data.supported_languages || [],
      responseLimit: data.response_limit,
      closesAt: data.closes_at,
      createdAt: data.created_at,
    };
  },

  async deleteForm(accessToken: string, formId: string, userId: string) {
    const { error } = await FormsSql.deleteForm(accessToken, formId, userId);
    if (error) throw error;
    return true;
  },

  async duplicateForm(accessToken: string, formId: string, userId: string) {
    const { data: source } = await FormsSql.findFormById(accessToken, formId);
    if (!source || source.user_id !== userId) throw new Error("Form not found");

    const slug = generateSlug();
    const { data: newForm, error: formErr } = await FormsSql.createForm({
      user_id: userId,
      title: `Copy of ${source.title}`,
      description: source.description,
      feature_image_url: source.feature_image_url,
      slug,
      original_language: source.original_language,
      status: "draft",
    });

    if (formErr) throw formErr;

    const sourceFields = source.form_fields || [];
    if (sourceFields.length > 0) {
      for (const f of sourceFields) {
        await FieldsSql.createField(accessToken, {
          form_id: newForm.id,
          order_index: f.order_index,
          field_type: f.field_type,
          label: f.label,
          placeholder: f.placeholder,
          is_required: f.is_required,
          options_json: f.options_json,
        });
      }
    }

    return newForm;
  },

  async publishForm(accessToken: string, formId: string, userId: string, languages: string[]) {
    // 1. Get form and fields
    const { data: form } = await this.getFormDetail(accessToken, formId, userId);
    if (!form) throw new Error("Form not found");

    // 2. Update status and supported languages
    const { data: updatedForm, error: updateError } = await FormsSql.updateForm(accessToken, formId, userId, {
      status: "published",
      supported_languages: languages
    });
    if (updateError) throw updateError;

    // 3. Generate translations in background (simulated here)
    const failedLanguages: string[] = [];
    
    // We do them sequentially for simplicity in this MVP, 
    // but in a real app, this should be a background job.
    for (const lang of languages) {
      if (lang === form.originalLanguage) continue;
      
      try {
        const translations = await FormsWorker.translateForm(
          form.title,
          form.description,
          form.fields.map(f => ({
            id: f.id,
            label: f.label,
            placeholder: f.placeholder,
            options: f.optionsJson
          })),
          lang,
          form.originalLanguage
        );
        await FormsSql.saveTranslation(formId, lang, translations);
      } catch (err) {
        console.error(`Failed to translate form ${formId} to ${lang}:`, err);
        failedLanguages.push(lang);
      }
    }

    return {
      success: true,
      failedLanguages: failedLanguages.length,
      form: {
        ...updatedForm,
        userId: updatedForm.user_id,
        featureImageUrl: updatedForm.feature_image_url,
        supportedLanguages: updatedForm.supported_languages,
        originalLanguage: updatedForm.original_language,
        createdAt: updatedForm.created_at
      }
    };
  }
};
