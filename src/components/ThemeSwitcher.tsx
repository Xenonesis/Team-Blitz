"use client";

import { useState, useEffect } from "react";

type Theme = "default" | "dark" | "cyberpunk" | "minimal" | "emerald";

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  accent: string;
}

const themes: Record<Theme, ThemeColors> = {
  default: {
    primary: "#3b82f6",
    secondary: "#4f46e5",
    background: "linear-gradient(to bottom, #1e3a8a, #312e81)",
    foreground: "#ffffff",
    accent: "#60a5fa",
  },
  dark: {
    primary: "#6366f1",
    secondary: "#8b5cf6",
    background: "linear-gradient(to bottom, #0f172a, #020617)",
    foreground: "#f8fafc",
    accent: "#a5b4fc",
  },
  cyberpunk: {
    primary: "#f59e0b",
    secondary: "#ef4444",
    background: "linear-gradient(to bottom, #0f172a, #4c1d95)",
    foreground: "#f8fafc",
    accent: "#fb923c",
  },
  emerald: {
    primary: "#10b981",
    secondary: "#0ea5e9",
    background: "linear-gradient(to bottom, #064e3b, #0f766e)",
    foreground: "#f0fdfa",
    accent: "#34d399",
  },
  minimal: {
    primary: "#94a3b8",
    secondary: "#64748b",
    background: "linear-gradient(to bottom, #0f172a, #1e293b)",
    foreground: "#f1f5f9",
    accent: "#cbd5e1",
  },
};

interface ThemeSwitcherProps {
  className?: string;
}

export default function ThemeSwitcher({ className = '' }: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>("default");

  // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const theme = themes[currentTheme];

    // Set CSS variables
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--secondary", theme.secondary);
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--background", theme.background);
    root.style.setProperty("--foreground", theme.foreground);

    // Set body background directly to ensure it takes effect
    document.body.style.background = theme.background;
    document.body.style.color = theme.foreground;

    // Add a class to the body to indicate the current theme
    document.body.className = document.body.className
      .replace(/theme-\w+/g, '')
      .trim();
    document.body.classList.add(`theme-${currentTheme}`);

    // Save theme preference
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 transition-all duration-300 flex items-center hover:scale-105 border border-white/10 ${className}`}
        aria-label="Change theme"
      >
        {currentTheme === "dark" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : currentTheme === "cyberpunk" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        ) : currentTheme === "emerald" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        ) : currentTheme === "minimal" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
        )}
        <span className="ml-2 hidden md:inline text-sm">Theme</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-64 md:w-56 modern-mobile-menu rounded-xl shadow-lg p-3 z-50 animate-fade-in border border-white/10">
            <div className="py-1 space-y-1">
              <h3 className="text-xs uppercase tracking-wider text-blue-300 mb-2 px-2 font-semibold">Select Theme</h3>
              {(Object.keys(themes) as Theme[]).map((theme) => (
                <button
                  type="button"
                  key={theme}
                  onClick={() => {
                    setCurrentTheme(theme);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-all duration-300 ${
                    currentTheme === theme
                      ? "bg-gradient-to-r from-blue-600/30 to-indigo-600/30 text-white border-l-2 border-blue-500"
                      : "hover:bg-blue-500/10 hover:translate-x-1 hover:border-l-2 hover:border-blue-500/50"
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded-full mr-3 flex-shrink-0 border border-white/20 shadow-md"
                    style={{
                      background: `linear-gradient(to right, ${themes[theme].primary}, ${themes[theme].secondary})`,
                    }}
                  ></span>
                  <div>
                    <div className="font-medium">{theme.charAt(0).toUpperCase() + theme.slice(1)}</div>
                    <div className="text-xs opacity-70 mt-0.5">
                      {theme === "default" ? "Blue gradient theme" :
                       theme === "dark" ? "Dark purple theme" :
                       theme === "cyberpunk" ? "Orange & red theme" :
                       theme === "emerald" ? "Green & teal theme" :
                       "Minimal gray theme"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
