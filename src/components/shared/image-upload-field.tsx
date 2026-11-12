"use client";

import * as React from "react";
import { ImagePlus, Loader2, RefreshCw, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";
import {
  type MediaScope,
  uploadMediaFile,
  validateImageFile,
} from "@/lib/api/media";

export interface ImageUploadFieldProps {
  scope: MediaScope;
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  description?: string;
  aspect?: "square" | "video" | "avatar";
  disabled?: boolean;
  className?: string;
}

export function ImageUploadField({
  scope,
  value,
  onChange,
  label,
  description = "JPEG, PNG ou WebP até 5 MB",
  aspect = "square",
  disabled = false,
  className,
}: ImageUploadFieldProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [localPreview, setLocalPreview] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const previewSrc = localPreview ?? value ?? null;

  const handleTriggerSelect = () => {
    if (disabled || isUploading) return;
    inputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    // Reset input value so picking the same file again triggers onChange
    event.target.value = "";
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setErrorMessage(validationError);
      toast.error(validationError);
      return;
    }

    setErrorMessage(null);
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setIsUploading(true);

    try {
      const response = await uploadMediaFile(file, scope);
      onChange(response.url);
      setLocalPreview(null);
      toast.success("Imagem carregada com sucesso.");
    } catch (error) {
      setLocalPreview(null);
      const message =
        error instanceof ApiError
          ? error.problem.detail || error.message
          : "Não foi possível carregar a imagem. Tente novamente.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    if (disabled || isUploading) return;
    setErrorMessage(null);
    setLocalPreview(null);
    onChange(null);
  };

  const previewShapeClass =
    aspect === "avatar"
      ? "h-20 w-20 rounded-full"
      : aspect === "video"
        ? "h-24 w-36 rounded-xl"
        : "h-20 w-20 rounded-2xl";

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <label className="block text-sm font-medium text-slate-900">
          {label}
        </label>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5">
        <button
          type="button"
          onClick={handleTriggerSelect}
          disabled={disabled || isUploading}
          aria-label={previewSrc ? "Substituir imagem" : "Selecionar imagem"}
          className={cn(
            "relative flex shrink-0 items-center justify-center overflow-hidden border border-dashed border-slate-300 bg-white text-slate-400 transition hover:border-teal-500 hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-60",
            previewShapeClass,
          )}
        >
          {previewSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewSrc}
              alt={label ?? "Pré-visualização da imagem"}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImagePlus className="h-6 w-6" />
          )}

          {isUploading ? (
            <span className="absolute inset-0 flex items-center justify-center bg-slate-900/50 text-white">
              <Loader2 className="h-5 w-5 animate-spin" />
            </span>
          ) : null}
        </button>

        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-xs text-slate-500">{description}</p>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTriggerSelect}
              disabled={disabled || isUploading}
              className="min-h-[44px] rounded-xl border-slate-200 bg-white px-3.5 text-slate-700 hover:bg-slate-100"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  A enviar...
                </>
              ) : previewSrc ? (
                <>
                  <RefreshCw className="mr-1.5 h-4 w-4" />
                  Substituir
                </>
              ) : (
                <>
                  <Upload className="mr-1.5 h-4 w-4" />
                  Carregar foto
                </>
              )}
            </Button>

            {previewSrc && !isUploading ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={disabled}
                aria-label="Remover imagem"
                className="min-h-[44px] rounded-xl px-3 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                Remover
              </Button>
            ) : null}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {errorMessage ? (
        <p className="text-xs font-medium text-rose-600" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
