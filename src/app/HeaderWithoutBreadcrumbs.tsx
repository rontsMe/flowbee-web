// src/app/HeaderWithoutBreadcrumbs.tsx
import React from 'react';
import { SidebarTrigger } from '@ui/sidebar';
import { Separator } from '@ui/separator';
import { Badge } from '@ui/badge';
import { Button } from '@ui/button';
import { Icons } from '@icons';
import SearchInput from '@compound/nav/SearchInput';
import { NavUser } from '@compound/nav/NavUser';
import { ModeToggle } from '@compound/nav/ThemeToggle';

/**
 * HeaderWithoutBreadcrumbs Component
 * 
 * Purpose: Top navigation bar without breadcrumbs (moved to content area)
 * Features: Uses bg-sidebar and sidebar colors from globals.css
 * Structure: Tailwind for layout, globals.css for theming
 * 
 * Methods:
 * - render(): Returns header JSX using globals.css sidebar theming system
 */
export default function HeaderWithoutBreadcrumbs() {
  
  // ✅ CLEAN STYLES - Structure only, theming handled by globals.css
  const styles = {
    header: "flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-sidebar",
    
    leftSection: "flex items-center gap-2 px-4",
    
    rightSection: "flex items-center gap-2 px-4",
    
    sidebarTrigger: "-ml-1",
    
    separator: "mr-2 h-4",
    
    logoSection: "flex items-center gap-3",
    
    logo: "w-8 h-8 bg-primary rounded-lg flex items-center justify-center",
    
    brandText: "text-lg font-bold text-sidebar-foreground",
    
    searchContainer: "hidden md:flex",
    
    activeIndicator: "hidden lg:flex items-center gap-2 px-3 py-1.5 bg-sidebar-accent border border-sidebar-border rounded-full",
    
    activePulse: "w-2 h-2 rounded-full bg-sidebar-primary animate-pulse",
    
    activeText: "text-sm font-medium text-sidebar-primary",
    
    notificationButton: "relative bg-sidebar-accent border border-sidebar-border text-sidebar-foreground",
    
    notificationBadge: "absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive ring-2 ring-sidebar animate-pulse",
    
    userSection: "flex items-center",
    
    themeSection: "flex items-center"
  };

  return (
    <header className={styles.header}>
      {/* Left Section - Trigger + Logo */}
      <div className={styles.leftSection}>
        <SidebarTrigger className={styles.sidebarTrigger} />
        <Separator orientation='vertical' className={styles.separator} />
        
        {/* Logo Section (visible when sidebar collapsed) */}
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <Icons.logo className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className={styles.brandText}>
            Flowbee
          </span>
        </div>
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