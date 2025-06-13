'use client';

// src/components/metrics/MetricCard.tsx
import React from 'react';
import { Card, CardContent } from '@ui/card';
import { Button } from '@ui/button';
import { Expand, Minimize2 } from 'lucide-react';
import { cn } from '@lib/utils';
import TimeRangeSelector from './TimeRangeSelector';
import { MetricCardProps } from './types';

/**
 * MetricCard Component
 * 
 * Purpose: Base metric card component utilizing globals.css theming
 * Features: Uses bg-card and semantic colors from globals.css, CSS-in-JS styling, dynamic padding
 * 
 * Methods:
 * - render(): Returns metric card JSX using globals.css theming system
 */
const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  spec,
  isExpanded,
  onToggleExpand,
  timeRange,
  onTimeRangeChange,
  children,
  className,
  data // ✅ Accept data prop to determine if labels will show
}) => {

  // ✅ Check if we have valid data for labels (same logic as ChartGrid)
  const hasValidData = Array.isArray(data) && data.length > 0;

  const styles = {
    container: "w-full",
    
    headerLeft: "space-y-1 mb-2",
    
    title: "text-lg font-semibold text-foreground",
    
    spec: "text-sm text-muted-foreground",
    
    valueContainer: "flex items-baseline gap-1",
    
    value: "text-3xl font-bold text-foreground",
    
    unit: "text-lg text-muted-foreground",
    
    card: `
      relative transition-all duration-500 
      hover:border-muted-foreground
      bg-card border border-border
      shadow-sm
      backdrop-blur-sm
      px-0 py-0
    `,
    
    cardExpanded: "h-48",
    
    cardCollapsed: "aspect-video",
    
    cardContent: "h-full p-4",
    
    contentContainer: "h-full flex flex-col",
    
    controlsContainer: "flex justify-between items-center mb-3",
    
    controlsGroup: "flex items-center gap-2",
    
    expandButton: `
      p-1 h-auto flex-shrink-0
      transition-all duration-200
      hover:bg-secondary
      hover:scale-110
      active:scale-95
    `,
    
    expandIcon: "w-4 h-4 text-muted-foreground transition-all duration-200",
    
    chartContainer: "flex-1 min-h-0",
    
    chartContainerExpanded: "flex-1 min-h-0 pl-12" // Space for Y-axis when expanded
  };

  return (
    <div className={cn(styles.container, className)}>
      {/* Header Outside Card */}
      <div className={styles.headerLeft}>
        <h3 className={styles.title}>{title}</h3>
        {spec && (
          <p className={styles.spec}>{spec}</p>
        )}
      </div>
      
      {/* Card */}
      <Card 
        className={cn(
          styles.card,
          isExpanded ? styles.cardExpanded : styles.cardCollapsed
        )}
      >
        <CardContent className={styles.cardContent}>
          <div className={styles.contentContainer}>
            {/* Controls Inside Card - Value Left, Controls Right */}
            <div className={styles.controlsContainer}>
              {/* Value Left Side */}
              <div className={styles.valueContainer}>
                <span className={styles.value}>{value}</span>
                {unit && (
                  <span className={styles.unit}>{unit}</span>
                )}
              </div>
              
              {/* Controls Right Side */}
              <div className={styles.controlsGroup}>
                {/* Time Range Selector - Show when expanded */}
                {isExpanded && onTimeRangeChange && timeRange && (
                  <TimeRangeSelector 
                    activeRange={timeRange}
                    onRangeChange={onTimeRangeChange}
                  />
                )}
                
                {/* Expand/Collapse Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleExpand}
                  className={styles.expandButton}
                  aria-label={isExpanded ? "Collapse chart" : "Expand chart"}
                >
                  {isExpanded ? (
                    <Minimize2 className={styles.expandIcon} />
                  ) : (
                    <Expand className={styles.expandIcon} />
                  )}
                </Button>
              </div>
            </div>
            
            {/* Chart Container */}
            <div className={cn(
              isExpanded ? styles.chartContainerExpanded : styles.chartContainer
            )}>
              {children}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricCard;