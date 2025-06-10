import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

interface FormFieldProps {
  label: string;
  type?: string;
  error?: FieldError;
  id: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  helperText?: string;
  className?: string;
}

export default function FormField({
  label,
  type,
  id,
  placeholder,
  register,
  error,
  helperText,
  className,
}: FormFieldProps) {
  return (
    <div className={className}>
      <Label
        htmlFor={id}
        className="text-foreground mb-1 block text-2xl font-semibold tracking-wide"
      >
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register}
        className="mt-1 text-base tracking-wider"
      />

      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
