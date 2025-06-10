import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Label } from "../../ui/label";

const categories = [
  { value: "technology", label: "Technology" },
  { value: "design", label: "Design" },
  { value: "business", label: "Business" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "travel", label: "Travel" },
  { value: "food", label: "Food & Cooking" },
  { value: "health", label: "Health & Fitness" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
  { value: "sports", label: "Sports" },
  { value: "finance", label: "Finance" },
  { value: "productivity", label: "Productivity" },
  { value: "other", label: "Other" },
];

interface SelectCategoryProps {
  label: string;
  error?: FieldError;
  id: string;
  register: UseFormRegisterReturn;
  placeholder?: string;
}

export default function SelectCategory({
  label,
  id,
  placeholder,
  error,
  register,
}: SelectCategoryProps) {
  return (
    <div>
      <Label
        className="text-foreground mb-1 block text-2xl font-semibold tracking-wide"
        htmlFor={id}
      >
        {label}
      </Label>
      <select
        id={id}
        {...register}
        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-1.5 text-base tracking-wider shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        {placeholder && (
          <option
            value=""
            disabled
            className="dark:bg-stone-900 dark:text-white"
          >
            {placeholder}
          </option>
        )}

        {categories.map((category) => (
          <option
            key={category.value}
            value={category.value}
            className="dark:bg-gray-900 dark:text-white"
          >
            {category.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
