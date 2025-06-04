import { createBrowserRouter, redirect } from "react-router";
import Home from "./pages/Home";
import RootLayout from "./layouts/RootLayout";
import BlogPost from "./pages/blog/BlogPost";
import CreateBlog from "./pages/blog/CreateBlog";
import EditBlog from "./pages/blog/EditBlog";
import AuthLayout from "./layouts/AuthLayout";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import NotFound from "./pages/NotFound";
import { store } from "./store/store";
import { authService } from "./services/authServices";
import Dashboard from "./pages/Dashboard";
import { setLoading } from "./store/authSlice";
import Bookmarks from "./pages/Bookmarks";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";

const checkAuthAndUpdateStore = async () => {
  const { auth } = store.getState();
  const { isAuthenticated, user } = auth;

  if (isAuthenticated && user?.email) {
    return true;
  }

  store.dispatch(setLoading(true));

  try {
    const currentUser = await authService.getCurrentUser();
    if (currentUser && user?.email) {
      return true;
    }
    return false;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error);
    return false;
  } finally {
    store.dispatch(setLoading(false));
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

      {
        path: "write",
        Component: CreateBlog,
        loader: requireAuth,
      },
      {
        path: "edit/:id",
        Component: EditBlog,
        loader: requireAuth,
      },
      {
        path: "dashboard",
        Component: Dashboard,
        loader: requireAuth,
      },
      {
        path: "blog/:slug",
        Component: BlogPost,
      },
      {
        path: "/bookmarks",
        Component: Bookmarks,
        loader: requireAuth,
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
        loader: requireGuest,
      },
      {
        path: "register",
        Component: RegisterForm,
        loader: requireGuest,
      },
      {
        path: "forgot-password",
        Component: ForgotPassword,
        loader: requireGuest,
      },
      {
        path: "reset-password",
        Component: ResetPassword,
        loader: requireGuest,
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
