// src/components/compound/nav/ThemeToggle.tsx
'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState, useCallback } from 'react';
import { Button } from '@ui/button';

/**
 * Enhanced ModeToggle Component
 * 
 * Purpose: Theme toggle utilizing globals.css sidebar theming
 * Features: Uses sidebar colors from globals.css to match header and sidebar
 * Structure: Tailwind for layout, globals.css for theming
 * Follows: Rules of Hooks - All hooks called in same order every render
 * 
 * Methods:
 * - handleThemeToggle(): Theme switching with view transitions
 * - render(): Returns toggle button JSX using globals.css sidebar theming
 */
export function ModeToggle() {
  // ✅ ALL HOOKS FIRST - Called in same order every render
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ✅ useEffect hook always called
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ useCallback hook always called - BEFORE conditional logic
  const handleThemeToggle = useCallback(
    (e?: React.MouseEvent) => {
      const newMode = resolvedTheme === 'dark' ? 'light' : 'dark';
      const root = document.documentElement;

      if (!document.startViewTransition) {
        setTheme(newMode);
        return;
      }

      // Set coordinates from the click event for smooth transition
      if (e) {
        root.style.setProperty('--x', `${e.clientX}px`);
        root.style.setProperty('--y', `${e.clientY}px`);
      }

      // Enhanced view transition
      const transition = document.startViewTransition(() => {
        setTheme(newMode);
      });

      transition.finished.then(() => {
        // Transition completed
      });
    },
    [resolvedTheme, setTheme]
  );

  // ✅ CLEAN STYLES - Structure only, theming handled by globals.css
  const styles = {
    toggleButton: "size-8 bg-sidebar-accent text-sidebar-foreground",
    
    icon: "h-4 w-4",
    
    screenReader: "sr-only"
  };

  // ✅ CONDITIONAL RENDERING - After all hooks
  if (!mounted) {
    return (
      <Button
        variant='secondary'
        size='icon'
        className={styles.toggleButton}
        disabled
      >
        <Sun className={styles.icon} />
        <span className={styles.screenReader}>Loading theme...</span>
      </Button>
    );
  }

  return (
    <Button
      variant='secondary'
      size='icon'
      className={styles.toggleButton}
      onClick={handleThemeToggle}
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? <Sun className={styles.icon} /> : <Moon className={styles.icon} />}
      <span className={styles.screenReader}>Toggle theme</span>
    </Button>
  );
}