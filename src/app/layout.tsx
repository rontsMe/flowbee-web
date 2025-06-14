// src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./globals1.css";

// Theme imports
import ThemeProvider from "@layout/ThemeProvider";
import { ThemeConfig, HydrationConfig } from '@themeTypes';

// Navigation imports - UPDATED
import { AppSidebar } from '@compound/nav'; // Your custom AppSidebar
import { SidebarProvider } from '@ui/sidebar'; // Keep for other components
import { Breadcrumbs } from '@compound/nav';

// Header without breadcrumbs
// import HeaderWithoutBreadcrumbs from './HeaderWithoutBreadcrumbs';

// KBar import
import KBar from '@components/kbar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Workflow Dashboard",
  description: "Real-time workflow monitoring and system metrics",
};

/**
 * RootLayout Component - Simple Flex Layout
 * Purpose: Main layout with hydration-safe theme handling + simple navigation structure
 * Features: Custom sidebar, header, theme provider, hydration safety, KBar search
 * Architecture: Pure flex layout without shadcn/ui sidebar wrappers
 * Follows: SOLID - Single responsibility for layout structure
 * 
 * @param children React.ReactNode - Page components to render
 * @returns JSX.Element - Root layout with navigation, theme safety, and search
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  
  // Theme configuration - centralized and typed
  const themeConfig: ThemeConfig = {
    attribute: "class",
    defaultTheme: "dark",
    enableSystem: false,
    storageKey: "theme",
    themes: ["light", "dark"]
  };

  // Hydration configuration - prevents SSR/client mismatches
  const hydrationConfig: HydrationConfig = {
    suppressHydrationWarning: true,
    defaultThemeClass: "dark",
    browserExtensionSuppress: true
  };

  return (
    <html 
      lang="en" 
      className={themeConfig.defaultTheme === 'dark' ? 'dark' : ''}
      suppressHydrationWarning={hydrationConfig.suppressHydrationWarning}
      style={{
        colorScheme: themeConfig.defaultTheme === 'dark' ? 'dark' : 'light'
      }}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={hydrationConfig.browserExtensionSuppress}
        data-theme-safe="true"
      >
        <ThemeProvider
          attribute={themeConfig.attribute}
          defaultTheme={themeConfig.defaultTheme}
          enableSystem={themeConfig.enableSystem}
        >
          {/* KBar Provider - Wraps everything for search functionality */}
          <KBar>
            {/* Minimal SidebarProvider - Just for components that need useSidebar */}
              {/* Simple Flex Layout - No SidebarInset wrapper */}
              <div className="flex h-screen">
                
                {/* Custom AppSidebar - Your React component match */}
                <AppSidebar />
                
                {/* Main Content Area */}
                <main className="flex-1 overflow-auto">
                  {/* Header - Search, User Menu, Theme Toggle (NO breadcrumbs) */}
                  {/* <HeaderWithoutBreadcrumbs /> */}
                  
                  {/* Main Content with Breadcrumbs */}
                  <div className="h-full">
                    {/* Breadcrumbs moved to content area */}
                    {/* <div className="px-6 py-3">
                      <Breadcrumbs />
                    </div> */}
                    
                    {/* Page Content */}
                    <div className="px-6 pb-6">
                      {children}
                    </div>
                  </div>
                </main>
                
              </div>
            {/* </SidebarProvider> */}
          </KBar>
        </ThemeProvider>
      </body>
    </html>
  );
}