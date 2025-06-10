import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";

interface UploadFileInputProps {
  label: string;
  error: FieldError | undefined;
  id: string;
  register: UseFormRegisterReturn;
  accept?: string;
  helperText?: string;
}

export default function UploadFileInput({
  label,
  id,
  register,
  accept,
  helperText,
  error,
}: UploadFileInputProps) {
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
        onChange={(e) => {
          const file = e.target.files?.[0];
          register.onChange({
            target: {
              name: register.name,
              value: file,
            },
          });
        }}
        className="mt-1 text-base tracking-wider file:mr-4 file:rounded-md file:border-0 file:bg-gray-50 file:px-4 file:font-medium hover:file:bg-gray-100 dark:file:bg-gray-600"
      />
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
