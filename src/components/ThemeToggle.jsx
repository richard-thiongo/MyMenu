"use client";

import useTheme from "@/hooks/useTheme";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-alt text-text transition-all duration-300 hover:scale-110 hover:border-primary-400 hover:text-primary-500 active:scale-95"
    >
      <span
        className={`absolute transition-all duration-300 ${
          theme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0"
        }`}
      >
        <FiMoon size={20} />
      </span>
      <span
        className={`absolute transition-all duration-300 ${
          theme === "light"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
      >
        <FiSun size={20} />
      </span>
    </button>
  );
}
