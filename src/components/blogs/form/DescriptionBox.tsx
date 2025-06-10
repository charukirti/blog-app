import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";

interface DescriptionBoxProps {
  label: string;
  error?: FieldError;
  id: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  rows?: number;
  className?: string;
  helperText?: string;
}

export default function DescriptionBox({
  label,
  error,
  placeholder,
  register,
  rows = 4,
  helperText,
  id,
  className,
}: DescriptionBoxProps) {
  return (
    <div className={className}>
      <Label
        htmlFor={id}
        className="text-foreground mb-1 block text-2xl font-semibold tracking-wide"
      >
        {label}
      </Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        rows={rows}
        {...register}
        className="tracking-wider"
      />
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
