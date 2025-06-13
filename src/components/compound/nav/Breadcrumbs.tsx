// src/components/compound/nav/Breadcrumbs.tsx
'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@ui/button';

/**
 * Enhanced Breadcrumbs Component
 * 
 * Purpose: Navigation breadcrumbs utilizing globals.css card theming
 * Features: Uses bg-card and bg-secondary from globals.css for glass-morphism
 * 
 * Methods:
 * - getBreadcrumbStyles(isLast): Returns Tailwind classes for breadcrumb items
 * - render(): Returns breadcrumbs JSX using globals.css theming system
 */
export function Breadcrumbs() {
  const pathname = usePathname();
  
  const styles = {
    container: `
      flex items-center space-x-1 text-sm
      p-2 rounded-lg
      bg-card/20
      backdrop-blur-sm
      border border-border/20
      shadow-sm
      transition-all duration-300 ease-in-out
      hover:shadow-md
      hover:bg-card/40
      hover:border-border/30
    `,
    
    breadcrumbItem: `
      flex items-center
      transition-all duration-200 ease-in-out
      hover:scale-102
    `,
    
    breadcrumbActive: `
      h-auto p-0 px-2 py-1 rounded-md
      transition-all duration-300 ease-in-out
      backdrop-blur-sm
      border border-transparent
      shadow-sm
      text-sm font-semibold
      text-primary
      bg-primary/10
      border-primary/20
      shadow-primary/10
      hover:shadow-md hover:shadow-primary/20
      hover:scale-105
      hover:bg-primary/15
      hover:border-primary/30
      active:scale-95
    `,
    
    breadcrumbInactive: `
      h-auto p-0 px-2 py-1 rounded-md
      transition-all duration-300 ease-in-out
      backdrop-blur-sm
      border border-transparent
      shadow-sm
      text-sm font-medium
      text-muted-foreground
      bg-secondary/30
      hover:text-foreground
      hover:bg-secondary/60
      hover:border-border/30
      hover:shadow-sm
      hover:scale-102
      hover:text-primary
      active:scale-98
    `,
    
    separator: `
      text-muted-foreground mx-2 
      transition-all duration-300 ease-in-out
      opacity-60
      hover:opacity-100
      hover:text-primary
      hover:scale-110
      select-none
      font-light
    `
  };

  /**
   * getBreadcrumbStyles - Get appropriate breadcrumb styles
   * Purpose: Return correct Tailwind classes for active/inactive breadcrumb state
   * @param isLast - Whether this is the last breadcrumb (current page)
   * @returns Tailwind classes for breadcrumb styling
   */
  const getBreadcrumbStyles = (isLast: boolean): string => {
    return isLast ? styles.breadcrumbActive : styles.breadcrumbInactive;
  };

  // Generate breadcrumbs from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLast = index === pathSegments.length - 1;
    
    return {
      label,
      href,
      isLast
    };
  });

  // Add home breadcrumb
  const allBreadcrumbs = [
    { label: 'Dashboard', href: '/dashboard', isLast: false },
    ...breadcrumbs
  ];

  return (
    <nav className={styles.container}>
      {allBreadcrumbs.map((item, index) => (
        <div key={item.href} className={styles.breadcrumbItem}>
          {index > 0 && (
            <span className={styles.separator}>
              /
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            className={getBreadcrumbStyles(item.isLast)}
            title={`Navigate to ${item.label}`}
          >
            {item.label}
          </Button>
        </div>
      ))}
    </nav>
  );
}