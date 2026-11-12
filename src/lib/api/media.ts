import { api } from "./client";

export type MediaScope =
  | "USER_AVATAR"
  | "BUSINESS_LOGO"
  | "SERVICE_IMAGE"
  | "EMPLOYEE_AVATAR";

export interface MediaUploadResponse {
  id: string;
  scope: MediaScope;
  storageKey: string;
  url: string;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
}

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Validates file MIME type and size before sending to `POST /api/v1/media/upload`.
 * Returns a localized Portuguese error message or `null` when valid.
 */
export function validateImageFile(file: File): string | null {
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type as (typeof ALLOWED_IMAGE_TYPES)[number],
    )
  ) {
    return "Formato inválido. Escolha uma imagem JPEG, PNG ou WebP.";
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "A imagem excede o limite máximo de 5 MB.";
  }

  return null;
}

/**
 * Uploads a validated image file to the unified media endpoint.
 * Injects `X-Business-Id` automatically for business-scoped media.
 */
export async function uploadMediaFile(
  file: File,
  scope: MediaScope,
): Promise<MediaUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("scope", scope);

  return api.post<MediaUploadResponse>("/api/v1/media/upload", formData, {
    tenant: scope !== "USER_AVATAR",
  });
}

