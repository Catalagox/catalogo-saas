import { NextResponse } from "next/server";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // optimizar imagen
    const optimizedImage = await sharp(buffer)
      .resize(800)
      .jpeg({ quality: 70 })
      .toBuffer();

    const fileName = `${crypto.randomUUID()}.jpg`;
    const filePath = `${userId}/${fileName}`;

    const { error } = await supabase.storage
      .from("productos")
      .upload(filePath, optimizedImage, {
        contentType: "image/jpeg",
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabase.storage
      .from("productos")
      .getPublicUrl(filePath);

    return NextResponse.json({ url: data.publicUrl });

  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}