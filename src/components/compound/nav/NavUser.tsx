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
import { Icons } from '@icons';

/**
 * Enhanced NavUser Component
 *
 * Purpose: User navigation dropdown utilizing globals.css card theming
 * Features: Uses bg-card and bg-popover from globals.css for glass-morphism
 * 
 * Methods:
 * - render(): Returns dropdown JSX using globals.css theming system
 */

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface NavUserProps {
  user?: User;
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

  const styles = {
    trigger: `
      relative h-10 w-10 rounded-full
      bg-card/50
      backdrop-blur-sm
      border border-border/50
      shadow-sm
      transition-all duration-300 ease-in-out
      hover:shadow-md
      hover:scale-105
      hover:bg-accent
      active:scale-95
    `,
    
    avatar: `
      h-8 w-8
      transition-all duration-300 ease-in-out
      ring-2 ring-primary/30
      shadow-sm
      hover:ring-primary/50
      hover:shadow-md
      hover:scale-110
    `,
    
    avatarFallback: `
      bg-primary text-primary-foreground 
      font-semibold
    `,
    
    dropdownContent: `
      w-56 p-2
      bg-popover
      border border-border/50
      shadow-xl
      rounded-xl
    `,
    
    userLabel: `
      font-normal p-3 rounded-lg
      bg-secondary/30
      border border-border/30
      backdrop-blur-sm
    `,
    
    userName: `
      text-sm leading-none font-semibold 
      text-foreground
    `,
    
    userEmail: `
      text-muted-foreground text-xs leading-none
    `,
    
    separator: `
      bg-border/50 opacity-50 my-1
    `,
    
    menuItem: `
      rounded-lg px-3 py-2
      transition-all duration-200 ease-in-out
      hover:bg-accent hover:text-accent-foreground
      hover:scale-102
      active:scale-98
      focus:bg-accent focus:text-accent-foreground
      group
    `,
    
    menuItemDestructive: `
      rounded-lg px-3 py-2
      transition-all duration-200 ease-in-out
      hover:bg-destructive hover:text-destructive-foreground
      hover:scale-102
      active:scale-98
      focus:bg-destructive focus:text-destructive-foreground
      group
      text-destructive
    `,
    
    icon: `
      mr-2 h-4 w-4
      transition-all duration-200
      group-hover:scale-110
    `
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
            <Icons.user className={styles.icon} />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className={styles.menuItem}>
            <Icons.billing className={styles.icon} />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem className={styles.menuItem}>
            <Icons.settings className={styles.icon} />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator className={styles.separator} />
        
        <DropdownMenuItem className={styles.menuItemDestructive}>
          <Icons.logout className={styles.icon} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}