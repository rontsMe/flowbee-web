// src/components/layout/hydration-safe-layout.tsx

'use client';

import React, { useEffect, useState, type ReactNode } from 'react';
import { 
  ThemeLayoutProps, 
  ThemeState, 
  BrowserExtensionData 
} from '@themeTypes';

/**
 * HydrationSafeLayout Class Component
 * Purpose: Handles SSR/client theme synchronization safely (SRP)
 * Follows: SOLID - Single responsibility for hydration safety
 */
export class HydrationSafeLayout {
  private readonly themeConfig: ThemeLayoutProps['themeConfig'];
  private readonly hydrationConfig: ThemeLayoutProps['hydrationConfig'];

  constructor(themeConfig: ThemeLayoutProps['themeConfig'], hydrationConfig: ThemeLayoutProps['hydrationConfig']) {
    this.themeConfig = themeConfig;
    this.hydrationConfig = hydrationConfig;
  }

  /**
   * getDefaultThemeClass - Determines default theme class for SSR
   * Purpose: Provides consistent theme class between server and client
   * @returns string - Theme class name
   */
  public getDefaultThemeClass(): string {
    return this.themeConfig.defaultTheme === 'dark' ? 'dark' : '';
  }

  /**
   * getHydrationProps - Creates hydration-safe props
   * Purpose: Generates props that prevent hydration mismatches
   * @returns object - HTML attributes for hydration safety
   */
  public getHydrationProps(): Record<string, boolean | string> {
    return {
      suppressHydrationWarning: this.hydrationConfig.suppressHydrationWarning,
      className: this.getDefaultThemeClass(),
      'data-theme-hydrated': 'false'
    };
  }
}

/**
 * BrowserExtensionSuppressor Class
 * Purpose: Handles browser extension interference (SRP)
 * Follows: SOLID - Single responsibility for extension handling
 */
export class BrowserExtensionSuppressor {
  private readonly extensionAttributes: readonly string[] = [
    'data-new-gr-c-s-check-loaded',
    'data-gr-ext-installed',
    'data-adblock-enabled',
    'data-lastpass-icon-root'
  ];

  /**
   * detectBrowserExtensions - Detects installed browser extensions
   * Purpose: Identifies extensions that might interfere with hydration
   * @param element HTMLElement - Element to check
   * @returns BrowserExtensionData - Extension detection results
   */
  public detectBrowserExtensions(element: HTMLElement): BrowserExtensionData {
    const foundAttributes = this.extensionAttributes.filter(attr => 
      element.hasAttribute(attr)
    );

    return {
      grammarlyInstalled: element.hasAttribute('data-gr-ext-installed'),
      adBlockerInstalled: element.hasAttribute('data-adblock-enabled'),
      extensionAttributes: foundAttributes
    };
  }

  /**
   * suppressExtensionWarnings - Suppresses extension-related hydration warnings
   * Purpose: Prevents false positive hydration errors from extensions
   * @param element HTMLElement - Element to suppress warnings on
   * @returns void
   */
  public suppressExtensionWarnings(element: HTMLElement): void {
    // Add suppressHydrationWarning to extension-modified elements
    this.extensionAttributes.forEach(attr => {
      if (element.hasAttribute(attr)) {
        element.setAttribute('data-suppress-hydration', 'true');
      }
    });
  }
}

/**
 * HydrationSafeThemeLayout Functional Component
 * Purpose: React component that applies hydration safety (SRP)
 * Follows: SOLID - Composition over inheritance
 */
export function HydrationSafeThemeLayout({ 
  children, 
  themeConfig, 
  hydrationConfig 
}: ThemeLayoutProps): React.ReactElement {
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const layoutHandler = new HydrationSafeLayout(themeConfig, hydrationConfig);
  const extensionSuppressor = new BrowserExtensionSuppressor();

  useEffect(() => {
    // Handle browser extension interference
    const bodyElement = document.body;
    const htmlElement = document.documentElement;

    extensionSuppressor.suppressExtensionWarnings(bodyElement);
    extensionSuppressor.suppressExtensionWarnings(htmlElement);

    // Mark as hydrated
    htmlElement.setAttribute('data-theme-hydrated', 'true');
    setIsHydrated(true);
  }, []);

  const hydrationProps = layoutHandler.getHydrationProps();

  return (
    <html 
      lang="en" 
      className={hydrationProps.className as string}
      suppressHydrationWarning={hydrationProps.suppressHydrationWarning as boolean}
      data-theme-hydrated={hydrationProps['data-theme-hydrated'] as string}
    >
      <body 
        suppressHydrationWarning={hydrationConfig.browserExtensionSuppress}
        data-hydration-safe="true"
      >
        {children}
      </body>
    </html>
  );
}