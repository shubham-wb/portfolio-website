"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadFile } from "@/lib/upload";

/** Reusable image picker: preview + upload/replace/remove, returns a URL. */
export function ImageUpload({
  value,
  onChange,
  folder,
  label = "image",
}: {
  value?: string;
  onChange: (url: string | undefined) => void;
  folder: string;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handle(file: File) {
    setUploading(true);
    setError(null);
    try {
      const url = await uploadFile(`${folder}/${Date.now()}-${file.name}`, file);
      onChange(url);
    } catch {
      setError("Upload failed — check Cloudinary settings.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative h-36 w-full overflow-hidden rounded-md border border-border bg-background">
          <Image src={value} alt="" fill className="object-cover" sizes="400px" />
        </div>
      )}
      <div className="flex items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:bg-card-hover">
          {uploading ? "Uploading…" : value ? `Replace ${label}` : `Upload ${label}`}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handle(f);
            }}
          />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="text-sm text-muted transition-colors hover:text-red-500"
          >
            Remove
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
