// src/components/metrics/TimeRangeSelector.tsx
import React from 'react';
import { cn } from '@lib/utils';
import { TimeRangeSelectorProps, TIME_RANGES } from './types';

/**
 * TimeRangeSelector Component
 * 
 * Purpose: Renders time range selection buttons (30m, 1h, 6h, 12h, 24h)
 * Responsibility: Handle time range selection UI only
 * 
 * @param activeRange - Currently selected time range
 * @param onRangeChange - Callback when range is changed
 * @returns JSX element with time range buttons
 */
const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ 
  activeRange, 
  onRangeChange 
}) => {
  return (
    <div className="flex gap-0.5 bg-muted rounded-md p-0.5 border border-border">
      {TIME_RANGES.map(range => (
        <button
          key={range.value}
          onClick={(e) => {
            e.stopPropagation();
            onRangeChange(range.value);
          }}
          className={cn(
            "px-1.5 py-0.5 text-xs rounded transition-all duration-200 font-medium min-w-6",
            activeRange === range.value 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground hover:bg-background"
          )}
          aria-label={`Select ${range.label} time range`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeSelector;