// src/components/compound/nav/NavUser.tsx
'use client';

import { Button } from '@ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@ui/dropdown-menu';
import { User, CreditCard, Settings, LogOut } from 'lucide-react';

/**
 * Enhanced NavUser Component
 *
 * Purpose: User navigation dropdown utilizing globals.css sidebar theming
 * Features: Uses sidebar colors from globals.css to match header and sidebar
 * Structure: Tailwind for layout, globals.css for theming
 * 
 * Methods:
 * - render(): Returns dropdown JSX using globals.css sidebar theming system
 */

interface UserType {
  name: string;
  email: string;
  avatar: string;
}

interface NavUserProps {
  user?: UserType;
}

export function NavUser({ user }: NavUserProps = {}) {
  // Default user data (replace with your auth system)
  const defaultUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://github.com/shadcn.png',
    initials: 'JD'
  };

  const userData = user || defaultUser;
  const initials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase();

  // ✅ CLEAN STYLES - Structure only, theming handled by globals.css
  const styles = {
    trigger: "h-10 w-10 rounded-full bg-sidebar-accent",
    
    avatar: "h-8 w-8",
    
    avatarFallback: "bg-sidebar-primary text-sidebar-primary-foreground font-semibold",
    
    dropdownContent: "w-56 p-2 bg-popover rounded-xl",
    
    userLabel: "font-normal p-3 rounded-lg bg-secondary",
    
    userName: "text-sm leading-none font-semibold text-foreground",
    
    userEmail: "text-muted-foreground text-xs leading-none",
    
    separator: "bg-border my-1",
    
    menuItem: "rounded-lg px-3 py-2 group",
    
    menuItemDestructive: "rounded-lg px-3 py-2 group text-destructive",
    
    icon: "mr-2 h-4 w-4"
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className={styles.trigger}>
          <Avatar className={styles.avatar}>
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback className={styles.avatarFallback}>
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={styles.dropdownContent}
        align='end'
        sideOffset={10}
        forceMount
      >
        <DropdownMenuLabel className={styles.userLabel}>
          <div className='flex flex-col space-y-1'>
            <p className={styles.userName}>
              {userData.name}
            </p>
            <p className={styles.userEmail}>
              {userData.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className={styles.separator} />
        
        <DropdownMenuGroup>
          <DropdownMenuItem className={styles.menuItem}>
            <User className={styles.icon} />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className={styles.menuItem}>
            <CreditCard className={styles.icon} />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem className={styles.menuItem}>
            <Settings className={styles.icon} />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator className={styles.separator} />
        
        <DropdownMenuItem className={styles.menuItemDestructive}>
          <LogOut className={styles.icon} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}