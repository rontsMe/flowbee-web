// src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Theme imports
import ThemeProvider from "@layout/ThemeProvider";
import { ThemeConfig, HydrationConfig } from '@themeTypes';

// Navigation imports
import { AppSidebar, Header } from '@compound/nav';
import { SidebarProvider, SidebarInset } from '@ui/sidebar';

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
 * RootLayout Component with Navigation Integration + KBar
 * Purpose: Main layout with hydration-safe theme handling + navigation structure + search (SRP)
 * Features: Sidebar navigation, header, theme provider, hydration safety, KBar search
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
          {/* ✅ KBar Provider - Wraps everything for search functionality */}
          <KBar>
            {/* Navigation Layout Structure */}
            <SidebarProvider>
              {/* App Sidebar - Navigation Menu */}
              <AppSidebar />
              
              {/* Main Content Area */}
              <SidebarInset>
                {/* Header - Breadcrumbs, Search, User Menu, Theme Toggle */}
                <Header />
                
                {/* Page Content */}
                <main >
                  <div className="h-full overflow-auto">
                    {children}
                  </div>
                </main>
              </SidebarInset>
            </SidebarProvider>
          </KBar>
        </ThemeProvider>
      </body>
    </html>
  );
}