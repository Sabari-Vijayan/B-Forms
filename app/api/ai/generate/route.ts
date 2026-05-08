import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/server/auth";
import { logger } from "@/lib/server/logger";

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { prompt, language } = await req.json();
    if (!prompt) {
       return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const { detectLanguage } = await import("@/lib/server/ai");
    const { FormsGenerator } = await import("@/lib/server/modules/forms/forms.generator");

    const detectedLanguage = language || await detectLanguage(prompt);
    const result = await FormsGenerator.generateForm(prompt, detectedLanguage);

    let rawItems = Array.isArray(result.items) 
      ? result.items 
      : (Array.isArray((result as any).fields) 
        ? (result as any).fields 
        : (Array.isArray((result as any).form?.items) 
          ? (result as any).form?.items 
          : (Array.isArray((result as any).form?.fields) 
            ? (result as any).form?.fields 
            : [])));

    const items = rawItems.map((item: any) => {
      if (item.questionItem) return item;

      const itemId = item.itemId || item.id || Math.random().toString(36).substring(7);
      const title = item.title || item.label || "Untitled Question";
      const description = item.description || item.placeholder || "";
      const required = !!(item.required || item.is_required);
      
      const question: any = {
        questionId: item.questionId || Math.random().toString(36).substring(7),
        required
      };

      const type = (item.type || item.fieldType || "short_text").toLowerCase();
      
      if (type.includes("choice") || type.includes("radio") || type.includes("checkbox") || type.includes("drop")) {
        question.choiceQuestion = {
          type: type.includes("multi") || type.includes("checkbox") ? "CHECKBOX" : "RADIO",
          options: Array.isArray(item.options) ? item.options : (Array.isArray(item.options_json) ? item.options_json : ["Option 1"])
        };
      } else if (type.includes("rating") || type.includes("star")) {
        question.ratingQuestion = { maxRating: 5 };
      } else {
        question.textQuestion = { paragraph: type.includes("long") || type.includes("para") };
      }

      return {
        itemId,
        title,
        description,
        questionItem: { question }
      };
    });

    const formDocument = {
      info: {
        title: result.info?.title || (result as any).title || (result as any).form?.title || "Untitled Form",
        description: result.info?.description || (result as any).description || (result as any).form?.description || ""
      },
      items: items
    };

    const featureImageUrl = result.feature_image_url || (result as any).featureImageUrl || (result as any).form?.featureImageUrl || (result as any).form?.feature_image_url;

    return NextResponse.json({
      form: formDocument,
      detectedLanguage,
      featureImageUrl
    });
  } catch (error: any) {
    logger.error({ error: error.message }, "AI Generation failed");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
