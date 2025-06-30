import Sidebar from "@/components/dashboard/Sidebar";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen ">
      <Sidebar />
      <main className="ml-0 md:ml-60 container mx-auto flex-1 px-6 py-4">
        <Outlet />
      </main>
    </div>
  );
}
