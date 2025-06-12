// src/components/compound/nav/Header.tsx
import React from 'react';
import { SidebarTrigger } from '@ui/sidebar';
import { Separator } from '@ui/separator';
import { Badge } from '@ui/badge';
import { Button } from '@ui/button';
import { Icons } from '@icons';
import { Breadcrumbs } from './Breadcrumbs';
import SearchInput from './SearchInput';
import { NavUser } from './NavUser';
import { ModeToggle } from './ThemeToggle';
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://github.com/shadcn.png'
};

/**
 * Header Component
 * 
 * Purpose: Top navigation bar with breadcrumbs, search, and user controls
 * Combines: Multiple navigation compound components
 * 
 * @returns Header navigation JSX
 */
export default function Header() {
  return (
    <header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
      {/* Left Section */}
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumbs />
      </div>

      {/* Right Section */}
      <div className='flex items-center gap-2 px-4'>
        {/* Search */}
        <div className='hidden md:flex'>
          <SearchInput />
        </div>

        {/* Active Node Indicator */}
        <Badge variant="secondary" className="hidden lg:flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          Active: enhance_audio
        </Badge>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Icons.bell className="w-4 h-4" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
            3
          </Badge>
        </Button>

        {/* User Navigation */}
        <NavUser />

        {/* Theme Toggle */}
        <ModeToggle />
      </div>
    </header>
  );
}