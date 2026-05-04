import { NextResponse } from "next/server";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string | null;

    if (!userId || userId === "null" || userId === "undefined") {
      return NextResponse.json(
        { error: "ID de usuario no válido o sesión expirada" },
        { status: 401 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: "No se subió ningún archivo" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const optimizedImage = await sharp(buffer)
      .resize(800, 800, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 75,
        progressive: true,
      })
      .toBuffer();

    const fileName = `${crypto.randomUUID()}.jpg`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("productos")
      .upload(filePath, optimizedImage, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error de Supabase Storage:", uploadError);
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    const { data } = supabaseAdmin.storage
      .from("productos")
      .getPublicUrl(filePath);

    return NextResponse.json({ url: data.publicUrl });
  } catch (error: any) {
    console.error("Error crítico en API:", error);

    return NextResponse.json(
      {
        error: error?.message || "Fallo en el servidor al procesar la imagen",
      },
      { status: 500 }
    );
  }
}