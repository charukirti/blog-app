import { Bookmark, ChartLine, LogOut, Menu, Pen, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import Avatar from "../blogs/common/Avatar";
import { useAppSelector } from "@/store/typedHooks";
import { authService } from "@/services/authServices";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/authSlice";
import ThemeToggle from "../layout/ThemeToggle";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logOut();
      dispatch(clearUser());
      navigate("/");
    } catch (error) {
      console.log("failed to logout", error);
    }
  };

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className="bg-background fixed top-4 left-4 z-50 rounded-md border p-2 shadow-sm md:hidden"
        aria-label={
          isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
        }
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      <aside
        className={`bg-muted fixed inset-y-0 left-0 z-40 flex w-50 flex-col border-r p-6 transition-transform duration-300 ease-in-out md:w-60 ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
        aria-label="Dashboard navigation"
      >
        <Link
          to="/"
          className="mt-10 mb-6 flex items-center gap-2 text-2xl font-bold md:mt-0"
          aria-label="Blogify - Go to dashboard home"
        >
          <Pen className="h-5 w-5" aria-hidden="true" /> Blogify
        </Link>

        <nav className="flex flex-col gap-2" aria-label="Main navigation">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground"
              }`
            }
            aria-label="Posts - Manage your blog posts"
            onClick={closeMobileMenu}
          >
            <Pen className="h-4 w-4" aria-hidden="true" />
            <span>Posts</span>
          </NavLink>

          <NavLink
            to="/dashboard/bookmarks"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground"
              }`
            }
            aria-label="Bookmarks - View saved posts"
            onClick={closeMobileMenu}
          >
            <Bookmark className="h-4 w-4" aria-hidden="true" />
            <span>Bookmarks</span>
          </NavLink>

          <NavLink
            to="/dashboard/analytics"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground"
              }`
            }
            aria-label="Analytics - View blog statistics"
            onClick={closeMobileMenu}
          >
            <ChartLine className="h-4 w-4" aria-hidden="true" />
            <span>Analytics</span>
          </NavLink>
        </nav>

        <div className="border-border mt-auto space-y-5 border-t pt-4">
          <div className="mb-3 flex items-center gap-1">
            <Avatar name={user?.name || ""} />
            <div className="hidden md:block">
              <p className="text-foreground text-sm font-medium">
                {user?.name}
              </p>
              <p className="text-muted-foreground text-xs">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10 flex w-full items-center gap-2 rounded-md px-3 py-2 transition-colors"
            aria-label="Sign out of your account"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden md:block">Log Out</span>
          </button>
        </div>
        <ThemeToggle />
      </aside>
    </>
  );
}
