"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);
      setIsDarkMode(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  // Do not render anything until the component has mounted and read the theme
  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn flex items-center gap-2 px-3 py-2 rounded-md border border-gray-400 text-gray-900 dark:text-gray-100 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle Theme"
    >
      <span>{isDarkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}</span>
    </button>
  );
}
