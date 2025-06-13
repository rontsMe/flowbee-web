// src/components/charts/ChartGrid.tsx

import React from 'react';
import { ChartGridProps } from './types';
import { formatTooltipTime } from './chartUtils';

/**
 * ChartGrid Component
 * Purpose: Generic grid lines and axis values for all chart types (SRP)
 * Features: Configurable grid/axis visibility, automatic value calculation
 * Follows: SOLID - Single responsibility for grid/axis rendering
 * 
 * Methods:
 * - renderGridLines(): SVG grid lines
 * - renderYAxisValues(): Y-axis numeric values  
 * - renderXAxisValues(): X-axis time values
 * - render(): Complete grid and axis system
 */
const ChartGrid: React.FC<ChartGridProps> = ({
  yTicks,
  data,
  showGrid,
  showYAxis,
  showXAxis,
  opacity
}) => {

  // Convert numeric opacity to Tailwind class
  const opacityClass = `opacity-${Math.max(0, Math.min(100, Math.round(opacity)))}`;

  // Generate X-axis labels (5 evenly spaced time points)
  const xLabels = React.useMemo(() => {
    if (!showXAxis || data.length === 0) return [];
    
    const positions = [0, 0.25, 0.5, 0.75, 1];
    
    return positions.map((position) => {
      const dataIndex = Math.floor(position * (data.length - 1));
      return {
        timestamp: data[dataIndex]?.timestamp || 0,
        x: position * 100
      };
    });
  }, [data, showXAxis]);

  // CSS-in-JS styles using Tailwind utilities
  const styles = {
    gridGroup: opacityClass,
    yAxisContainer: "absolute left-0 top-0 h-full w-12 pointer-events-none",
    yAxisValue: "absolute text-xs text-muted-foreground -translate-y-1/2 font-mono",
    xAxisContainer: "absolute bottom-0 left-0 w-full h-6 pointer-events-none", 
    xAxisValue: "absolute text-xs text-muted-foreground -translate-x-1/2 font-mono"
  };

  return (
    <>
      {/* Grid Lines (SVG) */}
      {showGrid && (
        <g className={styles.gridGroup}>
          {/* Horizontal grid lines */}
          {yTicks.map((tick, i) => (
            <line 
              key={`h-${i}`} 
              x1="0" 
              y1={tick.y} 
              x2="100" 
              y2={tick.y}
              stroke="white"
              strokeWidth="0.1"
              strokeDasharray="1,2"
            />
          ))}
          
          {/* Vertical grid lines */}
          {[25, 50, 75].map((x, i) => (
            <line 
              key={`v-${i}`} 
              x1={x} 
              y1="10" 
              x2={x} 
              y2="90"
              stroke="white"
              strokeWidth="0.1" 
              strokeDasharray="1,2"
            />
          ))}
        </g>
      )}

      {/* Y-axis Values (HTML overlay) */}
      {showYAxis && (
        <div className={styles.yAxisContainer}>
          {yTicks.map((tick, i) => (
            <div
              key={`y-${i}`}
              className={styles.yAxisValue}
              style={{ 
                top: `${tick.y}%`, 
                left: '-45px' 
              }}
            >
              {tick.value.toFixed(0)}
            </div>
          ))}
        </div>
      )}

      {/* X-axis Values (HTML overlay) */}
      {showXAxis && (
        <div className={styles.xAxisContainer}>
          {xLabels.map((label, i) => (
            <div
              key={`x-${i}`}
              className={styles.xAxisValue}
              style={{ 
                left: `${label.x}%`, 
                bottom: '-25px' 
              }}
            >
              {formatTooltipTime(label.timestamp)}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ChartGrid;