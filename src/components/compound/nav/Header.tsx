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

/**
 * Header Component
 * 
 * Purpose: Top navigation bar utilizing globals.css glass-morphism theming
 * Features: Uses bg-card and backdrop-blur effects from globals.css
 * 
 * Methods:
 * - render(): Returns header JSX using globals.css theming system
 */
export default function Header() {
  
  const styles = {
    header: `
      flex h-16 shrink-0 items-center justify-between gap-2 
      transition-[width,height] ease-linear
      group-has-data-[collapsible=icon]/sidebar-wrapper:h-12
      backdrop-blur-lg backdrop-saturate-150
      border-b border-border/50
      bg-card/80
      shadow-sm
    `,
    
    leftSection: "flex items-center gap-2 px-4",
    
    rightSection: "flex items-center gap-2 px-4",
    
    sidebarTrigger: `
      -ml-1 
      hover:bg-accent 
      transition-all duration-300
    `,
    
    separator: `
      mr-2 h-4 
      bg-border/50
    `,
    
    searchContainer: "hidden md:flex",
    
    activeIndicator: `
      hidden lg:flex items-center gap-2 px-3 py-1.5
      bg-secondary/50
      border border-border/20
      rounded-full
      backdrop-blur-sm
      shadow-sm
      transition-all duration-300
      hover:shadow-md
      hover:scale-105
    `,
    
    activePulse: `
      w-2 h-2 rounded-full
      bg-primary
      animate-pulse
    `,
    
    activeText: `
      text-sm font-medium 
      text-primary
    `,
    
    notificationButton: `
      relative
      bg-card/50
      backdrop-blur-sm
      border border-border/50
      shadow-sm
      transition-all duration-300
      hover:shadow-md
      hover:scale-105
      hover:bg-accent
    `,
    
    notificationBadge: `
      absolute -top-1 -right-1 h-5 w-5 
      flex items-center justify-center p-0 text-xs
      bg-destructive
      shadow-sm
      ring-2 ring-background
      transition-all duration-300
      animate-pulse
    `,
    
    userSection: "flex items-center",
    
    themeSection: "flex items-center"
  };

  return (
    <header className={styles.header}>
      {/* Left Section */}
      <div className={styles.leftSection}>
        <SidebarTrigger className={styles.sidebarTrigger} />
        <Separator orientation='vertical' className={styles.separator} />
        <Breadcrumbs />
      </div>

      {/* Right Section */}
      <div className={styles.rightSection}>
        {/* Search */}
        <div className={styles.searchContainer}>
          <SearchInput />
        </div>

        {/* Active Node Indicator */}
        <Badge variant="secondary" className={styles.activeIndicator}>
          <div className={styles.activePulse}></div>
          <span className={styles.activeText}>
            Active: enhance_audio
          </span>
        </Badge>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className={styles.notificationButton}>
          <Icons.bell className="w-4 h-4" />
          <Badge className={styles.notificationBadge}>
            3
          </Badge>
        </Button>

        {/* User Navigation */}
        <div className={styles.userSection}>
          <NavUser />
        </div>

        {/* Theme Toggle */}
        <div className={styles.themeSection}>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}