// src/components/compound/nav/Breadcrumbs.tsx
'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@ui/button';

/**
 * Breadcrumbs Component
 * 
 * Purpose: Display navigation breadcrumbs based on current path
 * Combines: Button components with pathname logic
 * 
 * @returns Breadcrumbs navigation JSX
 */
export function Breadcrumbs() {
  const pathname = usePathname();
  
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
    <nav className="flex items-center space-x-2 text-sm">
      {allBreadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <span className="text-muted-foreground mx-2">/</span>}
          <Button
            variant="ghost"
            size="sm"
            className={`h-auto p-0 ${
              item.isLast
                ? 'text-blue-600 dark:text-blue-400 font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {item.label}
          </Button>
        </div>
      ))}
    </nav>
  );
}