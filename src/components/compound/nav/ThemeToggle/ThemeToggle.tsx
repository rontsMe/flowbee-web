"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <button
      className={styles.toggleButton}
      onClick={() => setDarkMode((prev) => !prev)}
      aria-label="Toggle theme"
    >
      {darkMode ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
