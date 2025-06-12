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
 * Purpose: Complete application sidebar with navigation and user sections
 * Combines: NavMain and NavUser compound components
 * 
 * @returns Complete sidebar JSX
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
    icon: item.icon ? Icons[item.icon] : undefined,
    isActive: pathname === item.url,
    items: item.items?.map(subItem => ({
      title: subItem.title,
      url: subItem.url
    }))
  }));

  return (
    <Sidebar collapsible='icon'>
      {/* Header with Brand */}
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Icons.logo className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">Flowbee</span>
        </div>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className='overflow-x-hidden'>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      {/* User Section */}
      <SidebarFooter>
        <NavUser user={mockUser} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}