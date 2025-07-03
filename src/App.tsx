import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./context/ThemeContext";
import { useAppSelector } from "./store/typedHooks";
import Loader from "./components/Loader";
import { ErrorBoundary } from "./components/ErrorBoundry";

export default function App() {
  const { isLoading } = useAppSelector((state) => state.auth);
  return (
    <>
      <ThemeProvider>
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error("App Error Boundary caught:", error, errorInfo);
          }}
        >
          {isLoading ? <Loader /> : <RouterProvider router={router} />}
        </ErrorBoundary>
      </ThemeProvider>
    </>
  );
}
