import { ErrorBoundary } from "@/components/ErrorBoundry";
import Header from "@/components/layout/Header";
import Loader from "@/components/Loader";
import { Suspense } from "react";
import { Outlet, useLocation } from "react-router";

export default function AuthLayout() {
  const location = useLocation();
  const isLogin = location.pathname === "/auth/login";

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header variant="authLayout" />

        <main className="flex flex-col items-center sm:flex-row sm:px-6 sm:py-12 lg:px-10">
          <section className="mb-8 text-center sm:mx-auto sm:w-full sm:max-w-md">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
            <h1 className="mb-2 hidden text-3xl font-bold text-gray-900 sm:block dark:text-gray-200">
              {isLogin ? " Welcome Back to Bloggify" : "Welcome to Bloggify"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Share your stories with the world
            </p>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white px-6 py-6 shadow-xl sm:mx-auto sm:w-full sm:max-w-md dark:border-gray-800 dark:bg-gray-800">
            <Suspense fallback={<Loader />}>
              <Outlet />
            </Suspense>
            <p className="mt-8 text-center text-sm text-gray-500">
              Join thousands of writers sharing their stories
            </p>
          </section>
        </main>
      </div>
    </ErrorBoundary>
  );
}
