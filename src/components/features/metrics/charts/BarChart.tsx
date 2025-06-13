// src/components/charts/BarChart.tsx

import React, { useMemo } from 'react';
import { ChartProps, ChartOpacityManager, DEFAULT_SHOW_GRID, DEFAULT_SHOW_Y_AXIS, DEFAULT_SHOW_X_AXIS } from './types';
import { useChartData, useResolvedColor } from './chartHooks';
import ChartGrid from './ChartGrid';

/**
 * BarChart Component - Generic Bar Chart with Color Resolution
 * Purpose: Render bar chart for discrete data - completely domain agnostic (SRP)
 * Features: CSS custom property resolution, configurable opacity, grid/axis, tooltip interaction
 * Follows: SOLID - Uses composition of hooks and utilities
 */
const BarChart: React.FC<ChartProps> = ({ 
  data, 
  color,
  isExpanded = false, 
  opacity,
  unit,
  showGrid = DEFAULT_SHOW_GRID,
  showYAxis = DEFAULT_SHOW_Y_AXIS,
  showXAxis = DEFAULT_SHOW_X_AXIS,
  onHover 
}) => {
  
  // ✅ NEW - Resolve CSS custom properties for inline styles
  const resolvedColor = useResolvedColor(color);
  
  // Initialize opacity manager (memoized for performance)
  const opacityManager = useMemo(() => new ChartOpacityManager(), []);
  
  // Get chart calculations using smart hook
  const { bounds, yTicks, hasValidData } = useChartData(data);
  
  // Show last 12 data points for better bar visibility
  const displayData = useMemo(() => data.slice(-12), [data]);
  
  // Get appropriate opacity for bar charts
  const chartOpacity = useMemo(() => 
    opacityManager.getOpacity('bar', isExpanded, opacity),
    [opacityManager, isExpanded, opacity]
  );
  
  // Get grid-specific opacity (lighter than chart opacity)
  const gridOpacity = useMemo(() => {
    const baseOpacity = opacity || (isExpanded ? 90 : 80); // bar chart defaults
    return opacityManager.getGridOpacity('bar', baseOpacity);
  }, [opacityManager, opacity, isExpanded]);
  
  // Extract opacity value for inline styles
  const chartOpacityValue = useMemo(() => {
    const match = chartOpacity.match(/opacity-(\d+)/);
    return match ? parseInt(match[1]) / 100 : 0.8;
  }, [chartOpacity]);
  
  // Convert grid opacity number to class-compatible value
  const gridOpacityValue = useMemo(() => {
    const match = gridOpacity.match(/opacity-(\d+)/);
    return match ? parseInt(match[1]) : 25;
  }, [gridOpacity]);

  // Calculate bar heights based on bounds
  const barData = useMemo(() => {
    if (!hasValidData || bounds.max <= bounds.min) return [];
    
    const range = bounds.max - bounds.min;
    
    return displayData.map((point, index) => {
      const normalizedValue = (point.value - bounds.min) / range;
      const height = normalizedValue * 80; // 80% of chart height
      
      return {
        ...point,
        height,
        index
      };
    });
  }, [displayData, bounds, hasValidData]);

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

  // Don't render if no valid data
  if (!hasValidData) {
    return (
      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
        <span className="text-sm">No data available</span>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      {/* Background SVG for grid lines */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        {/* Grid Component */}
        <ChartGrid 
          yTicks={yTicks}
          data={displayData}
          showGrid={showGrid}
          showYAxis={showYAxis}
          showXAxis={showXAxis}
          opacity={gridOpacityValue}
        />
      </svg>

      {/* Bar chart container */}
      <div className="h-full w-full flex items-end justify-between px-2">
        {barData.map((bar) => (
          <div
            key={`${bar.timestamp}-${bar.index}`}
            className="transition-all duration-300 rounded-t-sm cursor-crosshair hover:opacity-100 relative flex-1 mx-0.5"
            style={{
              height: `${Math.max(2, bar.height)}%`, // Minimum 2% height for visibility
              backgroundColor: resolvedColor,        // ✅ Resolved CSS custom properties
              opacity: chartOpacityValue,           // ✅ Calculated opacity value
            }}
            onMouseMove={(e) => handleMouseMove(e, { timestamp: bar.timestamp, value: bar.value })}
            onMouseLeave={() => onHover?.(null)}
          />
        ))}
      </div>
    </div>
  );
};

export default BarChart;