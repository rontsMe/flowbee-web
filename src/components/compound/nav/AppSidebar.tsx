// src/components/compound/nav/AppSidebar.tsx
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@ui/sidebar';
import { navItems } from '@constants/data';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { Icons } from '@icons';
import { NavMain } from './NavMain';
import { NavUser } from './NavUser';

/**
 * AppSidebar Component
 * 
 * Purpose: Complete application sidebar utilizing globals.css theming
 * Features: Uses bg-sidebar and related CSS custom properties from globals.css
 * 
 * Methods:
 * - getBrandStyles(): Returns Tailwind classes for brand section
 * - render(): Returns complete sidebar JSX using globals.css theming
 */
export default function AppSidebar() {
  const pathname = usePathname();

  // Mock user data (replace with your auth system)
  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://github.com/shadcn.png'
  };

  // Transform navItems for NavMain component
  const mainNavItems = navItems.map(item => ({
    title: item.title,
    url: item.url,
    icon: item.icon ? Icons[item.icon as keyof typeof Icons] : undefined,
    isActive: pathname === item.url,
    items: item.items?.map(subItem => ({
      title: subItem.title,
      url: subItem.url
    }))
  }));

  const styles = {
    sidebar: "border-none shadow-2xl shadow-black/20",
    
    header: "border-none bg-transparent p-0",
    
    brand: `
      flex items-center gap-3 px-2 py-2 
      border-none bg-transparent
      transition-all duration-300 ease-in-out
      hover:scale-105
    `,
    
    logo: `
      w-8 h-8 
      bg-primary
      rounded-lg flex items-center justify-center
      shadow-lg
      transition-all duration-300 ease-in-out
      hover:scale-110
      ring-2 ring-primary/20
    `,
    
    brandText: `
      text-lg font-bold 
      text-sidebar-foreground
      transition-all duration-300
      hover:text-primary
    `,
    
    content: "overflow-x-hidden bg-transparent",
    
    footer: "border-none bg-transparent p-2",
    
    rail: "bg-gradient-to-b from-transparent via-white/5 to-transparent"
  };

  return (
    <Sidebar collapsible='icon' className={styles.sidebar}>
      {/* Header with Brand */}
      <SidebarHeader className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <Icons.logo className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className={styles.brandText}>
            Flowbee
          </span>
        </div>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className={styles.content}>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      {/* User Section */}
      <SidebarFooter className={styles.footer}>
        <NavUser />
      </SidebarFooter>

      <SidebarRail className={styles.rail} />
    </Sidebar>
  );
}