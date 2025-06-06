import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./context/ThemeContext";
import { useAppSelector } from "./store/typedHooks";
import Loader from "./components/Loader";

export default function App() {
  const { isLoading } = useAppSelector((state) => state.auth);
  return (
    <>
      <ThemeProvider>
        {isLoading ? <Loader /> : <RouterProvider router={router} />}
      </ThemeProvider>
    </>
  );
}
