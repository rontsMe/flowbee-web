// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Layout and Navigation Components
import ThemeProvider from "@layout/ThemeProvider";
import { SidebarProvider, SidebarInset } from "@ui/sidebar";
import { AppSidebar, Header } from "@compound/nav";

// KBar Command Palette
import KBar from "@components/kbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flowbee Dashboard",
  description: "Workflow orchestration dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class" 
          defaultTheme="dark" 
          enableSystem={true}
        >
          <KBar>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                {/* Persistent Sidebar */}
                <AppSidebar />
                
                {/* Main Content Area */}
                <SidebarInset className="flex flex-col bg-background">
                  {/* Persistent Header */}
                  <Header />
                  
                  {/* Page Content */}
                  <main className="flex-1 overflow-auto">
                    {children}
                  </main>
                </SidebarInset>
              </div>
            </SidebarProvider>
          </KBar>
        </ThemeProvider>
      </body>
    </html>
  );
}