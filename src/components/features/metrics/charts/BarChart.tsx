// src/components/metrics/charts/BarChart.tsx
import React from 'react';
import { ChartProps } from '../types';
import ChartGrid from './ChartGrid';

/**
 * BarChart Component
 * 
 * Purpose: Render bar chart for discrete metric data utilizing ChartGrid for DRY grid system
 * Features: Tooltip interaction, hover effects, white dotted grid lines
 * 
 * Methods:
 * - handleMouseMove(): Handle tooltip positioning and data extraction
 * - render(): Return bar chart JSX with DRY grid component
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

  // Y-axis ticks for grid lines
  const yTicks = [
    { value: maxValue, y: 10 },
    { value: maxValue * 0.75, y: 27.5 },
    { value: maxValue * 0.5, y: 45 },
    { value: maxValue * 0.25, y: 62.5 },
    { value: 0, y: 80 }
  ];

  return (
    <div className="h-full w-full relative">
      {/* Background SVG for grid lines */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        {/* ✅ DRY Grid Component with both X and Y labels */}
        <ChartGrid 
          yTicks={yTicks}
          data={displayData}
          showVertical={true}
          showYLabels={true}
          showXLabels={true}
          opacity="opacity-20"
        />
      </svg>

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