"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type ThemeSelection = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

interface ThemeContextType {
  theme: ThemeSelection;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeSelection) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getStoredTheme(): ThemeSelection {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme") as ThemeSelection | null;
  return stored || "light";
}

function getResolvedTheme(theme: ThemeSelection): ResolvedTheme {
  if (theme === "system") {
    return getSystemTheme();
  }
  return theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeSelection>(() => {
    if (typeof window === "undefined") return "light";
    return getStoredTheme();
  });

  const resolvedTheme = getResolvedTheme(theme);

  // Initialize theme on mount
  useEffect(() => {
    const root = document.documentElement;
    const stored = getStoredTheme();
    const resolved = getResolvedTheme(stored);

    if (resolved === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  // Listen for system theme changes if theme is 'system'
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const root = document.documentElement;
      const resolved = getSystemTheme();
      if (resolved === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const resolved = getResolvedTheme(theme);

    if (resolved === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const setTheme = (newTheme: ThemeSelection) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
