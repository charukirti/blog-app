import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import { ErrorBoundary } from "./components/ErrorBoundry.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error("Global Error Boundary caught", error, errorInfo);
      }}
    >
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={true}
          />
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
);
