// src/components/metrics/charts/ChartGrid.tsx
import React from 'react';

interface ChartGridProps {
  yTicks?: { value: number; y: number }[];
  data?: { timestamp: number; value: number }[];
  showVertical?: boolean;
  showYLabels?: boolean;
  showXLabels?: boolean;
  opacity?: string;
}

/**
 * ChartGrid Component
 * 
 * Purpose: DRY reusable grid component with both X and Y axis labels
 * Features: White dotted lines, Y-axis values, X-axis time labels, data validation
 * 
 * Methods:
 * - generateXLabels(): Generate X-axis time labels from data
 * - validateData(): Validate data before rendering labels
 * - formatTime(): Format timestamp for display
 * - render(): Return grid lines and axis labels JSX
 */
const ChartGrid: React.FC<ChartGridProps> = ({ 
  yTicks = [],
  data = [],
  showVertical = true,
  showYLabels = true,
  showXLabels = true,
  opacity = "opacity-20"
}) => {

  /**
   * validateData - Check if data is valid for rendering labels
   * Purpose: Prevent rendering invalid/infinite values
   * @returns boolean indicating if data is valid
   */
  const validateData = (): boolean => {
    return data.length > 0 && 
           yTicks.length > 0 && 
           yTicks.every(tick => isFinite(tick.value));
  };

  /**
   * generateXLabels - Create X-axis time labels from data
   * Purpose: Generate 5 evenly spaced time labels across timeline
   * @returns array of label objects with timestamp and x position
   */
  const generateXLabels = () => {
    if (!hasValidData) return [];
    
    return [
      { timestamp: data[0]?.timestamp, x: 0 },
      { timestamp: data[Math.floor(data.length * 0.25)]?.timestamp, x: 25 },
      { timestamp: data[Math.floor(data.length * 0.5)]?.timestamp, x: 50 },
      { timestamp: data[Math.floor(data.length * 0.75)]?.timestamp, x: 75 },
      { timestamp: data[data.length - 1]?.timestamp, x: 100 }
    ];
  };

  /**
   * formatTime - Format timestamp for display
   * Purpose: Convert timestamp to readable time format
   * @param timestamp - Unix timestamp
   * @returns formatted time string
   */
  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // CSS-in-JS styles using Tailwind utilities
  const styles = {
    gridGroup: opacity,
    
    yAxisContainer: "absolute left-0 top-0 h-full w-12 pointer-events-none",
    yAxisLabel: "absolute text-xs text-muted-foreground -translate-y-1/2",
    
    xAxisContainer: "absolute bottom-0 left-0 w-full h-6 pointer-events-none", 
    xAxisLabel: "absolute text-xs text-muted-foreground -translate-x-1/2"
  };

  // Validate data and generate labels
  const hasValidData = validateData();
  const xLabels = generateXLabels();

  return (
    <>
      {/* SVG Grid Lines */}
      <g className={styles.gridGroup}>
        {/* Horizontal lines */}
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
        
        {/* Vertical lines */}
        {showVertical && [25, 50, 75].map((x, i) => (
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

      {/* Y-axis Labels - Only if data is valid */}
      {showYLabels && hasValidData && (
        <div className={styles.yAxisContainer}>
          {yTicks.map((tick, i) => (
            <div
              key={`y-${i}`}
              className={styles.yAxisLabel}
              style={{ 
                top: `${tick.y}%`, 
                left: '-40px' 
              }}
            >
              {tick.value.toFixed(0)}
            </div>
          ))}
        </div>
      )}

      {/* X-axis Labels - Only if data is valid */}
      {showXLabels && hasValidData && (
        <div className={styles.xAxisContainer}>
          {xLabels.map((label, i) => (
            <div
              key={`x-${i}`}
              className={styles.xAxisLabel}
              style={{ 
                left: `${label.x}%`, 
                bottom: '-25px' 
              }}
            >
              {formatTime(label.timestamp)}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ChartGrid;