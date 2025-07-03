import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { useState } from "react";
import { useDeleteThumbnail } from "@/hooks/storage/useStorage";

interface UploadFileInputProps {
  label: string;
  error: FieldError | undefined;
  id: string;
  register: UseFormRegisterReturn;
  accept?: string;
  helperText?: string;
  previewUrl?: string;
  onImageRemoved?: () => void;
  existingImageUrl?: string;
  featuredImageId?: string;
}

export default function UploadFileInput({
  label,
  id,
  register,
  accept,
  helperText,
  error,
  previewUrl,
  onImageRemoved,
  featuredImageId,
}: UploadFileInputProps) {
  const { mutate: deleteThumbnail, isPending } = useDeleteThumbnail();

  const [imageUrl, setImageUrl] = useState(previewUrl);
  const [isNewImage, setIsNewImage] = useState(false);

  const handleRemove = () => {
    if (!imageUrl) return;

    if (isNewImage && featuredImageId) {
      deleteThumbnail(featuredImageId, {
        onSuccess: () => {
          setImageUrl(undefined);
          setIsNewImage(false);
          onImageRemoved?.();
        },
        onError: (error) => {
          console.error("Failed to delete thumbnail:", error);
          setImageUrl(undefined);
          setIsNewImage(false);
          onImageRemoved?.();
        },
      });
    } else {
      setIsNewImage(false);
      setImageUrl(undefined);
      onImageRemoved?.();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
      setIsNewImage(true)
      register.onChange({
        target: {
          name: register.name,
          value: file,
        },
      });
    }
  };

  return (
    <div>
      <Label
        htmlFor={id}
        className="text-foreground mb-1 block text-2xl font-semibold tracking-wide"
      >
        {label}
      </Label>
      <Input
        id={id}
        accept={accept}
        type="file"
        onChange={handleFileChange}
        className="mt-1 text-base tracking-wider file:mr-4 file:rounded-md file:border-0 file:bg-gray-50 file:px-4 file:font-medium hover:file:bg-gray-100 dark:file:bg-gray-600"
      />
      <h3 className="my-3 text-xl font-bold">Preview:</h3>
      {imageUrl && (
        <div className="mt-2 flex items-center gap-4">
          <img
            src={imageUrl}
            alt="Thumbnail Preview"
            className="h-30 rounded border object-cover"
          />
          <button
            type="button"
            className="text-sm text-red-500 hover:underline disabled:opacity-50"
            onClick={handleRemove}
            disabled={isPending}
          >
            {isPending ? "Removing..." : "Remove"}
          </button>
        </div>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
