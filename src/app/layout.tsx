// src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./globals1.css";

// Theme imports
import ThemeProvider from "@layout/ThemeProvider";
import { ThemeConfig, HydrationConfig } from "@themeTypes";

// App shell components
import { AppSidebar,TopStack } from "@compound/nav";
// KBar import
import KBar from "@components/kbar";

// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Page metadata
export const metadata: Metadata = {
  title: "Workflow Dashboard",
  description: "Real-time workflow monitoring and system metrics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  const themeConfig: ThemeConfig = {
    attribute: "class",
    defaultTheme: "dark",
    enableSystem: false,
    storageKey: "theme",
    themes: ["light", "dark"],
  };

  const hydrationConfig: HydrationConfig = {
    suppressHydrationWarning: true,
    defaultThemeClass: "dark",
    browserExtensionSuppress: true,
  };

  return (
    <html
      lang="en"
      className={themeConfig.defaultTheme === "dark" ? "dark" : ""}
      suppressHydrationWarning={hydrationConfig.suppressHydrationWarning}
      style={{
        colorScheme:
          themeConfig.defaultTheme === "dark" ? "dark" : "light",
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
          <KBar>
            <div className="flex h-screen">
              <AppSidebar />

              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Combined TopNav + Breadcrumbs */}
                <TopStack />

                {/* Main page content */}
                <main className="flex-1 overflow-auto px-6 pb-6">
                  {children}
                </main>
              </div>
            </div>
          </KBar>
        </ThemeProvider>
      </body>
    </html>
  );
}
