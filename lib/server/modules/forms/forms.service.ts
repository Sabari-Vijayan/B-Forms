import { FormsSql } from "./forms.sql";
import { generateSlug } from "../../nanoid";

// Simple in-memory cache resistant to HMR in Dev mode
const CACHE_TTL = 30 * 1000; // 30 seconds

interface CachedData {
  data: any;
  timestamp: number;
}

const globalForForms = global as unknown as {
  formsCache: Map<string, CachedData>
};

const cache = globalForForms.formsCache || new Map<string, CachedData>();

if (process.env.NODE_ENV !== "production") {
  globalForForms.formsCache = cache;
}

function getCache(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

function invalidateCache(userId: string, formId?: string) {
  // Invalidate dashboard and list
  cache.delete(`dashboard:${userId}`);
  cache.delete(`forms:${userId}`);
  if (formId) {
    cache.delete(`form:${formId}`);
  }
}

export const FormsService = {
  async generateFormSentimentSummary(accessToken: string, formId: string) {
    const { data: form } = await FormsSql.findFormById(formId);
    if (!form) throw new Error("Form not found");

    // In a real implementation, you'd fetch submissions here
    const submissions: any[] = []; 

    if (!submissions || submissions.length === 0) {
      return "No submissions yet to analyze.";
    }

    const cleanedSubmissions = submissions.map(s => ({
      respondentLanguage: s.respondent_language,
      responses: s.translated_responses_json || s.raw_responses_json
    }));

    const document = form.document_json;
    const cleanedFields = (document.items || []).map((item: any) => ({
      id: item.itemId,
      label: item.title
    }));

    // Dynamically import AI logic to keep the main service lean
    const { generateSentimentSummary } = await import("../../ai");
    return await generateSentimentSummary(form.title, cleanedSubmissions, cleanedFields);
  },

  async getUserDashboard(accessToken: string, userId: string) {
    const cacheKey = `forms:${userId}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;

    const { data, error } = await FormsSql.getFormsByUserId(userId);
    if (error) throw error;

    const result = (data || []).map((f) => ({
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

    setCache(cacheKey, result);
    return result;
  },

  async getDashboardSummary(accessToken: string, userId: string) {
    const cacheKey = `dashboard:${userId}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;

    const [{ data: forms }, { data: submissions }] = await Promise.all([
      FormsSql.getFormsByUserId(userId),
      FormsSql.getSubmissionsByUserId(userId)
    ]);

    const formsList = forms || [];
    const subsList = submissions || [];

    // Weekly trend
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const weeklyTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      const count = subsList.filter(s => s.submitted_at.startsWith(dateStr)).length;
      return { date: dateStr, count };
    });

    // Top languages
    const langCounts: Record<string, number> = {};
    subsList.forEach(s => {
      langCounts[s.respondent_language] = (langCounts[s.respondent_language] || 0) + 1;
    });
    const topLanguages = Object.entries(langCounts)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count);

    // Most active form
    const formStats = formsList.map(f => ({
      id: f.id,
      title: f.title,
      responseCount: subsList.filter(s => s.form_id === f.id).length
    })).sort((a, b) => b.responseCount - a.responseCount);

    const result = {
      totalForms: formsList.length,
      publishedForms: formsList.filter(f => f.status === 'published').length,
      draftForms: formsList.filter(f => f.status === 'draft').length,
      totalResponses: subsList.length,
      weeklyTrend,
      topLanguages,
      mostActiveForm: formStats[0] || null
    };

    setCache(cacheKey, result);
    return result;
  },

  async getFormDetail(accessToken: string, id: string, userId: string) {
    const cacheKey = `form:${id}`;
    const cached = getCache(cacheKey);
    if (cached && cached.userId === userId) return { data: cached };

    const { data, error } = await FormsSql.findFormById(id);
    if (error) return { error };
    if (!data || data.user_id !== userId) return { error: new Error("Unauthorized") };

    const result = {
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
      documentJson: data.document_json,
      responseLimit: data.response_limit,
      closesAt: data.closes_at,
      createdAt: data.created_at,
    };

    setCache(cacheKey, result);
    return { data: result };
  },

  async updateForm(accessToken: string, id: string, userId: string, body: any) {
    const { data, error } = await FormsSql.updateForm(id, userId, {
      title: body.title,
      description: body.description,
      document_json: body.documentJson || body.document,
      status: body.status,
      preferred_language: body.preferredLanguage,
      supported_languages: body.supportedLanguages,
      response_limit: body.responseLimit,
      closes_at: body.closesAt,
      feature_image_url: body.featureImageUrl,
    });
    if (error) throw error;
    
    invalidateCache(userId, id);
    return data;
  },

  async deleteForm(accessToken: string, id: string, userId: string) {
    const { error } = await FormsSql.deleteForm(id, userId);
    if (error) throw error;
    
    invalidateCache(userId, id);
  },

  async publishForm(accessToken: string, id: string, userId: string, languages: string[]) {
    const { data: form, error: fetchError } = await FormsSql.findFormById(id);
    if (fetchError || !form) throw new Error("Form not found");

    // 1. Update status and languages
    const { data, error } = await FormsSql.updateForm(id, userId, {
      status: "published",
      supported_languages: languages
    });
    if (error) throw error;

    // 2. Generate translations in the background
    const supportedLangs = languages.filter(l => l !== form.original_language);
    if (supportedLangs.length > 0) {
      // Execute as a detached promise to avoid blocking the main thread
      (async () => {
        try {
          const { FormsGenerator } = await import("./forms.generator");
          for (const lang of supportedLangs) {
            try {
              const translationsJson = await FormsGenerator.translateForm(
                form.title,
                form.description,
                form.document_json.items || [],
                lang,
                form.original_language
              );
              await FormsSql.saveTranslation(id, lang, translationsJson);
            } catch (err) {
              console.error(`Failed to generate translation for ${lang}:`, err);
            }
          }
        } catch (err) {
          console.error("Translation worker encountered a critical error:", err);
        }
      })();
    }
    
    invalidateCache(userId, id);
    return data;
  },

  async duplicateForm(accessToken: string, id: string, userId: string) {
    const { data: original, error: fetchError } = await FormsSql.findFormById(id);
    if (fetchError || !original) throw new Error("Form not found");
    if (original.user_id !== userId) throw new Error("Unauthorized");

    const slug = generateSlug();
    const { data, error } = await FormsSql.createForm({
      user_id: userId,
      slug,
      title: `${original.title} (Copy)`,
      description: original.description,
      document_json: original.document_json,
      status: "draft",
      original_language: original.original_language,
      supported_languages: original.supported_languages,
      feature_image_url: original.feature_image_url,
    });
    if (error) throw error;
    
    invalidateCache(userId);
    return data;
  },

  async createManualForm(accessToken: string, userId: string, body: any) {
    const slug = generateSlug();
    const title = body.title || "Untitled Form";
    const description = body.description || "";
    
    // Use the provided documentJson if available (e.g. from AI generation)
    // otherwise create a default empty one.
    const document_json = body.documentJson || { 
      info: { title, description }, 
      items: [] 
    };

    const { data, error } = await FormsSql.createForm({
      user_id: userId,
      slug,
      title,
      description,
      document_json,
      feature_image_url: body.featureImageUrl || null,
      status: "draft",
      original_language: body.originalLanguage || "en",
    });
    if (error) throw error;
    
    invalidateCache(userId);
    return data;
  },

  async getFormBySlug(slug: string) {
    const { data, error } = await FormsSql.findFormBySlug(slug);
    if (error || !data) return { error };
    
    const result = {
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
      documentJson: data.document_json,
      responseLimit: data.response_limit,
      closesAt: data.closes_at,
      createdAt: data.created_at,
    };
    
    return { data: result };
  }
};
