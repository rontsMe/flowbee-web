// src/components/compound/nav/Breadcrumbs.tsx
'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@ui/button';

/**
 * Enhanced Breadcrumbs Component
 * 
 * Purpose: Navigation breadcrumbs utilizing globals.css sidebar theming
 * Features: Uses bg-sidebar-accent and sidebar colors from globals.css to match header
 * Structure: Tailwind for layout, globals.css for theming
 * 
 * Methods:
 * - getBreadcrumbStyles(isLast): Returns Tailwind classes for breadcrumb items
 * - render(): Returns breadcrumbs JSX using globals.css sidebar theming system
 */
export function Breadcrumbs() {
  const pathname = usePathname();
  
  // ✅ CLEAN STYLES - Structure only, theming handled by globals.css
  const styles = {
    container: "flex items-center space-x-1 text-sm p-2 rounded-lg bg-sidebar-accent",
    
    breadcrumbItem: "flex items-center",
    
    breadcrumbActive: "h-auto p-0 px-2 py-1 rounded-md text-sm font-semibold text-sidebar-primary bg-sidebar-primary",
    
    breadcrumbInactive: "h-auto p-0 px-2 py-1 rounded-md text-sm font-medium text-sidebar-foreground bg-sidebar-accent",
    
    separator: "text-sidebar-foreground mx-2 opacity-60 select-none font-light"
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