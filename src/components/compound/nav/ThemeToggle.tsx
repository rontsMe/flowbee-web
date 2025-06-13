// src/components/compound/nav/ThemeToggle.tsx
'use client';

import { IconBrightness } from '@tabler/icons-react';
import { useTheme } from 'next-themes';
import { useEffect, useState, useCallback } from 'react';
import { Button } from '@ui/button';

/**
 * Enhanced ModeToggle Component - Fixed Hook Order
 * 
 * Purpose: Theme toggle utilizing globals.css secondary theming
 * Features: Uses bg-secondary and enhanced hover states from globals.css
 * Follows: Rules of Hooks - All hooks called in same order every render
 * 
 * Methods:
 * - handleThemeToggle(): Theme switching with view transitions
 * - render(): Returns toggle button JSX using globals.css theming
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

      // Add glow effect during transition (globals.css handles the actual glow styling)
      const button = e?.currentTarget as HTMLElement;
      if (button) {
        button.classList.add('shadow-lg', 'shadow-primary/50');
        setTimeout(() => {
          button.classList.remove('shadow-lg', 'shadow-primary/50');
        }, 600);
      }

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

  // ✅ Styles definition (not a hook, can be anywhere)
  const styles = {
    toggleButton: `
      group/toggle size-8
      bg-secondary
      backdrop-blur-sm backdrop-saturate-110
      border border-border/50
      shadow-sm
      transition-all duration-300 ease-in-out
      hover:shadow-md
      hover:bg-accent hover:text-accent-foreground
      hover:scale-110
      focus:shadow-lg
      focus:bg-accent focus:text-accent-foreground
      focus:scale-105
      active:scale-95
    `,
    
    icon: `
      h-4 w-4
      transition-all duration-500 ease-in-out
      group-hover/toggle:text-primary
      group-hover/toggle:rotate-180
      group-hover/toggle:scale-110
      group-focus/toggle:text-primary
      group-focus/toggle:rotate-180
      group-focus/toggle:scale-115
      group-active/toggle:rotate-90
    `,
    
    screenReader: `
      sr-only
      transition-all duration-300
    `
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
        <IconBrightness className={styles.icon} />
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
      <IconBrightness className={styles.icon} />
      <span className={styles.screenReader}>Toggle theme</span>
    </Button>
  );
}