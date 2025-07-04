import Sidebar from "@/components/dashboard/Sidebar";
import { ErrorBoundary } from "@/components/ErrorBoundry";
import Loader from "@/components/Loader";
import { Suspense } from "react";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <ErrorBoundary>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="container mx-auto ml-0 flex-1 px-6 py-4 md:ml-60">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  );
}
