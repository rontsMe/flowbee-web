// src/layout/ThemeToggle/theme-provider.tsx

'use client';

import { useEffect, useState } from 'react';
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps
} from 'next-themes';
import { SafeThemeProviderProps, ThemeState } from '@themeTypes';

/**
 * ThemeStateManager Class
 * Purpose: Manages theme state safely during hydration (SRP)
 * Follows: SOLID - Single responsibility for theme state management
 */
class ThemeStateManager {
  private state: ThemeState;

  constructor() {
    this.state = {
      currentTheme: 'dark',
      resolvedTheme: 'dark', 
      systemTheme: 'dark',
      isHydrated: false
    };
  }

  /**
   * initializeThemeState - Safely initializes theme state
   * Purpose: Prevents hydration mismatches during theme initialization
   * @param defaultTheme string - Default theme to use
   * @returns ThemeState - Initialized theme state
   */
  public initializeThemeState(defaultTheme: string): ThemeState {
    return {
      ...this.state,
      currentTheme: defaultTheme as any,
      resolvedTheme: defaultTheme as any
    };
  }

  /**
   * markAsHydrated - Marks theme as fully hydrated
   * Purpose: Signals that theme is safe for client-side operations
   * @returns void
   */
  public markAsHydrated(): void {
    this.state.isHydrated = true;
  }

  /**
   * getState - Gets current theme state
   * Purpose: Provides read-only access to theme state
   * @returns ThemeState - Current theme state
   */
  public getState(): ThemeState {
    return { ...this.state };
  }
}

/**
 * HydrationSafeThemeProvider Component
 * Purpose: Theme provider that handles hydration safely (SRP)
 * Follows: SOLID - Open/closed principle for theme provider extension
 */
function HydrationSafeThemeProvider({
  children,
  attribute,
  defaultTheme,
  enableSystem,
  ...props
}: SafeThemeProviderProps & Omit<ThemeProviderProps, keyof SafeThemeProviderProps>): JSX.Element {
  
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [themeManager] = useState(() => new ThemeStateManager());

  useEffect(() => {
    // Initialize theme state safely
    themeManager.initializeThemeState(defaultTheme);
    themeManager.markAsHydrated();
    setIsHydrated(true);

    // Ensure HTML element has correct theme class
    const htmlElement = document.documentElement;
    if (defaultTheme === 'dark' && !htmlElement.classList.contains('dark')) {
      htmlElement.classList.add('dark');
    }
  }, [defaultTheme, themeManager]);

  // Prevent theme flash during hydration
  if (!isHydrated) {
    return (
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    );
  }

  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

/**
 * Default Export - Enhanced Theme Provider
 * Purpose: Provides backward compatibility with existing imports
 * Follows: SOLID - Liskov substitution principle
 */
export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps): JSX.Element {
  return (
    <HydrationSafeThemeProvider
      children={children}
      attribute={props.attribute || 'class'}
      defaultTheme={props.defaultTheme || 'dark'}
      enableSystem={props.enableSystem ?? false}
      {...props}
    />
  );
}