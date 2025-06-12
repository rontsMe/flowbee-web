// src/components/metrics/charts/BarChart.tsx
import React from 'react';
import { ChartProps, TooltipData } from '../types';

/**
 * BarChart Component
 * 
 * Purpose: Render bar chart for discrete metric data
 * Responsibility: Chart rendering and hover interaction only
 * 
 * @param data - Array of chart data points
 * @param isExpanded - Whether chart is in expanded view
 * @param color - Chart color (CSS custom property format)
 * @param unit - Optional unit for tooltip
 * @param onHover - Callback for hover events
 * @returns Bar chart JSX element
 */
const BarChart: React.FC<ChartProps> = ({ 
  data, 
  isExpanded, 
  color = 'hsl(var(--primary))',
  unit,
  onHover 
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  // Show last 12 data points for better visibility
  const displayData = data.slice(-12);
  
  // Handle mouse movement for tooltip
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, point: { timestamp: number; value: number }) => {
    if (!onHover) return;
    onHover({
      x: e.clientX,
      y: e.clientY,
      timestamp: point.timestamp,
      value: point.value,
      unit
    });
  };

  // Y-axis ticks for expanded view
  const yTicks = isExpanded ? [
    { value: maxValue, label: maxValue.toFixed(0) },
    { value: maxValue * 0.75, label: (maxValue * 0.75).toFixed(0) },
    { value: maxValue * 0.5, label: (maxValue * 0.5).toFixed(0) },
    { value: maxValue * 0.25, label: (maxValue * 0.25).toFixed(0) },
    { value: 0, label: '0' }
  ] : [];

  return (
    <div className="h-full w-full relative">
      {/* Y-axis labels for expanded view */}
      {isExpanded && (
        <div className="absolute left-0 top-0 h-full w-12 pointer-events-none">
          {yTicks.map((tick, i) => (
            <div
              key={i}
              className="absolute text-xs text-muted-foreground -translate-y-1/2"
              style={{ 
                top: `${(1 - tick.value / maxValue) * 80 + 10}%`, 
                left: '-40px' 
              }}
            >
              {tick.label}
            </div>
          ))}
        </div>
      )}
      
      {/* Bar chart container */}
      <div className="h-full w-full flex items-end justify-between px-2">
        {displayData.map((point, index) => {
          const height = (point.value / maxValue) * 80;
          return (
            <div
              key={`${point.timestamp}-${index}`}
              className="transition-all duration-300 rounded-t-sm cursor-crosshair hover:opacity-100 relative"
              style={{
                width: `${100 / displayData.length * 0.6}%`,
                height: `${height}%`,
                backgroundColor: color,
                opacity: 0.8,
              }}
              onMouseMove={(e) => handleMouseMove(e, point)}
              onMouseLeave={() => onHover?.(null)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BarChart;