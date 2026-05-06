import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  hi: "Hindi",
  ml: "Malayalam",
  ta: "Tamil",
  ar: "Arabic",
  zh: "Chinese",
  pt: "Portuguese",
  ja: "Japanese",
  ko: "Korean",
};

const GENERATE_SYSTEM_PROMPT = `You are a form designer. Given a user's prompt, generate a form in JSON.

Return ONLY valid JSON matching this exact schema:
{
  "title": "string",
  "description": "string (optional)",
  "feature_image_url": "string (optional, suggest a relevant Unsplash URL)",
  "fields": [
    {
      "label": "string",
      "field_type": "short_text" | "long_text" | "single_choice" | "multi_choice" | "rating" | "date" | "email" | "phone",
      "placeholder": "string (optional)",
      "is_required": boolean,
      "options": ["string"]
    }
  ]
}

Rules:
- Generate 3-10 fields appropriate to the prompt.
- Use single_choice or multi_choice for questions with discrete answers; include meaningful options.
- Use rating for satisfaction or scale questions (options: ["1","2","3","4","5"]).
- Use email field type for email address questions.
- The title and all labels must be in the same language as the user's prompt.
- Do not add any explanation. Return only JSON.`;

export interface AIGeneratedField {
  label: string;
  field_type: string;
  placeholder?: string;
  is_required: boolean;
  options?: string[];
}

export interface AIGeneratedForm {
  title: string;
  description?: string;
  feature_image_url?: string;
  fields: AIGeneratedField[];
}

export async function generateFormFromPrompt(prompt: string, targetLanguageCode?: string): Promise<AIGeneratedForm> {
  const targetLanguage = targetLanguageCode ? LANGUAGE_MAP[targetLanguageCode] || targetLanguageCode : null;
  
  const systemInstruction = targetLanguage
    ? GENERATE_SYSTEM_PROMPT.replace(
        "- The title and all labels must be in the same language as the user's prompt.",
        `- You MUST generate the title, description, labels, placeholders, and all option values in ${targetLanguage} language, regardless of the language the prompt is written in. Do not mix languages.`
      )
    : GENERATE_SYSTEM_PROMPT;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: { responseMimeType: "application/json" },
    systemInstruction,
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  // Ensure field_type matches expected enum
  if (parsed.fields) {
    parsed.fields = parsed.fields.map((f: any) => ({
      ...f,
      field_type: f.field_type?.replace(" ", "_").toLowerCase() || "short_text"
    }));
  }

  return parsed as AIGeneratedForm;
}

export async function translateFields(
  formTitle: string,
  formDescription: string | null | undefined,
  fields: Array<{ id: string; label: string; placeholder?: string | null; options?: string[] | null }>,
  targetLanguageCode: string,
  sourceLanguageCode: string
): Promise<Record<string, string>> {
  const targetLanguage = LANGUAGE_MAP[targetLanguageCode] || targetLanguageCode;
  const sourceLanguage = LANGUAGE_MAP[sourceLanguageCode] || sourceLanguageCode;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: { responseMimeType: "application/json" },
  });

  // Build a flat key→value map of every string that needs translation.
  // The frontend reads exactly these keys from translationsJson.
  const input: Record<string, string> = {
    title: formTitle,
    submitButton: "Submit",
    thankYouTitle: "Thank you!",
    thankYouMessage: "Your response has been recorded.",
  };
  if (formDescription) {
    input.description = formDescription;
  }
  for (const f of fields) {
    input[`field_${f.id}_label`] = f.label;
    if (f.placeholder) input[`field_${f.id}_placeholder`] = f.placeholder;
    if (f.options) {
      f.options.forEach((opt, i) => {
        input[`field_${f.id}_option_${i}`] = opt;
      });
    }
  }

  const prompt = `Translate all values in the following JSON object from "${sourceLanguage}" to "${targetLanguage}".
Keep every key exactly as-is. Only translate the string values. Preserve tone and formality.
Return ONLY valid JSON with the same keys.

${JSON.stringify(input, null, 2)}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text) as Record<string, string>;
  } catch {
    throw new Error(`Translation to ${targetLanguage} returned invalid JSON`);
  }
}

export async function translateResponse(
  responses: Record<string, unknown>,
  fromLanguageCode: string,
  toLanguageCode: string
): Promise<Record<string, unknown>> {
  if (fromLanguageCode === toLanguageCode) return responses;

  const fromLanguage = LANGUAGE_MAP[fromLanguageCode] || fromLanguageCode;
  const toLanguage = LANGUAGE_MAP[toLanguageCode] || toLanguageCode;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: { responseMimeType: "application/json" },
  });

  const prompt = `Translate the values in the following JSON object from "${fromLanguage}" to "${toLanguage}".
Do not translate the keys.
Rules:
- If a value is a string, translate it.
- If a value is an array of strings, translate each string in the array.
- Leave numbers, booleans, and null values exactly as they are.
- Preserve the exact JSON structure.
Return only valid JSON.

Input:
${JSON.stringify(responses, null, 2)}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text);
  } catch {
    return responses;
  }
}

export async function generateSentimentSummary(
  formTitle: string,
  submissions: Array<{ respondentLanguage: string; responses: Record<string, unknown> }>,
  fields: Array<{ id: string; label: string }>
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
  });

  const prompt = `You are an expert data analyst. I will provide you with a list of responses to a form titled "${formTitle}".
Analyze the overall sentiment and provide a concise, professional summary (2-3 paragraphs).
Focus on:
1. The general tone of the feedback.
2. Key positive points or common complaints.
3. Notable patterns across different languages if applicable.

Format the output in professional, empathetic language. Do not use markdown headers, just plain text with paragraphs.

Data:
${JSON.stringify(submissions.slice(0, 50), null, 2)}
Fields:
${JSON.stringify(fields, null, 2)}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function analyzeSentiment(
  responses: Record<string, unknown>,
  languageCode: string
): Promise<Record<string, string>> {
  const language = LANGUAGE_MAP[languageCode] || languageCode;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: { responseMimeType: "application/json" },
  });

  const prompt = `Analyze the sentiment of each text value in the following JSON object.
The text is in "${language}".
For each key, provide a sentiment label: "positive", "neutral", "negative", or "mixed".
If a value is not text (like a number or choice), return "neutral".
Return only valid JSON where the keys match the input and values are the sentiment labels.

Input:
${JSON.stringify(responses, null, 2)}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export function detectLanguage(text: string): string {
  const lower = text.toLowerCase();
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  if (/[\u0D00-\u0D7F]/.test(text)) return "ml";
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta";
  if (/[\u0600-\u06FF]/.test(text)) return "ar";
  if (/[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/.test(text)) {
    return /[\u3040-\u309F\u30A0-\u30FF]/.test(text) ? "ja" : "zh";
  }
  if (/[\uAC00-\uD7AF]/.test(text)) return "ko";
  if (/\b(el|la|los|las|un|una|es|son|para|con|del|que)\b/.test(lower)) return "es";
  if (/\b(le|la|les|un|une|des|est|sont|avec|pour)\b/.test(lower)) return "fr";
  if (/\b(der|die|das|ein|eine|ist|sind|für|mit)\b/.test(lower)) return "de";
  if (/\b(você|está|estão|isso|esse|essa|uma|são|para|também|não|mas|cuando)\b/.test(lower)) return "pt";
  return "en";
}


