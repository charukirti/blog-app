import { authService } from "@/services/authServices";
import { clearUser } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/typedHooks";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import ThemeToggle from "./ThemeToggle";
import {
  Bookmark,
  LayoutDashboard,
  LogOut,
  SquarePen,
  Search,
  X,
  Menu,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import SearchBar from "../ui/SearchBar";

interface HeaderProps {
  variant?: "rootLayout" | "authLayout";
}

export default function Header({ variant }: HeaderProps) {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isUser = isAuthenticated && user?.email;

  const handleLogout = async () => {
    try {
      await authService.logOut();
      dispatch(clearUser());
      navigate("/");
    } catch (error) {
      console.log("failed to logout", error);
    }
  };

  if (variant === "authLayout") {
    const isLogin = location.pathname === "/auth/login";
    const isRegister = location.pathname === "/auth/register";
    return (
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link
            to="/"
            className="text-2xl font-bold text-gray-900 dark:text-gray-200"
          >
            Bloggify
          </Link>

          {(isLogin || isRegister) && (
            <div className="flex items-center space-x-2 text-sm">
              {isLogin ? (
                <>
                  <span className="font-poppins text-base font-semibold text-gray-600 dark:text-gray-300">
                    New to Bloggify?
                  </span>
                  <Link
                    to={"/auth/register"}
                    className="font-poppins rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <span className="font-poppins text-base font-semibold text-gray-600 dark:text-gray-300">
                    Already have an account?
                  </span>
                  <Link
                    to="/auth/login"
                    className="font-poppins rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Login
                  </Link>
                </>
              )}
              <ThemeToggle />
            </div>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {!isMobileSearchOpen && (
            <Link
              to="/"
              className="text-2xl font-bold text-gray-900 dark:text-gray-200"
            >
              Bloggify
            </Link>
          )}

          {isMobileSearchOpen && (
            <div className="flex flex-1 items-center gap-2 md:hidden">
              <div className="flex-1">
                <SearchBar />
              </div>
              <button
                onClick={() => setIsMobileSearchOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="hidden md:block">
            <SearchBar />
          </div>

          {!isMobileSearchOpen && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 md:hidden dark:text-gray-300 dark:hover:text-white"
              >
                <Search className="h-5 w-5" />
              </button>

              <div className="hidden items-center gap-3 md:flex">
                {isUser ? (
                  <>
                    <Link to={"/blog/new"}>
                      <SquarePen className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant={"ghost"}
                          className="font-poppins relative h-8 w-8 cursor-pointer rounded-full text-base font-semibold ring hover:ring-green-200"
                        >
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="mt-4 w-56"
                        forceMount
                      >
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="font-poppins text-sm leading-none font-medium">
                              {user?.name || "User"}
                            </p>
                            <p className="text-muted-foreground font-poppins text-xs leading-none">
                              {user?.email || "user@example.com"}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link to="/dashboard/bookmarks">
                            <Bookmark className="mr-2 h-4 w-4" />
                            Bookmarks
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="p-0"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <div className="flex w-full items-center justify-between px-2 py-1.5">
                            <span className="font-poppins text-base">
                              Theme
                            </span>
                            <ThemeToggle inDropdown={true} />
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <>
                    <Link to={"/auth/login"}>
                      <Button
                        variant={"outline"}
                        className="font-poppins cursor-pointer rounded-full"
                        size={"lg"}
                      >
                        Start Writing
                      </Button>
                    </Link>
                    <ThemeToggle />
                  </>
                )}
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 md:hidden"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          )}
        </div>

        {isMobileMenuOpen && !isMobileSearchOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden dark:border-gray-800">
            <nav className="flex flex-col space-y-4">
              {isUser ? (
                <>
                  <Link
                    to="/blog/new"
                    className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <SquarePen className="h-4 w-4" />
                    Write post
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>

                  <Link
                    to="/bookmarks"
                    className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Bookmark className="h-4 w-4" />
                    Bookmarks
                  </Link>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-600 dark:text-gray-300">
                      Theme
                    </span>
                    <ThemeToggle inDropdown={true} />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-left text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/register"
                    className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-600 dark:text-gray-300">
                      Theme
                    </span>
                    <ThemeToggle inDropdown={true} />
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
