import { ErrorBoundary } from "@/components/ErrorBoundry";
import Header from "@/components/layout/Header";
import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container mx-auto flex-1 px-6 py-4">
          <Outlet />
        </main>
      </div>
    </ErrorBoundary>
  );
}
