const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

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

async function callNvidia(messages: any[], jsonMode = false) {
  if (!NVIDIA_API_KEY) {
    throw new Error("NVIDIA_API_KEY is not configured");
  }

  const response = await fetch(INVOKE_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NVIDIA_API_KEY}`,
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "moonshotai/kimi-k2.6",
      messages,
      max_tokens: 16384,
      temperature: 0.7,
      top_p: 1.0,
      stream: false,
      ...(jsonMode && { response_format: { type: "json_object" } })
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`NVIDIA API Error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  return result.choices[0].message.content;
}

const GENERATE_SYSTEM_PROMPT = `You are a form designer. Given a user's prompt, generate a form in a hierarchical JSON document model similar to Google Forms.

Return ONLY valid JSON matching this exact schema:
{
  "info": {
    "title": "string",
    "description": "string (optional)"
  },
  "items": [
    {
      "itemId": "uuid (random)",
      "title": "string (question label or header)",
      "description": "string (placeholder or paragraph content - optional)",
      "questionItem": {
        "question": {
          "questionId": "uuid (random)",
          "required": boolean,
          "choiceQuestion": { 
             "type": "RADIO" | "CHECKBOX" | "DROP_DOWN",
             "options": ["string"] 
          },
          "textQuestion": { "paragraph": boolean },
          "ratingQuestion": { "maxRating": 5 },
          "fileQuestion": { "maxFiles": 1, "acceptedTypes": ["image/*"] }
        }
      }
    }
  ],
  "feature_image_url": "string (suggest a relevant Unsplash URL)"
}

CRITICAL RULES:
- If an item is purely informational (like a section header or a paragraph of text), omit the "questionItem" property.
- Use the key "items" for questions and content blocks. NEVER use "fields".
- Always nest question details inside questionItem.question.
- Ensure all IDs are valid random UUIDs.
- Return ONLY the JSON object. No markdown, no explanation.
- Generate 3-10 items appropriate to the prompt.
- Use choiceQuestion for questions with discrete answers (type: RADIO for single, CHECKBOX for multi).
- Use textQuestion for short answer (paragraph: false) or long answer (paragraph: true).
- Use ratingQuestion for satisfaction or scale questions.
- Use fileQuestion for image or document uploads.
- The title, description, and all item titles/descriptions must be in the same language as specified.
- DO NOT mix English characters/words with the target language script. Never combine a native script character with English letters in a single word (e.g., avoid "സencus" - it must be fully translated or properly transliterated like "സെൻസസ്").
- Do not add any explanation. Return only JSON.`;

export interface AIGeneratedForm {
  info: {
    title: string;
    description?: string;
  };
  items: any[];
  feature_image_url?: string;
}

export async function generateFormFromPrompt(prompt: string, targetLanguageCode?: string): Promise<AIGeneratedForm> {
  const targetLanguage = targetLanguageCode ? LANGUAGE_MAP[targetLanguageCode] || targetLanguageCode : "English";
  
  const systemInstruction = `${GENERATE_SYSTEM_PROMPT}\n\nYou MUST generate all text content in ${targetLanguage} language.`;

  const content = await callNvidia([
    { role: "system", content: systemInstruction },
    { role: "user", content: prompt }
  ], true);

  try {
    return JSON.parse(content) as AIGeneratedForm;
  } catch {
    // Attempt to extract JSON if the model included markers
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as AIGeneratedForm;
    }
    throw new Error("AI returned invalid JSON");
  }
}

export async function translateFields(
  formTitle: string,
  formDescription: string | null | undefined,
  items: any[],
  targetLanguageCode: string,
  sourceLanguageCode: string
): Promise<Record<string, string>> {
  const targetLanguage = LANGUAGE_MAP[targetLanguageCode] || targetLanguageCode;
  const sourceLanguage = LANGUAGE_MAP[sourceLanguageCode] || sourceLanguageCode;

  const input: Record<string, string> = {
    title: formTitle,
    submitButton: "Submit",
    thankYouTitle: "Thank you!",
    thankYouMessage: "Your response has been recorded.",
  };
  if (formDescription) {
    input.description = formDescription;
  }

  for (const item of items) {
    input[`item_${item.itemId}_title`] = item.title;
    if (item.description) input[`item_${item.itemId}_description`] = item.description;
    
    const choice = item.questionItem?.question?.choiceQuestion;
    if (choice?.options) {
      choice.options.forEach((opt: string, i: number) => {
        input[`item_${item.itemId}_option_${i}`] = opt;
      });
    }
  }

  const prompt = `Translate all values in the following JSON object from "${sourceLanguage}" to "${targetLanguage}".
Keep every key exactly as-is. Only translate the string values. Preserve tone and formality.
Return ONLY valid JSON with the same keys.

CRITICAL: DO NOT mix English characters/words with the target language script. 
Never combine a native script character with English letters in a single word (e.g., if target is Malayalam, avoid "സencus" - it must be fully translated or properly transliterated).

${JSON.stringify(input, null, 2)}`;

  const content = await callNvidia([
    { role: "system", content: "You are a professional translator. Return only valid JSON." },
    { role: "user", content: prompt }
  ], true);

  try {
    return JSON.parse(content) as Record<string, string>;
  } catch {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as Record<string, string>;
    }
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

  const prompt = `Translate the values in the following JSON object from "${fromLanguage}" to "${toLanguage}".
Do not translate the keys.
Rules:
- If a value is a string, translate it completely and accurately.
- If a value is an array of strings, translate each string in the array.
- Leave numbers, booleans, and null values exactly as they are.
- Preserve the exact JSON structure and keys.
- If the text is already in the target language or is a name/proper noun that shouldn't be translated, keep it as is.
Return only valid JSON.

Input:
${JSON.stringify(responses, null, 2)}`;

  const content = await callNvidia([
    { role: "system", content: "You are a professional translator specialized in form responses. You must return only valid JSON." },
    { role: "user", content: prompt }
  ], true);

  try {
    return JSON.parse(content);
  } catch {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return responses;
  }
}

export async function generateSentimentSummary(
  formTitle: string,
  submissions: Array<{ respondentLanguage: string; responses: Record<string, unknown> }>,
  fields: Array<{ id: string; label: string }>
): Promise<string> {
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

  return await callNvidia([
    { role: "system", content: "You are an expert data analyst." },
    { role: "user", content: prompt }
  ]);
}

export async function analyzeSentiment(
  responses: Record<string, unknown>,
  languageCode: string
): Promise<Record<string, string>> {
  const language = LANGUAGE_MAP[languageCode] || languageCode;

  const prompt = `Analyze the sentiment of each text value in the following JSON object.
The text is in "${language}".
For each key, provide a sentiment label: "positive", "neutral", "negative", or "mixed".
If a value is not text (like a number or choice), return "neutral".
Return only valid JSON where the keys match the input and values are the sentiment labels.

Input:
${JSON.stringify(responses, null, 2)}`;

  const content = await callNvidia([
    { role: "system", content: "You are a sentiment analysis expert. Return only valid JSON." },
    { role: "user", content: prompt }
  ], true);

  try {
    return JSON.parse(content);
  } catch {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {};
  }
}

export async function detectLanguage(text: string): Promise<string> {
  const prompt = `Identify the ISO 639-1 language code (e.g., "en", "ml", "es", "hi") of the following text.
Return ONLY the two-letter language code. No explanation.

Text: ${text}`;

  try {
    const content = await callNvidia([
      { role: "system", content: "You are a language detection expert. Return only the ISO code." },
      { role: "user", content: prompt }
    ]);
    
    const code = content.trim().toLowerCase().substring(0, 2);
    // Fallback to English if the code is invalid or not in our map
    return LANGUAGE_MAP[code] ? code : "en";
  } catch (err) {
    console.error("Language detection failed, falling back to English:", err);
    return "en";
  }
}
