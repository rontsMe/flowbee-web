// src/components/metrics/MetricCard.tsx

'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@ui/card';
import { Button } from '@ui/button';
import { Expand, Minimize2 } from 'lucide-react';
import { cn } from '@lib/utils';

// Import generic charts
import { LineChart, AreaChart, BarChart, TooltipData, ChartType } from './charts';

// Import metrics components
import TimeRangeSelector from './TimeRangeSelector';
import Tooltip from './Tooltip';

/**
 * Updated MetricCard Props
 * Purpose: Chart factory that creates charts based on chartType prop
 */
interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  spec?: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
  className?: string;
  
  // ✅ Chart configuration - passed from parent
  chartType: ChartType;                       // 'line' | 'area' | 'bar'
  data: { timestamp: number; value: number }[];
  color: string;                              // Parent sends hsl(var(--chart-X))
  opacity?: number;                           // Optional opacity override
  
  // ✅ Chart display options
  showGrid?: boolean;
  showYAxis?: boolean; 
  showXAxis?: boolean;
}

/**
 * MetricCard Component - Chart Factory
 * Purpose: Layout component + chart creation based on chartType (SRP)
 * Features: Uses semantic globals.css theming, dynamic padding, chart factory
 * Follows: SOLID - Single responsibility for metric card layout + chart creation
 * 
 * Methods:
 * - createChart(): Factory method to create chart based on chartType
 * - handleChartConfig(): Configure chart display options based on expansion
 * - render(): Returns metric card with internally created chart
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
  className,
  chartType,
  data,
  color,
  opacity,
  showGrid,
  showYAxis,
  showXAxis
}) => {

  // Tooltip state management
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Chart configuration based on expansion state and props
  const chartConfig = useMemo(() => ({
    showGrid: showGrid ?? isExpanded,        // Default: show grid when expanded
    showYAxis: showYAxis ?? isExpanded,      // Default: show Y-axis when expanded  
    showXAxis: showXAxis ?? isExpanded       // Default: show X-axis when expanded
  }), [isExpanded, showGrid, showYAxis, showXAxis]);

  // Chart component mapping
  const chartComponents = {
    line: LineChart,
    area: AreaChart,
    bar: BarChart
  };

  // Create chart based on chartType prop
  const createChart = () => {
    const ChartComponent = chartComponents[chartType];
    
    if (!ChartComponent) {
      console.warn(`Unknown chart type: ${chartType}`);
      return <div className="flex items-center justify-center h-full text-muted-foreground">Invalid chart type</div>;
    }

    return (
      <ChartComponent
        data={data}
        color={color}                        // Parent-provided color
        isExpanded={isExpanded}
        opacity={opacity}                    // Optional opacity override
        unit={unit}
        showGrid={chartConfig.showGrid}
        showYAxis={chartConfig.showYAxis}
        showXAxis={chartConfig.showXAxis}
        onHover={setTooltip}
      />
    );
  };

  // CSS-in-JS styles using semantic Tailwind classes (themed by globals.css)
  const styles = {
    container: "w-full",
    
    headerLeft: "space-y-1 mb-2",
    
    title: "text-lg font-semibold text-foreground",        // Semantic, themed by globals.css
    
    spec: "text-sm text-muted-foreground",                 // Semantic, themed by globals.css
    
    valueContainer: "flex items-baseline gap-1",
    
    value: "text-3xl font-bold text-foreground",           // Semantic, themed by globals.css
    
    unit: "text-lg text-muted-foreground",                 // Semantic, themed by globals.css
    
    card: cn(
      // Base card styling - semantic classes themed by globals.css
      "relative transition-all duration-500",
      "hover:border-muted-foreground",                     // Semantic hover, themed by globals.css
      "bg-card border border-border",                      // Semantic background/border, themed by globals.css
      "shadow-sm backdrop-blur-sm",                        // Enhanced by globals.css
      "px-0 py-0"
    ),
    
    cardExpanded: "h-48",
    
    cardCollapsed: "aspect-video",
    
    cardContent: "h-full p-4",
    
    contentContainer: "h-full flex flex-col",
    
    controlsContainer: "flex justify-between items-center mb-3",
    
    controlsGroup: "flex items-center gap-2",
    
    expandButton: cn(
      "p-1 h-auto flex-shrink-0",
      "transition-all duration-200",
      "hover:bg-secondary hover:scale-110",               // Semantic hover, themed by globals.css
      "active:scale-95"
    ),
    
    expandIcon: "w-4 h-4 text-muted-foreground transition-all duration-200", // Themed by globals.css
    
    chartContainer: "flex-1 min-h-0",
    
    // ✅ Dynamic padding based on chart configuration
    chartContainerExpanded: cn(
      "flex-1 min-h-0",
      chartConfig.showYAxis && "pl-12",                   // Space for Y-axis when shown
      chartConfig.showXAxis && "pb-6"                     // Space for X-axis when shown
    )
  };

  return (
    <>
      <div className={cn(styles.container, className)}>
        {/* Header Outside Card */}
        <div className={styles.headerLeft}>
          <h3 className={styles.title}>{title}</h3>
          {spec && (
            <p className={styles.spec}>{spec}</p>
          )}
        </div>
        
        {/* Card */}
        <Card 
          className={cn(
            styles.card,
            isExpanded ? styles.cardExpanded : styles.cardCollapsed
          )}
        >
          <CardContent className={styles.cardContent}>
            <div className={styles.contentContainer}>
              {/* Controls Inside Card - Value Left, Controls Right */}
              <div className={styles.controlsContainer}>
                {/* Value Left Side */}
                <div className={styles.valueContainer}>
                  <span className={styles.value}>{value}</span>
                  {unit && (
                    <span className={styles.unit}>{unit}</span>
                  )}
                </div>
                
                {/* Controls Right Side */}
                <div className={styles.controlsGroup}>
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
                    className={styles.expandButton}
                    aria-label={isExpanded ? "Collapse chart" : "Expand chart"}
                  >
                    {isExpanded ? (
                      <Minimize2 className={styles.expandIcon} />
                    ) : (
                      <Expand className={styles.expandIcon} />
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Chart Container - Dynamic padding based on chart config */}
              <div className={cn(
                isExpanded ? styles.chartContainerExpanded : styles.chartContainer
              )}>
                {createChart()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tooltip overlay */}
      {tooltip && <Tooltip tooltip={tooltip} />}
    </>
  );
};

export default MetricCard;