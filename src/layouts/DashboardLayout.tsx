import Sidebar from "@/components/dashboard/Sidebar";
import { ErrorBoundary } from "@/components/ErrorBoundry";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <ErrorBoundary>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="container mx-auto ml-0 flex-1 px-6 py-4 md:ml-60">
          <Outlet />
        </main>
      </div>
    </ErrorBoundary>
  );
}
