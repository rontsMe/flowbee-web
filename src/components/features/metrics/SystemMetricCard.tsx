// src/components/metrics/SystemMetricCard.tsx

'use client';

import React from 'react';
import { cn } from '@lib/utils';

/**
 * SystemMetricCard Component - Responsive Layout Container
 * Purpose: Layout coordination for multiple MetricCards with responsive grid (SRP)
 * Features: Section title, responsive breakpoints, semantic theming via globals.css
 * Follows: SOLID - Single responsibility for layout, no domain knowledge
 * 
 * Methods:
 * - render(): Returns responsive grid layout with semantic Tailwind classes
 */

interface SystemMetricCardProps {
  title: string;                    // Section title (e.g., "System Metrics")
  children: React.ReactNode;        // MetricCard components
  className?: string;               // Additional styling
  columns?: {                       // Responsive column configuration
    default?: number;               // Mobile (default: 1)
    sm?: number;                    // Small screens (default: 1) 
    md?: number;                    // Medium screens (default: 2)
    lg?: number;                    // Large screens (default: 2)
    xl?: number;                    // Extra large (default: 3)
  };
}

const SystemMetricCard: React.FC<SystemMetricCardProps> = ({
  title,
  children,
  className,
  columns = {
    default: 1,
    sm: 1,
    md: 2,
    lg: 2,
    xl: 3
  }
}) => {

  // CSS-in-JS styles using semantic Tailwind classes (themed by globals.css)
  const styles = {
    container: "w-full space-y-6",
    
    header: "space-y-2",
    
    title: "text-2xl font-bold text-foreground",  // Semantic class, themed by globals.css
    
    grid: cn(
      "grid gap-4 w-full",
      // Responsive columns based on props
      `grid-cols-${columns.default}`,
      columns.sm && `sm:grid-cols-${columns.sm}`,
      columns.md && `md:grid-cols-${columns.md}`, 
      columns.lg && `lg:grid-cols-${columns.lg}`,
      columns.xl && `xl:grid-cols-${columns.xl}`
    )
  };

  return (
    <section className={cn(styles.container, className)}>
      {/* Section Header */}
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </header>
      
      {/* Responsive Grid Layout */}
      <div className={styles.grid}>
        {children}
      </div>
    </section>
  );
};

export default SystemMetricCard;