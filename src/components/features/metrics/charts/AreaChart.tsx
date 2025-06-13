// src/components/charts/AreaChart.tsx

import React, { useRef, useMemo } from 'react';
import { ChartProps, ChartOpacityManager, DEFAULT_SHOW_GRID, DEFAULT_SHOW_Y_AXIS, DEFAULT_SHOW_X_AXIS } from './types';
import { useChartData, useTooltipPosition, useResolvedColor } from './chartHooks';
import { generateGradientId, pointsToSVGString, createAreaPolygonPoints } from './chartUtils';
import ChartGrid from './ChartGrid';

/**
 * AreaChart Component - Generic Area Chart with Color Resolution
 * Purpose: Render area chart with gradient fill - completely domain agnostic (SRP)
 * Features: CSS custom property resolution, configurable opacity, grid/axis, tooltip interaction
 * Follows: SOLID - Uses composition of hooks and utilities
 */
const AreaChart: React.FC<ChartProps> = ({ 
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
  const svgRef = useRef<SVGSVGElement>(null);
  
  // ✅ NEW - Resolve CSS custom properties for SVG compatibility
  const resolvedColor = useResolvedColor(color);
  
  // Initialize opacity manager (memoized for performance)
  const opacityManager = useMemo(() => new ChartOpacityManager(), []);
  
  // Get chart calculations using smart hook
  const { bounds, yTicks, chartPoints, hasValidData } = useChartData(data);
  
  // Get appropriate opacity for area charts
  const chartOpacity = useMemo(() => 
    opacityManager.getOpacity('area', isExpanded, opacity),
    [opacityManager, isExpanded, opacity]
  );
  
  // Get grid-specific opacity (lighter than chart opacity)
  const gridOpacity = useMemo(() => {
    const baseOpacity = opacity || (isExpanded ? 90 : 40); // area chart defaults
    return opacityManager.getGridOpacity('area', baseOpacity);
  }, [opacityManager, opacity, isExpanded]);
  
  // Extract opacity value for SVG attributes
  const chartOpacityValue = useMemo(() => {
    const match = chartOpacity.match(/opacity-(\d+)/);
    return match ? parseInt(match[1]) : 40;
  }, [chartOpacity]);
  
  // Convert grid opacity number to class-compatible value
  const gridOpacityValue = useMemo(() => {
    const match = gridOpacity.match(/opacity-(\d+)/);
    return match ? parseInt(match[1]) : 15;
  }, [gridOpacity]);

  // Generate SVG elements with resolved color
  const pointsString = useMemo(() =>
    pointsToSVGString(chartPoints), 
    [chartPoints]
  );
  
  const areaPoints = useMemo(() =>
    createAreaPolygonPoints(chartPoints),
    [chartPoints]
  );
  
  const areaGradientId = useMemo(() => 
    generateGradientId(`area-${resolvedColor}`), 
    [resolvedColor]
  );

  // Tooltip management
  const { getTooltipData } = useTooltipPosition(chartPoints, svgRef);

  // Handle mouse movement for tooltip
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onHover || !hasValidData) return;
    
    const tooltipData = getTooltipData(e, unit);
    if (tooltipData) {
      onHover(tooltipData);
    }
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
      <svg 
        ref={svgRef}
        className="w-full h-full cursor-crosshair" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => onHover?.(null)}
      >
        {/* Grid Component */}
        <ChartGrid 
          yTicks={yTicks}
          data={data}
          showGrid={showGrid}
          showYAxis={showYAxis}
          showXAxis={showXAxis}
          opacity={gridOpacityValue}
        />
        
        {/* Area gradient definition with resolved color */}
        <defs>
          <linearGradient id={areaGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={resolvedColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={resolvedColor} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Area fill with resolved color */}
        <polygon
          fill={`url(#${areaGradientId})`}
          points={areaPoints}
          fillOpacity={chartOpacityValue / 100}  // ✅ SVG opacity
        />
        
        {/* Area border with resolved color */}
        <polyline
          fill="none"
          stroke={resolvedColor}              // ✅ Resolved CSS custom properties
          strokeWidth="0.15"
          strokeOpacity={chartOpacityValue / 100}  // ✅ SVG opacity
          points={pointsString}
        />
      </svg>
    </div>
  );
};

export default AreaChart;