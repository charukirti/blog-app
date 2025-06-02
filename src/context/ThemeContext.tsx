import { useDarkMode } from "@/hooks/useDarkMode";
import type { Theme } from "@/types";
import { createContext, useContext, type ReactNode } from "react";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  darkTheme: boolean;
  toggleTheme: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export  function ThemeProvider({ children }: ThemeProviderProps) {
  const darkMode = useDarkMode();
  return (
    <ThemeContext.Provider value={darkMode}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme hook must be used inside a ThemeProvider");
  }
  return context;
}
