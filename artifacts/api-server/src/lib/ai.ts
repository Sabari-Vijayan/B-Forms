import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const GENERATE_SYSTEM_PROMPT = `You are a form designer. Given a user's prompt, generate a form in JSON.

Return ONLY valid JSON matching this exact schema:
{
  "title": "string",
  "description": "string (optional)",
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
  fields: AIGeneratedField[];
}

export async function generateFormFromPrompt(prompt: string): Promise<AIGeneratedForm> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    generationConfig: { responseMimeType: "application/json" },
    systemInstruction: GENERATE_SYSTEM_PROMPT,
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  return parsed as AIGeneratedForm;
}

export async function translateFields(
  fields: Array<{ id: string; label: string; placeholder?: string | null; options?: string[] | null }>,
  targetLanguage: string,
  sourceLanguage: string
): Promise<Record<string, { label: string; placeholder?: string; options?: string[] }>> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    generationConfig: { responseMimeType: "application/json" },
  });

  const fieldData = fields.map((f) => ({
    id: f.id,
    label: f.label,
    placeholder: f.placeholder,
    options: f.options,
  }));

  const prompt = `Translate the following form field data from "${sourceLanguage}" to "${targetLanguage}".
Return ONLY a JSON object where each key is the field id and the value has the translated label, placeholder (if present), and options array (if present).
Do not translate the keys. Preserve tone and formality. Return only JSON.

Input:
${JSON.stringify(fieldData, null, 2)}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Translation to ${targetLanguage} returned invalid JSON`);
  }
}

export async function translateResponse(
  responses: Record<string, unknown>,
  fromLanguage: string,
  toLanguage: string
): Promise<Record<string, unknown>> {
  if (fromLanguage === toLanguage) return responses;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    generationConfig: { responseMimeType: "application/json" },
  });

  const prompt = `Translate the values in the following JSON object from "${fromLanguage}" to "${toLanguage}".
Do not translate the keys. Only translate string values. Leave non-string values (numbers, booleans) unchanged.
Return only JSON.

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
  if (/\b(o|a|os|as|um|uma|é|são|para|com)\b/.test(lower)) return "pt";
  return "en";
}
