import { ShieldAlert } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundry cought an error", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  getContextualMessage = () => {
    const path = window.location.pathname;

    if (path.includes("/blog/")) {
      return {
        title: "Failed to load blog post",
        message: "Unable to load this blog post, reload the page.",
      };
    }

    if (path === "/" || path === "") {
      return {
        title: "Homepage Error",
        message:
          "We're having trouble loading the homepage, please try refreshing the page",
      };
    }

    if (
      path.includes("/dashboard/") ||
      path.includes("/dashboard/bookmarks") ||
      path.includes("/dashboard/analytics")
    ) {
      return {
        title: `${path} Error`,
        message: ` We're having trouble loading your ${path}. Please try refreshing the page.`,
      };
    }

    return {
      title: "Something Went Wrong",
      message:
        "We encountered an unexpected error. Please try refreshing the page or go back to the homepage.",
    };
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { title, message } = this.getContextualMessage();

      return (
        <main className="flex min-h-screen flex-col items-center justify-center px-6">
          <section className="max-w-md text-center">
            <div className="mb-6 text-6xl">
              <ShieldAlert />
            </div>

            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
              {title}
            </h1>

            <p className="mb-8 text-gray-600 dark:text-gray-400">{message}</p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button variant={"default"} onClick={this.handleRetry}>
                Try Again
              </Button>

              <Button variant={"outline"} onClick={this.handleGoHome}>
                Go to Homepage
              </Button>

              <Button variant={"ghost"} onClick={() => window.history.back()}>
                Go Back
              </Button>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-8 text-center">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                  Error Details (Development Only)
                </summary>

                <div className="mt-3 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                  <div className="mb-3">
                    <h4 className="font-semibold text-red-800 dark:text-red-200">
                      Error:
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {this.state.error.message}
                    </p>
                  </div>

                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <h4 className="font-semibold text-red-800 dark:text-red-200">
                        Component Stack:
                      </h4>
                      <pre className="mt-1 overflow-auto text-xs text-red-600 dark:text-red-400">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}
