import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FormFieldProps {
  label: string;
  type?: string;
  error?: FieldError;
  register: UseFormRegisterReturn;
  id: string;
  placeholder?: string;
  showPasswordToggle?: boolean;
}

export default function FormField({
  label,
  type,
  error,
  register,
  id,
  placeholder,
  showPasswordToggle,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    showPasswordToggle && type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  const togglePasswordVisiblity = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <Label
        htmlFor={id}
        className="font-poppins text-foreground mb-1 text-base font-normal"
      >
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          placeholder={placeholder}
          type={inputType}
          {...register}
          className={`font-poppins ${error ? "border-destructive" : "border-border"}`}
        />

        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer bg-transparent text-gray-500  focus:outline-none"
            onClick={togglePasswordVisiblity}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-destructive mt-1 text-sm">{error.message}</p>
      )}
    </div>
  );
}
