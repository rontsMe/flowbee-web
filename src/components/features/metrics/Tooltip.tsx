// src/components/metrics/Tooltip.tsx
import React from 'react';
import { TooltipProps, formatTooltipTime, formatValue } from './types';

/**
 * Tooltip Component
 * 
 * Purpose: Display chart data tooltip on hover
 * Responsibility: Position and render tooltip content only
 * 
 * @param tooltip - Tooltip data with position, timestamp, value, and unit
 * @returns Positioned tooltip JSX element
 */
const Tooltip: React.FC<TooltipProps> = ({ tooltip }) => {
  // Calculate position to keep tooltip within viewport
  const tooltipX = Math.min(tooltip.x + 10, window.innerWidth - 200);
  const tooltipY = Math.max(tooltip.y - 50, 10);

  return (
    <div
      className="fixed z-50 bg-popover border border-border rounded-lg p-3 pointer-events-none shadow-xl"
      style={{
        left: tooltipX,
        top: tooltipY,
      }}
    >
      <div className="text-xs text-muted-foreground">
        {formatTooltipTime(tooltip.timestamp)}
      </div>
      <div className="text-sm font-bold text-foreground">
        {formatValue(tooltip.value, tooltip.unit)}
      </div>
    </div>
  );
};

export default Tooltip;