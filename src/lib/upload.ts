// Free file uploads via Cloudinary (unsigned upload preset) — no backend needed.
// Images go up as `image` (CDN + transforms); everything else (e.g. PDFs) as
// `raw`, which sidesteps Cloudinary's default PDF-delivery restriction.

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload `file` and return its public URL. `path` is only used to group uploads
 * into a folder (its first segment, e.g. "skills" or "resume").
 */
export async function uploadFile(path: string, file: File): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local.",
    );
  }

  const resourceType = file.type.startsWith("image/") ? "image" : "raw";
  const folder = path.includes("/") ? path.split("/")[0] : undefined;

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);
  if (folder) form.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
    { method: "POST", body: form },
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Upload failed (${res.status}). ${detail}`);
  }

  const data = (await res.json()) as { secure_url: string };
  return data.secure_url;
}
