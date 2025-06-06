import Header from "@/components/layout/Header";
import { Outlet } from "react-router";

export default function RootLayout() {
 
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-3">
        <Outlet />
      </main>
    </div>
  );
}
