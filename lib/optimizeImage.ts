import sharp from "sharp";

export async function optimizeImage(file: File) {

  const buffer = Buffer.from(await file.arrayBuffer());

  const optimized = await sharp(buffer)
    .resize(800) // ancho máximo
    .jpeg({ quality: 70 })
    .toBuffer();

  return optimized;

}