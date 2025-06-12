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
 * Purpose: Base metric card component for displaying metrics with charts
 * Responsibility: Layout and UI structure only - no state management
 * 
 * Key Features:
 * - Controlled component (isExpanded from props)
 * - Uses shadcn/ui Card and Button components
 * - Accepts chart as children for maximum flexibility
 * - Theme-aware using CSS custom properties
 * - SOLID compliant - single responsibility
 * 
 * @param title - Metric title
 * @param value - Current metric value
 * @param unit - Optional unit (%, ms, etc.)
 * @param spec - Optional specification text
 * @param isExpanded - Whether card is expanded (controlled)
 * @param onToggleExpand - Callback to toggle expansion
 * @param timeRange - Current time range selection
 * @param onTimeRangeChange - Callback for time range changes
 * @param children - Chart component to render
 * @param className - Additional CSS classes
 * @returns MetricCard JSX element
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
  className
}) => {
  return (
    <div className={cn("w-full", className)}>
      {/* Header Outside Card */}
      <div className="mb-2 flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {spec && (
            <p className="text-sm text-muted-foreground">{spec}</p>
          )}
        </div>
        
        {/* Value Outside Card - Right */}
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-foreground">{value}</span>
          {unit && (
            <span className="text-lg text-muted-foreground">{unit}</span>
          )}
        </div>
      </div>
      
      {/* Card */}
      <Card 
        className={cn(
          "relative transition-all duration-500 hover:border-muted-foreground",
          isExpanded ? "h-48" : "aspect-video"
        )}
      >
        <CardContent className="h-full p-4">
          <div className="h-full flex flex-col">
            {/* Controls Inside Card - Right Aligned */}
            <div className="flex justify-end items-center mb-3">
              <div className="flex items-center gap-2">
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
                  className="p-1 h-auto flex-shrink-0"
                  aria-label={isExpanded ? "Collapse chart" : "Expand chart"}
                >
                  {isExpanded ? (
                    <Minimize2 className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Expand className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            
            {/* Chart Container */}
            <div className={cn(
              "flex-1 min-h-0",
              isExpanded && "pl-12" // Space for Y-axis when expanded
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