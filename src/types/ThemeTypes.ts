// src/types/ThemeTypes.ts

/**
 * Central Theme Type Definitions
 * Purpose: Single source of truth for all theme-related types (SRP)
 * Follows: SOLID principles with focused type definitions
 */

// Built-in types usage
export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeAttribute = 'class' | 'data-theme';

// Theme configuration structure
export interface ThemeConfig {
  readonly attribute: ThemeAttribute;
  readonly defaultTheme: ThemeMode;
  readonly enableSystem: boolean;
  readonly storageKey: string;
  readonly themes: readonly string[];
}

// Hydration safety configuration
export interface HydrationConfig {
  readonly suppressHydrationWarning: boolean;
  readonly defaultThemeClass: string;
  readonly browserExtensionSuppress: boolean;
}

// Layout props with theme support
export interface ThemeLayoutProps {
  readonly children: React.ReactNode;
  readonly themeConfig: ThemeConfig;
  readonly hydrationConfig: HydrationConfig;
}

// Theme provider props
export interface SafeThemeProviderProps {
  readonly children: React.ReactNode;
  readonly attribute: ThemeAttribute;
  readonly defaultTheme: ThemeMode;
  readonly enableSystem: boolean;
}

// Browser extension detection
export interface BrowserExtensionData {
  readonly grammarlyInstalled: boolean;
  readonly adBlockerInstalled: boolean;
  readonly extensionAttributes: readonly string[];
}

// Theme state management
export interface ThemeState {
  readonly currentTheme: ThemeMode;
  readonly resolvedTheme: ThemeMode;
  readonly systemTheme: ThemeMode;
  readonly isHydrated: boolean;
}

// Error handling types
export type ThemeErrorType = 'hydration_mismatch' | 'extension_interference' | 'theme_load_failure';

export interface ThemeError {
  readonly type: ThemeErrorType;
  readonly message: string;
  readonly element?: HTMLElement;
  readonly timestamp: Date;
}