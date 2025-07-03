import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <section className="max-w-md text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-gray-300 tracking-wider">
          404:(
        </h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Page Not Found
        </h2>
        <p className="mb-8 text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button variant={"outline"} onClick={() => navigate("/")}>
          Go back to home page
        </Button>
      </section>
    </main>
  );
}
