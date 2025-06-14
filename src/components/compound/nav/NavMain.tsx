// src/components/compound/nav/NavMain.tsx
'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@ui/sidebar';
import { 
  LayoutDashboard, 
  Package, 
  User, 
  Kanban, 
  ChevronRight 
} from 'lucide-react';

/**
 * NavMain Compound Component
 * 
 * Purpose: Main navigation utilizing globals.css primary theming
 * Features: Uses bg-primary and bg-secondary from globals.css for theming
 * Structure: Tailwind for layout, globals.css for theming
 * 
 * Methods:
 * - getMenuButtonStyles(isActive): Returns Tailwind classes based on active state
 * - render(): Returns navigation JSX using globals.css theming
 */

// Icon mapping
const iconMap = {
  'layout-dashboard': LayoutDashboard,
  'package': Package,
  'user': User,
  'kanban': Kanban,
};

export function NavMain({
  items
}: {
  items: {
    title: string;
    url: string;
    icon?: string;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {

  // ✅ CLEAN STYLES - Structure only, theming handled by globals.css
  const styles = {
    group: "px-4",
    
    groupLabel: "text-xs font-semibold uppercase tracking-wider text-primary mb-6 px-2",
    
    groupContent: "flex flex-col gap-2", // More spacing between items
    
    // ✅ Clean button classes - consistent 40px height
    menuButtonActive: "bg-primary text-primary-foreground h-10 w-full",
    
    menuButtonInactive: "bg-sidebar-accent text-sidebar-foreground h-10 w-full",
    
    menuIcon: "w-5 h-5", // Consistent icon size
    
    menuText: "font-medium",
    
    chevron: "ml-auto w-4 h-4 group-data-[state=open]/collapsible:rotate-90 transition-transform",
    
    subMenu: "bg-sidebar-accent ml-4 pl-4 mt-2 rounded-r-lg space-y-1",
    
    subMenuButton: "rounded-md h-8", // Smaller sub-items
    
    subMenuText: "text-sm"
  };

  /**
   * getMenuButtonStyles - Get appropriate button styles based on active state
   * Purpose: Return correct Tailwind classes for active/inactive states
   * @param isActive - Whether the menu item is currently active
   * @returns Tailwind classes for menu button
   */
  const getMenuButtonStyles = (isActive: boolean = false): string => {
    return isActive ? styles.menuButtonActive : styles.menuButtonInactive;
  };

  return (
    <SidebarGroup className={styles.group}>
      <SidebarGroupLabel className={styles.groupLabel}>
        Platform
      </SidebarGroupLabel>
      <SidebarGroupContent className={styles.groupContent}>
        <SidebarMenu className="space-y-2">
          {items.map((item) => {
            const IconComponent = item.icon ? iconMap[item.icon as keyof typeof iconMap] : null;
            
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className='group/collapsible'
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={getMenuButtonStyles(item.isActive)}
                    >
                      {IconComponent && (
                        <IconComponent className={styles.menuIcon} />
                      )}
                      <span className={styles.menuText}>
                        {item.title}
                      </span>
                      {item.items && item.items.length > 0 && (
                        <ChevronRight className={styles.chevron} />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items && item.items.length > 0 && (
                    <CollapsibleContent>
                      <SidebarMenuSub className={styles.subMenu}>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton 
                              asChild
                              className={styles.subMenuButton}
                            >
                              <a href={subItem.url}>
                                <span className={styles.subMenuText}>
                                  {subItem.title}
                                </span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}