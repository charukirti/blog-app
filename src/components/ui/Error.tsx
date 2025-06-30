import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorComponentProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  className?: string;
}

export default function ErrorComponent({
  title = "Something went wrong",
  message = "Unable to load data. Please try again.",
  onRetry,
  showRetry = true,
  className = "",
}: ErrorComponentProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mb-4 max-w-md text-gray-600">{message}</p>
      {showRetry && (
        <button
          onClick={handleRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
