import type { Theme } from "@/types";
import { useEffect, useState } from "react";



export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme") as Theme;
    return stored || "system";
  });

  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    const rootElement = window.document.documentElement;

    const updateTheme = () => {
      let isDarkMode = false;

      if (theme === "dark") {
        isDarkMode = true;
      } else if (theme === "light") {
        isDarkMode = false;
      } else {
        isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }

      setDarkTheme(isDarkMode);

      if (isDarkMode) {
        rootElement.classList.add("dark");
      } else {
        rootElement.classList.remove("dark");
      }
    };

    updateTheme();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemChange = () => {
      if (theme === "system") {
        updateTheme();
      }
    };

    mediaQuery.addEventListener("change", handleThemChange);
    localStorage.setItem("theme", theme);

    return () => mediaQuery.removeEventListener("change", handleThemChange);
  }, [theme]);

  return {
    theme,
    setTheme,
    darkTheme,
    toggleTheme: () => {
      setTheme((current) => {
        if (current === "light") return "dark";
        if (current === "dark") return "system";
        return "light";
      });
    },
  };
}
