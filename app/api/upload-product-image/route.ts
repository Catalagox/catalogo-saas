
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

const LIMITE_BASIC = 70;

export async function POST(req: Request) {
  try {
    // 1. Validar el token de la sesión.
    const authorization = req.headers.get("authorization");
    const token = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;

    if (!token) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para subir imágenes." },
        { status: 401 }
      );
    }

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Tu sesión no es válida o ha expirado." },
        { status: 401 }
      );
    }

    // 2. Recibir los datos.
    const formData = await req.formData();
    const file = formData.get("file");
    const catalogoId = formData.get("catalogoId");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No se recibió una imagen válida." },
        { status: 400 }
      );
    }

    if (typeof catalogoId !== "string" || !catalogoId.trim()) {
      return NextResponse.json(
        { error: "No se identificó el catálogo." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "El archivo seleccionado no es una imagen." },
        { status: 400 }
      );
    }

    // 3. Comprobar que el catálogo pertenece al usuario.
    const { data: catalogo, error: catalogoError } =
      await supabaseAdmin
        .from("catalogos")
        .select("id, user_id, suscripcion_activa, plan_tipo")
        .eq("id", catalogoId)
        .eq("user_id", user.id)
        .single();

    if (catalogoError || !catalogo) {
      return NextResponse.json(
        { error: "No tienes permiso para modificar este catálogo." },
        { status: 403 }
      );
    }

    if (!catalogo.suscripcion_activa) {
      return NextResponse.json(
        {
          error:
            "Tu suscripción está vencida. Renueva tu plan para seguir agregando productos.",
        },
        { status: 403 }
      );
    }

    // 4. Aplicar el límite exclusivamente al plan Basic.
    // Los planes antiguos con plan_tipo NULL conservan el acceso
    // sin límite para no perjudicar a clientes existentes.
    if (catalogo.plan_tipo === "basic") {
      const { count, error: countError } = await supabaseAdmin
        .from("productos")
        .select("id", { count: "exact", head: true })
        .eq("catalogo_id", catalogoId)
        .not("imagen_url", "is", null);

      if (countError) {
        console.error("Error contando imágenes:", countError);

        return NextResponse.json(
          { error: "No pudimos comprobar el límite de imágenes." },
          { status: 500 }
        );
      }

      if ((count ?? 0) >= LIMITE_BASIC) {
        return NextResponse.json(
          {
            code: "IMAGE_LIMIT_REACHED",
            error:
              "Has alcanzado el límite de 70 imágenes de tu plan Basic. Puedes eliminar imágenes existentes o cambiar al plan Pro para seguir agregando productos.",
            limite: LIMITE_BASIC,
            utilizadas: count,
          },
          { status: 403 }
        );
      }
    }

    // 5. Optimizar la imagen en el servidor.
    const buffer = Buffer.from(await file.arrayBuffer());

    const optimizedImage = await sharp(buffer)
      .rotate()
      .resize(800, 800, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 75,
        progressive: true,
      })
      .toBuffer();

    // 6. Guardar la imagen en Storage.
    const fileName = `${crypto.randomUUID()}.jpg`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("productos")
      .upload(filePath, optimizedImage, {
        contentType: "image/jpeg",
        upsert: false,
        cacheControl: "31536000",
      });

    if (uploadError) {
      console.error("Error de Supabase Storage:", uploadError);

      return NextResponse.json(
        { error: "No pudimos guardar la imagen. Inténtalo nuevamente." },
        { status: 500 }
      );
    }

    const { data } = supabaseAdmin.storage
      .from("productos")
      .getPublicUrl(filePath);

    return NextResponse.json({
      url: data.publicUrl,
      filePath,
    });
  } catch (error) {
    console.error("Error crítico en API de imágenes:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Fallo en el servidor al procesar la imagen.",
      },
      { status: 500 }
    );
  }
}
