import { useState, type KeyboardEvent } from "react";
import { useController, type Control, type FieldError } from "react-hook-form";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { X } from "lucide-react";

interface AddTagsField {
  label: string;
  error?: FieldError;
  id: string;
  placeholder?: string;
  control: Control<any>;
}

export default function AddTagsField({
  label,
  error,
  id,
  placeholder,
  control,
}: AddTagsField) {
  const [inputValue, setInputValue] = useState("");

  const {
    field: { value, onChange },
  } = useController({
    name: "tags",
    control,
    defaultValue: [],
  });

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !value.includes(trimmedValue)) {
      onChange([...value, trimmedValue]);
      setInputValue("");
    }
  };

  const removeTag = (tagValue: string) => {
    onChange(value.filter((tag: string) => tag !== tagValue));
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };
  return (
    <div>
      <Label
        className="text-foreground mb-1 block text-2xl font-semibold tracking-wide"
        htmlFor={id}
      >
        {label}
      </Label>

      <div className="mt-1 flex gap-2">
        <Input
          id={id}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="text-base tracking-wider"
          onKeyUp={handleKeyPress}
        />
        <Button
          type="button"
          variant={"outline"}
          disabled={!inputValue.trim()}
          onClick={addTag}
        >
          Add Tag
        </Button>
      </div>

      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {value.map((tag: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
            >
              {tag}
              <button
                type="button"
                className="rounded-full p-1 hover:bg-blue-200"
                onClick={() => removeTag(tag)}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
