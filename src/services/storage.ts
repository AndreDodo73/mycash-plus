import { supabase } from "../lib/supabase";

export type StorageBucket = "avatars" | "goals" | "account-logos" | "media";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_MEDIA_BYTES = 50 * 1024 * 1024;

function assertFileAllowed(bucket: StorageBucket, file: File): void {
  const max = bucket === "media" ? MAX_MEDIA_BYTES : MAX_IMAGE_BYTES;
  if (file.size > max) {
    throw new Error(
      `Arquivo muito grande. Máximo: ${Math.round(max / (1024 * 1024))} MB.`,
    );
  }
}

/** Faz upload e devolve URL pública (ou signed para bucket privado `media`). */
export async function uploadFile(
  bucket: StorageBucket,
  userId: string,
  file: File,
  folder = "",
): Promise<string> {
  assertFileAllowed(bucket, file);

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const safeFolder = folder ? `${folder.replace(/\/$/, "")}/` : "";
  const path = `${userId}/${safeFolder}${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });

  if (error) {
    throw error;
  }

  if (bucket === "media") {
    const { data, error: signedError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 60 * 60 * 24 * 7);
    if (signedError) throw signedError;
    return data.signedUrl;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/** Converte data URL (base64) em File e sobe para o Storage. */
export async function uploadDataUrl(
  bucket: StorageBucket,
  userId: string,
  dataUrl: string,
  fileName = "upload.png",
): Promise<string> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const file = new File([blob], fileName, { type: blob.type || "image/png" });
  return uploadFile(bucket, userId, file);
}
