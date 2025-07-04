import { lazy } from "react";
import { createBrowserRouter, redirect } from "react-router";
import Home from "./pages/Home";
import RootLayout from "./layouts/RootLayout";
const BlogPost = lazy(() => import("./pages/blog/BlogPost"));
const CreateBlog = lazy(() => import("./pages/blog/CreateBlog"));
const EditBlog = lazy(() => import("./pages/blog/EditBlog"));
import AuthLayout from "./layouts/AuthLayout";
const LoginForm = lazy(() => import("./components/auth/LoginForm"));
const RegisterForm = lazy(() => import("./components/auth/RegisterForm"));
const NotFound = lazy(() => import("./pages/NotFound"));
import { store } from "./store/store";
import { authService } from "./services/authServices";
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Bookmarks = lazy(() => import("./pages/dashboard/Bookmarks"));
const ForgotPassword = lazy(() => import("./components/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/auth/ResetPassword"));
import DashboardLayout from "./layouts/DashboardLayout";
const Analytics = lazy(() => import("./pages/dashboard/Analytics"));

const checkAuthAndUpdateStore = async () => {
  const { auth } = store.getState();
  const { isAuthenticated, user } = auth;

  if (isAuthenticated && user?.email) {
    return true;
  }

  try {
    const currentUser = await authService.getCurrentUser();
    if (currentUser && currentUser?.email) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const requireAuth = async () => {
  const isAuthenticated = await checkAuthAndUpdateStore();

  if (!isAuthenticated) {
    throw redirect("/auth/login");
  }

  return null;
};

const requireGuest = async () => {
  const isAuthenticated = await checkAuthAndUpdateStore();

  if (isAuthenticated) {
    throw redirect("/");
  }

  return null;
};

const restoreAuthState = async () => {
  await checkAuthAndUpdateStore();
  return null;
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    loader: restoreAuthState,
    HydrateFallback: () => null,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },

  {
    path: "/blog",
    Component: RootLayout,
    loader: restoreAuthState,
    HydrateFallback: () => null,
    children: [
      {
        path: ":slug",
        Component: BlogPost,
      },
      {
        path: "new",
        Component: CreateBlog,
        loader: requireAuth,
      },
      {
        path: "edit/:id",
        Component: EditBlog,
        loader: requireAuth,
      },
    ],
  },

  {
    path: "/dashboard",
    Component: DashboardLayout,
    loader: requireAuth,
    HydrateFallback: () => null,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "bookmarks",
        Component: Bookmarks,
      },
      {
        path: "analytics",
        Component: Analytics,
      },
    ],
  },

  {
    path: "/auth",
    Component: AuthLayout,
    HydrateFallback: () => null,
    children: [
      {
        path: "login",
        Component: LoginForm,
        // loader: requireGuest,
      },
      {
        path: "register",
        Component: RegisterForm,
        // loader: requireGuest,
      },
      {
        path: "forgot-password",
        Component: ForgotPassword,
        // loader: requireGuest,
      },
      {
        path: "reset-password",
        Component: ResetPassword,
        // loader: requireGuest,
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
