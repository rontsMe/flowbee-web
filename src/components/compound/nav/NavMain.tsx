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
import { Icon, Icons } from '@icons';

/**
 * NavMain Compound Component
 * 
 * Purpose: Main navigation utilizing globals.css primary theming
 * Features: Uses bg-primary and bg-secondary from globals.css for theming
 * 
 * Methods:
 * - getMenuButtonStyles(isActive): Returns Tailwind classes based on active state
 * - render(): Returns navigation JSX using globals.css theming
 */
export function NavMain({
  items
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {

  const styles = {
    group: "px-2",
    
    groupLabel: `
      text-xs font-semibold uppercase tracking-wider
      text-primary
      mb-2 px-2
    `,
    
    groupContent: "flex flex-col gap-2",
    
    menuButtonActive: `
      bg-primary text-primary-foreground
      hover:bg-primary/90 hover:text-primary-foreground 
      active:bg-primary/90 active:text-primary-foreground
      min-w-8 duration-300 ease-in-out
      transition-all
      backdrop-blur-sm
      border border-transparent
      shadow-sm
      hover:shadow-md
      hover:scale-105
      active:scale-95
    `,
    
    menuButtonInactive: `
      bg-secondary/50 text-sidebar-foreground
      hover:bg-accent hover:text-accent-foreground
      border border-transparent
      min-w-8 duration-300 ease-in-out
      transition-all
      backdrop-blur-sm
      shadow-sm
      hover:shadow-sm
      hover:scale-102
      active:scale-98
    `,
    
    menuIcon: `
      transition-all duration-300 
      group-hover:scale-110
    `,
    
    menuText: "font-medium",
    
    chevron: `
      ml-auto transition-all duration-300 ease-in-out
      group-data-[state=open]/collapsible:rotate-90
      group-data-[state=open]/collapsible:text-primary
      hover:scale-110
    `,
    
    subMenu: `
      bg-secondary/30
      backdrop-blur-sm
      border-l border-primary/20
      ml-4 pl-4 mt-2
      rounded-r-lg
      shadow-sm
    `,
    
    subMenuButton: `
      transition-all duration-200 ease-in-out
      rounded-md
      hover:bg-accent hover:text-accent-foreground
      hover:translate-x-1
      active:scale-95
    `,
    
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
        <SidebarMenu>
          {items.map((item) => (
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
                    {item.icon && (
                      <item.icon className={styles.menuIcon} />
                    )}
                    <span className={styles.menuText}>
                      {item.title}
                    </span>
                    <Icons.chevronRight className={styles.chevron} />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className={styles.subMenu}>
                    {item.items?.map((subItem) => (
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
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}