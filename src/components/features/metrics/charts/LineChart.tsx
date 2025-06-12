// src/components/metrics/charts/LineChart.tsx
import React, { useRef } from 'react';
import { ChartProps, TooltipData, generateGradientId } from '../types';

/**
 * LineChart Component
 * 
 * Purpose: Render line chart with gradient fill for metric data
 * Responsibility: Chart rendering and hover interaction only
 * 
 * @param data - Array of chart data points
 * @param isExpanded - Whether chart is in expanded view
 * @param color - Chart color (CSS custom property format)
 * @param unit - Optional unit for tooltip
 * @param onHover - Callback for hover events
 * @returns SVG line chart JSX element
 */
const LineChart: React.FC<ChartProps> = ({ 
  data, 
  isExpanded, 
  color = 'hsl(var(--primary))',
  unit,
  onHover 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Calculate chart bounds
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  // Generate chart points
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((point.value - minValue) / range) * 80;
    return { x, y, data: point };
  });

  const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');
  const gradientId = generateGradientId(color);

  // Handle mouse movement for tooltip
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onHover || !svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const closestPointIndex = Math.round((x / 100) * (data.length - 1));
    const closestPoint = points[closestPointIndex];
    
    if (closestPoint) {
      onHover({
        x: e.clientX,
        y: e.clientY,
        timestamp: closestPoint.data.timestamp,
        value: closestPoint.data.value,
        unit
      });
    }
  };

  // Y-axis ticks for expanded view
  const yTicks = isExpanded ? [
    { value: maxValue, y: 10 },
    { value: maxValue * 0.75, y: 27.5 },
    { value: maxValue * 0.5, y: 45 },
    { value: maxValue * 0.25, y: 62.5 },
    { value: minValue, y: 80 }
  ] : [];

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
        {/* Grid lines for expanded view */}
        {isExpanded && (
          <g className="opacity-10">
            {yTicks.map((tick, i) => (
              <line 
                key={i} 
                x1="0" 
                y1={tick.y} 
                x2="100" 
                y2={tick.y} 
                stroke={color} 
                strokeWidth="0.1"
              />
            ))}
          </g>
        )}
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <polygon
          fill={`url(#${gradientId})`}
          points={`0,100 ${pointsString} 100,100`}
        />
        
        {/* Line stroke */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="0.2"
          points={pointsString}
        />
        
        {/* Data points for expanded view */}
        {isExpanded && points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="0.3"
            fill={color}
            className="opacity-70"
          />
        ))}
      </svg>
      
      {/* Y-axis labels for expanded view */}
      {isExpanded && (
        <div className="absolute left-0 top-0 h-full w-12 pointer-events-none">
          {yTicks.map((tick, i) => (
            <div
              key={i}
              className="absolute text-xs text-muted-foreground -translate-y-1/2"
              style={{ top: `${tick.y}%`, left: '-40px' }}
            >
              {tick.value.toFixed(0)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LineChart;