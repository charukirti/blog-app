import { useSearchPosts } from "@/hooks/blog/useBlog";
import { Loader2, Search, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useNavigate } from "react-router";
import type { Models } from "appwrite";
import { Input } from "./input";
import { formatDate } from "@/utils/formatDate";

type SearchResult = Models.Document & {
  title: string;
  slug: string;
  $createdAt: string;
};

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: results = [], isPending, error } = useSearchPosts(searchTerm);

  const typedResults = results as SearchResult[];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(value.length >= 5);
    setSelectedIndex(-1);
  };

  const handleResultClick = useCallback(
    (result: SearchResult) => {
      navigate(`/blog/${result.slug}`);
      setSearchTerm("");
      setIsOpen(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    },
    [navigate],
  );

  const clearSearch = () => {
    setSearchTerm("");
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev < typedResults.length - 1 ? prev + 1 : prev,
          );
          break;

        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          event.preventDefault();
          if (selectedIndex >= 0 && typedResults[selectedIndex]) {
            handleResultClick(typedResults[selectedIndex]);
          }
          break;

        case "Escape":
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, typedResults, handleResultClick]);

  const shouldShowDropdown = isOpen && searchTerm.length >= 2;

  return (
    <section ref={searchRef} className="relative">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search posts...."
          className="w-full rounded-lg border border-gray-300 bg-white pr-10 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {shouldShowDropdown && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800">
          {isPending && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Searching...
              </span>
            </div>
          )}

          {error && (
            <div className="px-4 py-3 text-sm text-red-600 dark:text-red-400">
              Error while searching posts. Please try again
            </div>
          )}

          {!isPending &&
            !error &&
            typedResults.length === 0 &&
            searchTerm.length >= 2 && (
              <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                No posts found for "{searchTerm}"
              </div>
            )}

          {!isPending && !error && typedResults.length > 0 && (
            <div className="py-1">
              {typedResults.map((result: SearchResult, index: number) => (
                <button
                  key={result.$id}
                  onClick={() => handleResultClick(result)}
                  className={`w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none dark:hover:bg-gray-700 dark:focus:bg-gray-700 ${
                    index === selectedIndex ? "bg-gray-50 dark:bg-gray-700" : ""
                  }`}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="line-clamp-1 font-medium text-gray-900 dark:text-gray-100">
                    {result.title}
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(result.$createdAt)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
