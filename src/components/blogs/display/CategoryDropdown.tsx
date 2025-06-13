import { categories } from "@/utils/Categories";
import { Check, ChevronDown, Tag } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CategoryDropdownProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryDropdown({
  selectedCategory,
  onCategoryChange,
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const allCategories = ["All", ...categories];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategorySelect = (category: string) => {
    onCategoryChange(category);
    setIsOpen(false);
  };

  return (
    <section ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-w-[180px] items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 shadow-sm transition-all duration-200 hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-gray-900 dark:hover:bg-zinc-800"
      >
        <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <span className="flex-1 text-left font-medium text-gray-700 dark:text-gray-100">
          {selectedCategory}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 dark:text-gray-400 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <ul className="absolute right-0 z-50 mt-2 max-h-80 w-64 overflow-y-auto rounded-xl border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {allCategories.map((category) => (
            <li key={category}>
              <button
                onClick={() => handleCategorySelect(category)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  selectedCategory === category
                    ? "border-r-2 border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                {selectedCategory === category && (
                  <Check className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                )}
                <span
                  className={
                    selectedCategory === category
                      ? "font-medium"
                      : "font-normal"
                  }
                >
                  {category}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
