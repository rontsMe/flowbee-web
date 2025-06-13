// src/utils/hydration-debug.ts

import { ThemeError, ThemeErrorType, BrowserExtensionData } from '@themeTypes';

/**
 * HydrationDebugger Class
 * Purpose: Debug and diagnose hydration issues (SRP)
 * Follows: SOLID - Single responsibility for debugging hydration problems
 */
export class HydrationDebugger {
  private errors: ThemeError[] = [];
  private isDebugMode: boolean;

  constructor(debugMode: boolean = process.env.NODE_ENV === 'development') {
    this.isDebugMode = debugMode;
  }

  /**
   * logHydrationError - Logs hydration-related errors
   * Purpose: Captures and categorizes hydration errors for debugging
   * @param type ThemeErrorType - Type of hydration error
   * @param message string - Error message
   * @param element HTMLElement - Optional element causing the error
   * @returns void
   */
  public logHydrationError(
    type: ThemeErrorType, 
    message: string, 
    element?: HTMLElement
  ): void {
    const error: ThemeError = {
      type,
      message,
      element,
      timestamp: new Date()
    };

    this.errors.push(error);

    if (this.isDebugMode) {
      console.group(`🚨 Hydration Error: ${type}`);
      console.error(message);
      if (element) {
        console.log('Element:', element);
        console.log('Element attributes:', this.getElementAttributes(element));
      }
      console.log('Timestamp:', error.timestamp.toISOString());
      console.groupEnd();
    }
  }

  /**
   * analyzeHydrationMismatch - Analyzes server/client differences
   * Purpose: Identifies specific causes of hydration mismatches
   * @param serverHTML string - HTML from server
   * @param clientHTML string - HTML from client
   * @returns object - Analysis results
   */
  public analyzeHydrationMismatch(serverHTML: string, clientHTML: string): {
    differences: string[];
    possibleCauses: string[];
    recommendations: string[];
  } {
    const differences: string[] = [];
    const possibleCauses: string[] = [];
    const recommendations: string[] = [];

    // Check for theme class differences
    if (serverHTML.includes('class=""') && clientHTML.includes('class="dark"')) {
      differences.push('Theme class missing on server');
      possibleCauses.push('Default theme not applied to HTML element during SSR');
      recommendations.push('Add defaultTheme class to html element in layout.tsx');
    }

    // Check for browser extension attributes
    const extensionAttrs = ['data-gr-ext-installed', 'data-new-gr-c-s-check-loaded'];
    extensionAttrs.forEach(attr => {
      if (!serverHTML.includes(attr) && clientHTML.includes(attr)) {
        differences.push(`Browser extension attribute: ${attr}`);
        possibleCauses.push('Browser extension modified DOM after hydration');
        recommendations.push('Add suppressHydrationWarning to affected elements');
      }
    });

    return { differences, possibleCauses, recommendations };
  }

  /**
   * getElementAttributes - Gets all attributes from an element
   * Purpose: Helps debug which attributes cause hydration issues
   * @param element HTMLElement - Element to analyze
   * @returns Record<string, string> - Element attributes
   */
  private getElementAttributes(element: HTMLElement): Record<string, string> {
    const attributes: Record<string, string> = {};
    
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      attributes[attr.name] = attr.value;
    }
    
    return attributes;
  }

  /**
   * generateHydrationReport - Generates comprehensive hydration report
   * Purpose: Provides detailed analysis of all hydration issues
   * @returns object - Complete hydration report
   */
  public generateHydrationReport(): {
    totalErrors: number;
    errorsByType: Record<ThemeErrorType, number>;
    errors: ThemeError[];
    recommendations: string[];
  } {
    const errorsByType: Record<ThemeErrorType, number> = {
      hydration_mismatch: 0,
      extension_interference: 0,
      theme_load_failure: 0
    };

    this.errors.forEach(error => {
      errorsByType[error.type]++;
    });

    const recommendations = [
      'Use suppressHydrationWarning for browser extension conflicts',
      'Ensure theme classes match between server and client',
      'Initialize theme state before hydration',
      'Handle dynamic content that changes between server/client'
    ];

    return {
      totalErrors: this.errors.length,
      errorsByType,
      errors: [...this.errors],
      recommendations
    };
  }

  /**
   * clearErrors - Clears all recorded errors
   * Purpose: Resets error tracking for new debugging session
   * @returns void
   */
  public clearErrors(): void {
    this.errors = [];
  }
}

/**
 * HydrationValidator Class  
 * Purpose: Validates hydration safety of components (SRP)
 * Follows: SOLID - Single responsibility for hydration validation
 */
export class HydrationValidator {
  
  /**
   * validateThemeConsistency - Validates theme consistency between server/client
   * Purpose: Ensures theme state matches between SSR and hydration
   * @param expectedTheme string - Expected theme from server
   * @param actualTheme string - Actual theme on client
   * @returns boolean - Whether themes are consistent
   */
  public validateThemeConsistency(expectedTheme: string, actualTheme: string): boolean {
    return expectedTheme === actualTheme;
  }

  /**
   * validateElementAttributes - Validates element attributes for hydration safety
   * Purpose: Checks if element attributes could cause hydration issues
   * @param element HTMLElement - Element to validate
   * @returns object - Validation results
   */
  public validateElementAttributes(element: HTMLElement): {
    isHydrationSafe: boolean;
    issues: string[];
    fixes: string[];
  } {
    const issues: string[] = [];
    const fixes: string[] = [];

    // Check for dynamic attributes that change between server/client
    const dynamicAttrs = ['data-new-gr-c-s-check-loaded', 'data-gr-ext-installed'];
    
    dynamicAttrs.forEach(attr => {
      if (element.hasAttribute(attr)) {
        issues.push(`Dynamic attribute found: ${attr}`);
        fixes.push(`Add suppressHydrationWarning to element with ${attr}`);
      }
    });

    return {
      isHydrationSafe: issues.length === 0,
      issues,
      fixes
    };
  }
}

// Export singleton instances for easy use
export const hydrationDebugger = new HydrationDebugger();
export const hydrationValidator = new HydrationValidator();