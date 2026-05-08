import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/server/supabase";
import { nanoid } from "@/lib/server/nanoid";
import { logger } from "@/lib/server/logger";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const admin = createAdminClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${nanoid()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { data, error } = await admin.storage
      .from("form-attachments")
      .upload(filePath, Buffer.from(await file.arrayBuffer()), {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      logger.error({ error: error.message }, "Storage upload failed");
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: { publicUrl } } = admin.storage
      .from("form-attachments")
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    logger.error({ error: error.message }, "Upload error");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
